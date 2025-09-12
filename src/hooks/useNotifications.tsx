import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EmailNotification {
  id: string;
  project_id: string;
  recipient_email: string;
  recipient_type: 'client' | 'admin' | 'team';
  notification_type: string;
  subject: string;
  content: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  retry_count: number;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface WebhookEvent {
  id: string;
  project_id: string;
  event_type: string;
  payload: any;
  webhook_url?: string;
  status: 'pending' | 'sent' | 'failed';
  response_code?: number;
  response_body?: string;
  retry_count: number;
  created_at: string;
  sent_at?: string;
}

export interface NotificationPreferences {
  id: string;
  client_contact_id: string;
  email_notifications: boolean;
  milestone_notifications: boolean;
  task_notifications: boolean;
  report_notifications: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  created_at: string;
  updated_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch email notifications
  const { data: emailNotifications, isLoading: isLoadingEmails } = useQuery({
    queryKey: ['email_notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_email_notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmailNotification[];
    },
  });

  // Fetch webhook events
  const { data: webhookEvents, isLoading: isLoadingWebhooks } = useQuery({
    queryKey: ['webhook_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_webhook_events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WebhookEvent[];
    },
  });

  // Fetch notification preferences
  const { data: notificationPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['notification_preferences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_notification_preferences')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NotificationPreferences[];
    },
  });

  // Process email notifications
  const processEmailNotifications = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('project-email-service');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Processadas ${data?.processed || 0} notificações de email`);
      queryClient.invalidateQueries({ queryKey: ['email_notifications'] });
    },
    onError: (error) => {
      toast.error(`Erro ao processar notificações: ${error.message}`);
    },
  });

  // Process webhook events
  const processWebhookEvents = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('project-webhooks');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Processados ${data?.processed || 0} eventos de webhook`);
      queryClient.invalidateQueries({ queryKey: ['webhook_events'] });
    },
    onError: (error) => {
      toast.error(`Erro ao processar webhooks: ${error.message}`);
    },
  });

  // Create notification preference
  const createNotificationPreference = useMutation({
    mutationFn: async (preference: Omit<NotificationPreferences, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('client_notification_preferences')
        .insert([preference])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Preferências de notificação criadas');
      queryClient.invalidateQueries({ queryKey: ['notification_preferences'] });
    },
    onError: (error) => {
      toast.error(`Erro ao criar preferências: ${error.message}`);
    },
  });

  // Update notification preference
  const updateNotificationPreference = useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<NotificationPreferences> 
    }) => {
      const { data, error } = await supabase
        .from('client_notification_preferences')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Preferências atualizadas');
      queryClient.invalidateQueries({ queryKey: ['notification_preferences'] });
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar preferências: ${error.message}`);
    },
  });

  // Retry failed notification
  const retryNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('project_email_notifications')
        .update({ 
          status: 'pending',
          retry_count: 0 
        })
        .eq('id', notificationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notificação reagendada para reenvio');
      queryClient.invalidateQueries({ queryKey: ['email_notifications'] });
    },
    onError: (error) => {
      toast.error(`Erro ao reagendar notificação: ${error.message}`);
    },
  });

  // Get notification statistics
  const getNotificationStats = () => {
    if (!emailNotifications) return null;

    const stats = {
      total: emailNotifications.length,
      pending: emailNotifications.filter(n => n.status === 'pending').length,
      sent: emailNotifications.filter(n => n.status === 'sent').length,
      failed: emailNotifications.filter(n => n.status === 'failed').length,
    };

    return stats;
  };

  // Get webhook statistics
  const getWebhookStats = () => {
    if (!webhookEvents) return null;

    const stats = {
      total: webhookEvents.length,
      pending: webhookEvents.filter(w => w.status === 'pending').length,
      sent: webhookEvents.filter(w => w.status === 'sent').length,
      failed: webhookEvents.filter(w => w.status === 'failed').length,
    };

    return stats;
  };

  return {
    emailNotifications,
    webhookEvents,
    notificationPreferences,
    isLoading: isLoadingEmails || isLoadingWebhooks || isLoadingPreferences,
    processEmailNotifications,
    processWebhookEvents,
    createNotificationPreference,
    updateNotificationPreference,
    retryNotification,
    getNotificationStats,
    getWebhookStats,
  };
};