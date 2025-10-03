import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CRMAuditLog {
  id: string;
  entity_type: 'deal' | 'contact' | 'interaction';
  entity_id: string;
  action_type: 'created' | 'updated' | 'stage_changed' | 'deleted';
  field_name?: string;
  old_value?: string;
  new_value?: string;
  changed_by?: string;
  change_description?: string;
  is_manual_edit: boolean;
  event_timestamp: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export const useCRMAuditLog = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch audit logs for an entity
  const fetchAuditLogs = async (entityType: string, entityId: string) => {
    const { data, error } = await supabase
      .from('crm_audit_log')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('event_timestamp', { ascending: false });

    if (error) throw error;
    return data as CRMAuditLog[];
  };

  // Query for deal audit logs
  const useDealAuditLogs = (dealId: string) => {
    return useQuery({
      queryKey: ['crm_audit_log', 'deal', dealId],
      queryFn: () => fetchAuditLogs('deal', dealId),
      enabled: !!dealId,
    });
  };

  // Query for contact audit logs
  const useContactAuditLogs = (contactId: string) => {
    return useQuery({
      queryKey: ['crm_audit_log', 'contact', contactId],
      queryFn: () => fetchAuditLogs('contact', contactId),
      enabled: !!contactId,
    });
  };

  // Create manual audit log entry (for retroactive entries)
  const createManualAuditLog = useMutation({
    mutationFn: async (data: {
      entity_type: 'deal' | 'contact' | 'interaction';
      entity_id: string;
      action_type: 'created' | 'updated' | 'stage_changed' | 'deleted';
      event_timestamp: string;
      change_description: string;
      field_name?: string;
      old_value?: string;
      new_value?: string;
      metadata?: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('crm_audit_log')
        .insert({
          ...data,
          is_manual_edit: true,
        });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['crm_audit_log', variables.entity_type, variables.entity_id] 
      });
      toast({
        title: 'Evento histórico adicionado',
        description: 'O evento foi registrado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao adicionar evento',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update manual audit log entry
  const updateManualAuditLog = useMutation({
    mutationFn: async (data: {
      id: string;
      event_timestamp?: string;
      change_description?: string;
      metadata?: Record<string, any>;
    }) => {
      const { error } = await supabase
        .from('crm_audit_log')
        .update({
          event_timestamp: data.event_timestamp,
          change_description: data.change_description,
          metadata: data.metadata,
        })
        .eq('id', data.id)
        .eq('is_manual_edit', true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm_audit_log'] });
      toast({
        title: 'Evento atualizado',
        description: 'O evento histórico foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar evento',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    useDealAuditLogs,
    useContactAuditLogs,
    createManualAuditLog,
    updateManualAuditLog,
  };
};
