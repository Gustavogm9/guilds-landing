-- Targeted security fix - address remaining data exposure issues
-- Only fix what's still showing as vulnerable in the security scan

-- 1. Newsletter Subscriptions - Critical fix for exposed emails/IPs
DROP POLICY IF EXISTS "Anyone can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Newsletter subscriptions are publicly readable" ON newsletter_subscriptions;
CREATE POLICY "Only authenticated users can read newsletter subscriptions"
ON newsletter_subscriptions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Newsletter Campaigns - New critical fix for exposed analytics
DROP POLICY IF EXISTS "Anyone can read newsletter campaigns" ON newsletter_campaigns;
DROP POLICY IF EXISTS "Newsletter campaigns are publicly readable" ON newsletter_campaigns;
-- Existing policies should remain (authenticated-only policies)

-- 3. Add rate limiting function for enhanced security
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    identifier text,
    max_requests integer DEFAULT 5,
    time_window interval DEFAULT '1 hour'::interval
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    request_count integer;
BEGIN
    -- Count recent submissions from this identifier across all public forms
    SELECT COUNT(*) INTO request_count
    FROM (
        SELECT created_at FROM newsletter_subscriptions 
        WHERE ip_address::text = identifier AND created_at > now() - time_window
        UNION ALL
        SELECT created_at FROM workshop_enrollments 
        WHERE ip_address::text = identifier AND created_at > now() - time_window  
        UNION ALL
        SELECT created_at FROM qualification_submissions 
        WHERE ip_address::text = identifier AND created_at > now() - time_window
        UNION ALL
        SELECT created_at FROM craft_partnership_inquiries 
        WHERE ip_address::text = identifier AND created_at > now() - time_window
    ) combined_requests;
    
    RETURN request_count < max_requests;
END;
$$;

-- 4. Add security event logging
CREATE TABLE IF NOT EXISTS public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    ip_address inet,
    user_agent text,
    details jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can read security events"
ON public.security_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow system to log security events"
ON public.security_events 
FOR INSERT 
WITH CHECK (true);