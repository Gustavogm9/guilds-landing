-- Fix critical security vulnerabilities in RLS policies

-- 1. QUALIFICATION SUBMISSIONS - Restrict read access to authenticated users only
DROP POLICY IF EXISTS "Anyone can read qualification submissions" ON public.qualification_submissions;
CREATE POLICY "Only authenticated users can read qualification submissions" 
ON public.qualification_submissions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Keep public insert for forms to work
-- Update delete/update policies to require authentication
DROP POLICY IF EXISTS "Anyone can delete qualification submissions" ON public.qualification_submissions;
DROP POLICY IF EXISTS "Anyone can update qualification submissions" ON public.qualification_submissions;

CREATE POLICY "Only authenticated users can update qualification submissions" 
ON public.qualification_submissions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete qualification submissions" 
ON public.qualification_submissions 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- 2. NEWSLETTER SUBSCRIPTIONS - Restrict read access to authenticated users
DROP POLICY IF EXISTS "Anyone can view active subscriptions by email" ON public.newsletter_subscriptions;
CREATE POLICY "Only authenticated users can read newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. ADMINISTRATIVE TABLES - Restrict write operations to authenticated users only

-- Company Settings
DROP POLICY IF EXISTS "Anyone can insert company settings" ON public.company_settings;
DROP POLICY IF EXISTS "Anyone can update company settings" ON public.company_settings;

CREATE POLICY "Only authenticated users can insert company settings" 
ON public.company_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update company settings" 
ON public.company_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- SEO Settings
DROP POLICY IF EXISTS "Anyone can insert SEO settings" ON public.seo_settings;
DROP POLICY IF EXISTS "Anyone can update SEO settings" ON public.seo_settings;

CREATE POLICY "Only authenticated users can insert SEO settings" 
ON public.seo_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update SEO settings" 
ON public.seo_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Page SEO
DROP POLICY IF EXISTS "Anyone can insert page SEO" ON public.page_seo;
DROP POLICY IF EXISTS "Anyone can update page SEO" ON public.page_seo;
DROP POLICY IF EXISTS "Anyone can delete page SEO" ON public.page_seo;

CREATE POLICY "Only authenticated users can insert page SEO" 
ON public.page_seo 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update page SEO" 
ON public.page_seo 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete page SEO" 
ON public.page_seo 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Custom Tags
DROP POLICY IF EXISTS "Anyone can insert custom tags" ON public.custom_tags;
DROP POLICY IF EXISTS "Anyone can update custom tags" ON public.custom_tags;
DROP POLICY IF EXISTS "Anyone can delete custom tags" ON public.custom_tags;

CREATE POLICY "Only authenticated users can insert custom tags" 
ON public.custom_tags 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update custom tags" 
ON public.custom_tags 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete custom tags" 
ON public.custom_tags 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Contact Info
DROP POLICY IF EXISTS "Anyone can insert contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Anyone can update contact info" ON public.contact_info;
DROP POLICY IF EXISTS "Anyone can delete contact info" ON public.contact_info;

CREATE POLICY "Only authenticated users can insert contact info" 
ON public.contact_info 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update contact info" 
ON public.contact_info 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete contact info" 
ON public.contact_info 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Qualification Forms
DROP POLICY IF EXISTS "Anyone can insert qualification forms" ON public.qualification_forms;
DROP POLICY IF EXISTS "Anyone can update qualification forms" ON public.qualification_forms;
DROP POLICY IF EXISTS "Anyone can delete qualification forms" ON public.qualification_forms;

CREATE POLICY "Only authenticated users can insert qualification forms" 
ON public.qualification_forms 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update qualification forms" 
ON public.qualification_forms 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete qualification forms" 
ON public.qualification_forms 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Form Fields
DROP POLICY IF EXISTS "Anyone can insert form fields" ON public.form_fields;
DROP POLICY IF EXISTS "Anyone can update form fields" ON public.form_fields;
DROP POLICY IF EXISTS "Anyone can delete form fields" ON public.form_fields;

CREATE POLICY "Only authenticated users can insert form fields" 
ON public.form_fields 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update form fields" 
ON public.form_fields 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete form fields" 
ON public.form_fields 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Logos
DROP POLICY IF EXISTS "Anyone can insert logos" ON public.logos;
DROP POLICY IF EXISTS "Anyone can update logos" ON public.logos;
DROP POLICY IF EXISTS "Anyone can delete logos" ON public.logos;

CREATE POLICY "Only authenticated users can insert logos" 
ON public.logos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update logos" 
ON public.logos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete logos" 
ON public.logos 
FOR DELETE 
USING (auth.uid() IS NOT NULL);