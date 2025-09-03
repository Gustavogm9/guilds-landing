-- Check if public_company_settings has data and insert defaults if needed
INSERT INTO public_company_settings (
  company_name, 
  brand_primary_color, 
  brand_accent_color,
  public_whatsapp_number,
  public_support_email,
  business_hours,
  social_media
)
SELECT 
  'Guilds',
  'hsl(240, 85%, 55%)',
  'hsl(165, 85%, 45%)',
  '+5511999999999',
  'contato@guilds.com.br',
  '{"monday": {"open": "09:00", "close": "18:00", "isOpen": true}, "tuesday": {"open": "09:00", "close": "18:00", "isOpen": true}, "wednesday": {"open": "09:00", "close": "18:00", "isOpen": true}, "thursday": {"open": "09:00", "close": "18:00", "isOpen": true}, "friday": {"open": "09:00", "close": "18:00", "isOpen": true}, "saturday": {"open": "09:00", "close": "12:00", "isOpen": true}, "sunday": {"isOpen": false}}'::jsonb,
  '{"linkedin": "https://linkedin.com/company/guilds", "instagram": "https://instagram.com/guilds", "youtube": "https://youtube.com/@guilds"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public_company_settings LIMIT 1);