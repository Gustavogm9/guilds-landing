import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ApprovalRequest {
  token: string;
  approverEmail: string;
  comments?: string;
  action: 'approve' | 'request_change';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token, approverEmail, comments, action }: ApprovalRequest = await req.json();

    // Validate token and expiration
    const { data: version, error: versionError } = await supabase
      .from('proposal_versions')
      .select('*, proposal:proposals(*)')
      .eq('published_token', token)
      .gt('published_expires_at', new Date().toISOString())
      .single();

    if (versionError || !version) {
      return new Response(JSON.stringify({ 
        error: 'Token inválido ou expirado' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const proposal = version.proposal;

    // Check proposal status
    if (proposal.status !== 'sent') {
      return new Response(JSON.stringify({ 
        error: 'Proposta não pode ser aprovada neste momento' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if proposal expired
    if (new Date(proposal.valid_until) < new Date()) {
      await supabase
        .from('proposals')
        .update({ status: 'expired' })
        .eq('id', proposal.id);
      
      return new Response(JSON.stringify({ 
        error: 'Proposta expirada' 
      }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Capture IP and User-Agent
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    if (action === 'approve') {
      // Register approval
      const { error: approvalError } = await supabase
        .from('proposal_approvals')
        .insert({
          proposal_id: proposal.id,
          version_number: version.version_number,
          approver_type: 'client',
          approver_email: approverEmail,
          comments: comments,
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: {
            approved_at: new Date().toISOString(),
            token_used: token
          }
        });

      if (approvalError) throw approvalError;

      // Update proposal status
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'approved' })
        .eq('id', proposal.id);

      if (updateError) throw updateError;

      // Log webhook event for CRM
      console.log('Webhook OUT: proposal.approved', {
        proposalId: proposal.id,
        dealId: proposal.deal_id,
        amount: version.pricing?.total,
        version: version.version_number
      });

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Proposta aprovada com sucesso!',
        proposal_id: proposal.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'request_change') {
      // Create change request
      const currentVersion = version.version_number;
      const nextVersion = currentVersion + 1;

      const { error: changeError } = await supabase
        .from('proposal_change_requests')
        .insert({
          proposal_id: proposal.id,
          from_version: currentVersion,
          to_version: nextVersion,
          change_type: 'client_request',
          notes: comments || 'Cliente solicitou ajustes',
          requested_by: null
        });

      if (changeError) throw changeError;

      // Change status to negotiation
      await supabase
        .from('proposals')
        .update({ status: 'negotiation' })
        .eq('id', proposal.id);

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Solicitação de ajuste registrada. Entraremos em contato em breve.',
        proposal_id: proposal.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error: any) {
    console.error('Error in proposal-approval-webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
