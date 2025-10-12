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

    const { proposalId, versionNumber } = await req.json();

    // Fetch proposal and template
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .select('*, template:proposal_templates(*)')
      .eq('id', proposalId)
      .single();

    if (proposalError) throw proposalError;

    // Fetch version data
    const { data: version, error: versionError } = await supabaseClient
      .from('proposal_versions')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('version_number', versionNumber)
      .single();

    if (versionError) throw versionError;

    // Generate HTML (simplified - full implementation would use template engine)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${proposal.title}</title>
          <style>
            body { font-family: Inter, sans-serif; margin: 24mm; }
            h1 { color: #111827; font-size: 24px; }
            h2 { color: #374151; font-size: 18px; margin-top: 1.5em; }
            p { color: #6B7280; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin: 1em 0; }
            th, td { border: 1px solid #E5E7EB; padding: 8px; text-align: left; }
            th { background: #F9FAFB; font-weight: 600; }
          </style>
        </head>
        <body>
          <h1>${proposal.title}</h1>
          <p><strong>Número:</strong> ${proposal.proposal_number}</p>
          <p><strong>Versão:</strong> ${version.version_number}</p>
          <p><strong>Válida até:</strong> ${new Date(proposal.valid_until).toLocaleDateString('pt-BR')}</p>
          <hr>
          <pre>${JSON.stringify(version.variables, null, 2)}</pre>
        </body>
      </html>
    `;

    // TODO: Generate PDF using Chromium/Puppeteer
    // TODO: Upload to S3
    // For now, return HTML
    
    return new Response(JSON.stringify({ 
      success: true,
      html,
      message: 'PDF generation will be implemented in Phase 2'
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
