import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, contract_id } = await req.json();
    
    console.log(`Processing ${action} for contract ${contract_id}`);

    // Buscar dados do contrato
    const { data: contract, error: contractError } = await supabase
      .from('legal_contracts')
      .select(`
        *,
        client_contact:crm_contacts(name, email, company, phone),
        deal:crm_deals(title, value, tags, custom_fields),
        project:projects(title, description, sprints),
        template:legal_templates(name, contract_type, variables_mapping)
      `)
      .eq('id', contract_id)
      .single();

    if (contractError || !contract) {
      throw new Error(`Contrato não encontrado: ${contractError?.message}`);
    }

    // Buscar cláusulas selecionadas
    const { data: clauses, error: clausesError } = await supabase
      .from('legal_clauses')
      .select(`
        *,
        group:legal_clause_groups(name, description)
      `)
      .in('id', contract.selected_clauses || []);

    if (clausesError) {
      console.error('Erro ao buscar cláusulas:', clausesError);
    }

    let result;

    switch (action) {
      case 'generate_draft':
        result = await generateContractDraft(contract, clauses || []);
        break;
      case 'review_contract':
        result = await reviewContract(contract, clauses || []);
        break;
      case 'law_design':
        result = await generateLawDesign(contract, clauses || []);
        break;
      default:
        throw new Error(`Ação não suportada: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no legal-ai-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateContractDraft(contract: any, clauses: any[]) {
  console.log('Gerando rascunho do contrato com IA...');

  const systemPrompt = `Você é um redator jurídico especializado da Guilds. Sua tarefa é gerar contratos de desenvolvimento de software profissionais e precisos.

DIRETRIZES IMPORTANTES:
- Use terminologia técnica jurídica apropriada
- Mantenha o padrão Guilds para Sprints, manutenção, fidelidade, LGPD
- Estruture o contrato de forma clara e organizada
- Inclua todas as cláusulas selecionadas de forma coerente
- Use as variáveis do cliente/projeto fornecidas
- Mantenha conformidade com LGPD e legislação brasileira`;

  const userPrompt = `Gere um contrato completo baseado nos seguintes dados:

**CLIENTE:**
- Nome: ${contract.client_contact?.name || 'Nome não informado'}
- Empresa: ${contract.client_contact?.company || 'Não informado'}
- Email: ${contract.client_contact?.email || 'Não informado'}

**PROJETO:**
- Título: ${contract.title}
- Deal: ${contract.deal?.title || 'Não informado'}
- Valor: ${contract.deal?.value ? `R$ ${contract.deal.value}` : 'Não informado'}
- Tags: ${contract.deal?.tags?.join(', ') || 'Nenhuma'}

**CLÁUSULAS SELECIONADAS:**
${clauses.map(clause => `
Grupo: ${clause.group?.name}
Título: ${clause.title}
Conteúdo: ${clause.content_markdown}
`).join('\n---\n')}

**VARIABLES DATA:**
${JSON.stringify(contract.variables_data, null, 2)}

Gere o contrato completo em formato Markdown, estruturado e profissional.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    // Salvar o conteúdo gerado no contrato
    const { error: updateError } = await supabase
      .from('legal_contracts')
      .update({
        content_markdown: generatedContent,
        status: 'review',
        updated_at: new Date().toISOString()
      })
      .eq('id', contract.id);

    if (updateError) {
      throw new Error(`Erro ao salvar contrato: ${updateError.message}`);
    }

    console.log('Rascunho gerado e salvo com sucesso');
    return { success: true, content: generatedContent };

  } catch (error) {
    console.error('Erro ao gerar rascunho:', error);
    throw error;
  }
}

async function reviewContract(contract: any, clauses: any[]) {
  console.log('Executando revisão jurídica com IA...');

  const systemPrompt = `Você é um advogado especialista em contratos de TI e LGPD. Analise o contrato e identifique:

1. **Propriedade Intelectual** - Verificar cláusulas de PI, white-label, exclusividade
2. **LGPD** - Conformidade com proteção de dados
3. **Sprints e Prazos** - Coerência nos cronogramas
4. **Pagamentos** - Clareza em valores e condições
5. **Multas e Penalidades** - Adequação legal
6. **Rescisão** - Hipóteses bem definidas
7. **Confidencialidade** - Proteção de informações
8. **Foro** - Jurisdição aplicável
9. **Riscos Legais** - Identificar pontos de atenção
10. **Conflitos** - Detectar inconsistências

Para cada item, forneça:
- ✅ OK / ⚠️ ATENÇÃO / ❌ CRÍTICO
- Descrição do achado
- Sugestão de melhoria (quando aplicável)
- Score de risco (0-100)`;

  const userPrompt = `Analise este contrato:

**CONTRATO:**
${contract.content_markdown || 'Conteúdo não gerado ainda'}

**CONTEXTO:**
- Cliente: ${contract.client_contact?.name}
- Valor: ${contract.deal?.value}
- Tags: ${contract.deal?.tags?.join(', ')}

**CLÁUSULAS INCLUÍDAS:**
${clauses.map(c => `- ${c.title} (${c.group?.name})`).join('\n')}

Forneça uma análise detalhada em JSON no formato:
{
  "overall_risk_score": 0-100,
  "findings": [
    {
      "category": "categoria",
      "status": "OK|ATENÇÃO|CRÍTICO", 
      "description": "descrição",
      "suggestion": "sugestão",
      "risk_level": 0-100
    }
  ],
  "summary": "resumo geral"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const reviewContent = aiResponse.choices[0].message.content;

    let reviewData;
    try {
      reviewData = JSON.parse(reviewContent);
    } catch (parseError) {
      console.error('Erro ao parsear resposta da IA:', parseError);
      reviewData = {
        overall_risk_score: 50,
        findings: [{ 
          category: 'Análise', 
          status: 'ATENÇÃO', 
          description: 'Erro ao processar análise da IA',
          suggestion: 'Revisar manualmente',
          risk_level: 50
        }],
        summary: reviewContent
      };
    }

    // Salvar a revisão no contrato
    const { error: updateError } = await supabase
      .from('legal_contracts')
      .update({
        ai_draft_review: reviewData,
        ai_risk_score: reviewData.overall_risk_score,
        updated_at: new Date().toISOString()
      })
      .eq('id', contract.id);

    if (updateError) {
      throw new Error(`Erro ao salvar revisão: ${updateError.message}`);
    }

    console.log('Revisão jurídica concluída');
    return { success: true, review: reviewData };

  } catch (error) {
    console.error('Erro na revisão jurídica:', error);
    throw error;
  }
}

async function generateLawDesign(contract: any, clauses: any[]) {
  console.log('Gerando Law Design (resumo visual)...');

  const systemPrompt = `Você é um designer de comunicação jurídica. Crie um resumo visual do contrato em linguagem simples e acessível.

OBJETIVO: Transformar o contrato jurídico em um resumo de 1-2 páginas que qualquer pessoa entenda.

ESTRUTURA:
1. **Resumo Executivo** (3 linhas)
2. **Partes do Contrato** (quem é quem)
3. **O Que Será Entregue** (escopo em bullet points)
4. **Timeline de Sprints** (cronograma visual)
5. **Valores e Pagamentos** (tabela simples)
6. **Responsabilidades** (o que cada um faz)
7. **O Que NÃO Está Incluído** (exclusões importantes)
8. **Multas e Penalidades** (quando aplicável)
9. **Como Cancelar** (condições de rescisão)

Use:
- Linguagem simples e direta
- Bullet points e listas
- Ícones em texto (📋 🕐 💰 ⚠️)
- Tabelas quando apropriado
- Destaque para informações críticas`;

  const userPrompt = `Crie um resumo visual para este contrato:

**CONTRATO COMPLETO:**
${contract.content_markdown || 'Aguardando geração do rascunho'}

**DADOS DO CLIENTE:**
- ${contract.client_contact?.name} - ${contract.client_contact?.company}

**VALOR:** R$ ${contract.deal?.value || 'A definir'}

**PROJETO:** ${contract.title}

Gere o Law Design em Markdown, focado na clareza e facilidade de entendimento.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const lawDesignContent = aiResponse.choices[0].message.content;

    // Salvar o Law Design no contrato
    const { error: updateError } = await supabase
      .from('legal_contracts')
      .update({
        ai_law_design_summary: lawDesignContent,
        updated_at: new Date().toISOString()
      })
      .eq('id', contract.id);

    if (updateError) {
      throw new Error(`Erro ao salvar Law Design: ${updateError.message}`);
    }

    console.log('Law Design gerado com sucesso');
    return { success: true, law_design: lawDesignContent };

  } catch (error) {
    console.error('Erro ao gerar Law Design:', error);
    throw error;
  }
}