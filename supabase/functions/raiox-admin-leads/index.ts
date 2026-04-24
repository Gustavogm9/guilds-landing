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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseUserClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // MVP Admin Check: hardcode allowed emails or domains
    const allowedEmails = ['guilherme@medtrack.com.br', 'admin@guilds.com.br', 'tiago@guilds.com.br']
    const isGuildsDomain = user.email?.endsWith('@guilds.com.br') || user.email?.endsWith('@medtrack.com.br')

    if (!isGuildsDomain && !allowedEmails.includes(user.email ?? '')) {
      throw new Error('Forbidden: Admin access only')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch all diagnostics that are completed
    const { data: diagnostics, error: diagError } = await supabaseAdmin
      .from('diagnostics')
      .select(`
        id, 
        created_at, 
        status,
        user_id
      `)
      .order('created_at', { ascending: false })

    if (diagError) {
      throw diagError
    }

    return new Response(
      JSON.stringify({ success: true, leads: diagnostics }),
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
