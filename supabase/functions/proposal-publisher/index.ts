import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { proposalId, versionNumber, expiresInDays = 30 } = await req.json();

    // Generate random token
    const token = crypto.randomUUID().replace(/-/g, '');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Update version with publication data
    const { data, error } = await supabaseClient
      .from('proposal_versions')
      .update({
        published_token: token,
        published_url: `${Deno.env.get('SUPABASE_URL')}/propostas/visualizar?token=${token}`,
        published_expires_at: expiresAt.toISOString(),
      })
      .eq('proposal_id', proposalId)
      .eq('version_number', versionNumber)
      .select()
      .single();

    if (error) throw error;

    // Update proposal status to 'sent'
    await supabaseClient
      .from('proposals')
      .update({ status: 'sent' })
      .eq('id', proposalId);

    return new Response(JSON.stringify({ 
      success: true,
      publicUrl: data.published_url,
      token,
      expiresAt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
