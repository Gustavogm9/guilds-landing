-- Fix newsletter campaigns security vulnerability

-- Drop the overly permissive policy that allows anyone to manage campaigns
DROP POLICY IF EXISTS "Anyone can manage newsletter campaigns" ON public.newsletter_campaigns;

-- Create secure policies that require authentication for all operations
CREATE POLICY "Only authenticated users can read newsletter campaigns" 
ON public.newsletter_campaigns 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can create newsletter campaigns" 
ON public.newsletter_campaigns 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update newsletter campaigns" 
ON public.newsletter_campaigns 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete newsletter campaigns" 
ON public.newsletter_campaigns 
FOR DELETE 
USING (auth.uid() IS NOT NULL);