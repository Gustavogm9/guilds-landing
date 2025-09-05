import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Types
export interface CRMPipeline {
  id: string;
  name: string;
  description?: string;
  type: 'sales' | 'support' | 'projects';
  color: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CRMStage {
  id: string;
  pipeline_id: string;
  name: string;
  description?: string;
  color: string;
  display_order: number;
  auto_actions?: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  tags: string[];
  custom_fields: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CRMDeal {
  id: string;
  pipeline_id: string;
  stage_id: string;
  contact_id?: string;
  title: string;
  description?: string;
  value?: number;
  currency: string;
  probability: number;
  expected_close_date?: string;
  assigned_to?: string;
  source?: string;
  tags: string[];
  custom_fields: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  contact?: CRMContact;
}

export interface CRMActivity {
  id: string;
  deal_id?: string;
  contact_id?: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  completed_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export function useCRM() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pipelines
  const {
    data: pipelines,
    isLoading: pipelinesLoading,
    error: pipelinesError
  } = useQuery({
    queryKey: ['crm-pipelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as CRMPipeline[];
    }
  });

  // Fetch stages by pipeline
  const fetchStagesByPipeline = async (pipelineId: string) => {
    const { data, error } = await supabase
      .from('crm_stages')
      .select('*')
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data as CRMStage[];
  };

  // Fetch deals by pipeline with contacts
  const fetchDealsByPipeline = async (pipelineId: string) => {
    const { data, error } = await supabase
      .from('crm_deals')
      .select(`
        *,
        contact:crm_contacts(*)
      `)
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as any[];
  };

  // Fetch contacts
  const {
    data: contacts,
    isLoading: contactsLoading
  } = useQuery({
    queryKey: ['crm-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CRMContact[];
    }
  });

  // Create pipeline mutation
  const createPipeline = useMutation({
    mutationFn: async (pipeline: Omit<CRMPipeline, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .insert([pipeline])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast({
        title: "Pipeline criado",
        description: "Pipeline criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pipeline",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create stage mutation
  const createStage = useMutation({
    mutationFn: async (stage: Omit<CRMStage, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_stages')
        .insert([stage])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] });
      toast({
        title: "Estágio criado",
        description: "Estágio criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar estágio",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create contact mutation
  const createContact = useMutation({
    mutationFn: async (contact: Omit<CRMContact, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_contacts')
        .insert([contact])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast({
        title: "Contato criado",
        description: "Contato criado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar contato",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create deal mutation
  const createDeal = useMutation({
    mutationFn: async (deal: Omit<CRMDeal, 'id' | 'created_at' | 'updated_at' | 'contact'>) => {
      const { data, error } = await supabase
        .from('crm_deals')
        .insert([deal])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast({
        title: "Oportunidade criada",
        description: "Oportunidade criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar oportunidade",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Move deal mutation
  const moveDeal = useMutation({
    mutationFn: async ({ dealId, stageId }: { dealId: string; stageId: string }) => {
      const { data, error } = await supabase
        .from('crm_deals')
        .update({ stage_id: stageId })
        .eq('id', dealId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao mover oportunidade",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    pipelines,
    contacts,
    
    // Loading states
    pipelinesLoading,
    contactsLoading,
    
    // Fetch functions
    fetchStagesByPipeline,
    fetchDealsByPipeline,
    
    // Mutations
    createPipeline: createPipeline.mutate,
    isCreatingPipeline: createPipeline.isPending,
    
    createStage: createStage.mutate,
    isCreatingStage: createStage.isPending,
    
    createContact: createContact.mutate,
    isCreatingContact: createContact.isPending,
    
    createDeal: createDeal.mutate,
    isCreatingDeal: createDeal.isPending,
    
    moveDeal: moveDeal.mutate,
    isMovingDeal: moveDeal.isPending,
    
    // Errors
    pipelinesError
  };
}