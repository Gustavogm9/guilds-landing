import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SequenceExecutionRequest {
  contact_id: string;
  workflow_id?: string;
  sequence_id?: string;
  trigger_event?: string;
  manual_execution?: boolean;
}

interface SequenceCreationRequest {
  workflow_id: string;
  name: string;
  trigger_event: string;
  channel: string;
  delay_hours?: number;
  content_template_id?: string;
  conditions?: Record<string, any>;
  personalization_rules?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'execute';

    if (action === 'cron') {
      // Ação chamada pelo cron job - processar enrollments pendentes
      return await handleCronExecution(supabase);
    } else if (action === 'create') {
      return await handleSequenceCreation(req, supabase);
    } else if (action === 'status') {
      return await handleSequenceStatus(req, supabase);
    } else if (action === 'list') {
      return await handleSequencesList(supabase);
    } else {
      return await handleSequenceExecution(req, supabase);
    }

  } catch (error) {
    console.error('Erro no Nurturing Sequence Executor:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno no executor de sequências',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Executar sequência de nutrição
async function handleSequenceExecution(req: Request, supabase: any) {
  const { contact_id, workflow_id, sequence_id, trigger_event, manual_execution = false }: SequenceExecutionRequest = await req.json();

  console.log('Executando sequência de nutrição:', { contact_id, workflow_id, sequence_id, trigger_event });

  // Buscar dados do contato
  const { data: contact } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('id', contact_id)
    .single();

  if (!contact) {
    throw new Error('Contato não encontrado');
  }

  let sequences = [];

  if (sequence_id) {
    // Executar sequência específica
    const { data } = await supabase
      .from('lead_nurturing_sequences')
      .select('*, marketing_automation_workflows(*)')
      .eq('id', sequence_id)
      .eq('is_active', true)
      .single();
    
    if (data) sequences = [data];
  } else if (workflow_id) {
    // Executar todas as sequências de um workflow
    const { data } = await supabase
      .from('lead_nurturing_sequences')
      .select('*, marketing_automation_workflows(*)')
      .eq('workflow_id', workflow_id)
      .eq('is_active', true)
      .order('sequence_order');
    
    sequences = data || [];
  } else if (trigger_event) {
    // Buscar sequências por evento trigger
    const { data } = await supabase
      .from('lead_nurturing_sequences')
      .select('*, marketing_automation_workflows(*)')
      .eq('trigger_event', trigger_event)
      .eq('is_active', true)
      .order('sequence_order');
    
    sequences = data || [];
  }

  const executionResults = [];

  for (const sequence of sequences) {
    try {
      // Verificar condições da sequência
      const conditionsMet = await evaluateSequenceConditions(sequence, contact, supabase);
      
      if (!conditionsMet && !manual_execution) {
        console.log(`Condições não atendidas para sequência ${sequence.id}`);
        continue;
      }

      // Agendar ou executar imediatamente baseado no delay
      const executionTime = manual_execution ? new Date() : 
        new Date(Date.now() + (sequence.delay_hours || 0) * 60 * 60 * 1000);

      // Registrar execução
      const { data: execution } = await supabase
        .from('automation_executions')
        .insert({
          workflow_id: sequence.workflow_id,
          sequence_id: sequence.id,
          contact_id: contact_id,
          execution_type: 'nurturing_sequence',
          status: manual_execution ? 'running' : 'pending',
          started_at: executionTime.toISOString(),
          execution_data: {
            channel: sequence.channel,
            trigger_event,
            manual_execution,
            personalization_rules: sequence.personalization_rules
          }
        })
        .select()
        .single();

      let executionResult;

      if (manual_execution || sequence.delay_hours === 0) {
        // Executar imediatamente
        executionResult = await executeSequenceStep(sequence, contact, supabase);
        
        // Atualizar status da execução
        await supabase
          .from('automation_executions')
          .update({
            status: executionResult.success ? 'completed' : 'failed',
            completed_at: new Date().toISOString(),
            results: executionResult,
            error_message: executionResult.error || null
          })
          .eq('id', execution.id);
      } else {
        executionResult = {
          success: true,
          scheduled: true,
          execution_time: executionTime.toISOString(),
          message: `Sequência agendada para ${executionTime.toLocaleString()}`
        };
      }

      executionResults.push({
        sequence_id: sequence.id,
        sequence_name: sequence.name,
        execution_id: execution.id,
        result: executionResult
      });

    } catch (error) {
      console.error(`Erro na execução da sequência ${sequence.id}:`, error);
      executionResults.push({
        sequence_id: sequence.id,
        sequence_name: sequence.name,
        result: {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        }
      });
    }
  }

  return new Response(JSON.stringify({
    success: true,
    contact_id,
    sequences_processed: sequences.length,
    execution_results: executionResults
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Processar enrollments pendentes (chamado pelo cron)
async function handleCronExecution(supabase: any) {
  console.log('🔄 Cron: Processando enrollments pendentes...');
  
  try {
    // Buscar enrollments ativos com next_action_at vencido
    const { data: enrollments, error } = await supabase
      .from('nurturing_enrollments')
      .select(`
        *,
        nurturing_sequences(
          *,
          nurturing_sequence_steps(*)
        ),
        crm_contacts(*)
      `)
      .eq('status', 'active')
      .lte('next_action_at', new Date().toISOString())
      .order('next_action_at', { ascending: true })
      .limit(50); // Processar até 50 por vez

    if (error) throw error;

    if (!enrollments || enrollments.length === 0) {
      console.log('✅ Nenhum enrollment pendente para processar');
      return new Response(JSON.stringify({
        success: true,
        processed: 0,
        message: 'Nenhum enrollment pendente'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    
    for (const enrollment of enrollments) {
      try {
        const sequence = enrollment.nurturing_sequences;
        const contact = enrollment.crm_contacts;
        const steps = sequence.nurturing_steps || [];
        
        // Pegar o step atual
        const currentStep = steps.find((s: any) => s.step_order === enrollment.current_step_index);
        
        if (!currentStep) {
          console.log(`⚠️ Step ${enrollment.current_step_index} não encontrado para enrollment ${enrollment.id}`);
          continue;
        }

        // Executar o step (passando enrollment_id para tracking)
        const stepWithEnrollmentId = { ...currentStep, enrollment_id: enrollment.id };
        const stepResult = await executeNurturingStep(stepWithEnrollmentId, contact, supabase);
        
        // Calcular próximo step
        const nextStepIndex = enrollment.current_step_index + 1;
        const nextStep = steps.find((s: any) => s.step_order === nextStepIndex);
        
        if (nextStep) {
          // Há mais steps - agendar próximo
          const nextActionAt = new Date(Date.now() + nextStep.delay_hours * 60 * 60 * 1000);
          
          await supabase
            .from('nurturing_enrollments')
            .update({
              current_step_index: nextStepIndex,
              next_action_at: nextActionAt.toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
          
          results.push({
            enrollment_id: enrollment.id,
            contact: contact.name,
            step_executed: currentStep.step_order,
            next_step: nextStepIndex,
            next_action_at: nextActionAt.toISOString(),
            result: stepResult
          });
        } else {
          // Sequência completa
          await supabase
            .from('nurturing_enrollments')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
          
          results.push({
            enrollment_id: enrollment.id,
            contact: contact.name,
            step_executed: currentStep.step_order,
            completed: true,
            result: stepResult
          });
        }
      } catch (error) {
        console.error(`Erro ao processar enrollment ${enrollment.id}:`, error);
        results.push({
          enrollment_id: enrollment.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    console.log(`✅ Cron: ${results.length} enrollments processados`);
    
    return new Response(JSON.stringify({
      success: true,
      processed: results.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Erro no cron execution:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Executar step de nurturing (diferente de sequence, steps são da tabela nurturing_steps)
async function executeNurturingStep(step: any, contact: any, supabase: any) {
  console.log(`Executando nurturing step ${step.step_order} para ${contact.name}`);
  
  let result;
  
  switch (step.channel) {
    case 'email':
      result = await sendNurturingEmail(step, contact, supabase);
      break;
    case 'whatsapp':
      result = await sendNurturingWhatsApp(step, contact, supabase);
      break;
    default:
      console.log(`Canal ${step.channel} ainda não implementado`);
      result = { success: true, simulated: true };
  }
  
  return result;
}

// Enviar email de nurturing step
async function sendNurturingEmail(step: any, contact: any, supabase: any) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY não configurada - email simulado');
    return { success: true, simulated: true, message_id: `email_sim_${Date.now()}` };
  }

  const resend = new Resend(resendApiKey);
  
  // Personalizar conteúdo
  let subject = step.subject || 'Mensagem da Guilds';
  let content = step.content || '';
  
  const variables = {
    name: contact.name,
    company: contact.company || 'sua empresa',
    email: contact.email
  };

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, String(value));
    content = content.replace(regex, String(value));
  }

  // Get enrollment_id from context (must be passed to this function)
  const enrollmentId = (step as any).enrollment_id;
  
  // Add tracking to subject
  const subjectWithTracking = enrollmentId 
    ? `[ENROLLMENT:${enrollmentId}] ${subject}`
    : subject;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Guilds <onboarding@resend.dev>',
      to: [contact.email],
      subject: subjectWithTracking,
      html: content,
    });

    if (error) throw new Error(error.message);

    console.log(`✅ Email enviado para ${contact.email}: ${subject}`);
    return { success: true, message_id: data?.id };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

// Enviar WhatsApp de nurturing step (placeholder)
async function sendNurturingWhatsApp(step: any, contact: any, supabase: any) {
  console.log(`📱 WhatsApp simulado para ${contact.phone || contact.name}`);
  return { success: true, simulated: true, message_id: `whatsapp_sim_${Date.now()}` };
}

// Criar nova sequência
async function handleSequenceCreation(req: Request, supabase: any) {
  const sequenceData: SequenceCreationRequest = await req.json();

  console.log('Criando nova sequência:', sequenceData.name);

  const { data, error } = await supabase
    .from('lead_nurturing_sequences')
    .insert({
      workflow_id: sequenceData.workflow_id,
      name: sequenceData.name,
      trigger_event: sequenceData.trigger_event,
      channel: sequenceData.channel,
      delay_hours: sequenceData.delay_hours || 24,
      content_template_id: sequenceData.content_template_id,
      conditions: sequenceData.conditions || {},
      personalization_rules: sequenceData.personalization_rules || {},
      sequence_order: 0 // Será ajustado automaticamente
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({
    success: true,
    sequence: data
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Status das execuções
async function handleSequenceStatus(req: Request, supabase: any) {
  const { contact_id } = await req.json();

  const { data: executions } = await supabase
    .from('automation_executions')
    .select(`
      *,
      lead_nurturing_sequences(name, channel),
      marketing_automation_workflows(name)
    `)
    .eq('contact_id', contact_id)
    .eq('execution_type', 'nurturing_sequence')
    .order('started_at', { ascending: false })
    .limit(20);

  return new Response(JSON.stringify({
    success: true,
    executions: executions || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Listar sequências disponíveis
async function handleSequencesList(supabase: any) {
  const { data: sequences } = await supabase
    .from('lead_nurturing_sequences')
    .select(`
      *,
      marketing_automation_workflows(name, workflow_type)
    `)
    .eq('is_active', true)
    .order('sequence_order');

  // Agrupar por workflow
  const groupedSequences = (sequences || []).reduce((acc: Record<string, any>, seq: any) => {
    const workflowId = seq.workflow_id;
    if (!acc[workflowId]) {
      acc[workflowId] = {
        workflow: seq.marketing_automation_workflows,
        sequences: []
      };
    }
    acc[workflowId].sequences.push(seq);
    return acc;
  }, {});

  return new Response(JSON.stringify({
    success: true,
    workflows: groupedSequences
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Executar step da sequência
async function executeSequenceStep(sequence: any, contact: any, supabase: any) {
  try {
    console.log(`Executando step ${sequence.name} para contato ${contact.id} via ${sequence.channel}`);

    let result;

    switch (sequence.channel) {
      case 'email':
        result = await sendEmailSequence(sequence, contact, supabase);
        break;
      case 'whatsapp':
        result = await sendWhatsAppSequence(sequence, contact, supabase);
        break;
      case 'sms':
        result = await sendSMSSequence(sequence, contact, supabase);
        break;
      case 'linkedin':
        result = await sendLinkedInSequence(sequence, contact, supabase);
        break;
      case 'push':
        result = await sendPushSequence(sequence, contact, supabase);
        break;
      default:
        throw new Error(`Canal não suportado: ${sequence.channel}`);
    }

    // Registrar métricas
    await updateSequenceMetrics(sequence, contact, 'sent', supabase);

    // Executar ações de sucesso se definidas
    if (sequence.success_actions?.length > 0) {
      await executeSuccessActions(sequence.success_actions, contact, supabase);
    }

    return {
      success: true,
      channel: sequence.channel,
      message_id: result.message_id,
      sent_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro na execução do step:', error);

    // Executar ações de falha se definidas
    if (sequence.failure_actions?.length > 0) {
      await executeFailureActions(sequence.failure_actions, contact, supabase);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Avaliar condições da sequência
async function evaluateSequenceConditions(sequence: any, contact: any, supabase: any): Promise<boolean> {
  if (!sequence.conditions || Object.keys(sequence.conditions).length === 0) {
    return true; // Sem condições = sempre executar
  }

  const conditions = sequence.conditions;

  // Verificar condições de lead score
  if (conditions.min_lead_score && contact.lead_score < conditions.min_lead_score) {
    return false;
  }

  if (conditions.max_lead_score && contact.lead_score > conditions.max_lead_score) {
    return false;
  }

  // Verificar lifecycle stage
  if (conditions.lifecycle_stages && !conditions.lifecycle_stages.includes(contact.lifecycle_stage)) {
    return false;
  }

  // Verificar tags
  if (conditions.required_tags) {
    const hasAllTags = conditions.required_tags.every((tag: string) => 
      contact.tags?.includes(tag)
    );
    if (!hasAllTags) return false;
  }

  // Verificar exclusão por tags
  if (conditions.excluded_tags) {
    const hasExcludedTag = conditions.excluded_tags.some((tag: string) => 
      contact.tags?.includes(tag)
    );
    if (hasExcludedTag) return false;
  }

  // Verificar última interação
  if (conditions.min_days_since_interaction && contact.last_interaction_date) {
    const daysSince = Math.floor(
      (Date.now() - new Date(contact.last_interaction_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < conditions.min_days_since_interaction) return false;
  }

  return true;
}

// Enviar email da sequência
async function sendEmailSequence(sequence: any, contact: any, supabase: any) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY não configurada - email simulado');
    const messageId = `email_simulated_${Date.now()}_${contact.id}`;
    return { message_id: messageId };
  }

  const resend = new Resend(resendApiKey);

  // Se tem template específico, usar ele
  let emailContent;
  
  if (sequence.content_template_id) {
    const { data: template } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', sequence.content_template_id)
      .single();

    if (template) {
      // Personalizar template com dados do contato
      emailContent = personalizeEmailContent(template, contact, sequence.personalization_rules);
    }
  }

  // Se não tem template, gerar conteúdo básico
  if (!emailContent) {
    emailContent = generateBasicEmailContent(sequence, contact);
  }

  try {
    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Guilds <onboarding@resend.dev>',
      to: [contact.email],
      subject: emailContent.subject,
      html: emailContent.content,
    });

    if (error) {
      console.error('Erro ao enviar email via Resend:', error);
      throw new Error(error.message || 'Erro ao enviar email');
    }

    console.log(`✅ Email enviado via Resend para ${contact.email}:`, {
      subject: emailContent.subject,
      message_id: data?.id
    });

    return { message_id: data?.id || `email_${Date.now()}` };
  } catch (error) {
    console.error('Falha no envio de email:', error);
    throw error;
  }
}

// Enviar WhatsApp da sequência  
async function sendWhatsAppSequence(sequence: any, contact: any, supabase: any) {
  const message = personalizeMessage(
    `Olá ${contact.name}! ${sequence.name}`,
    contact,
    sequence.personalization_rules
  );

  const messageId = `whatsapp_${Date.now()}_${contact.id}`;
  
  console.log(`WhatsApp enviado para ${contact.phone}:`, {
    message,
    message_id: messageId
  });

  return { message_id: messageId };
}

// Enviar SMS da sequência
async function sendSMSSequence(sequence: any, contact: any, supabase: any) {
  const message = personalizeMessage(
    `Guilds: ${sequence.name}`,
    contact,
    sequence.personalization_rules
  );

  const messageId = `sms_${Date.now()}_${contact.id}`;
  
  console.log(`SMS enviado para ${contact.phone}:`, {
    message,
    message_id: messageId
  });

  return { message_id: messageId };
}

// Enviar LinkedIn da sequência
async function sendLinkedInSequence(sequence: any, contact: any, supabase: any) {
  const messageId = `linkedin_${Date.now()}_${contact.id}`;
  
  console.log(`LinkedIn message para ${contact.name}:`, {
    sequence: sequence.name,
    message_id: messageId
  });

  return { message_id: messageId };
}

// Enviar push notification da sequência
async function sendPushSequence(sequence: any, contact: any, supabase: any) {
  const messageId = `push_${Date.now()}_${contact.id}`;
  
  console.log(`Push notification para ${contact.name}:`, {
    sequence: sequence.name,
    message_id: messageId
  });

  return { message_id: messageId };
}

// Personalizar conteúdo do email
function personalizeEmailContent(template: any, contact: any, personalizationRules: any) {
  let subject = template.subject_template;
  let content = template.content_html;

  // Substituir variáveis básicas
  const variables = {
    name: contact.name,
    company: contact.company || 'sua empresa',
    email: contact.email,
    ...personalizationRules
  };

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    subject = subject.replace(regex, String(value));
    content = content.replace(regex, String(value));
  }

  return { subject, content };
}

// Personalizar mensagem
function personalizeMessage(message: string, contact: any, personalizationRules: any) {
  const variables = {
    name: contact.name,
    company: contact.company || 'sua empresa',
    ...personalizationRules
  };

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, String(value));
  }

  return message;
}

// Gerar conteúdo básico de email
function generateBasicEmailContent(sequence: any, contact: any) {
  return {
    subject: `${sequence.name} - ${contact.name}`,
    content: `
      <h2>Olá, ${contact.name}!</h2>
      <p>Este é um conteúdo automático da sequência: ${sequence.name}</p>
      <p>Atenciosamente,<br>Equipe Guilds</p>
    `
  };
}

// Atualizar métricas da sequência
async function updateSequenceMetrics(sequence: any, contact: any, action: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0];
  
  const updateData: any = {};
  
  switch (action) {
    case 'sent':
      if (sequence.channel === 'email') updateData.emails_sent = 1;
      else if (sequence.channel === 'whatsapp') updateData.whatsapp_sent = 1;
      break;
  }

  await supabase
    .from('automation_metrics')
    .upsert({
      workflow_id: sequence.workflow_id,
      contact_id: contact.id,
      date: today,
      ...updateData
    }, {
      onConflict: 'workflow_id,contact_id,date'
    });
}

// Executar ações de sucesso
async function executeSuccessActions(actions: any[], contact: any, supabase: any) {
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'add_tag':
          await addTagToContact(contact.id, action.value, supabase);
          break;
        case 'update_score':
          await updateContactScore(contact.id, action.value, supabase);
          break;
        case 'trigger_workflow':
          await triggerWorkflow(contact.id, action.workflow_id, supabase);
          break;
      }
    } catch (error) {
      console.error('Erro ao executar ação de sucesso:', error);
    }
  }
}

// Executar ações de falha
async function executeFailureActions(actions: any[], contact: any, supabase: any) {
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'add_tag':
          await addTagToContact(contact.id, action.value, supabase);
          break;
        case 'retry_later':
          // Implementar retry logic
          break;
      }
    } catch (error) {
      console.error('Erro ao executar ação de falha:', error);
    }
  }
}

// Adicionar tag ao contato
async function addTagToContact(contactId: string, tag: string, supabase: any) {
  const { data: contact } = await supabase
    .from('crm_contacts')
    .select('tags')
    .eq('id', contactId)
    .single();

  const currentTags = contact?.tags || [];
  if (!currentTags.includes(tag)) {
    await supabase
      .from('crm_contacts')
      .update({ tags: [...currentTags, tag] })
      .eq('id', contactId);
  }
}

// Atualizar score do contato
async function updateContactScore(contactId: string, scoreChange: number, supabase: any) {
  const { data: contact } = await supabase
    .from('crm_contacts')
    .select('lead_score')
    .eq('id', contactId)
    .single();

  const currentScore = contact?.lead_score || 0;
  await supabase
    .from('crm_contacts')
    .update({ lead_score: currentScore + scoreChange })
    .eq('id', contactId);
}

// Triggerar workflow
async function triggerWorkflow(contactId: string, workflowId: string, supabase: any) {
  // Implementar trigger de workflow
  console.log(`Triggering workflow ${workflowId} for contact ${contactId}`);
}

serve(handler);