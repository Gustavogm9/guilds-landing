import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLegal } from './useLegal';

export interface CRMContractIntegration {
  generateContractFromDeal: (dealId: string, templateId?: string) => Promise<string>;
  checkExistingContract: (dealId: string) => Promise<string | null>;
  isGenerating: boolean;
}

export function useCRMContractIntegration(): CRMContractIntegration {
  const { toast } = useToast();
  const { createContract } = useLegal();

  // Verificar se já existe contrato para o deal
  const checkExistingContract = async (dealId: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from('legal_contracts')
      .select('id')
      .eq('deal_id', dealId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking existing contract:', error);
      return null;
    }

    return data?.id || null;
  };

  // Gerar contrato a partir do deal
  const generateContractMutation = useMutation({
    mutationFn: async ({ dealId, templateId }: { dealId: string; templateId?: string }) => {
      // Buscar dados do deal com relacionamentos
      const { data: dealData, error: dealError } = await supabase
        .from('crm_deals')
        .select('*')
        .eq('id', dealId)
        .single();

      if (dealError || !dealData) {
        throw new Error('Deal não encontrado');
      }

      // Buscar contato separadamente
      let contactData = null;
      if (dealData.contact_id) {
        const { data: contact } = await supabase
          .from('crm_contacts')
          .select('*')
          .eq('id', dealData.contact_id)
          .single();
        contactData = contact;
      }

      // Buscar pipeline separadamente
      let pipelineData = null;
      if (dealData.pipeline_id) {
        const { data: pipeline } = await supabase
          .from('crm_pipelines')
          .select('*')
          .eq('id', dealData.pipeline_id)
          .single();
        pipelineData = pipeline;
      }

      // Verificar se já existe contrato
      const existingContractId = await checkExistingContract(dealId);
      if (existingContractId) {
        return existingContractId;
      }

      // Buscar template padrão se não especificado
      let selectedTemplateId = templateId;
      
      if (!selectedTemplateId) {
        const { data: templates, error: templatesError } = await supabase
          .from('legal_templates')
          .select('*')
          .eq('is_active', true)
          .eq('is_default', true)
          .order('created_at', { ascending: false })
          .limit(1);

        if (!templatesError && templates && templates.length > 0) {
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
      const contractData = {
        client_contact_id: dealData.contact_id,
        deal_id: dealId,
        template_id: selectedTemplateId,
        title: `Contrato: ${dealData.title}`,
        variables_data: contractVariables,
        status: 'draft' as const
      };

      const result = await createContract.mutateAsync(contractData);
      return typeof result === 'string' ? result : result.id;
    },
    onSuccess: (contractId) => {
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