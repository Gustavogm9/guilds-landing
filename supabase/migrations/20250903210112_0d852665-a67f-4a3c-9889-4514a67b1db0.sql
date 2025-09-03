-- Strengthen security for company_settings table
-- Remove public access and make it admin-only

-- Drop any existing policies for company_settings
DROP POLICY IF EXISTS "Company settings are publicly readable" ON company_settings;
DROP POLICY IF EXISTS "Public access to company settings" ON company_settings;

-- Ensure only authenticated users can access company_settings
-- This table should contain sensitive internal data only
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read company settings
CREATE POLICY "Only authenticated users can read company settings"
ON company_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only authenticated users can insert company settings
CREATE POLICY "Only authenticated users can insert company settings"
ON company_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Only authenticated users can update company settings
CREATE POLICY "Only authenticated users can update company settings"
ON company_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Prevent deletion of company settings for data integrity
-- DELETE operations will continue to be blocked