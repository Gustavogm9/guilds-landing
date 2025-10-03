import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export interface BoardPreferences {
  board_density?: 'compact' | 'comfortable' | 'spacious';
  show_card_value?: boolean;
  show_card_probability?: boolean;
  show_card_close_date?: boolean;
  show_stage_metrics?: boolean;
}

export function useUserCRMPreferences() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user preferences
  const { data: preferences, isLoading, error } = useQuery({
    queryKey: ['user-crm-preferences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_crm_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserCRMPreferences | null;
    },
  });

  // Update default pipeline
  const updateDefaultPipeline = useMutation({
    mutationFn: async (pipelineId: string | null) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upsert preferences
      const { error } = await supabase
        .from('user_crm_preferences')
        .upsert({
          user_id: user.id,
          default_pipeline_id: pipelineId,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-crm-preferences'] });
      toast({
        title: "Pipeline padrão atualizado",
        description: "Suas preferências foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar pipeline padrão",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update last viewed pipeline (silent, no toast)
  const updateLastViewedPipeline = useMutation({
    mutationFn: async (pipelineId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_crm_preferences')
        .upsert({
          user_id: user.id,
          last_viewed_pipeline_id: pipelineId,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-crm-preferences'] });
    },
  });

  // Update board display preferences
  const updateBoardPreferences = useMutation({
    mutationFn: async (prefs: BoardPreferences) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_crm_preferences')
        .upsert({
          user_id: user.id,
          ...prefs,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-crm-preferences'] });
      toast({
        title: "Preferências de visualização atualizadas",
        description: "Suas configurações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar preferências",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    preferences,
    isLoading,
    error,
    updateDefaultPipeline: updateDefaultPipeline.mutate,
    isUpdatingDefault: updateDefaultPipeline.isPending,
    updateLastViewedPipeline: updateLastViewedPipeline.mutate,
    isUpdatingLastViewed: updateLastViewedPipeline.isPending,
    updateBoardPreferences: updateBoardPreferences.mutate,
    isUpdatingBoardPrefs: updateBoardPreferences.isPending,
  };
}
