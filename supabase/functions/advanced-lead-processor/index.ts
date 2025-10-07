import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadProcessingRequest {
  contact_id: string;
  source: string;
  form_data?: Record<string, any>;
  behavioral_data?: Record<string, any>;
  utm_data?: Record<string, any>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { contact_id, source, form_data = {}, behavioral_data = {}, utm_data = {} }: LeadProcessingRequest = await req.json();

    console.log('Advanced Lead Processor iniciado para contato:', contact_id);

    // 1. Buscar informações do contato
    const { data: contact } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('id', contact_id)
      .single();

    if (!contact) {
      throw new Error('Contato não encontrado');
    }

    // 2. Aplicar regras de lead scoring dinâmicas
    const { data: scoringRules } = await supabase
      .from('lead_scoring_rules')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    let totalScore = contact.lead_score || 0;
    const appliedRules = [];

    for (const rule of scoringRules || []) {
      const ruleApplied = await applyLeadScoringRule(contact, rule, form_data, behavioral_data);
      if (ruleApplied.applied) {
        totalScore += ruleApplied.points;
        appliedRules.push({
          rule_id: rule.id,
          rule_name: rule.name,
          points_added: ruleApplied.points
        });
      }
    }

    // 3. Atualizar score do contato
    await supabase
      .from('crm_contacts')
      .update({ 
        lead_score: totalScore,
        last_interaction_date: new Date().toISOString()
      })
      .eq('id', contact_id);

    // 4. Verificar triggers de automação
    const { data: triggers } = await supabase
      .from('automation_triggers')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false });

    const triggeredAutomations = [];

    for (const trigger of triggers || []) {
      const shouldTrigger = await evaluateTriggerConditions(trigger, contact, totalScore, source);
      
      if (shouldTrigger) {
        // Registrar execução do trigger
        await supabase
          .from('automation_executions')
          .insert({
            trigger_id: trigger.id,
            contact_id: contact_id,
            execution_type: 'trigger_activated',
            status: 'pending',
            execution_data: {
              source,
              form_data,
              behavioral_data,
              utm_data,
              applied_rules: appliedRules,
              new_score: totalScore
            }
          });

        triggeredAutomations.push({
          trigger_id: trigger.id,
          trigger_name: trigger.name,
          workflows: trigger.target_workflows
        });

        // Atualizar contador do trigger
        await supabase
          .from('automation_triggers')
          .update({ 
            execution_count: (trigger.execution_count || 0) + 1,
            last_executed_at: new Date().toISOString()
          })
          .eq('id', trigger.id);
      }
    }

    // 5. Analisar segmentação automática
    const segmentData = await performAutomaticSegmentation(contact, totalScore, behavioral_data);

    // 6. Gerar insights sobre o lead
    const leadInsights = await generateLeadInsights(contact, form_data, behavioral_data, totalScore);

    const response = {
      success: true,
      contact_id,
      processing_results: {
        original_score: contact.lead_score || 0,
        new_score: totalScore,
        score_increase: totalScore - (contact.lead_score || 0),
        applied_rules: appliedRules,
        triggered_automations: triggeredAutomations,
        segment_data: segmentData,
        lead_insights: leadInsights
      }
    };

    console.log('Advanced Lead Processing concluído:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no Advanced Lead Processor:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno no processamento de lead',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Função para aplicar regras de lead scoring
async function applyLeadScoringRule(contact: any, rule: any, formData: any, behavioralData: any) {
  const { condition_field, condition_operator, condition_value, points } = rule;
  
  // Combinar dados do contato, formulário e comportamental
  const allData = { 
    ...contact, 
    ...formData,
    ...behavioralData,
    // Mapear campos do formulário para os campos esperados
    job_title: formData.cargo || contact.job_title,
    company_size: formData.tamanho_empresa || contact.company_size,
    budget_range: formData.orcamento || contact.budget_range,
    decision_timeline: formData.prazo || contact.decision_timeline,
    // Calcular campos derivados
    products_interest_count: contact.products_interest?.length || 0,
    pain_points_count: contact.pain_points?.length || 0,
    interaction_count: behavioralData.interaction_count || 0,
    last_interaction_days: contact.last_interaction_date 
      ? Math.floor((new Date().getTime() - new Date(contact.last_interaction_date).getTime()) / (1000 * 60 * 60 * 24))
      : 999
  };
  
  const fieldValue = allData[condition_field];
  let applied = false;
  
  try {
    const conditionValues = Array.isArray(condition_value) ? condition_value : 
                          typeof condition_value === 'string' ? JSON.parse(condition_value) : 
                          [condition_value];
    
    switch (condition_operator) {
      case 'equals':
        applied = conditionValues.some(val => fieldValue === val);
        break;
      case 'not_equals':
        applied = !conditionValues.some(val => fieldValue === val);
        break;
      case 'contains':
        if (Array.isArray(fieldValue)) {
          applied = conditionValues.some(val => fieldValue.includes(val));
        } else if (typeof fieldValue === 'string') {
          applied = conditionValues.some(val => 
            fieldValue.toLowerCase().includes(String(val).toLowerCase())
          );
        }
        break;
      case 'not_contains':
        if (Array.isArray(fieldValue)) {
          applied = !conditionValues.some(val => fieldValue.includes(val));
        } else if (typeof fieldValue === 'string') {
          applied = !conditionValues.some(val => 
            fieldValue.toLowerCase().includes(String(val).toLowerCase())
          );
        }
        break;
      case 'greater_than':
        const numValue = parseFloat(fieldValue);
        const numCondition = parseFloat(conditionValues[0]);
        applied = !isNaN(numValue) && !isNaN(numCondition) && numValue > numCondition;
        break;
      case 'less_than':
        const numValue2 = parseFloat(fieldValue);
        const numCondition2 = parseFloat(conditionValues[0]);
        applied = !isNaN(numValue2) && !isNaN(numCondition2) && numValue2 < numCondition2;
        break;
      case 'in_list':
        applied = conditionValues.some(val => 
          String(fieldValue).toLowerCase() === String(val).toLowerCase()
        );
        break;
    }
  } catch (error) {
    console.error('Erro ao aplicar regra:', rule.rule_name, error);
  }

  const pointsAwarded = applied ? points : 0;
  
  return { applied, points: pointsAwarded };
}

// Função para avaliar condições de trigger
async function evaluateTriggerConditions(trigger: any, contact: any, score: number, source: string) {
  const { trigger_type, conditions, frequency_limit, cooldown_hours, last_executed_at } = trigger;
  
  // Verificar cooldown
  if (last_executed_at && cooldown_hours) {
    const lastExecution = new Date(last_executed_at);
    const now = new Date();
    const hoursSince = (now.getTime() - lastExecution.getTime()) / (1000 * 60 * 60);
    
    if (hoursSince < cooldown_hours) {
      return false;
    }
  }

  // Avaliar condições específicas do trigger
  switch (trigger_type) {
    case 'score_based':
      const minScore = conditions.min_score || 0;
      const maxScore = conditions.max_score || 1000;
      return score >= minScore && score <= maxScore;
    
    case 'behavioral':
      return conditions.sources?.includes(source) || false;
    
    case 'lifecycle':
      return conditions.lifecycle_stages?.includes(contact.lifecycle_stage) || false;
    
    case 'external_event':
      return conditions.event_sources?.includes(source) || false;
    
    default:
      return false;
  }
}

// Função para segmentação automática
async function performAutomaticSegmentation(contact: any, score: number, behavioralData: any) {
  const segments = [];

  // Segmentação por score
  if (score >= 80) segments.push('hot_lead');
  else if (score >= 60) segments.push('warm_lead');
  else if (score >= 30) segments.push('cold_lead');
  else segments.push('unqualified');

  // Segmentação por empresa
  if (contact.company) segments.push('business_contact');
  else segments.push('individual_contact');

  // Segmentação por interesse
  if (contact.products_interest) {
    contact.products_interest.forEach((product: string) => {
      segments.push(`interest_${product.toLowerCase()}`);
    });
  }

  return {
    segments,
    primary_segment: segments[0] || 'unqualified',
    score_tier: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
  };
}

// Função para gerar insights do lead
async function generateLeadInsights(contact: any, formData: any, behavioralData: any, score: number) {
  const insights = [];

  // Insight de qualificação
  if (score >= 80) {
    insights.push({
      type: 'qualification',
      priority: 'high',
      message: 'Lead altamente qualificado - priorizar contato imediato',
      action: 'immediate_contact'
    });
  }

  // Insight de interesse
  if (contact.products_interest?.length > 1) {
    insights.push({
      type: 'interest',
      priority: 'medium', 
      message: 'Lead demonstra interesse em múltiplos produtos',
      action: 'cross_sell_opportunity'
    });
  }

  // Insight comportamental
  if (behavioralData.page_views > 5) {
    insights.push({
      type: 'behavioral',
      priority: 'medium',
      message: 'Alto engajamento no site - lead engajado',
      action: 'send_nurturing_content'
    });
  }

  return insights;
}

serve(handler);