-- Insert public contact info data if not exists
-- This ensures public components have data to display

-- Insert public email if not exists
INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'email', 'Email Principal', 'contato@guilds.com.br', true, true, true, 1
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'email' AND is_public = true AND is_primary = true
);

-- Insert public phone if not exists
INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'phone', 'Telefone Principal', '+5511999999999', true, true, true, 2
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'phone' AND is_public = true AND is_primary = true
);

-- Insert public address if not exists
INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'address', 'Endereço Principal', 
'{"street": "Av. Paulista, 1000", "city": "São Paulo", "state": "SP", "zipCode": "01310-100", "country": "Brasil"}',
true, true, true, 3
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'address' AND is_public = true AND is_primary = true
);

-- Insert social media links if not exist
INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'social', 'linkedin', 'https://linkedin.com/company/guilds', false, true, true, 10
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'social' AND label = 'linkedin' AND is_public = true
);

INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'social', 'instagram', 'https://instagram.com/guilds', false, true, true, 11
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'social' AND label = 'instagram' AND is_public = true
);

INSERT INTO contact_info (
  type, label, value, is_primary, is_active, is_public, display_order
)
SELECT 'social', 'youtube', 'https://youtube.com/@guilds', false, true, true, 12
WHERE NOT EXISTS (
  SELECT 1 FROM contact_info 
  WHERE type = 'social' AND label = 'youtube' AND is_public = true
);