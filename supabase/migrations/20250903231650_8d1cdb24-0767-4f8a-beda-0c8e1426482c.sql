-- Enhanced security for public forms while maintaining business functionality
-- This addresses the security scan findings without breaking enrollment functionality

-- 1. Add enhanced validation trigger for workshop enrollments
CREATE OR REPLACE FUNCTION validate_workshop_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate email format
  IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  -- Sanitize inputs - prevent potential XSS
  NEW.name = TRIM(NEW.name);
  NEW.email = LOWER(TRIM(NEW.email));
  NEW.company = CASE WHEN NEW.company IS NOT NULL THEN TRIM(NEW.company) ELSE NULL END;
  NEW.phone = CASE WHEN NEW.phone IS NOT NULL THEN TRIM(NEW.phone) ELSE NULL END;
  NEW.expectations = CASE WHEN NEW.expectations IS NOT NULL THEN TRIM(NEW.expectations) ELSE NULL END;
  
  -- Log security event for monitoring
  INSERT INTO security_events (event_type, details, ip_address, user_agent)
  VALUES (
    'workshop_enrollment_attempt',
    jsonb_build_object(
      'email', NEW.email,
      'workshop_id', NEW.workshop_id,
      'source_page', NEW.source_page,
      'utm_source', NEW.utm_source
    ),
    NEW.ip_address,
    NEW.user_agent
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_workshop_enrollment_trigger ON workshop_enrollments;
CREATE TRIGGER validate_workshop_enrollment_trigger
  BEFORE INSERT ON workshop_enrollments
  FOR EACH ROW EXECUTE FUNCTION validate_workshop_enrollment();

-- 2. Add data retention policy - automatically clean old pending enrollments
CREATE OR REPLACE FUNCTION cleanup_old_enrollments()
RETURNS void AS $$
BEGIN
  -- Delete pending enrollments older than 6 months
  DELETE FROM workshop_enrollments 
  WHERE status = 'pending' 
    AND created_at < now() - interval '6 months';
  
  -- Log cleanup activity
  INSERT INTO security_events (event_type, details)
  VALUES ('enrollment_cleanup', jsonb_build_object('action', 'automated_cleanup'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Enhanced rate limiting specifically for workshop enrollments
CREATE OR REPLACE FUNCTION check_workshop_enrollment_limit(email_param text, ip_param inet)
RETURNS boolean AS $$
DECLARE
  email_count integer := 0;
  ip_count integer := 0;
BEGIN
  -- Check email-based rate limit (max 3 enrollments per email per day)
  SELECT COUNT(*) INTO email_count
  FROM workshop_enrollments 
  WHERE email = email_param 
    AND created_at > now() - interval '24 hours';
  
  -- Check IP-based rate limit (max 5 enrollments per IP per hour)  
  SELECT COUNT(*) INTO ip_count
  FROM workshop_enrollments 
  WHERE ip_address = ip_param 
    AND created_at > now() - interval '1 hour';
    
  -- Return false if limits exceeded
  IF email_count >= 3 OR ip_count >= 5 THEN
    -- Log potential abuse
    INSERT INTO security_events (event_type, details, ip_address)
    VALUES (
      'enrollment_rate_limit_exceeded',
      jsonb_build_object(
        'email_count', email_count,
        'ip_count', ip_count,
        'email', email_param
      ),
      ip_param
    );
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Update RLS policy to include rate limiting check
DROP POLICY IF EXISTS "Anyone can enroll in workshops" ON workshop_enrollments;
CREATE POLICY "Protected workshop enrollment"
ON workshop_enrollments 
FOR INSERT 
WITH CHECK (
  -- Validate workshop exists and is active
  EXISTS (
    SELECT 1 FROM workshops 
    WHERE id = workshop_id AND is_active = true
  )
  AND
  -- Check rate limits
  check_workshop_enrollment_limit(email, ip_address)
);

-- 5. Add honeypot detection capability
ALTER TABLE workshop_enrollments ADD COLUMN IF NOT EXISTS honeypot_field text DEFAULT NULL;

-- Add honeypot validation to the trigger
CREATE OR REPLACE FUNCTION validate_workshop_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  -- Honeypot field should always be empty (bots often fill all fields)
  IF NEW.honeypot_field IS NOT NULL AND LENGTH(TRIM(NEW.honeypot_field)) > 0 THEN
    -- Log potential bot activity
    INSERT INTO security_events (event_type, details, ip_address, user_agent)
    VALUES (
      'honeypot_triggered',
      jsonb_build_object('honeypot_value', NEW.honeypot_field),
      NEW.ip_address,
      NEW.user_agent
    );
    RAISE EXCEPTION 'Invalid form submission detected';
  END IF;
  
  -- Clear honeypot field before saving
  NEW.honeypot_field = NULL;
  
  -- Validate email format
  IF NEW.email IS NULL OR NEW.email !~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(TRIM(NEW.name)) < 2 THEN
    RAISE EXCEPTION 'Name must be at least 2 characters';
  END IF;
  
  -- Sanitize inputs
  NEW.name = TRIM(NEW.name);
  NEW.email = LOWER(TRIM(NEW.email));
  NEW.company = CASE WHEN NEW.company IS NOT NULL THEN TRIM(NEW.company) ELSE NULL END;
  NEW.phone = CASE WHEN NEW.phone IS NOT NULL THEN TRIM(NEW.phone) ELSE NULL END;
  NEW.expectations = CASE WHEN NEW.expectations IS NOT NULL THEN TRIM(NEW.expectations) ELSE NULL END;
  
  -- Log security event
  INSERT INTO security_events (event_type, details, ip_address, user_agent)
  VALUES (
    'workshop_enrollment_attempt',
    jsonb_build_object(
      'email', NEW.email,
      'workshop_id', NEW.workshop_id,
      'source_page', NEW.source_page,
      'utm_source', NEW.utm_source
    ),
    NEW.ip_address,
    NEW.user_agent
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;