import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateToken(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { diagnosticId } = await req.json()

    if (!diagnosticId) {
      throw new Error('diagnosticId is required')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    // Create an admin client to bypass RLS for inserting the token (or reading existing)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Also get auth token from user request to validate ownership
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: { headers: { Authorization: authHeader } }
    })

    // Validate ownership (RLS ensures we only get it if user owns it)
    const { data: diagnostic, error: diagError } = await supabaseUser
      .from('diagnostics')
      .select('id, user_id')
      .eq('id', diagnosticId)
      .single()

    if (diagError || !diagnostic) {
      throw new Error('Unauthorized or diagnostic not found')
    }

    // Check if valid token already exists
    const { data: existingTokens } = await supabaseAdmin
      .from('share_tokens')
      .select('token, expires_at')
      .eq('diagnostic_id', diagnosticId)
      .eq('revoked', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (existingTokens && existingTokens.length > 0) {
      return new Response(
        JSON.stringify({ success: true, token: existingTokens[0].token, expiresAt: existingTokens[0].expires_at }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate new token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days expiration

    const { error: insertError } = await supabaseAdmin
      .from('share_tokens')
      .insert({
        token,
        diagnostic_id: diagnosticId,
        created_by: diagnostic.user_id,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Error inserting token:', insertError)
      throw new Error('Failed to generate token')
    }

    return new Response(
      JSON.stringify({ success: true, token, expiresAt: expiresAt.toISOString() }),
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
