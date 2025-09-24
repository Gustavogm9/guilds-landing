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

  // Admin functions
  const fetchAllFeedback = async (): Promise<FeedbackEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_entries')
        .select(`
          *,
          module:feedback_modules(name, key),
          contact:crm_contacts(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(entry => ({
        ...entry,
        persona: entry.persona as 'gestor' | 'usuario_final' | 'parceiro',
        channel: entry.channel as 'inapp' | 'whatsapp' | 'email' | 'import' | 'api',
        type: entry.type as 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat' | 'ces' | 'pmf' | 'usability',
        severity: entry.severity as 'blocker' | 'high' | 'medium' | 'low' | 'idea',
        status: entry.status as 'new' | 'triaged' | 'in_backlog' | 'in_progress' | 'released' | 'wont_fix',
        attachments: Array.isArray(entry.attachments) ? entry.attachments : JSON.parse(entry.attachments as string || '[]'),
        context: typeof entry.context === 'object' ? entry.context : JSON.parse(entry.context as string || '{}'),
        ip_address: entry.ip_address as string || '',
        user_agent: entry.user_agent as string || ''
      })) as FeedbackEntry[];
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      throw error;
    }
  };

  const fetchAllTickets = async (): Promise<FeedbackTicket[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .select(`
          *,
          contact:crm_contacts(name, email),
          feedback:feedback_entries(verbatim, type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as 'open' | 'pending' | 'solved' | 'closed',
        priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent'
      }));
    } catch (error) {
      console.error('Error fetching all tickets:', error);
      throw error;
    }
  };

  const updateFeedbackStatus = async (
    feedbackId: string, 
    status: FeedbackEntry['status']
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('feedback_entries')
        .update({ status })
        .eq('id', feedbackId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['feedbackEntries'] });
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  };

  const updateTicketStatus = async (
    ticketId: string, 
    status: FeedbackTicket['status']
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('feedback_tickets')
        .update({ status })
        .eq('id', ticketId);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['feedbackTickets'] });
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  };

  const getFeedbackMetrics = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback_entries')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const total = data?.length || 0;
      const bugs = data?.filter(e => e.type === 'bug').length || 0;
      const ideas = data?.filter(e => e.type === 'ideia').length || 0;
      const npsEntries = data?.filter(e => e.type === 'nps' && e.score) || [];
      const avgNPS = npsEntries.length > 0 
        ? npsEntries.reduce((acc, e) => acc + (e.score || 0), 0) / npsEntries.length
        : 0;

      const distribution = data?.reduce((acc, entry) => {
        acc[entry.type] = (acc[entry.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const statusDistribution = data?.reduce((acc, entry) => {
        acc[entry.status] = (acc[entry.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return {
        total,
        bugs,
        ideas,
        avgNPS,
        distribution,
        statusDistribution,
        highPriority: data?.filter(e => e.severity === 'blocker' || e.severity === 'high').length || 0,
        mediumPriority: data?.filter(e => e.severity === 'medium').length || 0,
        lowPriority: data?.filter(e => e.severity === 'low' || e.severity === 'idea').length || 0,
        avgRiceScore: data?.filter(e => e.rice_score)
          .reduce((acc, e, _, arr) => acc + (e.rice_score || 0) / arr.length, 0) || 0
      };
    } catch (error) {
      console.error('Error fetching feedback metrics:', error);
      throw error;
    }
  };

  const getTicketMetrics = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const total = data?.length || 0;
      const open = data?.filter(t => t.status === 'open').length || 0;
      const resolved = data?.filter(t => t.status === 'solved' || t.status === 'closed').length || 0;
      const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

      return {
        total,
        open,
        resolved,
        resolutionRate,
        avgResponseTime: 24 // Placeholder - would calculate from first_response_at
      };
    } catch (error) {
      console.error('Error fetching ticket metrics:', error);
      throw error;
    }
  };

  return {
    // Data
    feedbackEntries,
    feedbackLoading,
    feedbackError,

    // Fetch functions
    fetchModulesByProject,
    fetchTicketsByProject,
    fetchMetricsByProject,
    fetchAllFeedback,
    fetchAllTickets,

    // Mutations
    submitFeedback,
    updateFeedbackEntry,
    createTicket,
    updateTicket,

    // Admin functions
    updateFeedbackStatus,
    updateTicketStatus,

    // Metrics
    getFeedbackMetrics,
    getTicketMetrics,

    // Loading states
    isSubmitting: submitFeedback.isPending,
    isUpdatingFeedback: updateFeedbackEntry.isPending,
    isCreatingTicket: createTicket.isPending,
    isUpdatingTicket: updateTicket.isPending,
  };
};