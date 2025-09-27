import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookEvent {
  id?: string
  event_type: string
  source: string
  payload: any
  headers: Record<string, string>
  timestamp: string
  signature?: string
  processed: boolean
  retry_count: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processing_logs: any[]
}

interface ProcessingRule {
  id: string
  event_type: string
  source: string
  conditions: any[]
  actions: any[]
  transform_rules: any[]
  retry_config: {
    max_retries: number
    retry_delay_ms: number
    exponential_backoff: boolean
  }
  is_active: boolean
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event_type, source, payload, headers: eventHeaders, signature } = await req.json()

    // Log inicio do processamento
    const logId = await supabaseClient.rpc('log_system_operation', {
      p_operation_type: 'advanced_webhook_processing',
      p_metadata: { event_type, source, payload_size: JSON.stringify(payload).length }
    })

    let processedCount = 0
    let successCount = 0
    let errorCount = 0

    try {
      // Buscar regras de processamento para este tipo de evento
      const { data: rules, error: rulesError } = await supabaseClient
        .from('webhook_processing_rules')
        .select('*')
        .eq('event_type', event_type)
        .eq('source', source)
        .eq('is_active', true)

      if (rulesError) {
        console.error('Error fetching processing rules:', rulesError)
        throw rulesError
      }

      // Criar registro do evento webhook
      const webhookEvent: WebhookEvent = {
        event_type,
        source,
        payload,
        headers: eventHeaders || {},
        timestamp: new Date().toISOString(),
        signature,
        processed: false,
        retry_count: 0,
        status: 'pending',
        processing_logs: []
      }

      const { data: eventRecord, error: eventError } = await supabaseClient
        .from('webhook_events')
        .insert(webhookEvent)
        .select()
        .single()

      if (eventError) {
        console.error('Error creating webhook event:', eventError)
        throw eventError
      }

      // Processar cada regra aplicável
      for (const rule of rules || []) {
        processedCount++

        try {
          // Verificar condições da regra
          const conditionsMet = await evaluateConditions(rule.conditions, payload, supabaseClient)
          
          if (!conditionsMet) {
            console.log(`Rule ${rule.id} conditions not met, skipping`)
            continue
          }

          // Aplicar transformações de dados
          const transformedPayload = await applyTransformations(rule.transform_rules, payload)

          // Executar ações da regra
          const actionResults = await executeActions(rule.actions, transformedPayload, supabaseClient)

          // Log sucesso
          webhookEvent.processing_logs.push({
            rule_id: rule.id,
            timestamp: new Date().toISOString(),
            status: 'success',
            actions_executed: actionResults.length,
            transformed_payload: transformedPayload
          })

          successCount++

        } catch (ruleError) {
          console.error(`Error processing rule ${rule.id}:`, ruleError)
          
          // Log erro
          webhookEvent.processing_logs.push({
            rule_id: rule.id,
            timestamp: new Date().toISOString(),
            status: 'error',
        error: ruleError instanceof Error ? ruleError.message : String(ruleError),
        stack: ruleError instanceof Error ? ruleError.stack : undefined
          })

          errorCount++

          // Verificar se deve fazer retry
          if (rule.retry_config && webhookEvent.retry_count < rule.retry_config.max_retries) {
            // Agendar retry
            await scheduleRetry(eventRecord.id, rule, webhookEvent.retry_count + 1, supabaseClient)
          }
        }
      }

      // Atualizar status do evento
      const finalStatus = errorCount > 0 ? (successCount > 0 ? 'partially_completed' : 'failed') : 'completed'
      
      await supabaseClient
        .from('webhook_events')
        .update({
          processed: true,
          status: finalStatus,
          processing_logs: webhookEvent.processing_logs
        })
        .eq('id', eventRecord.id)

      // Executar processamentos específicos por tipo de evento
      await processSpecificEventType(event_type, payload, supabaseClient)

    } catch (error) {
      errorCount++
      console.error('Error in webhook processing:', error)
      
      await supabaseClient.rpc('log_system_error', {
        p_error_type: 'webhook_processing_error',
        p_error_message: error instanceof Error ? error.message : String(error),
        p_error_stack: error instanceof Error ? error.stack : undefined,
        p_component_name: 'advanced-webhook-processor'
      })
    }

    // Log conclusão
    await supabaseClient.rpc('complete_system_operation', {
      p_log_id: logId.data,
      p_records_processed: processedCount,
      p_success_count: successCount,
      p_error_count: errorCount,
      p_status: errorCount > 0 ? 'completed_with_errors' : 'completed'
    })

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        successful: successCount,
        errors: errorCount,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Fatal error in webhook processor:', error)
    
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

async function evaluateConditions(conditions: any[], payload: any, supabase: any): Promise<boolean> {
  if (!conditions || conditions.length === 0) return true

  for (const condition of conditions) {
    const { field, operator, value, type = 'string' } = condition
    const actualValue = getNestedValue(payload, field)

    let conditionMet = false

    switch (operator) {
      case 'equals':
        conditionMet = actualValue === value
        break
      case 'not_equals':
        conditionMet = actualValue !== value
        break
      case 'greater_than':
        conditionMet = Number(actualValue) > Number(value)
        break
      case 'less_than':
        conditionMet = Number(actualValue) < Number(value)
        break
      case 'contains':
        conditionMet = String(actualValue).includes(String(value))
        break
      case 'starts_with':
        conditionMet = String(actualValue).startsWith(String(value))
        break
      case 'ends_with':
        conditionMet = String(actualValue).endsWith(String(value))
        break
      case 'in_array':
        conditionMet = Array.isArray(value) && value.includes(actualValue)
        break
      case 'exists':
        conditionMet = actualValue !== undefined && actualValue !== null
        break
      default:
        conditionMet = true
    }

    if (!conditionMet) {
      return false
    }
  }

  return true
}

async function applyTransformations(transformRules: any[], payload: any): Promise<any> {
  if (!transformRules || transformRules.length === 0) return payload

  let transformedPayload = JSON.parse(JSON.stringify(payload))

  for (const rule of transformRules) {
    const { type, field, value, target_field } = rule

    switch (type) {
      case 'map_field':
        setNestedValue(transformedPayload, target_field || field, getNestedValue(payload, field))
        break
      case 'set_value':
        setNestedValue(transformedPayload, field, value)
        break
      case 'format_currency':
        const numericValue = Number(getNestedValue(payload, field))
        setNestedValue(transformedPayload, field, numericValue / 100) // Convert cents to currency
        break
      case 'format_date':
        const dateValue = getNestedValue(payload, field)
        setNestedValue(transformedPayload, field, new Date(dateValue).toISOString())
        break
      case 'concatenate':
        const fields = rule.fields || []
        const concatenatedValue = fields.map((f: string) => getNestedValue(payload, f)).join(rule.separator || '')
        setNestedValue(transformedPayload, target_field || field, concatenatedValue)
        break
      case 'remove_field':
        deleteNestedValue(transformedPayload, field)
        break
    }
  }

  return transformedPayload
}

async function executeActions(actions: any[], payload: any, supabase: any): Promise<any[]> {
  const results = []

  for (const action of actions) {
    try {
      const { type, config } = action

      switch (type) {
        case 'create_transaction':
          const transactionResult = await createFinancialTransaction(payload, config, supabase)
          results.push({ action: type, result: transactionResult })
          break
        
        case 'update_invoice_status':
          const invoiceResult = await updateInvoiceStatus(payload, config, supabase)
          results.push({ action: type, result: invoiceResult })
          break
        
        case 'send_notification':
          const notificationResult = await sendNotification(payload, config, supabase)
          results.push({ action: type, result: notificationResult })
          break
        
        case 'trigger_workflow':
          const workflowResult = await triggerWorkflow(payload, config, supabase)
          results.push({ action: type, result: workflowResult })
          break
        
        case 'call_webhook':
          const webhookResult = await callExternalWebhook(payload, config)
          results.push({ action: type, result: webhookResult })
          break
        
        default:
          console.log(`Unknown action type: ${type}`)
      }
    } catch (actionError) {
      console.error(`Error executing action ${action.type}:`, actionError)
      results.push({ action: action.type, error: actionError instanceof Error ? actionError.message : String(actionError) })
    }
  }

  return results
}

async function processSpecificEventType(eventType: string, payload: any, supabase: any) {
  switch (eventType) {
    case 'payment_received':
      await processPaymentReceived(payload, supabase)
      break
    case 'invoice_created':
      await processInvoiceCreated(payload, supabase)
      break
    case 'bank_transaction':
      await processBankTransaction(payload, supabase)
      break
    case 'subscription_updated':
      await processSubscriptionUpdated(payload, supabase)
      break
    default:
      console.log(`No specific processing for event type: ${eventType}`)
  }
}

async function processPaymentReceived(payload: any, supabase: any) {
  // Atualizar status da conta a receber
  if (payload.reference_id) {
    await supabase
      .from('accounts_receivable')
      .update({
        status: 'paid',
        payment_date: payload.payment_date || new Date().toISOString().split('T')[0],
        payment_method: payload.payment_method
      })
      .eq('id', payload.reference_id)
  }

  // Criar transação financeira
  await supabase
    .from('financial_transactions')
    .insert({
      transaction_type: 'credit',
      amount: payload.amount,
      description: `Pagamento recebido - ${payload.payment_method}`,
      transaction_date: payload.payment_date || new Date().toISOString().split('T')[0],
      reference_type: 'payment',
      reference_id: payload.payment_id,
      category: 'payment_received'
    })
}

async function processInvoiceCreated(payload: any, supabase: any) {
  // Criar conta a receber
  await supabase
    .from('accounts_receivable')
    .insert({
      amount: payload.amount,
      due_date: payload.due_date,
      description: payload.description,
      contact_id: payload.client_id,
      status: 'pending',
      invoice_number: payload.invoice_id
    })
}

async function processBankTransaction(payload: any, supabase: any) {
  // Criar transação financeira baseada em movimento bancário
  await supabase
    .from('financial_transactions')
    .insert({
      transaction_type: payload.transaction_type,
      amount: Math.abs(payload.amount),
      description: payload.description,
      transaction_date: payload.date,
      reference_type: 'bank_transaction',
      reference_id: payload.transaction_id,
      category: payload.category || 'bank_transfer'
    })
}

async function processSubscriptionUpdated(payload: any, supabase: any) {
  // Processar mudanças de assinatura
  console.log('Processing subscription update:', payload)
}

// Utility functions
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

function deleteNestedValue(obj: any, path: string): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!
  const target = keys.reduce((current, key) => current?.[key], obj)
  if (target) delete target[lastKey]
}

async function scheduleRetry(eventId: string, rule: any, retryCount: number, supabase: any) {
  const delay = rule.retry_config.exponential_backoff 
    ? rule.retry_config.retry_delay_ms * Math.pow(2, retryCount - 1)
    : rule.retry_config.retry_delay_ms

  await supabase
    .from('webhook_retry_queue')
    .insert({
      event_id: eventId,
      rule_id: rule.id,
      retry_count: retryCount,
      scheduled_at: new Date(Date.now() + delay).toISOString(),
      status: 'scheduled'
    })
}

async function createFinancialTransaction(payload: any, config: any, supabase: any) {
  return await supabase
    .from('financial_transactions')
    .insert({
      transaction_type: config.transaction_type || 'credit',
      amount: getNestedValue(payload, config.amount_field),
      description: config.description || getNestedValue(payload, config.description_field),
      transaction_date: new Date().toISOString().split('T')[0],
      category: config.category
    })
}

async function updateInvoiceStatus(payload: any, config: any, supabase: any) {
  return await supabase
    .from('accounts_receivable')
    .update({ status: config.new_status })
    .eq('id', getNestedValue(payload, config.invoice_id_field))
}

async function sendNotification(payload: any, config: any, supabase: any) {
  return await supabase
    .from('project_email_notifications')
    .insert({
      recipient_email: config.recipient || getNestedValue(payload, config.recipient_field),
      notification_type: config.notification_type,
      subject: config.subject,
      content: config.template.replace(/\{\{(\w+)\}\}/g, (match: string, key: string) => getNestedValue(payload, key) || match)
    })
}

async function triggerWorkflow(payload: any, config: any, supabase: any) {
  // Trigger workflow execution
  console.log('Triggering workflow:', config.workflow_id, 'with payload:', payload)
  return { workflow_id: config.workflow_id, triggered: true }
}

async function callExternalWebhook(payload: any, config: any) {
  const response = await fetch(config.url, {
    method: config.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify(payload)
  })

  return {
    status: response.status,
    response: await response.text()
  }
}