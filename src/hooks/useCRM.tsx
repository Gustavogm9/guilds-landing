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
  // Enhanced fields
  lead_score?: number;
  icp_score?: number;
  lifecycle_stage?: string;
  lead_source?: string;
  products_interest?: string[];
  engagement_score?: number;
  last_interaction_date?: string;
  next_action?: string;
  next_action_date?: string;
  budget_range?: string;
  decision_timeline?: string;
  pain_points?: string[];
  company_size?: string;
  industry?: string;
  job_title?: string;
  social_media?: Record<string, any>;
  notes?: string;
}

export interface CRMContactInteraction {
  id: string;
  contact_id: string;
  interaction_type: 'email' | 'phone' | 'whatsapp' | 'meeting' | 'form' | 'newsletter' | 'website' | 'social' | 'other';
  interaction_date: string;
  subject?: string;
  description?: string;
  outcome?: string;
  next_steps?: string;
  channel_data?: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CRMProductInterest {
  id: string;
  contact_id: string;
  product_category: 'software_apps' | 'automacao_ia' | 'jogos_gamificacao' | 'consultoria' | 'workshops';
  interest_level: number;
  specific_products?: string[];
  budget_indicated?: number;
  timeline_indicated?: string;
  source_interaction?: string;
  notes?: string;
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

  // Fetch contacts with enhanced data
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
        .order('last_interaction_date', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      return data as CRMContact[];
    }
  });

  // Fetch contact interactions
  const fetchContactInteractions = async (contactId: string) => {
    const { data, error } = await supabase
      .from('crm_contact_interactions')
      .select('*')
      .eq('contact_id', contactId)
      .order('interaction_date', { ascending: false });
    
    if (error) throw error;
    return data as CRMContactInteraction[];
  };

  // Fetch product interests
  const fetchProductInterests = async (contactId: string) => {
    const { data, error } = await supabase
      .from('crm_product_interests')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CRMProductInterest[];
  };

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

  // Create interaction mutation
  const createInteraction = useMutation({
    mutationFn: async (interaction: Omit<CRMContactInteraction, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_contact_interactions')
        .insert([interaction])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      toast({
        title: "Interação registrada",
        description: "Interação registrada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao registrar interação",
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
    fetchContactInteractions,
    fetchProductInterests,
    
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
    
    createInteraction: createInteraction.mutate,
    isCreatingInteraction: createInteraction.isPending,
    
    // Errors
    pipelinesError
  };
}