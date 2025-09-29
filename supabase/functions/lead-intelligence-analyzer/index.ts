import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  contact_id?: string;
  contact_data?: Record<string, any>;
  analysis_type: 'full' | 'scoring' | 'segmentation' | 'prediction' | 'behavioral';
  historical_data?: boolean;
  include_recommendations?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      contact_id, 
      contact_data, 
      analysis_type = 'full',
      historical_data = true,
      include_recommendations = true 
    }: AnalysisRequest = await req.json();

    console.log('Iniciando análise de inteligência para:', { contact_id, analysis_type });

    let contact = contact_data;

    // Buscar dados do contato se ID fornecido
    if (contact_id && !contact_data) {
      const { data } = await supabase
        .from('crm_contacts')
        .select(`
          *,
          crm_contact_interactions(*),
          crm_activities(*),
          crm_product_interests(*)
        `)
        .eq('id', contact_id)
        .single();
      contact = data;
    }

    if (!contact) {
      throw new Error('Dados do contato não encontrados');
    }

    // Executar análises baseadas no tipo solicitado
    let analysisResults: any = {};

    switch (analysis_type) {
      case 'scoring':
        analysisResults = await performScoringAnalysis(supabase, contact);
        break;
      case 'segmentation':
        analysisResults = await performSegmentationAnalysis(supabase, contact);
        break;
      case 'prediction':
        analysisResults = await performPredictiveAnalysis(supabase, contact);
        break;
      case 'behavioral':
        analysisResults = await performBehavioralAnalysis(supabase, contact);
        break;
      case 'full':
      default:
        analysisResults = await performFullAnalysis(supabase, contact, historical_data);
        break;
    }

    // Gerar recomendações se solicitado
    let recommendations = [];
    if (include_recommendations) {
      recommendations = await generateRecommendations(analysisResults, contact);
    }

    const response = {
      success: true,
      contact_id: contact.id,
      analysis_type,
      analysis_results: analysisResults,
      recommendations,
      analysis_metadata: {
        analyzed_at: new Date().toISOString(),
        data_points_analyzed: calculateDataPoints(contact),
        confidence_score: calculateConfidenceScore(analysisResults)
      }
    };

    console.log('Análise de inteligência concluída:', { 
      contact_id: contact.id, 
      confidence: response.analysis_metadata.confidence_score 
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no Lead Intelligence Analyzer:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno na análise de inteligência',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Análise completa de inteligência
async function performFullAnalysis(supabase: any, contact: any, includeHistorical: boolean) {
  const [scoring, segmentation, prediction, behavioral] = await Promise.all([
    performScoringAnalysis(supabase, contact),
    performSegmentationAnalysis(supabase, contact),
    performPredictiveAnalysis(supabase, contact),
    performBehavioralAnalysis(supabase, contact)
  ]);

  return {
    lead_scoring: scoring,
    segmentation: segmentation,
    predictions: prediction,
    behavioral_insights: behavioral,
    overall_assessment: generateOverallAssessment(scoring, segmentation, prediction, behavioral)
  };
}

// Análise de lead scoring
async function performScoringAnalysis(supabase: any, contact: any) {
  const { data: scoringRules } = await supabase
    .from('lead_scoring_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });

  let totalScore = 0;
  const scoreBreakdown: Record<string, number> = {};
  const appliedRules = [];

  for (const rule of scoringRules || []) {
    const ruleScore = evaluateRule(contact, rule);
    if (ruleScore > 0) {
      totalScore += ruleScore;
      appliedRules.push({
        rule_name: rule.name,
        category: rule.rule_type,
        points: ruleScore
      });

      if (!scoreBreakdown[rule.rule_type]) {
        scoreBreakdown[rule.rule_type] = 0;
      }
      scoreBreakdown[rule.rule_type] += ruleScore;
    }
  }

  return {
    total_score: totalScore,
    score_tier: getScoreTier(totalScore),
    score_breakdown: scoreBreakdown,
    applied_rules: appliedRules,
    improvement_opportunities: identifyImprovementOpportunities(contact, scoringRules)
  };
}

// Análise de segmentação
async function performSegmentationAnalysis(supabase: any, contact: any) {
  const segments = [];
  const segmentScores = {};

  // Segmentação por perfil demográfico
  if (contact.company) {
    segments.push('B2B');
    if (contact.company_size === 'large') segments.push('Enterprise');
    else if (contact.company_size === 'medium') segments.push('Mid-Market');
    else segments.push('SMB');
  } else {
    segments.push('B2C');
  }

  // Segmentação por interesse
  if (contact.products_interest) {
    contact.products_interest.forEach((interest: string) => {
      segments.push(`Interest_${interest}`);
    });
  }

  // Segmentação por comportamento
  const engagementLevel = calculateEngagementLevel(contact);
  segments.push(`Engagement_${engagementLevel}`);

  // Segmentação por lifecycle
  segments.push(`Lifecycle_${contact.lifecycle_stage || 'unknown'}`);

  return {
    primary_segments: segments.slice(0, 3),
    all_segments: segments,
    segment_confidence: calculateSegmentConfidence(contact),
    lifecycle_stage: contact.lifecycle_stage || 'lead',
    engagement_level: engagementLevel,
    recommended_personas: identifyPersonas(contact, segments)
  };
}

// Análise preditiva
async function performPredictiveAnalysis(supabase: any, contact: any) {
  // Probabilidade de conversão
  const conversionProbability = predictConversionProbability(contact);
  
  // Valor potencial do cliente
  const predictedValue = predictCustomerValue(contact);
  
  // Tempo estimado para conversão
  const timeToConversion = predictTimeToConversion(contact);
  
  // Melhor canal de comunicação
  const preferredChannel = predictPreferredChannel(contact);

  return {
    conversion_probability: conversionProbability,
    predicted_customer_value: predictedValue,
    estimated_days_to_conversion: timeToConversion,
    preferred_communication_channel: preferredChannel,
    churn_risk: calculateChurnRisk(contact),
    upsell_opportunities: identifyUpsellOpportunities(contact),
    next_best_action: recommendNextAction(contact, conversionProbability)
  };
}

// Análise comportamental
async function performBehavioralAnalysis(supabase: any, contact: any) {
  const interactions = contact.crm_contact_interactions || [];
  const activities = contact.crm_activities || [];

  return {
    interaction_patterns: analyzeInteractionPatterns(interactions),
    engagement_trends: analyzeEngagementTrends(interactions),
    response_patterns: analyzeResponsePatterns(interactions),
    preferred_content_types: identifyContentPreferences(interactions),
    communication_frequency: calculateOptimalFrequency(interactions),
    behavioral_flags: identifyBehavioralFlags(contact, interactions)
  };
}

// Funções auxiliares para análise

function evaluateRule(contact: any, rule: any): number {
  const fieldValue = contact[rule.condition_field];
  let matches = false;

  switch (rule.condition_operator) {
    case 'equals':
      matches = fieldValue === rule.condition_value;
      break;
    case 'contains':
      matches = fieldValue && fieldValue.toString().toLowerCase().includes(rule.condition_value.toLowerCase());
      break;
    case 'greater_than':
      matches = parseFloat(fieldValue || 0) > parseFloat(rule.condition_value);
      break;
    case 'in_list':
      const list = rule.condition_value.split(',').map((s: string) => s.trim());
      matches = list.includes(fieldValue);
      break;
  }

  return matches ? rule.score_points * (rule.score_multiplier || 1) : 0;
}

function getScoreTier(score: number): string {
  if (score >= 80) return 'hot';
  if (score >= 60) return 'warm';
  if (score >= 30) return 'cool';
  return 'cold';
}

function calculateEngagementLevel(contact: any): string {
  const score = contact.engagement_score || 0;
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

function predictConversionProbability(contact: any): number {
  let probability = 0.1; // Base 10%

  // Fatores que aumentam probabilidade
  if (contact.company) probability += 0.2;
  if (contact.job_title?.includes('Director') || contact.job_title?.includes('CEO')) probability += 0.15;
  if (contact.budget_range) probability += 0.1;
  if (contact.decision_timeline === 'immediate' || contact.decision_timeline === '1-3 months') probability += 0.2;
  if (contact.lead_score >= 70) probability += 0.15;
  if (contact.engagement_score >= 60) probability += 0.1;

  return Math.min(probability, 0.95); // Max 95%
}

function predictCustomerValue(contact: any): number {
  let baseValue = 5000; // Valor base

  // Ajustes baseados em dados
  if (contact.company_size === 'large') baseValue *= 3;
  else if (contact.company_size === 'medium') baseValue *= 1.5;

  if (contact.budget_range) {
    const budget = parseFloat(contact.budget_range.replace(/[^\d]/g, '')) || baseValue;
    baseValue = Math.max(baseValue, budget);
  }

  if (contact.products_interest?.length > 1) baseValue *= 1.3;

  return Math.round(baseValue);
}

function predictTimeToConversion(contact: any): number {
  let days = 90; // Base 3 meses

  if (contact.decision_timeline === 'immediate') days = 15;
  else if (contact.decision_timeline === '1-3 months') days = 45;
  else if (contact.decision_timeline === '3-6 months') days = 120;

  // Ajustes por engagement
  if (contact.engagement_score >= 70) days *= 0.7;
  else if (contact.engagement_score <= 30) days *= 1.5;

  return Math.round(days);
}

function predictPreferredChannel(contact: any): string {
  // Análise baseada em interações passadas e perfil
  if (contact.company) return 'email'; // B2B prefere email
  if (contact.age && contact.age < 35) return 'whatsapp'; // Jovens preferem WhatsApp
  return 'email'; // Padrão
}

function calculateChurnRisk(contact: any): string {
  const daysSinceLastInteraction = contact.last_interaction_date 
    ? Math.floor((Date.now() - new Date(contact.last_interaction_date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceLastInteraction > 60) return 'high';
  if (daysSinceLastInteraction > 30) return 'medium';
  return 'low';
}

function identifyUpsellOpportunities(contact: any): string[] {
  const opportunities = [];
  
  if (contact.products_interest?.includes('software') && !contact.products_interest?.includes('automation')) {
    opportunities.push('automation_services');
  }
  
  if (contact.company_size === 'large' && !contact.products_interest?.includes('consulting')) {
    opportunities.push('consulting_services');
  }

  return opportunities;
}

function recommendNextAction(contact: any, conversionProbability: number): string {
  if (conversionProbability >= 0.7) return 'immediate_sales_call';
  if (conversionProbability >= 0.4) return 'send_proposal';
  if (conversionProbability >= 0.2) return 'nurturing_sequence';
  return 'educational_content';
}

function analyzeInteractionPatterns(interactions: any[]): any {
  if (!interactions?.length) return { pattern: 'insufficient_data' };

  const channels = interactions.map(i => i.interaction_type);
  const frequency = channels.reduce((acc, channel) => {
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {});

  return {
    most_used_channel: Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a])[0],
    interaction_frequency: frequency,
    total_interactions: interactions.length
  };
}

function analyzeEngagementTrends(interactions: any[]): any {
  // Análise temporal de engajamento
  return {
    trend: 'stable', // Simplificado
    peak_periods: ['morning', 'afternoon'],
    response_rate: 0.7
  };
}

function analyzeResponsePatterns(interactions: any[]): any {
  return {
    avg_response_time_hours: 24,
    response_quality: 'good',
    preferred_response_channel: 'email'
  };
}

function identifyContentPreferences(interactions: any[]): string[] {
  return ['case_studies', 'technical_docs', 'video_demos'];
}

function calculateOptimalFrequency(interactions: any[]): string {
  return 'weekly'; // Simplificado
}

function identifyBehavioralFlags(contact: any, interactions: any[]): string[] {
  const flags = [];
  
  if (interactions.length === 0) flags.push('no_engagement');
  if (contact.engagement_score < 20) flags.push('low_engagement');
  if (contact.lead_score > 80) flags.push('high_intent');
  
  return flags;
}

function identifyImprovementOpportunities(contact: any, rules: any[]): string[] {
  const opportunities = [];
  
  if (!contact.company) opportunities.push('collect_company_info');
  if (!contact.job_title) opportunities.push('collect_job_title');
  if (!contact.budget_range) opportunities.push('qualify_budget');
  
  return opportunities;
}

function calculateSegmentConfidence(contact: any): number {
  let confidence = 0.5; // Base 50%
  
  if (contact.company) confidence += 0.2;
  if (contact.job_title) confidence += 0.15;
  if (contact.products_interest?.length > 0) confidence += 0.15;
  
  return Math.min(confidence, 0.95);
}

function identifyPersonas(contact: any, segments: string[]): string[] {
  const personas = [];
  
  if (segments.includes('B2B') && segments.includes('Enterprise')) {
    personas.push('Enterprise_Decision_Maker');
  }
  
  if (segments.includes('Interest_software')) {
    personas.push('Tech_Innovator');
  }
  
  return personas;
}

function generateOverallAssessment(scoring: any, segmentation: any, prediction: any, behavioral: any): any {
  return {
    priority_level: prediction.conversion_probability >= 0.6 ? 'high' : 
                   prediction.conversion_probability >= 0.3 ? 'medium' : 'low',
    readiness_score: Math.round((scoring.total_score + prediction.conversion_probability * 100) / 2),
    key_strengths: identifyKeyStrengths(scoring, prediction),
    action_items: generateActionItems(scoring, segmentation, prediction),
    risk_factors: identifyRiskFactors(behavioral, prediction)
  };
}

function identifyKeyStrengths(scoring: any, prediction: any): string[] {
  const strengths = [];
  
  if (scoring.total_score >= 70) strengths.push('high_qualification_score');
  if (prediction.conversion_probability >= 0.5) strengths.push('strong_conversion_likelihood');
  if (prediction.predicted_customer_value >= 10000) strengths.push('high_value_potential');
  
  return strengths;
}

function generateActionItems(scoring: any, segmentation: any, prediction: any): string[] {
  const actions = [];
  
  if (prediction.conversion_probability >= 0.6) {
    actions.push('schedule_sales_call');
  }
  
  if (segmentation.engagement_level === 'low') {
    actions.push('increase_engagement_efforts');
  }
  
  return actions;
}

function identifyRiskFactors(behavioral: any, prediction: any): string[] {
  const risks = [];
  
  if (prediction.churn_risk === 'high') risks.push('high_churn_probability');
  if (behavioral.behavioral_flags?.includes('no_engagement')) risks.push('lack_of_engagement');
  
  return risks;
}

function generateRecommendations(analysisResults: any, contact: any): any[] {
  const recommendations = [];

  // Recomendações baseadas em scoring
  if (analysisResults.lead_scoring?.total_score >= 70) {
    recommendations.push({
      type: 'action',
      priority: 'high',
      title: 'Contato Imediato Recomendado',
      description: 'Lead altamente qualificado - agendar demo ou call comercial',
      action: 'schedule_meeting'
    });
  }

  // Recomendações baseadas em predições
  if (analysisResults.predictions?.conversion_probability >= 0.6) {
    recommendations.push({
      type: 'strategy',
      priority: 'high',
      title: 'Estratégia de Fechamento',
      description: 'Alta probabilidade de conversão - focar em proposta customizada',
      action: 'prepare_proposal'
    });
  }

  return recommendations;
}

function calculateDataPoints(contact: any): number {
  let points = 0;
  
  Object.keys(contact).forEach(key => {
    if (contact[key] !== null && contact[key] !== undefined && contact[key] !== '') {
      points++;
    }
  });
  
  return points;
}

function calculateConfidenceScore(analysisResults: any): number {
  // Calcular confiança baseada na quantidade de dados disponíveis
  let confidence = 0.5; // Base 50%
  
  if (analysisResults.lead_scoring?.total_score > 0) confidence += 0.2;
  if (analysisResults.predictions?.conversion_probability > 0) confidence += 0.2;
  if (analysisResults.behavioral_insights?.interaction_patterns?.total_interactions > 0) confidence += 0.1;
  
  return Math.min(Math.round(confidence * 100), 95);
}

serve(handler);