-- Fix project_statistics materialized view to support concurrent refresh
-- Drop existing materialized view
DROP MATERIALIZED VIEW IF EXISTS public.project_statistics;

-- Recreate with a unique identifier column
CREATE MATERIALIZED VIEW public.project_statistics AS
SELECT 
  1 as stats_id, -- Unique identifier for the single row of stats
  COUNT(*) FILTER (WHERE p.is_active = true) as total_projects,
  COUNT(*) FILTER (WHERE p.status = 'draft') as draft_projects,
  COUNT(*) FILTER (WHERE p.status = 'in_development') as active_projects,
  COUNT(*) FILTER (WHERE p.status = 'completed') as completed_projects,
  COUNT(*) FILTER (WHERE p.status = 'on_hold') as on_hold_projects,
  COALESCE(AVG(p.progress_percentage) FILTER (WHERE p.is_active = true), 0) as avg_progress,
  COUNT(DISTINCT p.client_id) FILTER (WHERE p.is_active = true) as unique_clients,
  COALESCE(SUM(p.budget_value) FILTER (WHERE p.is_active = true), 0) as total_budget,
  COALESCE(AVG(p.budget_value) FILTER (WHERE p.is_active = true), 0) as avg_budget,
  COUNT(*) FILTER (WHERE p.created_at >= now() - interval '30 days') as projects_last_30_days,
  COUNT(*) FILTER (WHERE p.created_at >= now() - interval '7 days') as projects_last_7_days,
  now() as last_updated
FROM public.projects p;

-- Create unique index to enable concurrent refresh
CREATE UNIQUE INDEX project_statistics_stats_id_idx ON public.project_statistics (stats_id);

-- Update the refresh function (already exists, just ensuring it works)
CREATE OR REPLACE FUNCTION public.refresh_project_statistics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.project_statistics;
END;
$$;