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

  // Mark as read mutation with optimistic update
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id: string) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['crm-notifications'] });
      
      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<CRMNotification[]>(['crm-notifications']);
      
      // Optimistically update
      queryClient.setQueryData<CRMNotification[]>(['crm-notifications'], (old) =>
        old?.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n) || []
      );
      
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      console.error('❌ Erro ao marcar notificação como lida:', err);
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['crm-notifications'], context.previousNotifications);
      }
      toast({
        title: 'Erro ao marcar como lida',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Notificação marcada como lida',
        duration: 2000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
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

  // Archive mutation with optimistic update
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_notifications')
        .update({ is_archived: true, archived_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id: string) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['crm-notifications'] });
      
      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData<CRMNotification[]>(['crm-notifications']);
      
      // Optimistically update (remove from list since we filter is_archived: false)
      queryClient.setQueryData<CRMNotification[]>(['crm-notifications'], (old) =>
        old?.filter(n => n.id !== id) || []
      );
      
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      console.error('❌ Erro ao arquivar notificação:', err);
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['crm-notifications'], context.previousNotifications);
      }
      toast({
        title: 'Erro ao arquivar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Notificação arquivada',
        duration: 2000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-notifications'] });
    },
  });

  const handleAction = (notification: CRMNotification) => {
    // Mark as read first
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    
    // Fix old URLs and build fallbacks
    let targetUrl = notification.action_url;
    
    // Rewrite old URLs from /admin/crm?deal= to /admin/crm/board?deal=
    if (targetUrl?.startsWith('/admin/crm?deal=')) {
      targetUrl = targetUrl.replace('/admin/crm?deal=', '/admin/crm/board?deal=');
    }
    
    // Fallback: build URL from entity info if action_url is missing
    if (!targetUrl) {
      if (notification.entity_type === 'deal' && notification.entity_id) {
        targetUrl = `/admin/crm/board?deal=${notification.entity_id}`;
      } else if (notification.entity_type === 'contact' && notification.entity_id) {
        targetUrl = `/admin/crm/board?contact=${notification.entity_id}`;
      } else if (notification.entity_type === 'activity' && notification.metadata?.deal_id) {
        targetUrl = `/admin/crm/board?deal=${notification.metadata.deal_id}`;
      }
    }
    
    // Navigate if we have a URL
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    archive: archiveMutation.mutate,
    handleAction,
    isMarkingAsRead: markAsReadMutation.isPending,
    isArchiving: archiveMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  };
};
