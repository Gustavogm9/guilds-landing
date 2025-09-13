import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PerformanceLog {
  id: string;
  operation_type: string;
  start_time: string;
  end_time?: string;
  duration_ms?: number;
  records_processed: number;
  success_count: number;
  error_count: number;
  status: 'running' | 'completed' | 'failed';
  metadata: any;
  created_at: string;
}

export interface DashboardSummary {
  total_projects: number;
  active_projects: number;
  new_projects_month: number;
  total_contacts: number;
  total_deals: number;
  new_contacts_month: number;
  pending_emails: number;
  pending_webhooks: number;
  failed_emails: number;
  avg_email_processing_time?: number;
  system_errors_today: number;
}

export interface ProjectStatistics {
  total_projects: number;
  draft_projects: number;
  active_projects: number;
  completed_projects: number;
  on_hold_projects: number;
  avg_progress: number;
  unique_clients: number;
  total_budget?: number;
  avg_budget?: number;
  projects_last_30_days: number;
  projects_last_7_days: number;
  last_updated: string;
}

export const usePerformanceMonitoring = () => {
  const queryClient = useQueryClient();

  // Fetch performance logs
  const { data: performanceLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['performance_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as PerformanceLog[];
    },
  });

  // Fetch dashboard summary
  const { data: dashboardSummary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboard_summary'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_dashboard_summary');
      
      if (error) throw error;
      return data[0] as DashboardSummary;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch project statistics
  const { data: projectStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['project_statistics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_project_statistics');
      
      if (error) throw error;
      return data[0] as ProjectStatistics;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Refresh project statistics manually
  const refreshProjectStats = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('refresh_project_statistics');
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Estatísticas atualizadas com sucesso');
      queryClient.invalidateQueries({ queryKey: ['project_statistics'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_summary'] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar estatísticas: ${error.message}`);
    },
  });

  // Clean old data manually
  const cleanupOldData = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('cleanup_old_data');
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Limpeza de dados executada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['performance_logs'] });
    },
    onError: (error: any) => {
      toast.error(`Erro na limpeza de dados: ${error.message}`);
    },
  });

  // Performance metrics calculation
  const getPerformanceMetrics = () => {
    if (!performanceLogs) return null;

    const last24Hours = performanceLogs.filter(
      log => new Date(log.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const emailBatches = last24Hours.filter(log => log.operation_type === 'email_batch');
    const webhookBatches = last24Hours.filter(log => log.operation_type === 'webhook_batch');

    return {
      totalOperations: last24Hours.length,
      emailBatches: emailBatches.length,
      webhookBatches: webhookBatches.length,
      avgEmailDuration: emailBatches.length > 0 
        ? emailBatches.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / emailBatches.length 
        : 0,
      avgWebhookDuration: webhookBatches.length > 0 
        ? webhookBatches.reduce((sum, log) => sum + (log.duration_ms || 0), 0) / webhookBatches.length 
        : 0,
      errorRate: last24Hours.length > 0 
        ? (last24Hours.filter(log => log.status === 'failed').length / last24Hours.length) * 100 
        : 0,
      successfulOperations: last24Hours.filter(log => log.status === 'completed').length,
      failedOperations: last24Hours.filter(log => log.status === 'failed').length,
    };
  };

  // System health score calculation
  const getSystemHealthScore = () => {
    const metrics = getPerformanceMetrics();
    if (!metrics || !dashboardSummary) return 100;

    let score = 100;

    // Deduct points for errors
    if (metrics.errorRate > 10) score -= 30;
    else if (metrics.errorRate > 5) score -= 15;
    else if (metrics.errorRate > 1) score -= 5;

    // Deduct points for pending operations
    const totalPending = dashboardSummary.pending_emails + dashboardSummary.pending_webhooks;
    if (totalPending > 100) score -= 20;
    else if (totalPending > 50) score -= 10;
    else if (totalPending > 10) score -= 5;

    // Deduct points for failed operations
    if (dashboardSummary.failed_emails > 10) score -= 15;
    else if (dashboardSummary.failed_emails > 5) score -= 8;
    else if (dashboardSummary.failed_emails > 0) score -= 3;

    // Deduct points for system errors
    if (dashboardSummary.system_errors_today > 5) score -= 20;
    else if (dashboardSummary.system_errors_today > 2) score -= 10;
    else if (dashboardSummary.system_errors_today > 0) score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  return {
    performanceLogs,
    dashboardSummary,
    projectStats,
    isLoading: isLoadingLogs || isLoadingSummary || isLoadingStats,
    refreshProjectStats,
    cleanupOldData,
    getPerformanceMetrics,
    getSystemHealthScore,
  };
};