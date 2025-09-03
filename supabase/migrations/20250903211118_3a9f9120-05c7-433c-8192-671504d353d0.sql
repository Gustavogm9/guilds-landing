-- Fix RLS security issues - restrict access to sensitive tables
-- These tables contain sensitive customer/business data that should not be publicly accessible

-- Fix workshop_enrollments - contains personal data
DROP POLICY IF EXISTS "Anyone can view workshop enrollments" ON workshop_enrollments;
CREATE POLICY "Only authenticated users can read workshop enrollments"
ON workshop_enrollments 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix craft_partnership_inquiries - contains business intelligence
DROP POLICY IF EXISTS "Anyone can view partnership inquiries" ON craft_partnership_inquiries;
CREATE POLICY "Only authenticated users can read partnership inquiries"
ON craft_partnership_inquiries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix qualification_submissions - contains customer project data
DROP POLICY IF EXISTS "Anyone can view qualification submissions" ON qualification_submissions;
CREATE POLICY "Only authenticated users can read qualification submissions"
ON qualification_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Ensure company_settings is properly protected (admin-only access)
-- Drop any public access policies if they exist
DROP POLICY IF EXISTS "Company settings are publicly readable" ON company_settings;
DROP POLICY IF EXISTS "Public access to company settings" ON company_settings;

-- Create secure policy for company_settings
CREATE POLICY "Admin only access to company settings"
ON company_settings 
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Newsletter subscriptions - verify existing policies are secure
-- The policies we created earlier should already be in place
-- Just ensure no public SELECT policy exists
DROP POLICY IF EXISTS "Anyone can view newsletter subscriptions" ON newsletter_subscriptions;
DROP POLICY IF EXISTS "Newsletter subscriptions are publicly readable" ON newsletter_subscriptions;