import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface FeedbackModule {
  id: string;
  project_id: string;
  key: string;
  name: string;
  path_hint?: string;
  description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeedbackEntry {
  id: string;
  project_id: string;
  module_id?: string;
  contact_id?: string;
  persona: 'gestor' | 'usuario_final' | 'parceiro';
  channel: 'inapp' | 'whatsapp' | 'email' | 'import' | 'api';
  type: 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat' | 'ces' | 'pmf' | 'usability';
  score?: number;
  severity: 'blocker' | 'high' | 'medium' | 'low' | 'idea';
  status: 'new' | 'triaged' | 'in_backlog' | 'in_progress' | 'released' | 'wont_fix';
  verbatim: string;
  attachments: string[];
  context: Record<string, any>;
  rice_reach?: number;
  rice_impact?: number;
  rice_confidence?: number;
  rice_effort?: number;
  rice_score?: number;
  wsjf_user_value?: number;
  wsjf_time_criticality?: number;
  wsjf_risk_reduction?: number;
  wsjf_job_size?: number;
  wsjf_score?: number;
  user_agent?: string;
  ip_address?: string;
  locale: string;
  priority_score: number;
  resolution_note?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackTicket {
  id: string;
  project_id: string;
  feedback_id?: string;
  contact_id?: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'solved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  csat_score?: number;
  csat_comment?: string;
  resolution_note?: string;
  first_response_at?: string;
  resolved_at?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackMetrics {
  project_id: string;
  date: string;
  total_feedback: number;
  bugs_count: number;
  ideas_count: number;
  questions_count: number;
  nps_score?: number;
  nps_responses: number;
  csat_score?: number;
  csat_responses: number;
  ces_score?: number;
  ces_responses: number;
  pmf_score?: number;
  pmf_responses: number;
  avg_first_response_hours?: number;
  avg_resolution_hours?: number;
  tickets_created: number;
  tickets_closed: number;
  inapp_feedback: number;
  whatsapp_feedback: number;
  email_feedback: number;
}

export const useFeedback = (projectId?: string) => {
  const queryClient = useQueryClient();

  // Fetch feedback entries
  const {
    data: feedbackEntries = [],
    isLoading: feedbackLoading,
    error: feedbackError
  } = useQuery({
    queryKey: ['feedbackEntries', projectId],
    queryFn: async () => {
      let query = supabase
        .from('feedback_entries')
        .select(`
          *,
          module:feedback_modules(name, key),
          contact:crm_contacts(name, email)
        `)
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FeedbackEntry[];
    },
    enabled: !!projectId
  });

  // Fetch feedback modules
  const fetchModulesByProject = async (projectId: string): Promise<FeedbackModule[]> => {
    const { data, error } = await supabase
      .from('feedback_modules')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data;
  };

  // Fetch feedback tickets
  const fetchTicketsByProject = async (projectId: string): Promise<FeedbackTicket[]> => {
    const { data, error } = await supabase
      .from('feedback_tickets')
      .select(`
        *,
        contact:crm_contacts(name, email),
        feedback:feedback_entries(verbatim, type)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(ticket => ({
      ...ticket,
      status: ticket.status as 'open' | 'pending' | 'solved' | 'closed',
      priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent'
    }));
  };

  // Fetch feedback metrics
  const fetchMetricsByProject = async (
    projectId: string, 
    startDate: string, 
    endDate: string
  ): Promise<FeedbackMetrics[]> => {
    const { data, error } = await supabase
      .from('feedback_metrics_daily')
      .select('*')
      .eq('project_id', projectId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) throw error;
    return data;
  };

  // Submit feedback (public endpoint)
  const submitFeedback = useMutation({
    mutationFn: async (feedbackData: {
      project_key: string;
      module_key?: string;
      contact_id?: string;
      persona: 'gestor' | 'usuario_final' | 'parceiro';
      channel: 'inapp' | 'whatsapp' | 'email' | 'api';
      type: 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat' | 'ces' | 'pmf' | 'usability';
      score?: number;
      severity?: 'blocker' | 'high' | 'medium' | 'low' | 'idea';
      verbatim: string;
      context?: Record<string, any>;
      attachments?: string[];
    }) => {
      // Call the public edge function
      const response = await fetch(`https://itvruukwhgttnjpvghzq.supabase.co/functions/v1/feedback-collector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnJ1dWt3aGd0dG5qcHZnaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ4MjgsImV4cCI6MjA3MTcwMDgyOH0.NWcAv2VONoAOKiXGHBMZAB42_SCPaI8nTxFTXw6GTBM`
        },
        body: JSON.stringify(feedbackData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit feedback');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Nossa equipe irá analisá-lo em breve.",
      });
      queryClient.invalidateQueries({ queryKey: ['feedbackEntries'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar feedback",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update feedback entry (admin)
  const updateFeedbackEntry = useMutation({
    mutationFn: async ({ 
      feedbackId, 
      updates 
    }: { 
      feedbackId: string; 
      updates: Partial<FeedbackEntry> 
    }) => {
      const { data, error } = await supabase
        .from('feedback_entries')
        .update(updates)
        .eq('id', feedbackId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Feedback atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['feedbackEntries'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Create feedback ticket
  const createTicket = useMutation({
    mutationFn: async (ticketData: {
      project_id: string;
      feedback_id?: string;
      contact_id?: string;
      subject: string;
      description: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
    }) => {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Ticket criado",
        description: "O ticket foi criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['feedbackTickets'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update feedback ticket
  const updateTicket = useMutation({
    mutationFn: async ({ 
      ticketId, 
      updates 
    }: { 
      ticketId: string; 
      updates: Partial<FeedbackTicket> 
    }) => {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .update(updates)
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Ticket atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['feedbackTickets'] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar ticket",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    // Data
    feedbackEntries,
    feedbackLoading,
    feedbackError,

    // Fetch functions
    fetchModulesByProject,
    fetchTicketsByProject,
    fetchMetricsByProject,

    // Mutations
    submitFeedback,
    updateFeedbackEntry,
    createTicket,
    updateTicket,

    // Loading states
    isSubmitting: submitFeedback.isPending,
    isUpdatingFeedback: updateFeedbackEntry.isPending,
    isCreatingTicket: createTicket.isPending,
    isUpdatingTicket: updateTicket.isPending,
  };
};