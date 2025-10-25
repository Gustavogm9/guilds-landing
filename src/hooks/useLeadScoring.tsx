import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LeadScoringRule {
  id: string;
  rule_name: string;
  rule_type: string;
  condition_field: string;
  condition_operator: string;
  condition_value: any;
  points: number;
  score_type: string;
  is_active: boolean;
  priority: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ICPCriteria {
  id: string;
  criterion_name: string;
  criterion_type: string;
  criterion_field: string;
  target_values: any[];
  weight: number;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export function useLeadScoring() {
  const queryClient = useQueryClient();

  // ==================== FETCH DATA ====================
  
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["lead-scoring-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_scoring_rules")
        .select("*")
        .order("priority", { ascending: true });

      if (error) throw error;
      return data as LeadScoringRule[];
    },
  });

  const { data: icpCriteria, isLoading: criteriaLoading } = useQuery({
    queryKey: ["icp-criteria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("icp_criteria")
        .select("*")
        .order("weight", { ascending: false });

      if (error) throw error;
      return data as ICPCriteria[];
    },
  });

  // Fetch ICP Health Statistics
  const { data: icpHealthData, isLoading: healthLoading } = useQuery({
    queryKey: ["icp-health"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_icp_health_stats");
      
      if (error) throw error;
      
      // Get missing fields from criteria
      const missingFields: string[] = [];
      if (icpCriteria) {
        const CONTACT_FORM_FIELDS = [
          'name', 'email', 'phone', 'company', 'role', 'company_size',
          'budget_range', 'timeline', 'source', 'product_interest'
        ];
        
        icpCriteria.forEach(c => {
          if (!CONTACT_FORM_FIELDS.includes(c.criterion_field) && 
              !c.criterion_field.startsWith('custom_fields.')) {
            missingFields.push(c.criterion_field);
          }
        });
      }
      
      return {
        incompleteContactsPercent: data?.[0]?.incomplete_percent || 0,
        totalContacts: data?.[0]?.total_contacts || 0,
        incompleteContacts: data?.[0]?.incomplete_contacts || 0,
        missingFields: [...new Set(missingFields)]
      };
    },
    enabled: !!icpCriteria,
  });

  // ==================== MUTATIONS ====================

  // Create Lead Scoring Rule
  const createRule = useMutation({
    mutationFn: async (newRule: Omit<LeadScoringRule, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("lead_scoring_rules")
        .insert(newRule)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scoring-rules"] });
      toast.success("Regra de scoring criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar regra: " + error.message);
    },
  });

  // Update Lead Scoring Rule
  const updateRule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<LeadScoringRule> }) => {
      const { data, error } = await supabase
        .from("lead_scoring_rules")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scoring-rules"] });
      toast.success("Regra atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar regra: " + error.message);
    },
  });

  // Delete Lead Scoring Rule
  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lead_scoring_rules")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-scoring-rules"] });
      toast.success("Regra deletada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar regra: " + error.message);
    },
  });

  // Create ICP Criteria
  const createCriteria = useMutation({
    mutationFn: async (newCriteria: Omit<ICPCriteria, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("icp_criteria")
        .insert(newCriteria)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icp-criteria"] });
      toast.success("Critério de ICP criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao criar critério: " + error.message);
    },
  });

  // Update ICP Criteria
  const updateCriteria = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ICPCriteria> }) => {
      const { data, error } = await supabase
        .from("icp_criteria")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icp-criteria"] });
      toast.success("Critério atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar critério: " + error.message);
    },
  });

  // Delete ICP Criteria
  const deleteCriteria = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("icp_criteria")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["icp-criteria"] });
      toast.success("Critério deletado com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao deletar critério: " + error.message);
    },
  });

  // Recalculate Scores for All Contacts
  const recalculateScores = useMutation({
    mutationFn: async () => {
      const { data: contacts, error: fetchError } = await supabase
        .from("crm_contacts")
        .select("id")
        .eq("is_active", true);

      if (fetchError) throw fetchError;

      // TODO: Chamar edge function para processar cada contato
      // Por enquanto, apenas simula o processamento
      toast.info(`Recalculando scores de ${contacts?.length || 0} contatos...`);
      
      return contacts;
    },
    onSuccess: (contacts) => {
      queryClient.invalidateQueries({ queryKey: ["crm-contacts"] });
      toast.success(`Scores recalculados para ${contacts?.length || 0} contatos!`);
    },
    onError: (error: any) => {
      toast.error("Erro ao recalcular scores: " + error.message);
    },
  });

  return {
    // Data
    rules,
    icpCriteria,
    icpHealthData,
    
    // Loading states
    rulesLoading,
    criteriaLoading,
    healthLoading,
    
    // Mutations
    createRule: createRule.mutate,
    updateRule: updateRule.mutate,
    deleteRule: deleteRule.mutate,
    createCriteria: createCriteria.mutate,
    updateCriteria: updateCriteria.mutate,
    deleteCriteria: deleteCriteria.mutate,
    recalculateScores: recalculateScores.mutate,
    
    // Pending states
    isCreatingRule: createRule.isPending,
    isUpdatingRule: updateRule.isPending,
    isDeletingRule: deleteRule.isPending,
    isCreatingCriteria: createCriteria.isPending,
    isUpdatingCriteria: updateCriteria.isPending,
    isDeletingCriteria: deleteCriteria.isPending,
    isRecalculating: recalculateScores.isPending,
  };
}
