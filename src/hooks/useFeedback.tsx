import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

const log = logger.scope('Feedback');

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
  const { toast } = useToast();

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
  module: feedback_modules(name, key),
    contact: crm_contacts(name, email)
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
      contact: crm_contacts(name, email),
        feedback: feedback_entries(verbatim, type)
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
      // Call the public edge function using Supabase client
      const { data, error } = await supabase.functions.invoke('feedback-collector', {
        body: feedbackData
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit feedback');
      }

      return data;
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
          module: feedback_modules(name, key),
            contact: crm_contacts(name, email)
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
      log.error('Error fetching all feedback', { metadata: { error } });
      throw error;
    }
  };

  const fetchAllTickets = async (): Promise<FeedbackTicket[]> => {
    try {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .select(`
              *,
              contact: crm_contacts(name, email),
                feedback: feedback_entries(verbatim, type)
                  `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(ticket => ({
        ...ticket,
        status: ticket.status as 'open' | 'pending' | 'solved' | 'closed',
        priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent'
      }));
    } catch (error) {
      log.error('Error fetching all tickets', { metadata: { error } });
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
      log.error('Error updating feedback status', { metadata: { error } });
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
      log.error('Error updating ticket status', { metadata: { error } });
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
      log.error('Error fetching feedback metrics', { metadata: { error } });
      throw error;
    }
  };

  const getTicketMetrics = async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('feedback_tickets')
        .select('*, created_at, first_response_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      const total = data?.length || 0;
      const open = data?.filter(t => t.status === 'open').length || 0;
      const resolved = data?.filter(t => t.status === 'solved' || t.status === 'closed').length || 0;
      const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

      // Calculate real average response time in hours
      const ticketsWithResponse = data?.filter(t => t.first_response_at && t.created_at) || [];
      let avgResponseTime = 0;

      if (ticketsWithResponse.length > 0) {
        const totalHours = ticketsWithResponse.reduce((sum, t) => {
          const created = new Date(t.created_at).getTime();
          const responded = new Date(t.first_response_at).getTime();
          const hours = (responded - created) / (1000 * 60 * 60); // Convert ms to hours
          return sum + hours;
        }, 0);
        avgResponseTime = Math.round(totalHours / ticketsWithResponse.length * 10) / 10; // Round to 1 decimal
      }

      return {
        total,
        open,
        resolved,
        resolutionRate,
        avgResponseTime
      };
    } catch (error) {
      log.error('Error fetching ticket metrics', { metadata: { error } });
      throw error;
    }
  };

  // GAP 4 FIX: Process high NPS feedback and create upsell opportunities
  const processHighNPSForUpsell = async (feedbackId: string): Promise<boolean> => {
    try {
      // Get the feedback entry
      const { data: feedback, error: feedbackError } = await supabase
        .from('feedback_entries')
        .select('*, contact:crm_contacts(id, name, email)')
        .eq('id', feedbackId)
        .single();

      if (feedbackError || !feedback) {
        log.error('Feedback not found', { metadata: { feedbackId } });
        return false;
      }

      // Only process NPS type with score >= 9 (promoters)
      if (feedback.type !== 'nps' || !feedback.score || feedback.score < 9) {
        log.info('Feedback not eligible for upsell', {
          metadata: { type: feedback.type, score: feedback.score }
        });
        return false;
      }

      // Check if contact exists
      const contact = feedback.contact as any;
      if (!contact?.id) {
        log.warn('No contact linked to feedback', { metadata: { feedbackId } });
        return false;
      }

      // Get default pipeline for upsell deals
      const { data: pipeline } = await supabase
        .from('crm_pipelines')
        .select('id')
        .eq('is_default', true)
        .eq('is_active', true)
        .single();

      if (!pipeline) {
        log.error('No default pipeline found');
        return false;
      }

      // Get first stage
      const { data: firstStage } = await supabase
        .from('crm_stages')
        .select('id')
        .eq('pipeline_id', pipeline.id)
        .eq('is_active', true)
        .order('display_order')
        .limit(1)
        .single();

      if (!firstStage) {
        log.error('No stage found in pipeline');
        return false;
      }

      // Create upsell deal
      const { error: dealError } = await supabase
        .from('crm_deals')
        .insert({
          pipeline_id: pipeline.id,
          stage_id: firstStage.id,
          contact_id: contact.id,
          title: `Upsell - NPS Promotor (${contact.name || contact.email})`,
          description: `Cliente deu NPS ${feedback.score}. Oportunidade de upsell/cross-sell. Feedback: "${feedback.verbatim?.substring(0, 200)}"`,
          probability: 70,
          currency: 'BRL',
          source: 'nps_promoter',
          tags: ['nps-upsell', 'promotor'],
          is_active: true,
          custom_fields: {
            feedback_id: feedbackId,
            nps_score: feedback.score
          }
        } as any);

      if (dealError) {
        log.error('Error creating upsell deal', { metadata: { error: dealError } });
        return false;
      }

      // Mark feedback as processed
      await supabase
        .from('feedback_entries')
        .update({
          status: 'triaged',
          resolution_note: 'Oportunidade de upsell criada no CRM automaticamente.'
        })
        .eq('id', feedbackId);

      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
      queryClient.invalidateQueries({ queryKey: ['feedbackEntries'] });

      toast({
        title: '🎯 Oportunidade criada!',
        description: `Deal de upsell criado para ${contact.name || contact.email}.`,
      });

      return true;
    } catch (error) {
      log.error('Error processing NPS for upsell', { metadata: { error } });
      return false;
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
    processHighNPSForUpsell,

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