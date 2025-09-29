import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  event_type: string;
  data: any;
  source: string;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Webhook processor function called');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();
    console.log('Processing webhook:', payload);

    // Log the webhook event
    const { data: webhookLog, error: logError } = await supabase
      .from('project_webhook_events')
      .insert({
        event_type: payload.event_type,
        payload: payload.data,
        status: 'received',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (logError) {
      console.error('Error logging webhook:', logError);
      throw logError;
    }

    let result;

    // Process different webhook types
    switch (payload.event_type) {
      case 'payment_received':
        result = await processPaymentReceived(supabase, payload.data);
        break;
      case 'invoice_created':
        result = await processInvoiceCreated(supabase, payload.data);
        break;
      case 'bank_transaction':
        result = await processBankTransaction(supabase, payload.data);
        break;
      case 'accounting_sync':
        result = await processAccountingSync(supabase, payload.data);
        break;
      case 'payment_failed':
        result = await processPaymentFailed(supabase, payload.data);
        break;
      default:
        console.log(`Unhandled webhook event type: ${payload.event_type}`);
        result = { message: `Event type ${payload.event_type} logged but not processed` };
    }

    // Update webhook status
    await supabase
      .from('project_webhook_events')
      .update({
        status: 'processed',
        response_code: 200,
        response_body: JSON.stringify(result),
        sent_at: new Date().toISOString()
      })
      .eq('id', webhookLog.id);

    console.log('Webhook processed successfully:', result);

    return new Response(
      JSON.stringify({ success: true, result }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

async function processPaymentReceived(supabase: any, data: any) {
  console.log('Processing payment received:', data);
  
  const { 
    payment_id, 
    amount, 
    reference_id, 
    payment_method = 'external',
    payment_date,
    payer_info 
  } = data;

  // Try to find matching receivable account
  let accountUpdate = null;
  
  if (reference_id) {
    const { data: receivable, error: findError } = await supabase
      .from('accounts_receivable')
      .select('*')
      .eq('id', reference_id)
      .eq('status', 'pending')
      .single();

    if (!findError && receivable) {
      // Update the receivable account
      const { error: updateError } = await supabase
        .from('accounts_receivable')
        .update({
          status: 'paid',
          payment_date: payment_date || new Date().toISOString().split('T')[0],
          payment_method,
          updated_at: new Date().toISOString()
        })
        .eq('id', reference_id);

      if (updateError) {
        console.error('Error updating receivable:', updateError);
        throw updateError;
      }

      accountUpdate = { type: 'receivable', id: reference_id };

      // Create transaction record
      await supabase
        .from('financial_transactions')
        .insert({
          transaction_type: 'credit',
          amount: receivable.amount,
          description: `Pagamento recebido: ${receivable.description}`,
          reference_id,
          reference_type: 'receivable',
          transaction_date: payment_date || new Date().toISOString().split('T')[0],
          project_id: receivable.project_id,
          category: 'payment_received'
        });

      // Create notification
      await supabase
        .from('project_email_notifications')
        .insert({
          recipient_email: 'financeiro@guilds.com.br',
          recipient_type: 'admin',
          notification_type: 'payment_received',
          subject: `Pagamento Recebido: R$ ${amount.toLocaleString('pt-BR')}`,
          content: `Pagamento de R$ ${amount.toLocaleString('pt-BR')} foi recebido para a conta "${receivable.description}".`,
          metadata: { 
            payment_id, 
            amount, 
            reference_id, 
            payment_method,
            payer_info 
          }
        });
    }
  }

  // Log security event
  await supabase.rpc('log_security_event', {
    event_type: 'payment_received_webhook',
    details: {
      payment_id,
      amount,
      reference_id,
      account_updated: !!accountUpdate
    }
  });

  return {
    payment_id,
    amount,
    account_updated: accountUpdate,
    transaction_created: true
  };
}

async function processInvoiceCreated(supabase: any, data: any) {
  console.log('Processing invoice created:', data);
  
  const {
    invoice_id,
    amount,
    due_date,
    client_id,
    description,
    items
  } = data;

  // Create accounts receivable entry
  const { data: receivable, error: receivableError } = await supabase
    .from('accounts_receivable')
    .insert({
      description: description || `Fatura ${invoice_id}`,
      amount,
      due_date,
      contact_id: client_id,
      status: 'pending',
      invoice_number: invoice_id,
      installment_number: 1,
      total_installments: 1
    })
    .select()
    .single();

  if (receivableError) {
    console.error('Error creating receivable:', receivableError);
    throw receivableError;
  }

  // Create notification
  await supabase
    .from('project_email_notifications')
    .insert({
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'invoice_created',
      subject: `Nova Fatura Criada: R$ ${amount.toLocaleString('pt-BR')}`,
      content: `Uma nova fatura no valor de R$ ${amount.toLocaleString('pt-BR')} foi criada com vencimento em ${new Date(due_date).toLocaleDateString('pt-BR')}.`,
      metadata: { 
        invoice_id, 
        amount, 
        due_date, 
        receivable_id: receivable.id 
      }
    });

  return {
    invoice_id,
    receivable_id: receivable.id,
    amount,
    due_date
  };
}

async function processBankTransaction(supabase: any, data: any) {
  console.log('Processing bank transaction:', data);
  
  const {
    transaction_id,
    amount,
    transaction_type, // credit or debit
    description,
    date,
    category
  } = data;

  // Create financial transaction
  const { data: transaction, error: transactionError } = await supabase
    .from('financial_transactions')
    .insert({
      transaction_type: transaction_type === 'credit' ? 'credit' : 'debit',
      amount: Math.abs(amount),
      description: description || 'Transação bancária automática',
      transaction_date: date || new Date().toISOString().split('T')[0],
      category: category || 'bank_transfer',
      reference_id: transaction_id,
      reference_type: 'bank_transaction'
    })
    .select()
    .single();

  if (transactionError) {
    console.error('Error creating transaction:', transactionError);
    throw transactionError;
  }

  // Try to match with pending accounts
  if (transaction_type === 'credit' && amount > 0) {
    // Look for matching receivables
    const { data: matchingReceivables } = await supabase
      .from('accounts_receivable')
      .select('*')
      .eq('status', 'pending')
      .eq('amount', Math.abs(amount))
      .limit(1);

    if (matchingReceivables && matchingReceivables.length > 0) {
      const receivable = matchingReceivables[0];
      
      // Update receivable as paid
      await supabase
        .from('accounts_receivable')
        .update({
          status: 'paid',
          payment_date: date || new Date().toISOString().split('T')[0],
          payment_method: 'bank_transfer'
        })
        .eq('id', receivable.id);

      // Update transaction with reference
      await supabase
        .from('financial_transactions')
        .update({
          reference_id: receivable.id,
          reference_type: 'receivable',
          description: `${description} - ${receivable.description}`
        })
        .eq('id', transaction.id);
    }
  }

  return {
    transaction_id: transaction.id,
    amount,
    type: transaction_type,
    matched_account: false // TODO: implement matching logic
  };
}

async function processAccountingSync(supabase: any, data: any) {
  console.log('Processing accounting sync:', data);
  
  const { accounts, transactions, period } = data;

  interface SyncError {
    type: string;
    data: any;
    error: string;
  }

  let syncResults: {
    accounts_synced: number;
    transactions_synced: number;
    errors: SyncError[];
  } = {
    accounts_synced: 0,
    transactions_synced: 0,
    errors: []
  };

  // Sync chart of accounts
  if (accounts && Array.isArray(accounts)) {
    for (const account of accounts) {
      try {
        await supabase
          .from('chart_of_accounts')
          .upsert({
            code: account.code,
            name: account.name,
            account_type: account.type,
            is_active: account.active !== false
          }, { onConflict: 'code' });
        
        syncResults.accounts_synced++;
      } catch (error: any) {
        console.error('Error syncing account:', error);
        syncResults.errors.push({ type: 'account', data: account, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  // Sync transactions
  if (transactions && Array.isArray(transactions)) {
    for (const transaction of transactions) {
      try {
        await supabase
          .from('financial_transactions')
          .insert({
            transaction_type: transaction.type,
            amount: Math.abs(transaction.amount),
            description: transaction.description,
            transaction_date: transaction.date,
            category: transaction.category,
            reference_id: transaction.external_id,
            reference_type: 'accounting_sync'
          });
        
        syncResults.transactions_synced++;
      } catch (error: any) {
        console.error('Error syncing transaction:', error);
        syncResults.errors.push({ type: 'transaction', data: transaction, error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  // Create sync notification
  await supabase
    .from('project_email_notifications')
    .insert({
      recipient_email: 'financeiro@guilds.com.br',
      recipient_type: 'admin',
      notification_type: 'accounting_sync',
      subject: `Sincronização Contábil Concluída`,
      content: `Sincronização concluída: ${syncResults.accounts_synced} contas e ${syncResults.transactions_synced} transações sincronizadas.`,
      metadata: syncResults
    });

  return syncResults;
}

async function processPaymentFailed(supabase: any, data: any) {
  console.log('Processing payment failed:', data);
  
  const { payment_id, reference_id, reason, amount } = data;

  // Update receivable if exists
  if (reference_id) {
    const { data: receivable } = await supabase
      .from('accounts_receivable')
      .select('*')
      .eq('id', reference_id)
      .single();

    if (receivable) {
      // Create alert notification
      await supabase
        .from('project_email_notifications')
        .insert({
          recipient_email: 'financeiro@guilds.com.br',
          recipient_type: 'admin',
          notification_type: 'payment_failed',
          subject: `Falha no Pagamento: R$ ${amount.toLocaleString('pt-BR')}`,
          content: `O pagamento da conta "${receivable.description}" no valor de R$ ${amount.toLocaleString('pt-BR')} falhou. Motivo: ${reason}`,
          metadata: { 
            payment_id, 
            reference_id, 
            reason, 
            amount 
          }
        });
    }
  }

  // Log security event
  await supabase.rpc('log_security_event', {
    event_type: 'payment_failed_webhook',
    details: {
      payment_id,
      reference_id,
      reason,
      amount
    }
  });

  return {
    payment_id,
    reference_id,
    action_taken: 'notification_sent'
  };
}

serve(handler);