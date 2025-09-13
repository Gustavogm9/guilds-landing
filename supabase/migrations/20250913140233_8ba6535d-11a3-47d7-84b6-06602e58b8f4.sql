-- Phase 5: Performance & Production
-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create performance monitoring table
CREATE TABLE public.system_performance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'email_batch', 'webhook_batch', 'crm_sync', 'project_update'
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  records_processed INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'failed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.system_performance_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only authenticated users can read performance logs"
ON public.system_performance_logs
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert performance logs"
ON public.system_performance_logs
FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_system_performance_logs_operation_type ON public.system_performance_logs(operation_type);
CREATE INDEX idx_system_performance_logs_created_at ON public.system_performance_logs(created_at);
CREATE INDEX idx_system_performance_logs_status ON public.system_performance_logs(status);

-- Function to log system operations
CREATE OR REPLACE FUNCTION public.log_system_operation(
  p_operation_type TEXT,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.system_performance_logs (operation_type, metadata)
  VALUES (p_operation_type, p_metadata)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Function to complete system operation
CREATE OR REPLACE FUNCTION public.complete_system_operation(
  p_log_id UUID,
  p_records_processed INTEGER DEFAULT 0,
  p_success_count INTEGER DEFAULT 0,
  p_error_count INTEGER DEFAULT 0,
  p_status TEXT DEFAULT 'completed'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.system_performance_logs
  SET 
    end_time = now(),
    duration_ms = EXTRACT(EPOCH FROM (now() - start_time)) * 1000,
    records_processed = p_records_processed,
    success_count = p_success_count,
    error_count = p_error_count,
    status = p_status
  WHERE id = p_log_id;
END;
$$;

-- Create automated cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_old_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log cleanup start
  INSERT INTO public.system_performance_logs (operation_type, metadata)
  VALUES ('data_cleanup', jsonb_build_object('action', 'automated_cleanup'));

  -- Clean old performance logs (older than 3 months)
  DELETE FROM public.system_performance_logs 
  WHERE created_at < now() - interval '3 months';

  -- Clean old sent notifications (older than 6 months)
  DELETE FROM public.project_email_notifications 
  WHERE status = 'sent' 
    AND sent_at < now() - interval '6 months';

  -- Clean old successful webhook events (older than 3 months)
  DELETE FROM public.project_webhook_events 
  WHERE status = 'sent' 
    AND sent_at < now() - interval '3 months';

  -- Clean old security events (older than 1 year)
  DELETE FROM public.security_events 
  WHERE created_at < now() - interval '1 year';
END;
$$;

-- Create project statistics materialized view for performance
CREATE MATERIALIZED VIEW public.project_statistics AS
SELECT 
  COUNT(*) as total_projects,
  COUNT(*) FILTER (WHERE status = 'draft') as draft_projects,
  COUNT(*) FILTER (WHERE status = 'in_development') as active_projects,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_projects,
  COUNT(*) FILTER (WHERE status = 'on_hold') as on_hold_projects,
  AVG(progress_percentage) as avg_progress,
  COUNT(DISTINCT client_id) as unique_clients,
  SUM(budget_value) FILTER (WHERE budget_value IS NOT NULL) as total_budget,
  AVG(budget_value) FILTER (WHERE budget_value IS NOT NULL) as avg_budget,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') as projects_last_30_days,
  COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') as projects_last_7_days,
  now() as last_updated
FROM public.projects
WHERE is_active = true;

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_project_statistics_singleton ON public.project_statistics ((1));

-- Function to refresh project statistics
CREATE OR REPLACE FUNCTION public.refresh_project_statistics()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.project_statistics;
END;
$$;

-- Create notification queue optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_email_notifications_processing 
ON public.project_email_notifications(status, retry_count, created_at)
WHERE status = 'pending';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_webhook_events_processing 
ON public.project_webhook_events(status, retry_count, created_at)
WHERE status = 'pending';

-- Schedule automated tasks using pg_cron
-- Process email notifications every 5 minutes
SELECT cron.schedule(
  'process-email-notifications',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://itvruukwhgttnjpvghzq.supabase.co/functions/v1/project-email-service',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnJ1dWt3aGd0dG5qcHZnaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ4MjgsImV4cCI6MjA3MTcwMDgyOH0.NWcAv2VONoAOKiXGHBMZAB42_SCPaI8nTxFTXw6GTBM"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);

-- Process webhook events every 10 minutes
SELECT cron.schedule(
  'process-webhook-events',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://itvruukwhgttnjpvghzq.supabase.co/functions/v1/project-webhooks',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0dnJ1dWt3aGd0dG5qcHZnaHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjQ4MjgsImV4cCI6MjA3MTcwMDgyOH0.NWcAv2VONoAOKiXGHBMZAB42_SCPaI8nTxFTXw6GTBM"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);

-- Refresh project statistics every hour
SELECT cron.schedule(
  'refresh-project-stats',
  '0 * * * *',
  'SELECT public.refresh_project_statistics();'
);

-- Clean old data daily at 2 AM
SELECT cron.schedule(
  'cleanup-old-data',
  '0 2 * * *',
  'SELECT public.cleanup_old_data();'
);

-- Create summary view for admin dashboard performance
CREATE OR REPLACE VIEW public.admin_dashboard_summary AS
SELECT 
  -- Project metrics
  (SELECT COUNT(*) FROM public.projects WHERE is_active = true) as total_projects,
  (SELECT COUNT(*) FROM public.projects WHERE status = 'in_development') as active_projects,
  (SELECT COUNT(*) FROM public.projects WHERE created_at >= now() - interval '30 days') as new_projects_month,
  
  -- CRM metrics
  (SELECT COUNT(*) FROM public.crm_contacts WHERE is_active = true) as total_contacts,
  (SELECT COUNT(*) FROM public.crm_deals WHERE is_active = true) as total_deals,
  (SELECT COUNT(*) FROM public.crm_contacts WHERE created_at >= now() - interval '30 days') as new_contacts_month,
  
  -- Notification metrics
  (SELECT COUNT(*) FROM public.project_email_notifications WHERE status = 'pending') as pending_emails,
  (SELECT COUNT(*) FROM public.project_webhook_events WHERE status = 'pending') as pending_webhooks,
  (SELECT COUNT(*) FROM public.project_email_notifications WHERE status = 'failed' AND retry_count >= 3) as failed_emails,
  
  -- System performance
  (SELECT AVG(duration_ms) FROM public.system_performance_logs WHERE operation_type = 'email_batch' AND created_at >= now() - interval '24 hours') as avg_email_processing_time,
  (SELECT COUNT(*) FROM public.system_performance_logs WHERE status = 'failed' AND created_at >= now() - interval '24 hours') as system_errors_today;

-- Grant necessary permissions
GRANT SELECT ON public.admin_dashboard_summary TO anon, authenticated;
GRANT SELECT ON public.project_statistics TO anon, authenticated;
GRANT SELECT ON public.system_performance_logs TO authenticated;