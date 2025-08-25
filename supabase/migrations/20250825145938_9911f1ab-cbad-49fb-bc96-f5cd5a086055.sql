-- Expand company_settings table with contact fields
ALTER TABLE public.company_settings 
ADD COLUMN contact_emails JSONB DEFAULT '[]'::jsonb,
ADD COLUMN contact_phones JSONB DEFAULT '[]'::jsonb,
ADD COLUMN addresses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN social_media JSONB DEFAULT '{}'::jsonb,
ADD COLUMN business_hours JSONB DEFAULT '{}'::jsonb,
ADD COLUMN response_time_hours INTEGER DEFAULT 2,
ADD COLUMN auto_response_message TEXT DEFAULT 'Nossa equipe entrará em contato em breve.';

-- Create contact_info table for structured contact management
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'address', 'social', 'other')),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_info
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_info
CREATE POLICY "Contact info is publicly readable" 
ON public.contact_info 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can insert contact info" 
ON public.contact_info 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update contact info" 
ON public.contact_info 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete contact info" 
ON public.contact_info 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_contact_info_updated_at
BEFORE UPDATE ON public.contact_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact data from current hardcoded values
INSERT INTO public.contact_info (type, label, value, is_primary, display_order) VALUES
('email', 'Principal', 'contato@guilds.com.br', true, 1),
('phone', 'Principal', '+55 11 99999-9999', true, 1),
('address', 'Sede', '{"street": "Rua das Startups, 123", "city": "São Paulo", "state": "SP", "zipCode": "01234-567", "country": "Brasil"}', true, 1),
('social', 'LinkedIn', 'https://linkedin.com/company/guilds', false, 1),
('social', 'Instagram', 'https://instagram.com/guilds', false, 2),
('social', 'YouTube', 'https://youtube.com/@guilds', false, 3);

-- Update company_settings with structured data
UPDATE public.company_settings SET
  contact_emails = '[
    {"email": "contato@guilds.com.br", "label": "Principal", "isPrimary": true},
    {"email": "comercial@guilds.com.br", "label": "Comercial", "isPrimary": false}
  ]'::jsonb,
  contact_phones = '[
    {"phone": "+5511999999999", "label": "Principal", "isPrimary": true},
    {"phone": "+5511888888888", "label": "Comercial", "isPrimary": false}
  ]'::jsonb,
  social_media = '{
    "linkedin": "https://linkedin.com/company/guilds",
    "instagram": "https://instagram.com/guilds", 
    "youtube": "https://youtube.com/@guilds"
  }'::jsonb,
  business_hours = '{
    "monday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "tuesday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "wednesday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "thursday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "friday": {"open": "09:00", "close": "18:00", "isOpen": true},
    "saturday": {"open": "09:00", "close": "14:00", "isOpen": true},
    "sunday": {"open": "00:00", "close": "00:00", "isOpen": false}
  }'::jsonb,
  addresses = '[
    {
      "type": "main",
      "label": "Sede",
      "street": "Rua das Startups, 123",
      "city": "São Paulo", 
      "state": "SP",
      "zipCode": "01234-567",
      "country": "Brasil",
      "isPrimary": true
    }
  ]'::jsonb;