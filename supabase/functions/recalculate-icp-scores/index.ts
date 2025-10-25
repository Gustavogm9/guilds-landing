import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Iniciando recálculo de ICP scores para todos os contatos...');

    // Buscar todos os contatos ativos
    const { data: contacts, error: fetchError } = await supabase
      .from('crm_contacts')
      .select('id')
      .eq('is_active', true);

    if (fetchError) {
      throw new Error(`Erro ao buscar contatos: ${fetchError.message}`);
    }

    if (!contacts || contacts.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Nenhum contato ativo encontrado',
        total_contacts: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const totalContacts = contacts.length;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Processar em batches de 50
    const BATCH_SIZE = 50;
    const batches = Math.ceil(totalContacts / BATCH_SIZE);

    console.log(`Processando ${totalContacts} contatos em ${batches} batches...`);

    for (let i = 0; i < batches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min((i + 1) * BATCH_SIZE, totalContacts);
      const batch = contacts.slice(start, end);

      console.log(`Processando batch ${i + 1}/${batches} (${batch.length} contatos)...`);

      // Processar batch em paralelo
      const promises = batch.map(async (contact) => {
        try {
          // Invocar lead-enrichment para cada contato
          const { data, error } = await supabase.functions.invoke('lead-enrichment', {
            body: {
              contact_id: contact.id,
              enrichment_sources: ['internal', 'social'],
              fields_to_enrich: []
            }
          });

          if (error) {
            throw error;
          }

          return { success: true, contact_id: contact.id };
        } catch (error) {
          return { 
            success: false, 
            contact_id: contact.id, 
            error: error instanceof Error ? error.message : String(error) 
          };
        }
      });

      const results = await Promise.all(promises);

      // Contar sucessos e erros
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          errors.push(`Contato ${result.contact_id}: ${result.error}`);
        }
      });

      // Delay entre batches para não sobrecarregar
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Recálculo concluído: ${successCount} sucessos, ${errorCount} erros`);

    // Log da operação
    await supabase.from('system_performance_logs').insert({
      operation_type: 'icp_recalculation',
      status: errorCount === 0 ? 'completed' : 'completed_with_errors',
      records_processed: totalContacts,
      success_count: successCount,
      error_count: errorCount,
      metadata: {
        batches_processed: batches,
        errors: errors.slice(0, 10) // Primeiros 10 erros
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Recálculo concluído`,
      summary: {
        total_contacts: totalContacts,
        success_count: successCount,
        error_count: errorCount,
        batches_processed: batches
      },
      errors: errors.length > 0 ? errors.slice(0, 10) : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no recálculo de ICP scores:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao recalcular scores',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
