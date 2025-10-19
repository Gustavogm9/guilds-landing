// CRM Hook - Updated with deal closing functionality
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
  is_default?: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserCRMPreferences {
  id: string;
  user_id: string;
  default_pipeline_id?: string | null;
  last_viewed_pipeline_id?: string | null;
  board_density: 'compact' | 'comfortable' | 'spacious';
  show_card_value: boolean;
  show_card_probability: boolean;
  show_card_close_date: boolean;
  show_stage_metrics: boolean;
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
  business_unit?: 'guilds' | 'guilds_lab' | 'guilds_craft' | 'doavya' | 'outros';
  tags: string[];
  custom_fields: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  is_won?: boolean | null;
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

export function useCRM(includeInactive: boolean = false) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pipelines
  const {
    data: pipelines,
    isLoading: pipelinesLoading,
    error: pipelinesError
  } = useQuery({
    queryKey: ['crm-pipelines', includeInactive],
    queryFn: async () => {
      let query = supabase
        .from('crm_pipelines')
        .select('*');
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('display_order');
      
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
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select(`
          *,
          contact:crm_contacts(*)
        `)
        .eq('pipeline_id', pipelineId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar deals:', error);
        toast({
          title: "Erro ao carregar oportunidades",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as any[];
    } catch (err) {
      console.error('Erro inesperado ao buscar deals:', err);
      return [];
    }
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

  // Fetch pipeline by name
  const fetchPipelineByName = async (name: string) => {
    const { data, error } = await supabase
      .from('crm_pipelines')
      .select('*')
      .eq('name', name)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) throw error;
    return data as CRMPipeline | null;
  };

  // Fetch first stage of pipeline
  const fetchFirstStageOfPipeline = async (pipelineId: string) => {
    const { data, error } = await supabase
      .from('crm_stages')
      .select('*')
      .eq('pipeline_id', pipelineId)
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data as CRMStage | null;
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

  // Update deal mutation
  const updateDeal = useMutation({
    mutationFn: async (deal: Partial<CRMDeal> & { id: string }) => {
      const { id, created_at, updated_at, contact, ...updateData } = deal as any;
      const { data, error } = await supabase
        .from('crm_deals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast({
        title: "Oportunidade atualizada",
        description: "Oportunidade atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar oportunidade",
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
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      
      // Verificar se moveu para stage de "Qualificação" e processar lead scoring
      const { data: stage } = await supabase
        .from('crm_stages')
        .select('name')
        .eq('id', data.stage_id)
        .single();
      
      if (stage?.name?.toLowerCase().includes('qualif')) {
        // Processar lead scoring automaticamente
        if (data.contact_id) {
          try {
            await supabase.functions.invoke('advanced-lead-processor', {
              body: {
                contact_id: data.contact_id,
                source: 'pipeline_qualification',
                behavioral_data: {
                  deal_id: data.id,
                  moved_to_qualification: new Date().toISOString()
                }
              }
            });
          } catch (error) {
            console.error('Erro ao processar lead scoring:', error);
          }
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Erro ao mover oportunidade",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mark deal as closed mutation
  const markDealAsClosed = useMutation({
    mutationFn: async ({ dealId, isWon }: { dealId: string; isWon: boolean }) => {
      const { data, error } = await supabase
        .from('crm_deals')
        .update({
          is_won: isWon,
          closed_at: new Date().toISOString()
        })
        .eq('id', dealId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast({
        title: variables.isWon ? 'Deal marcado como Ganho!' : 'Deal marcado como Perdido',
        description: 'Status de fechamento atualizado com sucesso.',
        variant: variables.isWon ? 'default' : 'destructive'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar deal',
        description: error.message,
        variant: 'destructive'
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

  // Activity mutations
  const createActivity = useMutation({
    mutationFn: async (activity: Omit<CRMActivity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('crm_activities')
        .insert([activity])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['deal-activities'] });
      toast({
        title: "Atividade agendada",
        description: "Atividade criada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar atividade",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const updateActivity = useMutation({
    mutationFn: async (activity: Partial<CRMActivity> & { id: string }) => {
      const { id, created_at, updated_at, ...updateData } = activity;
      const { data, error } = await supabase
        .from('crm_activities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['deal-activities'] });
      toast({
        title: "Atividade atualizada",
        description: "Atividade atualizada com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar atividade",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const markActivityAsCompleted = useMutation({
    mutationFn: async (activityId: string) => {
      const { data, error } = await supabase
        .from('crm_activities')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', activityId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['deal-activities'] });
      toast({
        title: "Atividade concluída! 🎉",
      });
    }
  });

  // Activity fetch functions
  const fetchActivitiesByDeal = async (dealId: string) => {
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('deal_id', dealId)
      .order('due_date', { ascending: true, nullsFirst: false });
    
    if (error) throw error;
    return data as CRMActivity[];
  };

  const fetchActivitiesByContact = async (contactId: string) => {
    const { data, error } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('contact_id', contactId)
      .order('due_date', { ascending: true, nullsFirst: false });
    
    if (error) throw error;
    return data as CRMActivity[];
  };

  const fetchUpcomingActivities = async (daysAhead: number = 7) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysAhead);
    
    const { data, error } = await supabase
      .from('crm_activities')
      .select(`
        *,
        deal:crm_deals(*),
        contact:crm_contacts(*)
      `)
      .eq('completed', false)
      .gte('due_date', today.toISOString())
      .lte('due_date', futureDate.toISOString())
      .order('due_date', { ascending: true });
    
    if (error) throw error;
    return data;
  };

  // Recurring Activities Mutations
  const createRecurringActivity = useMutation({
    mutationFn: async (recurrence: any) => {
      const { error } = await supabase
        .from('crm_activity_recurrence')
        .insert([recurrence]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-activities'] });
      toast({
        title: "Recorrência criada",
        description: "Atividade recorrente criada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar recorrência",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateRecurringActivity = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('crm_activity_recurrence')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-activities'] });
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      toast({
        title: "Recorrência atualizada",
        description: "Atividade recorrente atualizada com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar recorrência",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRecurringActivity = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_activity_recurrence')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-activities'] });
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
      toast({
        title: "Recorrência excluída",
        description: "Atividade recorrente e suas ocorrências futuras foram removidas",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir recorrência",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Pipeline mutations
  const updatePipeline = useMutation({
    mutationFn: async ({ pipelineId, updates }: { pipelineId: string; updates: Partial<CRMPipeline> }) => {
      const { data, error } = await supabase
        .from('crm_pipelines')
        .update(updates)
        .eq('id', pipelineId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast({
        title: "Pipeline atualizado",
        description: "Pipeline atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar pipeline",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deletePipeline = useMutation({
    mutationFn: async (pipelineId: string) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_active: false })
        .eq('id', pipelineId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast({
        title: "Pipeline excluído",
        description: "Pipeline foi arquivado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir pipeline",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const setDefaultPipeline = useMutation({
    mutationFn: async (pipelineId: string) => {
      const { error } = await supabase
        .from('crm_pipelines')
        .update({ is_default: true })
        .eq('id', pipelineId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-pipelines'] });
      toast({
        title: "Pipeline padrão definido",
        description: "Pipeline marcado como padrão com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao definir pipeline padrão",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Stage mutations
  const updateStage = useMutation({
    mutationFn: async ({ stageId, updates }: { stageId: string; updates: Partial<CRMStage> }) => {
      const { data, error } = await supabase
        .from('crm_stages')
        .update(updates)
        .eq('id', stageId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] });
      toast({
        title: "Estágio atualizado",
        description: "Estágio atualizado com sucesso!",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar estágio",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const deleteStage = useMutation({
    mutationFn: async (stageId: string) => {
      const { error } = await supabase
        .from('crm_stages')
        .update({ is_active: false })
        .eq('id', stageId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] });
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      toast({
        title: "Estágio excluído",
        description: "Estágio foi desativado com sucesso",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir estágio",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const reorderStages = useMutation({
    mutationFn: async (stageIds: string[]) => {
      const updates = stageIds.map((stageId, index) => 
        supabase
          .from('crm_stages')
          .update({ display_order: index })
          .eq('id', stageId)
      );
      
      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      
      if (errors.length > 0) throw new Error('Erro ao reordenar estágios');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-stages'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao reordenar estágios",
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
    fetchPipelineByName,
    fetchFirstStageOfPipeline,
    
    // Mutations
    createPipeline: createPipeline.mutate,
    isCreatingPipeline: createPipeline.isPending,
    
    createStage: createStage.mutate,
    isCreatingStage: createStage.isPending,
    
    createContact: createContact.mutate,
    isCreatingContact: createContact.isPending,
    
    createDeal: createDeal.mutate,
    isCreatingDeal: createDeal.isPending,
    
    updateDeal: updateDeal.mutate,
    isUpdatingDeal: updateDeal.isPending,
    
    moveDeal: moveDeal.mutate,
    isMovingDeal: moveDeal.isPending,
    
    markDealAsClosed: markDealAsClosed.mutate,
    isMarkingDealAsClosed: markDealAsClosed.isPending,
    
    createInteraction: createInteraction.mutate,
    isCreatingInteraction: createInteraction.isPending,
    
    // Activities
    createActivity: createActivity.mutate,
    isCreatingActivity: createActivity.isPending,
    
    updateActivity: updateActivity.mutate,
    isUpdatingActivity: updateActivity.isPending,
    
    markActivityAsCompleted: markActivityAsCompleted.mutate,
    isCompletingActivity: markActivityAsCompleted.isPending,
    
    fetchActivitiesByDeal,
    fetchActivitiesByContact,
    fetchUpcomingActivities,
    
    // Recurring Activities
    createRecurringActivity: createRecurringActivity.mutate,
    isCreatingRecurringActivity: createRecurringActivity.isPending,
    
    updateRecurringActivity: updateRecurringActivity.mutate,
    isUpdatingRecurringActivity: updateRecurringActivity.isPending,
    
    deleteRecurringActivity: deleteRecurringActivity.mutate,
    isDeletingRecurringActivity: deleteRecurringActivity.isPending,
    
    // Pipeline & Stage Management
    updatePipeline: updatePipeline.mutate,
    isUpdatingPipeline: updatePipeline.isPending,
    
    deletePipeline: deletePipeline.mutate,
    isDeletingPipeline: deletePipeline.isPending,
    
    setDefaultPipeline: setDefaultPipeline.mutate,
    isSettingDefaultPipeline: setDefaultPipeline.isPending,
    
    updateStage: updateStage.mutate,
    isUpdatingStage: updateStage.isPending,
    
    deleteStage: deleteStage.mutate,
    isDeletingStage: deleteStage.isPending,
    
    reorderStages: reorderStages.mutate,
    isReorderingStages: reorderStages.isPending,
    
    // Errors
    pipelinesError
  };
}