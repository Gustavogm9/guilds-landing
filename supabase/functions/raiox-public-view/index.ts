import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      throw new Error('Token is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // Create an admin client to bypass RLS for reading the token
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Check if token is valid
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('share_tokens')
      .select('diagnostic_id, expires_at, revoked')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      throw new Error('Invalid or expired token')
    }

    if (tokenData.revoked) {
      throw new Error('Token has been revoked')
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      throw new Error('Token has expired')
    }

    const diagnosticId = tokenData.diagnostic_id

    // Fetch scores
    const { data: scores, error: scoresError } = await supabaseAdmin
      .from('diagnostic_scores')
      .select('*')
      .eq('diagnostic_id', diagnosticId)
      .single()

    if (scoresError) {
      console.error('Error fetching scores:', scoresError)
      throw new Error('Could not load diagnostic scores')
    }

    // Fetch narratives
    const { data: narratives, error: narrativesError } = await supabaseAdmin
      .from('diagnostic_narratives')
      .select('section_id, content')
      .eq('diagnostic_id', diagnosticId)

    if (narrativesError) {
      console.error('Error fetching narratives:', narrativesError)
      throw new Error('Could not load diagnostic narratives')
    }

    // Map narratives
    const narrativesMap: Record<string, any> = {}
    narratives?.forEach(n => {
      narrativesMap[n.section_id] = n.content
    })

    const MOCK_FALLBACK = {
      bottlenecks: [
        { title: "Desconexão de Dados", detail: "Falta de integração entre CRM e ERP atrasa decisões.", severity: "ALTO" }
      ],
      efficiency: {
        current: 40,
        potential: 85,
        savedHours: 120
      }
    }

    const dashboardData = {
      companyName: narrativesMap.empresa?.name || 'Empresa Analisada',
      financialLoss: scores?.annual_loss_estimate || 0,
      fitScore: {
        total: scores?.fit_score || 0,
        factors: []
      },
      maturity: {
        score: scores?.overall_score || 0,
        level: narrativesMap.maturidade?.headline || 'Nível de Maturidade',
        description: narrativesMap.empresa?.synopsis || 'Análise do estágio atual.',
        dimensions: {
          processos: scores?.processos_score || 0,
          tecnologia: scores?.sistemas_score || 0,
          dados: scores?.dados_score || 0,
          pessoas: scores?.pessoas_score || 0
        }
      },
      market: {
        icpFit: 0,
        positioning: narrativesMap.mercado?.positioning || '',
        competitorIndex: narrativesMap.comunicacao?.score || 0
      },
      phase: {
        id: 'phase_1',
        name: 'Estruturação',
        description: 'Foco em estabilizar processos.',
        color: '#3B82F6',
        metrics: narrativesMap.kpis || []
      },
      roadmap: narrativesMap.plano?.actions || [],
      bottlenecks: narrativesMap.maturidade?.gaps || MOCK_FALLBACK.bottlenecks,
      efficiency: MOCK_FALLBACK.efficiency
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        diagnosticId: tokenData.diagnostic_id,
        dashboardData
      }),
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
