-- Drop the overly permissive public access policy for company_settings
DROP POLICY IF EXISTS "Company settings are publicly readable" ON public.company_settings;

-- Create new restrictive policy - only authenticated users can read sensitive company settings
CREATE POLICY "Only authenticated users can read company settings" 
ON public.company_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create a view for safe public company information
CREATE OR REPLACE VIEW public.public_company_info AS
SELECT 
  company_name,
  brand_primary_color,
  brand_accent_color,
  business_hours,
  social_media
FROM public.company_settings;

-- Grant public access to the safe view
GRANT SELECT ON public.public_company_info TO anon;
GRANT SELECT ON public.public_company_info TO authenticated;

-- Create a function to get safe public company info (for better performance and security)
CREATE OR REPLACE FUNCTION public.get_public_company_info()
RETURNS TABLE (
  company_name text,
  brand_primary_color text,
  brand_accent_color text,  
  business_hours jsonb,
  social_media jsonb
) 
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    company_name,
    brand_primary_color,
    brand_accent_color,
    business_hours,
    social_media
  FROM company_settings
  LIMIT 1;
$$;