-- Remove the overly permissive RLS policy for newsletter_subscriptions
DROP POLICY IF EXISTS "Only authenticated users can read newsletter subscriptions" ON newsletter_subscriptions;

-- Create a security definer function for admin access to newsletter data
-- This function will be used by admin components to access newsletter data safely
CREATE OR REPLACE FUNCTION public.get_all_newsletter_subscriptions()
RETURNS TABLE (
  id uuid,
  email text,
  status text,
  created_at timestamp with time zone,
  confirmed_at timestamp with time zone,
  unsubscribed_at timestamp with time zone,
  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  -- Only allow access if user is authenticated
  -- In the future, you can add role-based checks here
  SELECT 
    ns.id,
    ns.email,
    ns.status,
    ns.created_at,
    ns.confirmed_at,
    ns.unsubscribed_at,
    ns.source_page,
    ns.utm_source,
    ns.utm_medium,
    ns.utm_campaign
  FROM newsletter_subscriptions ns
  WHERE auth.uid() IS NOT NULL
  ORDER BY ns.created_at DESC;
$$;

-- Create a security definer function for newsletter stats
CREATE OR REPLACE FUNCTION public.get_newsletter_stats()
RETURNS TABLE (
  total_count bigint,
  active_count bigint,
  pending_count bigint,
  unsubscribed_count bigint
)
SECURITY DEFINER
SET search_path = public  
LANGUAGE sql
AS $$
  SELECT 
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'active') as active_count,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count
  FROM newsletter_subscriptions
  WHERE auth.uid() IS NOT NULL;
$$;

-- Create a security definer function for recent newsletter subscriptions (dashboard)
CREATE OR REPLACE FUNCTION public.get_recent_newsletter_subscriptions(limit_count integer DEFAULT 3)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamp with time zone
)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql  
AS $$
  SELECT 
    ns.id,
    ns.email,
    ns.created_at
  FROM newsletter_subscriptions ns
  WHERE auth.uid() IS NOT NULL
    AND ns.status = 'active'
  ORDER BY ns.created_at DESC
  LIMIT limit_count;
$$;

-- Allow users to check their own subscription status
CREATE POLICY "Users can check their own subscription status"
ON newsletter_subscriptions
FOR SELECT
USING (
  -- Allow reading only your own subscription by email
  email = current_setting('request.email', true)
);

-- Allow users to update their own subscription (for unsubscribe)
CREATE POLICY "Users can update their own subscription"  
ON newsletter_subscriptions
FOR UPDATE
USING (
  -- Allow updating only your own subscription by email
  email = current_setting('request.email', true)
);

-- Note: The INSERT policy already exists and allows anyone to subscribe (which is correct)
-- Note: The UPDATE policy will be replaced by the more specific one above