-- Add a safe public WhatsApp field to public_company_settings
-- Admins can control what WhatsApp number is safe for public use
ALTER TABLE public.public_company_settings 
ADD COLUMN public_whatsapp_number TEXT;

-- Update with a safe public WhatsApp number from the original settings
UPDATE public.public_company_settings 
SET public_whatsapp_number = (
  SELECT whatsapp_number 
  FROM company_settings 
  LIMIT 1
);

-- Add a public support email field as well for contact forms
ALTER TABLE public.public_company_settings 
ADD COLUMN public_support_email TEXT;

-- Update with a safe public support email
UPDATE public.public_company_settings 
SET public_support_email = (
  SELECT support_email 
  FROM company_settings 
  LIMIT 1
);