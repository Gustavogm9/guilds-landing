import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Usando client direto para evitar dependências circulares
const supabaseUrl = 'https://itvruukwhgttnjpvghzq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnJ1dWt3aGd0dG5qcHZnaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ4MjgsImV4cCI6MjA3MTcwMDgyOH0.NWcAv2VONoAOKiXGHBMZAB42_SCPaI8nTxFTXw6GTBM';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);

export function useCRMContractIntegration() {
  const { toast } = useToast();

  // Verificar se já existe contrato para o deal
  const checkExistingContract = async (dealId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('legal_contracts')
      .select('id')
      .eq('deal_id', dealId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing contract:', error);
      return null;
    }

    return data?.id || null;
  };

  // Gerar contrato a partir do deal
  const generateContractMutation = useMutation({
    mutationFn: async ({ dealId, templateId }: { dealId: string; templateId?: string }) => {
      // Verificar se já existe contrato
      const existingContractId = await checkExistingContract(dealId);
      if (existingContractId) {
        return existingContractId;
      }

      // Buscar dados do deal
      const { data: dealData, error: dealError } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('id', dealId)
        .single();

      if (dealError || !dealData) {
        throw new Error('Deal não encontrado');
      }

      // Buscar contato se existe
      let contactData = null;
      if (dealData.contact_id) {
        const { data: contact } = await supabase
          .from('crm_contacts')
          .select('*')
          .eq('id', dealData.contact_id)
          .maybeSingle();
        contactData = contact;
      }

      // Buscar pipeline se existe
      let pipelineData = null;
      if (dealData.pipeline_id) {
        const { data: pipeline } = await supabase
          .from('crm_pipelines')
          .select('*')
          .eq('id', dealData.pipeline_id)
          .maybeSingle();
        pipelineData = pipeline;
      }

      // Buscar template padrão se não especificado
      let selectedTemplateId = templateId;
      
      if (!selectedTemplateId) {
        const { data: templates } = await supabase
          .from('legal_templates')
          .select('*')
          .eq('is_active', true)
          .eq('is_default', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (templates && templates.length > 0) {
          selectedTemplateId = templates[0].id;
        }
      }

      if (!selectedTemplateId) {
        throw new Error('Nenhum template encontrado. Configure um template padrão primeiro.');
      }

      // Mapear dados do deal para variáveis do contrato
      const contractVariables = {
        cliente_nome: contactData?.name || '',
        cliente_email: contactData?.email || '',
        cliente_empresa: contactData?.company || '',
        cliente_telefone: contactData?.phone || '',
        valor_total: dealData.value || 0,
        moeda: dealData.currency || 'BRL',
        data_inicio: new Date().toISOString().split('T')[0],
        prazo_entrega: dealData.expected_close_date || '',
        descricao_projeto: dealData.description || '',
        tags_projeto: dealData.tags?.join(', ') || '',
        pipeline: pipelineData?.name || '',
        origem: dealData.source || 'CRM'
      };

      // Criar contrato
      const { data: newContract, error: createError } = await supabase
        .from('legal_contracts')
        .insert({
          client_contact_id: dealData.contact_id,
          deal_id: dealId,
          template_id: selectedTemplateId,
          title: `Contrato: ${dealData.title}`,
          variables_data: contractVariables,
          status: 'draft'
        })
        .select('id')
        .single();

      if (createError || !newContract) {
        throw new Error('Erro ao criar contrato: ' + (createError?.message || 'Erro desconhecido'));
      }

      return newContract.id;
    },
    onSuccess: () => {
      toast({
        title: 'Contrato gerado com sucesso',
        description: 'O contrato foi criado e está pronto para edição.',
      });
    },
    onError: (error: any) => {
      console.error('Error generating contract from deal:', error);
      toast({
        title: 'Erro ao gerar contrato',
        description: error.message || 'Ocorreu um erro inesperado',
        variant: 'destructive',
      });
    },
  });

  return {
    generateContractFromDeal: async (dealId: string, templateId?: string) => {
      return generateContractMutation.mutateAsync({ dealId, templateId });
    },
    checkExistingContract,
    isGenerating: generateContractMutation.isPending,
  };
}