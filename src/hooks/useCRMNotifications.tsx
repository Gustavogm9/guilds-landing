import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export interface CRMNotification {
  id: string;
  entity_type: 'deal' | 'contact' | 'activity';
  entity_id: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  read_at?: string;
  archived_at?: string;
  metadata?: Record<string, any>;
}

export const useCRMNotifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch notifications from Supabase
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['crm-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_notifications')
        .select('*')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as CRMNotification[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Setup Realtime listener for new notifications
  useEffect(() => {
    const channel = supabase
      .channel('crm-notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'crm_notifications',
        },
        (payload) => {
          const newNotification = payload.new as CRMNotification;
          
          // Show toast for urgent/high priority notifications
          if (newNotification.priority === 'urgent' || newNotification.priority === 'high') {
            toast({
              title: newNotification.title,
              description: newNotification.message,
              variant: newNotification.priority === 'urgent' ? 'destructive' : 'default',
              duration: newNotification.priority === 'urgent' ? 10000 : 5000,
            });
          }
          
          // Refresh notifications list
          queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast, navigate]);

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
      toast({
        title: 'Notificação marcada como lida',
        duration: 2000,
      });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('is_read', false)
        .eq('is_archived', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
      toast({
        title: 'Notificações marcadas como lidas',
        description: 'Todas as notificações foram marcadas como lidas.',
      });
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ is_archived: true, archived_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
      toast({
        title: 'Notificação arquivada',
        duration: 2000,
      });
    },
  });

  const handleAction = (notification: CRMNotification) => {
    markAsReadMutation.mutate(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    archive: archiveMutation.mutate,
    handleAction,
  };
};
