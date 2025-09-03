-- Add is_public column to contact_info table
ALTER TABLE public.contact_info 
ADD COLUMN is_public boolean NOT NULL DEFAULT false;

-- Update existing social media contacts to be public (these are typically safe to expose)
UPDATE public.contact_info 
SET is_public = true 
WHERE type = 'social' AND is_active = true;

-- Set primary email and phone as public (business contacts should be public)
-- But first let's be more selective - only set primary business contacts as public
UPDATE public.contact_info 
SET is_public = true 
WHERE type IN ('email', 'phone') 
  AND is_primary = true 
  AND is_active = true
  AND (
    value LIKE '%@guilds.com.br' 
    OR label ILIKE '%comercial%' 
    OR label ILIKE '%principal%' 
    OR label ILIKE '%contato%'
  );

-- Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Contact info is publicly readable" ON public.contact_info;

-- Create new restrictive policy for public access - only public contacts
CREATE POLICY "Public contacts are publicly readable" 
ON public.contact_info 
FOR SELECT 
USING (is_active = true AND is_public = true);

-- Keep the existing authenticated user policies unchanged
-- These already exist:
-- "Only authenticated users can insert contact info"
-- "Only authenticated users can update contact info" 
-- "Only authenticated users can delete contact info"

-- Add index for better performance on public queries
CREATE INDEX IF NOT EXISTS idx_contact_info_public_active 
ON public.contact_info(is_public, is_active) 
WHERE is_public = true AND is_active = true;