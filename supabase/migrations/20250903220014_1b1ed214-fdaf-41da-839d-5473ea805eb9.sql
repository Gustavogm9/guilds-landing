-- Add the missing log_security_event function
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