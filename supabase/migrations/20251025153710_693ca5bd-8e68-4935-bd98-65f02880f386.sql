-- Create RPC function to get ICP health statistics
CREATE OR REPLACE FUNCTION get_icp_health_stats()
RETURNS TABLE (
  incomplete_percent numeric,
  total_contacts bigint,
  incomplete_contacts bigint
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;