import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LegalClauseGroup {
  id: string;
  name: string;
  description?: string;
  display_order: number;
  icon_name?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalClause {
  id: string;
  group_id: string;
  title: string;
  content_markdown: string;
  variables: string[]; // placeholders
  conditions: Record<string, any>; // regras condicionais
  tags: string[];
  is_locked_by_legal: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalTemplate {
  id: string;
  name: string;
  description?: string;
  contract_type: string;
  default_groups: string[];
  default_clauses: string[];
  variables_mapping: Record<string, any>;
  is_default: boolean;
  created_by?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LegalContract {
  id: string;
  contract_number?: string;
  client_contact_id: string;
  deal_id?: string;
  project_id?: string;
  template_id: string;
  title: string;
  content_markdown?: string;
  variables_data: any; // Changed from Record<string, any> to any for Supabase compatibility
  selected_clauses: string[];
  status: 'draft' | 'review' | 'approved' | 'signed' | 'cancelled';
  pdf_url?: string;
  pdf_hash?: string;
  ai_draft_review?: any; // Changed from Record<string, any> to any for Supabase compatibility
  ai_risk_score?: number;
  ai_law_design_summary?: string;
  created_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LegalContractSignature {
  id: string;
  contract_id: string;
  provider: string;
  envelope_id?: string;
  status: 'pending' | 'sent' | 'signed' | 'cancelled';
  signers: any[];
  sent_at?: string;
  signed_at?: string;
  webhook_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useLegal = () => {
  const queryClient = useQueryClient();

  // Fetch clause groups
  const {
    data: clauseGroups = [],
    isLoading: clauseGroupsLoading,
    error: clauseGroupsError
  } = useQuery({
    queryKey: ['legal-clause-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_clause_groups')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as LegalClauseGroup[];
    }
  });

  // Fetch clauses by group
  const fetchClausesByGroup = async (groupId: string): Promise<LegalClause[]> => {
    const { data, error } = await supabase
      .from('legal_clauses')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data as LegalClause[];
  };

  // Fetch templates
  const {
    data: templates = [],
    isLoading: templatesLoading
  } = useQuery({
    queryKey: ['legal-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      return data as LegalTemplate[];
    }
  });

  // Fetch contracts
  const {
    data: contracts = [],
    isLoading: contractsLoading
  } = useQuery({
    queryKey: ['legal-contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_contracts')
        .select(`
          *,
          client_contact:crm_contacts(name, email, company),
          deal:crm_deals(title, value),
          template:legal_templates(name, contract_type)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LegalContract[];
    }
  });

  // Create contract mutation
  const createContract = useMutation({
    mutationFn: async (contractData: any) => {
      const { data, error } = await supabase
        .from('legal_contracts')
        .insert([contractData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Contrato criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar contrato:', error);
      toast.error('Erro ao criar contrato');
    }
  });

  // Update contract mutation
  const updateContract = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('legal_contracts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Contrato atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar contrato:', error);
      toast.error('Erro ao atualizar contrato');
    }
  });

  // Generate contract draft using AI
  const generateContractDraft = useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await supabase.functions.invoke('legal-ai-generator', {
        body: {
          action: 'generate_draft',
          contract_id: contractId
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Rascunho gerado com IA!');
    },
    onError: (error) => {
      console.error('Erro ao gerar rascunho:', error);
      toast.error('Erro ao gerar rascunho com IA');
    }
  });

  // Review contract with AI
  const reviewContractWithAI = useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await supabase.functions.invoke('legal-ai-generator', {
        body: {
          action: 'review_contract',
          contract_id: contractId
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Revisão jurídica concluída!');
    },
    onError: (error) => {
      console.error('Erro na revisão jurídica:', error);
      toast.error('Erro na revisão jurídica com IA');
    }
  });

  // Generate Law Design summary
  const generateLawDesign = useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await supabase.functions.invoke('legal-ai-generator', {
        body: {
          action: 'law_design',
          contract_id: contractId
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Resumo visual gerado!');
    },
    onError: (error) => {
      console.error('Erro ao gerar resumo visual:', error);
      toast.error('Erro ao gerar resumo visual');
    }
  });

  // Send to Clicksign
  const sendToClicksign = useMutation({
    mutationFn: async (contractId: string) => {
      const { data, error } = await supabase.functions.invoke('legal-clicksign-integration', {
        body: {
          action: 'send_contract',
          contract_id: contractId
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-contracts'] });
      toast.success('Contrato enviado para assinatura!');
    },
    onError: (error) => {
      console.error('Erro ao enviar para Clicksign:', error);
      toast.error('Erro ao enviar para assinatura');
    }
  });

  // Create clause group
  const createClauseGroup = useMutation({
    mutationFn: async (groupData: any) => {
      const { data, error } = await supabase
        .from('legal_clause_groups')
        .insert([groupData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-clause-groups'] });
      toast.success('Grupo de cláusulas criado!');
    },
    onError: (error) => {
      console.error('Erro ao criar grupo:', error);
      toast.error('Erro ao criar grupo de cláusulas');
    }
  });

  // Create clause
  const createClause = useMutation({
    mutationFn: async (clauseData: any) => {
      const { data, error } = await supabase
        .from('legal_clauses')
        .insert([clauseData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-clause-groups'] });
      toast.success('Cláusula criada!');
    },
    onError: (error) => {
      console.error('Erro ao criar cláusula:', error);
      toast.error('Erro ao criar cláusula');
    }
  });

  // Update clause
  const updateClause = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('legal_clauses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-clause-groups'] });
      toast.success('Cláusula atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar cláusula:', error);
      toast.error('Erro ao atualizar cláusula');
    }
  });

  // Delete clause
  const deleteClause = useMutation({
    mutationFn: async (clauseId: string) => {
      // First check if clause is used in any contracts
      const { data: contractsUsing } = await supabase
        .from('legal_contracts')
        .select('id, title')
        .contains('selected_clauses', [clauseId]);

      if (contractsUsing && contractsUsing.length > 0) {
        throw new Error(`Não é possível deletar. Cláusula está sendo usada em ${contractsUsing.length} contrato(s).`);
      }

      const { data, error } = await supabase
        .from('legal_clauses')
        .update({ is_active: false })
        .eq('id', clauseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-clause-groups'] });
      toast.success('Cláusula removida com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao remover cláusula:', error);
      toast.error(error.message || 'Erro ao remover cláusula');
    }
  });

  // Duplicate clause
  const duplicateClause = useMutation({
    mutationFn: async (clauseId: string) => {
      // First get the original clause
      const { data: originalClause, error: fetchError } = await supabase
        .from('legal_clauses')
        .select('*')
        .eq('id', clauseId)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate with modified title
      const duplicateData = {
        ...originalClause,
        id: undefined, // Let Supabase generate new ID
        title: `${originalClause.title} (Cópia)`,
        created_at: undefined,
        updated_at: undefined
      };

      const { data, error } = await supabase
        .from('legal_clauses')
        .insert([duplicateData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-clause-groups'] });
      toast.success('Cláusula duplicada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao duplicar cláusula:', error);
      toast.error('Erro ao duplicar cláusula');
    }
  });

  // Create template
  const createTemplate = useMutation({
    mutationFn: async (templateData: any) => {
      const { data, error } = await supabase
        .from('legal_templates')
        .insert([templateData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-templates'] });
      toast.success('Template criado!');
    },
    onError: (error) => {
      console.error('Erro ao criar template:', error);
      toast.error('Erro ao criar template');
    }
  });

  // Update template (for configuration)
  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('legal_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legal-templates'] });
      toast.success('Template configurado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao configurar template:', error);
      toast.error('Erro ao configurar template');
    }
  });

  return {
    // Data
    clauseGroups,
    contracts,
    templates,
    
    // Loading states
    clauseGroupsLoading,
    contractsLoading,
    templatesLoading,
    
    // Error states
    clauseGroupsError,
    
    // Functions
    fetchClausesByGroup,
    
    // Mutations
    createContract,
    updateContract,
    generateContractDraft,
    reviewContractWithAI,
    generateLawDesign,
    sendToClicksign,
    createClauseGroup,
    createClause,
    updateClause,
    deleteClause,
    duplicateClause,
    createTemplate,
    updateTemplate,
    
    // Mutation states
    isCreatingContract: createContract.isPending,
    isUpdatingContract: updateContract.isPending,
    isGeneratingDraft: generateContractDraft.isPending,
    isReviewingContract: reviewContractWithAI.isPending,
    isGeneratingLawDesign: generateLawDesign.isPending,
    isSendingToClicksign: sendToClicksign.isPending,
    isUpdatingClause: updateClause.isPending,
    isDeletingClause: deleteClause.isPending,
    isDuplicatingClause: duplicateClause.isPending
  };
};