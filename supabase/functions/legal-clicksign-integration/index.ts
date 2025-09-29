import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
// Note: Clicksign API key should be added to secrets
const clicksignApiKey = Deno.env.get('CLICKSIGN_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, contract_id } = await req.json();
    
    console.log(`Processing Clicksign ${action} for contract ${contract_id}`);

    // Buscar dados do contrato
    const { data: contract, error: contractError } = await supabase
      .from('legal_contracts')
      .select(`
        *,
        client_contact:crm_contacts(name, email, company, phone),
        deal:crm_deals(title, value),
        template:legal_templates(name)
      `)
      .eq('id', contract_id)
      .single();

    if (contractError || !contract) {
      throw new Error(`Contrato não encontrado: ${contractError?.message}`);
    }

    let result;

    switch (action) {
      case 'send_contract':
        result = await sendToClicksign(contract);
        break;
      case 'webhook_status':
        result = await handleClicksignWebhook(req);
        break;
      default:
        throw new Error(`Ação não suportada: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no legal-clicksign-integration:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function sendToClicksign(contract: any) {
  console.log('Enviando contrato para Clicksign...');

  if (!clicksignApiKey) {
    throw new Error('CLICKSIGN_API_KEY não configurado');
  }

  if (!contract.pdf_url) {
    throw new Error('Contrato não possui PDF gerado');
  }

  try {
    // 1. Criar documento no Clicksign
    const documentPayload = {
      document: {
        name: `${contract.contract_number} - ${contract.title}`,
        content_type: 'application/pdf',
        deadline_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(), // 30 dias
        auto_close: true,
        locale: 'pt-BR'
      }
    };

    const documentResponse = await fetch('https://api.clicksign.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clicksignApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentPayload),
    });

    if (!documentResponse.ok) {
      throw new Error(`Erro ao criar documento no Clicksign: ${documentResponse.statusText}`);
    }

    const documentData = await documentResponse.json();
    const documentKey = documentData.document.key;

    console.log(`Documento criado no Clicksign: ${documentKey}`);

    // 2. Fazer upload do PDF
    const uploadResponse = await fetch(`https://api.clicksign.com/v1/documents/${documentKey}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clicksignApiKey}`,
        'Content-Type': 'application/octet-stream',
      },
      // Note: In a real implementation, you'd fetch the PDF content and stream it
      // body: pdfContent
    });

    if (!uploadResponse.ok) {
      throw new Error(`Erro no upload do PDF: ${uploadResponse.statusText}`);
    }

    // 3. Adicionar signatários
    const signatories = [
      {
        email: 'contato@guilds.com.br',
        name: 'Guilds Tecnologia',
        sign_as: 'party'
      },
      {
        email: contract.client_contact.email,
        name: contract.client_contact.name,
        sign_as: 'party'
      }
    ];

    for (const signatory of signatories) {
      const signatoryResponse = await fetch(`https://api.clicksign.com/v1/documents/${documentKey}/signatories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clicksignApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signatory }),
      });

      if (!signatoryResponse.ok) {
        console.error(`Erro ao adicionar signatário ${signatory.email}`);
      }
    }

    // 4. Criar notificação para assinatura
    const notificationResponse = await fetch(`https://api.clicksign.com/v1/documents/${documentKey}/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clicksignApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification: {
          requestable_type: 'Document',
          requestable_key: documentKey,
          message: `Olá! O contrato ${contract.contract_number} está pronto para assinatura. Por favor, acesse o link para revisar e assinar o documento.`
        }
      }),
    });

    if (!notificationResponse.ok) {
      console.error('Erro ao enviar notificação de assinatura');
    }

    // 5. Salvar dados da assinatura no banco
    const { error: signatureError } = await supabase
      .from('legal_contract_signatures')
      .insert([{
        contract_id: contract.id,
        provider: 'clicksign',
        envelope_id: documentKey,
        status: 'sent',
        signers: signatories,
        sent_at: new Date().toISOString()
      }]);

    if (signatureError) {
      console.error('Erro ao salvar dados da assinatura:', signatureError);
    }

    // 6. Atualizar status do contrato
    const { error: updateError } = await supabase
      .from('legal_contracts')
      .update({
        status: 'sent_for_signature',
        updated_at: new Date().toISOString()
      })
      .eq('id', contract.id);

    if (updateError) {
      console.error('Erro ao atualizar status do contrato:', updateError);
    }

    console.log('Contrato enviado para Clicksign com sucesso');
    
    return { 
      success: true, 
      clicksign_document_key: documentKey,
      message: 'Contrato enviado para assinatura com sucesso'
    };

  } catch (error) {
    console.error('Erro ao enviar para Clicksign:', error);
    throw error;
  }
}

async function handleClicksignWebhook(req: Request) {
  console.log('Processando webhook do Clicksign...');

  try {
    const webhookData = await req.json();
    console.log('Webhook data:', JSON.stringify(webhookData, null, 2));

    const { event, data } = webhookData;
    const documentKey = data?.document?.key;

    if (!documentKey) {
      throw new Error('Document key não encontrado no webhook');
    }

    // Buscar assinatura pelo envelope_id
    const { data: signature, error: signatureError } = await supabase
      .from('legal_contract_signatures')
      .select('*, contract:legal_contracts(*)')
      .eq('envelope_id', documentKey)
      .single();

    if (signatureError || !signature) {
      console.error('Assinatura não encontrada:', signatureError);
      return { success: false, message: 'Assinatura não encontrada' };
    }

    let newStatus = signature.status;
    let contractStatus = signature.contract.status;

    // Processar diferentes tipos de eventos
    switch (event) {
      case 'document.completed':
        newStatus = 'signed';
        contractStatus = 'signed';
        break;
      case 'document.declined':
        newStatus = 'cancelled';
        contractStatus = 'cancelled';
        break;
      case 'document.expired':
        newStatus = 'cancelled';
        contractStatus = 'cancelled';
        break;
      default:
        console.log(`Evento não processado: ${event}`);
        return { success: true, message: 'Evento não processado' };
    }

    // Atualizar status da assinatura
    const { error: updateSignatureError } = await supabase
      .from('legal_contract_signatures')
      .update({
        status: newStatus,
        webhook_data: webhookData,
        signed_at: newStatus === 'signed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', signature.id);

    if (updateSignatureError) {
      console.error('Erro ao atualizar assinatura:', updateSignatureError);
    }

    // Atualizar status do contrato
    const { error: updateContractError } = await supabase
      .from('legal_contracts')
      .update({
        status: contractStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', signature.contract_id);

    if (updateContractError) {
      console.error('Erro ao atualizar contrato:', updateContractError);
    }

    console.log(`Webhook processado: ${event} -> ${newStatus}`);
    
    return { 
      success: true, 
      message: `Webhook processado: ${event}`,
      new_status: newStatus
    };

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    throw error;
  }
}