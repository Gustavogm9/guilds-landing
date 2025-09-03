-- Remove the potentially unsafe view and function
DROP VIEW IF EXISTS public.public_company_info;
DROP FUNCTION IF EXISTS public.get_public_company_info();

-- Create a new table specifically for public company information that admins can manage
CREATE TABLE IF NOT EXISTS public.public_company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL DEFAULT 'Guilds',
  brand_primary_color TEXT NOT NULL DEFAULT 'hsl(240, 85%, 55%)',
  brand_accent_color TEXT NOT NULL DEFAULT 'hsl(165, 85%, 45%)',
  business_hours JSONB DEFAULT '{}',
  social_media JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.public_company_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (safe since this table only contains non-sensitive data)
CREATE POLICY "Public company settings are publicly readable" 
ON public.public_company_settings 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage public settings
CREATE POLICY "Only authenticated users can insert public company settings" 
ON public.public_company_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update public company settings" 
ON public.public_company_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Insert initial data from existing company_settings (safe fields only)
INSERT INTO public.public_company_settings (company_name, brand_primary_color, brand_accent_color, business_hours, social_media)
SELECT 
  company_name,
  brand_primary_color,
  brand_accent_color,
  business_hours,
  social_media
FROM public.company_settings
ON CONFLICT (id) DO NOTHING;

-- Create trigger to keep updated_at current
CREATE TRIGGER update_public_company_settings_updated_at
  BEFORE UPDATE ON public.public_company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();