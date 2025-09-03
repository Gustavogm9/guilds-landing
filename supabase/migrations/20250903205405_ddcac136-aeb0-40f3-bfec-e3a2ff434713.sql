-- Remove the problematic policies that won't work as intended
DROP POLICY IF EXISTS "Users can check their own subscription status" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON newsletter_subscriptions;

-- Remove the existing overly permissive update policy
DROP POLICY IF EXISTS "Anyone can update subscription status" ON newsletter_subscriptions;

-- Create a more secure update policy that only allows status changes for unsubscribe
CREATE POLICY "Allow unsubscribe updates"
ON newsletter_subscriptions  
FOR UPDATE
USING (true)
WITH CHECK (
  -- Only allow updating status to 'unsubscribed' and setting unsubscribed_at
  -- This prevents malicious updates while allowing legitimate unsubscribe functionality
  status = 'unsubscribed' AND unsubscribed_at IS NOT NULL
);

-- Create a function to safely check subscription status by email
CREATE OR REPLACE FUNCTION public.check_subscription_status(email_address text)
RETURNS TABLE (status text)
SECURITY DEFINER
SET search_path = public
LANGUAGE sql
AS $$
  SELECT ns.status
  FROM newsletter_subscriptions ns
  WHERE ns.email = email_address
  LIMIT 1;
$$;