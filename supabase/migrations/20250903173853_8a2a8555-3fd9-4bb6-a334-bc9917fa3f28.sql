-- Be more restrictive with personal information
-- Remove personal email from public access  
UPDATE public.contact_info 
SET is_public = false 
WHERE value = 'gustavo.macedo@guilds.com.br';

-- Remove personal phone from public access
UPDATE public.contact_info 
SET is_public = false 
WHERE value = '+55 17 99752-0867';

-- Only social media should remain public by default
-- Business will need to manually set appropriate contacts as public through admin interface