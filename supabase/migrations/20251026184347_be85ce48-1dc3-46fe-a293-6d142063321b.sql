-- Fix get_icp_health_stats() to prevent search_path hijacking
CREATE OR REPLACE FUNCTION public.get_icp_health_stats()
RETURNS TABLE (
  incomplete_percent NUMERIC,
  total_contacts BIGINT,
  incomplete_contacts BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(
      COUNT(*) FILTER (WHERE icp_score IS NULL OR icp_score < 50) * 100.0 / NULLIF(COUNT(*), 0),
      1
    ) as incomplete_percent,
    COUNT(*) as total_contacts,
    COUNT(*) FILTER (WHERE icp_score IS NULL OR icp_score < 50) as incomplete_contacts
  FROM crm_contacts
  WHERE is_active = true;
END;
$$;