import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import { calcDimensionScores, calcFinancialLoss, calcFitScore } from "./scoring.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { diagnosticId, language = 'pt' } = await req.json()

    if (!diagnosticId) {
      throw new Error('diagnosticId is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 1. Fetch diagnostic and answers
    const { data: diagnostic, error: diagError } = await supabase
      .from('diagnostics')
      .select('*, diagnostic_answers(*)')
      .eq('id', diagnosticId)
      .single()

    if (diagError || !diagnostic) {
      throw new Error(`Diagnostic not found: ${diagError?.message}`)
    }

    const answersArray = diagnostic.diagnostic_answers || []
    
    // Convert answers array to key-value object
    const answersObj: Record<string, any> = {}
    answersArray.forEach((ans: any) => {
      // Parse JSON arrays if present
      try {
        if (ans.answer_text.startsWith('[') && ans.answer_text.endsWith(']')) {
          answersObj[ans.question_id] = JSON.parse(ans.answer_text)
        } else {
          answersObj[ans.question_id] = ans.answer_text
        }
      } catch(e) {
        answersObj[ans.question_id] = ans.answer_text
      }
    })

    // 2. Perform Real Scoring Calculation
    const scores = calcDimensionScores(answersObj as any)
    const financial = calcFinancialLoss(answersObj as any)
    const fit = calcFitScore(answersObj as any, scores)

    const dbScores = {
      overall_score: scores.overall,
      processos_score: scores.subScores.processos,
      sistemas_score: scores.subScores.sistemas,
      dados_score: scores.subScores.dados,
      pessoas_score: scores.subScores.pessoas,
      fit_score: fit.total,
      annual_loss_estimate: financial.total
    }

    const { error: scoreError } = await supabase
      .from('diagnostic_scores')
      .upsert({
        diagnostic_id: diagnosticId,
        ...dbScores
      })

    if (scoreError) {
      console.error('Error inserting scores:', scoreError)
      throw new Error('Failed to save scores')
    }

    // 3. Generate Narratives via Anthropic Claude
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    let narratives: any = null

    if (anthropicApiKey) {
      console.log('Calling Claude API...')
      narratives = await generateNarrativesWithClaude(anthropicApiKey, answersObj, dbScores, language)
    } else {
      console.log('No Anthropic API key found. Using mock narratives.')
      narratives = getMockNarratives(answersObj, dbScores, language)
    }

    // 4. Insert narratives
    for (const [section, content] of Object.entries(narratives)) {
      const { error: narrativeError } = await supabase
        .from('diagnostic_narratives')
        .upsert({
          diagnostic_id: diagnosticId,
          section_id: section,
          content: content
        }, { onConflict: 'diagnostic_id, section_id' })

      if (narrativeError) {
        console.error(`Error inserting narrative for ${section}:`, narrativeError)
      }
    }

    // 5. Update diagnostic status to completed
    await supabase
      .from('diagnostics')
      .update({ status: 'completed' })
      .eq('id', diagnosticId)

    return new Response(
      JSON.stringify({ success: true, message: 'Report generated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function generateNarrativesWithClaude(apiKey: string, answers: any, scores: any, language: string) {
  const isEnglish = language === 'en';
  
  const promptPT = `Você é um Consultor de Crescimento da Guilds (G-FORGE).
Analise os dados deste diagnóstico e gere um relatório B2B em formato estrito JSON.
As respostas do cliente foram:
${JSON.stringify(answers, null, 2)}

Os scores calculados foram:
${JSON.stringify(scores, null, 2)}

O JSON DEVE ter exatamente a seguinte estrutura (responda APENAS com o JSON, sem markdown):
{
  "maturidade": {
    "headline": "Título curto sobre o estágio",
    "gaps": [ { "title": "Nome do Gap", "detail": "Explicação técnica rápida", "severity": "ALTO|MÉDIO|BAIXO" } ]
  },
  "mercado": {
    "headline": "Título da oportunidade",
    "positioning": "Análise do posicionamento no mercado",
    "sectorChip": "NOME DO SETOR EM MAIÚSCULAS",
    "opportunities": ["op1", "op2"],
    "threats": ["am1", "am2"],
    "competitors": [ { "name": "Tipo de concorrente", "type": "Direto/Indireto", "detail": "Análise" } ],
    "sources": ["Fonte da análise"]
  },
  "comunicacao": {
    "headline": "Auditoria de Marca",
    "body": "Análise do site e comunicação",
    "score": ${scores.comunicacao_score || 3.0},
    "sectorAvg": 3.2,
    "channels": [ { "label": "Canal", "score": 3.0, "severity": "MÉDIO", "detail": "Detalhe" } ],
    "siteAudit": {
      "url": "${answers.q_site_url || 'URL não informada'}",
      "annotations": [ { "id": "1", "title": "Área do site", "detail": "O que precisa melhorar" } ]
    }
  },
  "empresa": {
    "name": "${answers.q_nome_empresa || 'Empresa Analisada'}",
    "subtitle": "Diagnóstico G-FORGE",
    "synopsis": "Breve sinopse executiva da empresa baseada nas respostas.",
    "stats": [ { "label": "Tamanho", "value": "${answers.q_funcionarios || 'N/I'}" } ]
  },
  "plano": {
    "smartGoals": [ { "isPrimary": true, "title": "Objetivo", "smart": { "specific": "S", "measurable": "M", "achievable": "A", "relevant": "R", "temporal": "T" } } ],
    "actions": [ { "id": 1, "title": "Ação 1", "priority": "Alta|Média", "isGuilds": true, "why": "Motivo", "timeline": "Mês 1", "yourTime": "Baixo|Médio", "checklist": ["Passo 1", "Passo 2"] } ]
  },
  "kpis": [
    { "label": "Métrica", "priority": "Alta", "current": "Atual", "target": "Meta", "barPercent": 30 }
  ]
}`

  const promptEN = `You are a Growth Consultant at Guilds (G-FORGE).
Analyze the data from this B2B diagnostic and generate a strict JSON report.
The client's answers were:
${JSON.stringify(answers, null, 2)}

The calculated scores were:
${JSON.stringify(scores, null, 2)}

The JSON MUST have exactly the following structure (respond ONLY with the JSON, without markdown):
{
  "maturidade": {
    "headline": "Short title about the stage",
    "gaps": [ { "title": "Gap Name", "detail": "Quick technical explanation", "severity": "HIGH|MEDIUM|LOW" } ]
  },
  "mercado": {
    "headline": "Opportunity title",
    "positioning": "Market positioning analysis",
    "sectorChip": "SECTOR NAME IN UPPERCASE",
    "opportunities": ["op1", "op2"],
    "threats": ["th1", "th2"],
    "competitors": [ { "name": "Competitor type", "type": "Direct/Indirect", "detail": "Analysis" } ],
    "sources": ["Analysis source"]
  },
  "comunicacao": {
    "headline": "Brand Audit",
    "body": "Site and communication analysis",
    "score": ${scores.comunicacao_score || 3.0},
    "sectorAvg": 3.2,
    "channels": [ { "label": "Channel", "score": 3.0, "severity": "MEDIUM", "detail": "Detail" } ],
    "siteAudit": {
      "url": "${answers.q_site_url || 'URL not provided'}",
      "annotations": [ { "id": "1", "title": "Site area", "detail": "What needs improvement" } ]
    }
  },
  "empresa": {
    "name": "${answers.q_nome_empresa || 'Analyzed Company'}",
    "subtitle": "G-FORGE Diagnostic",
    "synopsis": "Brief executive synopsis of the company based on the answers.",
    "stats": [ { "label": "Size", "value": "${answers.q_funcionarios || 'N/A'}" } ]
  },
  "plano": {
    "smartGoals": [ { "isPrimary": true, "title": "Goal", "smart": { "specific": "S", "measurable": "M", "achievable": "A", "relevant": "R", "temporal": "T" } } ],
    "actions": [ { "id": 1, "title": "Action 1", "priority": "High|Medium", "isGuilds": true, "why": "Reason", "timeline": "Month 1", "yourTime": "Low|Medium", "checklist": ["Step 1", "Step 2"] } ]
  },
  "kpis": [
    { "label": "Metric", "priority": "High", "current": "Current", "target": "Target", "barPercent": 30 }
  ]
}`

  const prompt = isEnglish ? promptEN : promptPT;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API Error:', err)
      throw new Error('Claude API failed')
    }

    const data = await response.json()
    const content = data.content[0].text
    // Try parsing JSON safely
    try {
      const jsonStart = content.indexOf('{')
      const jsonEnd = content.lastIndexOf('}')
      if (jsonStart !== -1 && jsonEnd !== -1) {
        return JSON.parse(content.slice(jsonStart, jsonEnd + 1))
      }
      return JSON.parse(content)
    } catch(e) {
      console.error('Failed to parse Claude JSON:', content)
      return getMockNarratives(answers, scores, language)
    }
  } catch (err) {
    console.error(err)
    return getMockNarratives(answers, scores, language)
  }
}

function getMockNarratives(answers: any, scores: any, language: string) {
  if (language === 'en') {
    return {
      maturidade: {
        headline: "Your operation's maturity level needs to evolve to keep up with the market.",
        gaps: [
          { title: "Manual Processes Identified", detail: "Excessive use of spreadsheets and lack of integration affects performance.", severity: "HIGH" }
        ]
      },
      mercado: {
        headline: "Competitive Opportunity",
        positioning: "You are operating in a market with high automation potential.",
        sectorChip: (answers.q_setor || "B2B SERVICES").toUpperCase(),
        opportunities: ["Sales flow automation", "CRM and marketing tools integration"],
        threats: ["Digitally mature competitors", "Rising acquisition costs"],
        competitors: [
          { name: "Industry Peers", type: "Indirect", detail: "Companies with similar digital adoption pains." }
        ],
        sources: ["G-FORGE Intelligence"]
      },
      comunicacao: {
        headline: "Brand Audit",
        body: "Value perception might be diluted due to channel fragmentation.",
        score: scores.comunicacao_score || 3.0,
        sectorAvg: 3.2,
        channels: [
          { label: "Website", score: 2.0, severity: "HIGH", detail: "Needs review on Value Proposition and CTAs." }
        ],
        siteAudit: {
          url: answers.q_site_url || "No URL",
          annotations: [{ id: "1", title: "First Impression", detail: "Clarity on main benefit (Above the fold)." }]
        }
      },
      empresa: {
        name: answers.q_nome_empresa || "Analyzed Company",
        subtitle: "Generated G-FORGE Diagnostic",
        synopsis: "This diagnostic details the systemic and procedural bottlenecks detected in the analysis, focusing on leverage.",
        stats: [{ label: "Size", value: answers.q_funcionarios || "N/A" }]
      },
      plano: {
        smartGoals: [
          { 
            isPrimary: true, 
            title: "Stack Modernization", 
            smart: { specific: "Integrate current tools", measurable: "100% data flowing", achievable: "Yes", relevant: "High", temporal: "Month 1 to 3" } 
          }
        ],
        actions: [
          { id: 1, title: "Process Audit", priority: "High", isGuilds: true, why: "Foundation for scale", timeline: "Week 1", yourTime: "Low", checklist: ["Mapping", "Refinement"] }
        ]
      },
      kpis: [
        { label: "Productivity", priority: "High", current: "Low", target: "High Performance", barPercent: 40 }
      ]
    }
  }

  return {
    maturidade: {
      headline: "O nível de maturidade da sua operação precisa evoluir para acompanhar o mercado.",
      gaps: [
        { title: "Processos Manuais Identificados", detail: "O uso excessivo de planilhas e a falta de integração afetam o desempenho.", severity: "ALTO" }
      ]
    },
    mercado: {
      headline: "Oportunidade Competitiva",
      positioning: "Vocês estão operando em um mercado com potencial de automação.",
      sectorChip: (answers.q_setor || "B2B SERVICES").toUpperCase(),
      opportunities: ["Automação do fluxo de vendas", "Integração do CRM com ferramentas de marketing"],
      threats: ["Concorrentes digitalmente maduros", "Custo de aquisição crescente"],
      competitors: [
        { name: "Pares do Setor", type: "Indireto", detail: "Empresas com dores semelhantes de adoção digital." }
      ],
      sources: ["Inteligência G-FORGE"]
    },
    comunicacao: {
      headline: "Auditoria de Marca",
      body: "A percepção de valor pode estar diluída devido à fragmentação de canais.",
      score: scores.comunicacao_score || 3.0,
      sectorAvg: 3.2,
      channels: [
        { label: "Site", score: 2.0, severity: "ALTO", detail: "Necessita de revisão na Proposta de Valor e CTAs." }
      ],
      siteAudit: {
        url: answers.q_site_url || "Nenhuma URL",
        annotations: [{ id: "1", title: "Primeira Impressão", detail: "Clareza no benefício principal (Above the fold)." }]
      }
    },
    empresa: {
      name: answers.q_nome_empresa || "Empresa Analisada",
      subtitle: "Diagnóstico Gerado G-FORGE",
      synopsis: "Este diagnóstico detalha os gargalos sistêmicos e processuais detectados na análise, focando em alavancagem.",
      stats: [{ label: "Tamanho", value: answers.q_funcionarios || "N/I" }]
    },
    plano: {
      smartGoals: [
        { 
          isPrimary: true, 
          title: "Modernização do Stack", 
          smart: { specific: "Integrar ferramentas atuais", measurable: "100% de dados fluindo", achievable: "Sim", relevant: "Alta", temporal: "Mês 1 a 3" } 
        }
      ],
      actions: [
        { id: 1, title: "Auditoria de Processos", priority: "Alta", isGuilds: true, why: "Fundação para escala", timeline: "Semana 1", yourTime: "Baixo", checklist: ["Mapeamento", "Refinamento"] }
      ]
    },
    kpis: [
      { label: "Produtividade", priority: "Alta", current: "Baixa", target: "Alta Performance", barPercent: 40 }
    ]
  }
}
