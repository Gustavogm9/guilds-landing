import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  type: 'proposal_published' | 'proposal_approved' | 'proposal_change_requested';
  proposalId: string;
  recipientEmail: string;
  recipientName?: string;
  metadata?: Record<string, any>;
}

const templates = {
  proposal_published: (data: any) => ({
    subject: `Nova Proposta Comercial - ${data.proposalNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: hsl(240, 85%, 55%); font-size: 28px; margin-bottom: 8px;">Guilds</h1>
          <p style="color: hsl(220, 9%, 46%); font-size: 16px;">Sistemas inteligentes, resultados reais</p>
        </div>

        <div style="background: hsl(220, 14%, 96%); border-left: 4px solid hsl(240, 85%, 55%); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: hsl(220, 9%, 26%); margin-top: 0;">Olá ${data.clientName || 'Cliente'},</h2>
          <p style="color: hsl(220, 9%, 26%); line-height: 1.6;">
            Sua proposta comercial está pronta para visualização!
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>Número da Proposta:</strong> ${data.proposalNumber}</p>
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>Validade:</strong> ${data.validUntil}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.publicUrl}" 
               style="background: hsl(240, 85%, 55%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Visualizar Proposta
            </a>
          </div>
        </div>

        <div style="background: hsl(220, 14%, 96%); padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <p style="color: hsl(220, 9%, 26%); margin: 0; font-size: 14px;">
            <strong>Importante:</strong> Esta proposta é válida até ${data.validUntil}. Após essa data, será necessário gerar uma nova versão.
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid hsl(220, 13%, 91%); text-align: center;">
          <p style="color: hsl(220, 9%, 46%); font-size: 14px; margin: 8px 0;">Guilds - Tecnologia & Inovação</p>
          <p style="color: hsl(220, 9%, 46%); font-size: 14px; margin: 8px 0;">
            <a href="mailto:contato@guilds.com.br" style="color: hsl(240, 85%, 55%); text-decoration: none;">contato@guilds.com.br</a>
          </p>
        </div>
      </div>
    `,
  }),

  proposal_approved: (data: any) => ({
    subject: `Proposta Aprovada - ${data.proposalNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: hsl(240, 85%, 55%); font-size: 28px; margin-bottom: 8px;">Guilds</h1>
          <p style="color: hsl(220, 9%, 46%); font-size: 16px;">Sistemas inteligentes, resultados reais</p>
        </div>

        <div style="background: hsl(142, 76%, 36%, 0.1); border-left: 4px solid hsl(142, 76%, 36%); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: hsl(142, 76%, 36%); margin-top: 0;">🎉 Proposta Aprovada!</h2>
          <p style="color: hsl(220, 9%, 26%); line-height: 1.6;">
            Parabéns! A proposta <strong>${data.proposalNumber}</strong> foi aprovada pelo cliente.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>Cliente:</strong> ${data.clientName}</p>
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>E-mail:</strong> ${data.approverEmail}</p>
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>Data de Aprovação:</strong> ${data.approvedAt}</p>
          ${data.comments ? `
            <div style="background: hsl(220, 14%, 96%); padding: 16px; border-radius: 6px; margin-top: 20px;">
              <p style="color: hsl(220, 9%, 46%); margin: 0 0 8px 0; font-size: 14px;"><strong>Comentários do cliente:</strong></p>
              <p style="color: hsl(220, 9%, 26%); margin: 0;">${data.comments}</p>
            </div>
          ` : ''}
        </div>

        <div style="background: hsl(165, 85%, 45%, 0.1); border-left: 4px solid hsl(165, 85%, 45%); padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <p style="color: hsl(220, 9%, 26%); margin: 0; font-size: 14px;">
            <strong>Próximos passos:</strong> O contrato será gerado automaticamente. Em breve você receberá as instruções para assinatura.
          </p>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid hsl(220, 13%, 91%); text-align: center;">
          <p style="color: hsl(220, 9%, 46%); font-size: 14px; margin: 8px 0;">Guilds - Tecnologia & Inovação</p>
        </div>
      </div>
    `,
  }),

  proposal_change_requested: (data: any) => ({
    subject: `Solicitação de Ajuste - ${data.proposalNumber}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: hsl(240, 85%, 55%); font-size: 28px; margin-bottom: 8px;">Guilds</h1>
          <p style="color: hsl(220, 9%, 46%); font-size: 16px;">Sistemas inteligentes, resultados reais</p>
        </div>

        <div style="background: hsl(38, 92%, 50%, 0.1); border-left: 4px solid hsl(38, 92%, 50%); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: hsl(38, 92%, 50%); margin-top: 0;">📝 Solicitação de Ajuste</h2>
          <p style="color: hsl(220, 9%, 26%); line-height: 1.6;">
            O cliente solicitou ajustes na proposta <strong>${data.proposalNumber}</strong>.
          </p>
        </div>

        <div style="margin-bottom: 30px;">
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>Cliente:</strong> ${data.clientName}</p>
          <p style="color: hsl(220, 9%, 26%); margin-bottom: 16px;"><strong>E-mail:</strong> ${data.requesterEmail}</p>
          
          <div style="background: hsl(220, 14%, 96%); padding: 16px; border-radius: 6px; margin-top: 20px;">
            <p style="color: hsl(220, 9%, 46%); margin: 0 0 8px 0; font-size: 14px;"><strong>Comentários do cliente:</strong></p>
            <p style="color: hsl(220, 9%, 26%); margin: 0;">${data.comments}</p>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.adminUrl}" 
             style="background: hsl(240, 85%, 55%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
            Criar Nova Versão
          </a>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid hsl(220, 13%, 91%); text-align: center;">
          <p style="color: hsl(220, 9%, 46%); font-size: 14px; margin: 8px 0;">Guilds - Tecnologia & Inovação</p>
        </div>
      </div>
    `,
  }),
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

    const { type, proposalId, recipientEmail, recipientName, metadata } = await req.json() as EmailRequest;

    // Get proposal data
    const { data: proposal, error: proposalError } = await supabaseClient
      .from('proposals')
      .select('*, proposal_versions(*)')
      .eq('id', proposalId)
      .single();

    if (proposalError) throw proposalError;

    // Prepare template data
    const templateData = {
      proposalNumber: proposal.proposal_number,
      clientName: recipientName || 'Cliente',
      ...metadata,
    };

    const template = templates[type](templateData);

    // Insert email notification
    const { error: emailError } = await supabaseClient
      .from('project_email_notifications')
      .insert({
        project_id: proposal.deal_id, // Use deal_id as project reference
        recipient_email: recipientEmail,
        recipient_type: type.includes('admin') ? 'admin' : 'client',
        notification_type: type,
        subject: template.subject,
        content: template.html,
        metadata: {
          proposal_id: proposalId,
          proposal_number: proposal.proposal_number,
          type,
        },
      });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ success: true, message: 'Email queued for sending' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
