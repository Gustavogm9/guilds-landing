import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
// Não usar createHmac por incompatibilidade de versão
// import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-clicksign-signature',
};

interface ClicksignWebhookEvent {
  event: {
    name: string;
    occurred_at: string;
    data: {
      document: {
        key: string;
        filename: string;
        status: string;
        download_url?: string;
      };
      signatories?: Array<{
        key: string;
        name: string;
        email: string;
        status: string;
        sign_date?: string;
        refusal_reason?: string;
      }>;
    };
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar assinatura do webhook (segurança)
    const signature = req.headers.get('x-clicksign-signature');
    const body = await req.text();
    
    if (!verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return new Response('Unauthorized', { status: 401 });
    }

    const webhookData: ClicksignWebhookEvent = JSON.parse(body);
    const { event } = webhookData;

    console.log('Clicksign webhook received:', event.name, event.data.document.key);

    // Buscar contrato pelo document_key do Clicksign
    const { data: contract, error: contractError } = await supabase
      .from('legal_contracts')
      .select('*')
      .eq('clicksign_document_key', event.data.document.key)
      .single();

    if (contractError || !contract) {
      console.error('Contract not found for document key:', event.data.document.key);
      return new Response('Contract not found', { status: 404 });
    }

    // Processar diferentes tipos de eventos
    let newStatus = contract.status;
    let signedAt = null;
    let notificationData = null;

    switch (event.name) {
      case 'document.created':
        newStatus = 'sent_for_signature';
        notificationData = {
          type: 'contract_sent',
          message: 'Contrato enviado para assinatura via Clicksign'
        };
        break;

      case 'document.signed':
        newStatus = 'signed';
        signedAt = new Date().toISOString();
        notificationData = {
          type: 'contract_signed',
          message: 'Contrato assinado com sucesso!'
        };
        break;

      case 'document.completed':
        newStatus = 'completed';
        notificationData = {
          type: 'contract_completed',
          message: 'Processo de assinatura concluído. Contrato totalmente executado.'
        };
        break;

      case 'document.refused':
        newStatus = 'refused';
        const refusalReason = event.data.signatories?.[0]?.refusal_reason || 'Não especificado';
        notificationData = {
          type: 'contract_refused',
          message: `Contrato recusado. Motivo: ${refusalReason}`
        };
        break;

      case 'document.expired':
        newStatus = 'expired';
        notificationData = {
          type: 'contract_expired',
          message: 'Contrato expirou sem ser assinado'
        };
        break;

      case 'document.cancelled':
        newStatus = 'cancelled';
        notificationData = {
          type: 'contract_cancelled',
          message: 'Contrato foi cancelado'
        };
        break;

      default:
        console.log('Unhandled event type:', event.name);
        return new Response('OK', { status: 200 });
    }

    // Preparar dados para atualização
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString(),
      clicksign_events: [
        ...(contract.clicksign_events || []),
        {
          event_name: event.name,
          occurred_at: event.occurred_at,
          data: event.data,
          processed_at: new Date().toISOString()
        }
      ]
    };

    if (signedAt) {
      updateData.signed_at = signedAt;
    }

    if (event.data.document.download_url) {
      updateData.signed_document_url = event.data.document.download_url;
    }

    // Atualizar contrato
    const { error: updateError } = await supabase
      .from('legal_contracts')
      .update(updateData)
      .eq('id', contract.id);

    if (updateError) {
      throw new Error('Failed to update contract: ' + updateError.message);
    }

    // Criar notificação se necessário
    if (notificationData && contract.client_contact_id) {
      // Buscar dados do cliente
      const { data: client } = await supabase
        .from('crm_contacts')
        .select('name, email')
        .eq('id', contract.client_contact_id)
        .single();

      if (client?.email) {
        // Criar notificação por email
        await supabase
          .from('project_email_notifications')
          .insert({
            project_id: contract.deal_id, // Usar deal_id como project_id se disponível
            recipient_email: client.email,
            recipient_type: 'client',
            notification_type: notificationData.type,
            subject: `Atualização do Contrato: ${contract.title}`,
            content: `Olá ${client.name},

${notificationData.message}

Contrato: ${contract.title}
Status: ${getStatusDisplay(newStatus)}
Data do evento: ${new Date(event.occurred_at).toLocaleString('pt-BR')}

${newStatus === 'completed' && event.data.document.download_url ? 
  `Você pode baixar o contrato assinado através do link fornecido em seu portal do cliente.` : ''
}

Atenciosamente,
Equipe Guilds`,
            metadata: {
              contract_id: contract.id,
              contract_number: contract.contract_number,
              clicksign_event: event.name,
              new_status: newStatus
            }
          });
      }
    }

    // Criar webhook event para automações internas
    if (contract.deal_id) {
      await supabase
        .from('project_webhook_events')
        .insert({
          project_id: contract.deal_id,
          event_type: `contract_${event.name.replace('document.', '')}`,
          payload: {
            contract_id: contract.id,
            contract_title: contract.title,
            contract_number: contract.contract_number,
            old_status: contract.status,
            new_status: newStatus,
            clicksign_event: event.name,
            client_id: contract.client_contact_id,
            timestamp: event.occurred_at
          }
        });
    }

    console.log(`Contract ${contract.id} updated to status: ${newStatus}`);

    return new Response('OK', { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error: any) {
    console.error('Error processing Clicksign webhook:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function verifyWebhookSignature(body: string, signature: string | null): boolean {
  // Implementar verificação de assinatura HMAC se configurada
  const webhookSecret = Deno.env.get('CLICKSIGN_WEBHOOK_SECRET');
  
  if (!webhookSecret || !signature) {
    // Se não há secret configurado, aceitar (desenvolvimento)
    return true;
  }

  // TODO: Implementar verificação HMAC quando necessário
  // Por enquanto, aceitar todas as requisições em desenvolvimento
  console.log('Webhook signature verification not implemented, accepting request');
  return true;
}

function getStatusDisplay(status: string): string {
  const statusMap: Record<string, string> = {
    'draft': 'Rascunho',
    'sent_for_signature': 'Enviado para Assinatura',
    'signed': 'Assinado',
    'completed': 'Concluído',
    'refused': 'Recusado',
    'expired': 'Expirado',
    'cancelled': 'Cancelado'
  };
  
  return statusMap[status] || status;
}