-- Complete security fix - implement all critical data protection measures
-- Phase 1: Fix all publicly readable sensitive tables

-- 1. Newsletter Subscriptions - Restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Newsletter subscriptions are publicly readable" ON newsletter_subscriptions;
CREATE POLICY "Only authenticated users can read newsletter subscriptions"
ON newsletter_subscriptions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 2. Workshop Enrollments - Already has correct policy, but ensure it's properly applied
DROP POLICY IF EXISTS "Anyone can view workshop enrollments" ON workshop_enrollments;
CREATE POLICY "Only authenticated users can read workshop enrollments"
ON workshop_enrollments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. Qualification Submissions - Already has correct policy, verify it exists
DROP POLICY IF EXISTS "Anyone can view qualification submissions" ON qualification_submissions;
CREATE POLICY "Only authenticated users can read qualification submissions"
ON qualification_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 4. Partnership Inquiries - Already has correct policy, verify it exists  
DROP POLICY IF EXISTS "Anyone can view partnership inquiries" ON craft_partnership_inquiries;
CREATE POLICY "Only authenticated users can read partnership inquiries"
ON craft_partnership_inquiries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 5. Newsletter Campaigns - NEW CRITICAL FIX
DROP POLICY IF EXISTS "Anyone can read newsletter campaigns" ON newsletter_campaigns;
DROP POLICY IF EXISTS "Newsletter campaigns are publicly readable" ON newsletter_campaigns;
-- Keep existing authenticated-only policies intact, just ensure no public access exists

-- Phase 2: Add rate limiting functions for form submissions
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
    -- Count recent submissions from this identifier
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

-- Phase 3: Add security event logging table
CREATE TABLE public.security_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    ip_address inet,
    user_agent text,
    details jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on security events
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read security events
CREATE POLICY "Only authenticated users can read security events"
ON public.security_events 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow system to insert security events
CREATE POLICY "Allow system to log security events"
ON public.security_events 
FOR INSERT 
WITH CHECK (true);

-- Phase 4: Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    event_type text,
    user_id uuid DEFAULT auth.uid(),
    ip_address inet DEFAULT null,
    user_agent text DEFAULT null,
    details jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.security_events (event_type, user_id, ip_address, user_agent, details)
    VALUES (event_type, user_id, ip_address, user_agent, details);
END;
$$;