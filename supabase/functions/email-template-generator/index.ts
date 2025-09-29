import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TemplateGenerationRequest {
  template_type: string;
  contact_data: Record<string, any>;
  personalization_data?: Record<string, any>;
  campaign_context?: Record<string, any>;
  template_id?: string;
}

interface TemplateCreationRequest {
  name: string;
  template_type: string;
  subject_template: string;
  content_html: string;
  content_text?: string;
  variables?: string[];
  design_config?: Record<string, any>;
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
    const action = url.searchParams.get('action') || 'generate';

    if (action === 'create') {
      return await handleTemplateCreation(req, supabase);
    } else if (action === 'list') {
      return await handleTemplatesList(supabase);
    } else {
      return await handleTemplateGeneration(req, supabase);
    }

  } catch (error) {
    console.error('Erro no Email Template Generator:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno no gerador de templates',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

// Gerar email personalizado a partir de template
async function handleTemplateGeneration(req: Request, supabase: any) {
  const { template_type, contact_data, personalization_data = {}, campaign_context = {}, template_id }: TemplateGenerationRequest = await req.json();

  console.log('Gerando email personalizado:', { template_type, template_id });

  let template;

  if (template_id) {
    // Usar template específico
    const { data } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', template_id)
      .eq('is_active', true)
      .single();
    template = data;
  } else {
    // Buscar melhor template por tipo
    const { data: templates } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_type', template_type)
      .eq('is_active', true)
      .order('usage_count', { ascending: false })
      .limit(1);
    template = templates?.[0];
  }

  if (!template) {
    // Gerar template básico se não encontrar
    template = generateDefaultTemplate(template_type);
  }

  // Personalizar template com dados do contato
  const personalizedEmail = await personalizeTemplate(template, contact_data, personalization_data, campaign_context);

  // Atualizar contador de uso
  if (template.id) {
    await supabase
      .from('email_templates')
      .update({ usage_count: (template.usage_count || 0) + 1 })
      .eq('id', template.id);
  }

  return new Response(JSON.stringify({
    success: true,
    template_used: template.id || 'default_generated',
    personalized_email: personalizedEmail,
    personalization_applied: Object.keys(personalizedEmail.variables_used || {}).length
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Criar novo template
async function handleTemplateCreation(req: Request, supabase: any) {
  const templateData: TemplateCreationRequest = await req.json();

  console.log('Criando novo template:', templateData.name);

  const { data, error } = await supabase
    .from('email_templates')
    .insert({
      name: templateData.name,
      template_type: templateData.template_type,
      subject_template: templateData.subject_template,
      content_html: templateData.content_html,
      content_text: templateData.content_text,
      variables: templateData.variables || [],
      design_config: templateData.design_config || {},
      created_by: null // Será preenchido com auth.uid() automaticamente se necessário
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return new Response(JSON.stringify({
    success: true,
    template: data
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Listar templates disponíveis
async function handleTemplatesList(supabase: any) {
  const { data: templates } = await supabase
    .from('email_templates')
    .select('id, name, template_type, description, usage_count, performance_metrics, created_at')
    .eq('is_active', true)
    .order('usage_count', { ascending: false });

  return new Response(JSON.stringify({
    success: true,
    templates: templates || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Personalizar template com dados
async function personalizeTemplate(template: any, contactData: any, personalizationData: any, campaignContext: any) {
  const allData = { ...contactData, ...personalizationData, ...campaignContext };
  const variablesUsed: Record<string, any> = {};

  // Personalizar subject
  let personalizedSubject = template.subject_template;
  personalizedSubject = replaceVariables(personalizedSubject, allData, variablesUsed);

  // Personalizar conteúdo HTML
  let personalizedHtml = template.content_html;
  personalizedHtml = replaceVariables(personalizedHtml, allData, variablesUsed);

  // Personalizar conteúdo texto
  let personalizedText = template.content_text || '';
  personalizedText = replaceVariables(personalizedText, allData, variablesUsed);

  // Aplicar regras de personalização específicas
  if (template.personalization_fields) {
    personalizedHtml = applyPersonalizationRules(personalizedHtml, template.personalization_fields, allData);
  }

  // Gerar versões A/B se disponíveis
  const abVariants = [];
  if (template.a_b_variants?.length > 0) {
    for (const variant of template.a_b_variants) {
      abVariants.push({
        variant_name: variant.name,
        subject: replaceVariables(variant.subject_template || personalizedSubject, allData, {}),
        html: replaceVariables(variant.content_html || personalizedHtml, allData, {}),
        weight: variant.weight || 50
      });
    }
  }

  return {
    subject: personalizedSubject,
    html_content: personalizedHtml,
    text_content: personalizedText,
    variables_used: variablesUsed,
    template_info: {
      id: template.id,
      name: template.name,
      type: template.template_type
    },
    ab_variants: abVariants,
    personalization_score: calculatePersonalizationScore(variablesUsed, allData)
  };
}

// Substituir variáveis no texto
function replaceVariables(text: string, data: any, variablesUsed: Record<string, any>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
    const value = data[variable];
    if (value !== undefined) {
      variablesUsed[variable] = value;
      return value;
    }
    return match; // Manter variável se não encontrar valor
  });
}

// Aplicar regras de personalização
function applyPersonalizationRules(content: string, rules: any, data: any): string {
  let personalizedContent = content;

  for (const [field, rule] of Object.entries(rules)) {
    if (data[field] && rule) {
      const ruleConfig = rule as any;
      
      if (ruleConfig.conditional_content) {
        for (const condition of ruleConfig.conditional_content) {
          if (evaluateCondition(data[field], condition.condition)) {
            personalizedContent = personalizedContent.replace(
              new RegExp(`{{${field}_conditional}}`, 'g'),
              condition.content
            );
          }
        }
      }
    }
  }

  return personalizedContent;
}

// Avaliar condição para personalização
function evaluateCondition(value: any, condition: any): boolean {
  switch (condition.operator) {
    case 'equals':
      return value === condition.value;
    case 'contains':
      return value.toString().includes(condition.value);
    case 'greater_than':
      return parseFloat(value) > parseFloat(condition.value);
    default:
      return false;
  }
}

// Calcular score de personalização
function calculatePersonalizationScore(variablesUsed: Record<string, any>, allData: Record<string, any>): number {
  const totalVariables = Object.keys(allData).length;
  const usedVariables = Object.keys(variablesUsed).length;
  
  if (totalVariables === 0) return 0;
  
  return Math.round((usedVariables / totalVariables) * 100);
}

// Gerar template padrão
function generateDefaultTemplate(templateType: string) {
  const templates = {
    welcome: {
      subject_template: 'Bem-vindo(a), {{name}}!',
      content_html: `
        <h1>Olá, {{name}}!</h1>
        <p>Seja bem-vindo(a) à Guilds! Estamos muito felizes em tê-lo(a) conosco.</p>
        <p>{{#if company}}Vimos que você representa a empresa {{company}}, e estamos ansiosos para conhecer melhor suas necessidades.{{/if}}</p>
        <p>Nossa equipe entrará em contato em breve para alinharmos a melhor solução para você.</p>
        <p>Atenciosamente,<br>Equipe Guilds</p>
      `,
      variables: ['name', 'company']
    },
    nurturing: {
      subject_template: 'Conteúdo exclusivo para você, {{name}}',
      content_html: `
        <h2>Olá, {{name}}!</h2>
        <p>Preparamos um conteúdo especial pensando no seu interesse em {{interest}}.</p>
        <p>{{#if company}}Sabemos que na {{company}} vocês buscam sempre a excelência, e temos soluções que podem ajudar.{{/if}}</p>
        <p>Confira nossos recursos e entre em contato quando quiser saber mais!</p>
      `,
      variables: ['name', 'interest', 'company']
    }
  };

  return templates[templateType as keyof typeof templates] || templates.welcome;
}

serve(handler);