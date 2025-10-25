import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EnrichmentRequest {
  contact_id: string;
  enrichment_sources?: string[];
  fields_to_enrich?: string[];
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
      enrichment_sources = ['internal', 'social'],
      fields_to_enrich = ['company', 'job_title', 'industry', 'company_size']
    }: EnrichmentRequest = await req.json();

    console.log('Iniciando enriquecimento para contato:', contact_id);

    // 1. Buscar dados atuais do contato
    const { data: contact } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('id', contact_id)
      .single();

    if (!contact) {
      throw new Error('Contato não encontrado');
    }

    const enrichedData: Record<string, any> = {};
    const enrichmentLog = [];

    // 2. Enriquecimento interno (baseado em interações)
    if (enrichment_sources.includes('internal')) {
      const internalData = await enrichFromInternalData(supabase, contact);
      Object.assign(enrichedData, internalData.data);
      enrichmentLog.push(...internalData.log);
    }

    // 3. Enriquecimento via domain lookup (se tiver email corporativo)
    if (enrichment_sources.includes('domain') && contact.email?.includes('@')) {
      const domain = contact.email.split('@')[1];
      if (!['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'].includes(domain)) {
        const domainData = await enrichFromDomain(domain);
        Object.assign(enrichedData, domainData.data);
        enrichmentLog.push(...domainData.log);
      }
    }

    // 4. Enriquecimento via social media (LinkedIn patterns)
    if (enrichment_sources.includes('social') && contact.job_title) {
      const socialData = await enrichFromSocialPatterns(contact);
      Object.assign(enrichedData, socialData.data);
      enrichmentLog.push(...socialData.log);
    }

    // 5. Calcular ICP Score DINAMICAMENTE baseado em critérios configurados
    const icpResult = await calculateDynamicICPScore(supabase, contact, enrichedData);
    enrichedData.icp_score = icpResult.score;

    // 6. Gerar tags automáticas baseadas nos dados
    const autoTags = generateAutoTags(contact, enrichedData);
    if (autoTags.length > 0) {
      enrichedData.tags = Array.from(new Set([...(contact.tags || []), ...autoTags]));
    }

    // 7. Atualizar contato com dados enriquecidos
    const fieldsToUpdate = fields_to_enrich.reduce((acc, field) => {
      if (enrichedData[field] !== undefined && !contact[field]) {
        acc[field] = enrichedData[field];
      }
      return acc;
    }, {} as Record<string, any>);

    if (Object.keys(fieldsToUpdate).length > 0 || enrichedData.icp_score || enrichedData.tags) {
      await supabase
        .from('crm_contacts')
        .update({
          ...fieldsToUpdate,
          icp_score: enrichedData.icp_score,
          tags: enrichedData.tags,
          custom_fields: {
            ...contact.custom_fields,
            enrichment_date: new Date().toISOString(),
            enrichment_sources: enrichment_sources,
            icp_breakdown: icpResult.breakdown // NOVO: armazenar breakdown
          }
        })
        .eq('id', contact_id);
    }

    const response = {
      success: true,
      contact_id,
      enrichment_results: {
        fields_enriched: Object.keys(fieldsToUpdate),
        new_data: fieldsToUpdate,
        icp_score: enrichedData.icp_score,
        icp_breakdown: icpResult.breakdown,
        auto_tags: autoTags,
        enrichmentLog,
        data_quality_score: calculateDataQualityScore(contact, enrichedData)
      }
    };

    console.log('Enriquecimento concluído:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no Lead Enrichment:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno no enriquecimento de dados',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Enriquecimento baseado em dados internos
async function enrichFromInternalData(supabase: any, contact: any) {
  const log = [];
  const data: Record<string, any> = {};

  const { data: interactions } = await supabase
    .from('crm_contact_interactions')
    .select('*')
    .eq('contact_id', contact.id)
    .order('interaction_date', { ascending: false })
    .limit(50);

  if (interactions && interactions.length > 0) {
    const mentionedProducts = new Set<string>();
    interactions.forEach((interaction: any) => {
      const text = (interaction.description || '').toLowerCase();
      if (text.includes('software')) mentionedProducts.add('software');
      if (text.includes('automação') || text.includes('automation')) mentionedProducts.add('automation');
      if (text.includes('ia') || text.includes('ai')) mentionedProducts.add('ia');
      if (text.includes('jogos') || text.includes('games')) mentionedProducts.add('games');
    });

    if (mentionedProducts.size > 0 && !contact.products_interest?.length) {
      data.products_interest = Array.from(mentionedProducts);
      log.push({
        source: 'internal_interactions',
        field: 'products_interest',
        confidence: 0.7
      });
    }
  }

  if (interactions && interactions.length > 0) {
    const engagementScore = Math.min(100, interactions.length * 5 + (contact.engagement_score || 0));
    if (engagementScore > (contact.engagement_score || 0)) {
      data.engagement_score = engagementScore;
      log.push({
        source: 'internal_activity',
        field: 'engagement_score',
        confidence: 0.9
      });
    }
  }

  return { data, log };
}

// Enriquecimento via domain
async function enrichFromDomain(domain: string) {
  const log = [];
  const data: Record<string, any> = {};

  if (!data.company) {
    data.company = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    log.push({
      source: 'domain_inference',
      field: 'company',
      confidence: 0.6
    });
  }

  const industryPatterns: Record<string, string> = {
    'tech': 'technology',
    'soft': 'technology',
    'dev': 'technology',
    'cloud': 'technology',
    'digital': 'marketing',
    'agency': 'marketing',
    'health': 'healthcare',
    'med': 'healthcare',
    'edu': 'education',
    'school': 'education'
  };

  for (const [pattern, industry] of Object.entries(industryPatterns)) {
    if (domain.includes(pattern)) {
      data.industry = industry;
      log.push({
        source: 'domain_pattern',
        field: 'industry',
        confidence: 0.5
      });
      break;
    }
  }

  return { data, log };
}

// Enriquecimento via padrões sociais
async function enrichFromSocialPatterns(contact: any) {
  const log = [];
  const data: Record<string, any> = {};

  const jobTitle = (contact.job_title || '').toLowerCase();
  
  const seniorityPatterns: Record<string, string> = {
    'ceo': 'c_level',
    'cto': 'c_level',
    'cfo': 'c_level',
    'cmo': 'c_level',
    'director': 'director',
    'head': 'director',
    'gerente': 'manager',
    'manager': 'manager',
    'coordenador': 'coordinator',
    'coordinator': 'coordinator',
    'analista': 'individual_contributor',
    'analyst': 'individual_contributor'
  };

  for (const [pattern, level] of Object.entries(seniorityPatterns)) {
    if (jobTitle.includes(pattern)) {
      data.custom_fields = {
        ...contact.custom_fields,
        seniority_level: level
      };
      log.push({
        source: 'job_title_analysis',
        field: 'seniority_level',
        confidence: 0.8
      });
      break;
    }
  }

  if (data.custom_fields?.seniority_level === 'c_level' && !contact.budget_range) {
    data.budget_range = '50k-100k';
    log.push({
      source: 'seniority_inference',
      field: 'budget_range',
      confidence: 0.5
    });
  }

  return { data, log };
}

// NOVO: Calcular ICP Score DINAMICAMENTE
async function calculateDynamicICPScore(supabase: any, contact: any, enrichedData: any) {
  // Buscar critérios ativos
  const { data: criteria, error } = await supabase
    .from('icp_criteria')
    .select('*')
    .eq('is_active', true);

  if (error || !criteria || criteria.length === 0) {
    console.log('Nenhum critério ICP ativo encontrado, usando score padrão');
    return {
      score: 0,
      breakdown: {}
    };
  }

  let totalScore = 0;
  const breakdown: Record<string, any> = {};

  for (const criterion of criteria) {
    const field = criterion.criterion_field;
    const contactValue = contact[field] || enrichedData[field];
    const targetValues = criterion.target_values || [];
    
    let matched = false;

    // Verificar match baseado no tipo de dados
    if (Array.isArray(contactValue)) {
      // Para arrays (ex: products_interest), verificar se há interseção
      matched = contactValue.some(val => targetValues.includes(val));
    } else if (contactValue !== null && contactValue !== undefined) {
      // Para valores simples
      matched = targetValues.includes(contactValue);
    }

    const pointsEarned = matched ? (criterion.weight || 0) : 0;
    totalScore += pointsEarned;

    breakdown[field] = {
      criterion_name: criterion.criterion_name,
      matched,
      points: pointsEarned,
      max_points: criterion.weight || 0,
      contact_value: contactValue,
      target_values: targetValues
    };
  }

  return {
    score: Math.min(100, Math.round(totalScore)),
    breakdown
  };
}

// Gerar tags automáticas
function generateAutoTags(contact: any, enrichedData: any): string[] {
  const tags: string[] = [];

  if (enrichedData.icp_score >= 80) tags.push('high_icp_fit');
  else if (enrichedData.icp_score >= 60) tags.push('medium_icp_fit');

  const seniorityLevel = enrichedData.custom_fields?.seniority_level;
  if (seniorityLevel === 'c_level') tags.push('decision_maker');
  else if (seniorityLevel === 'director') tags.push('influencer');

  if ((contact.engagement_score || 0) >= 70) tags.push('highly_engaged');
  else if ((contact.engagement_score || 0) >= 40) tags.push('engaged');

  if (enrichedData.products_interest) {
    enrichedData.products_interest.forEach((product: string) => {
      tags.push(`interest_${product}`);
    });
  }

  if (contact.last_interaction_date) {
    const daysSince = Math.floor(
      (Date.now() - new Date(contact.last_interaction_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince <= 7) tags.push('recent_activity');
    else if (daysSince > 30) tags.push('dormant');
  }

  return tags;
}

// Calcular score de qualidade dos dados
function calculateDataQualityScore(contact: any, enrichedData: any): number {
  const essentialFields = [
    'name', 'email', 'company', 'job_title', 'industry', 
    'company_size', 'products_interest', 'budget_range'
  ];

  const filledFields = essentialFields.filter(field => 
    contact[field] || enrichedData[field]
  );

  return Math.round((filledFields.length / essentialFields.length) * 100);
}

serve(handler);
