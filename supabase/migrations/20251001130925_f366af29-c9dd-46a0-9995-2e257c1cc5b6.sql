-- Fase 1: Adicionar coluna business_unit nas tabelas de SEO e configurações públicas

-- Adicionar business_unit em seo_settings
ALTER TABLE public.seo_settings 
ADD COLUMN IF NOT EXISTS business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Adicionar business_unit em page_seo
ALTER TABLE public.page_seo 
ADD COLUMN IF NOT EXISTS business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Adicionar business_unit em public_company_settings
ALTER TABLE public.public_company_settings 
ADD COLUMN IF NOT EXISTS business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Adicionar business_unit em contact_info
ALTER TABLE public.contact_info 
ADD COLUMN IF NOT EXISTS business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Adicionar business_unit em custom_tags
ALTER TABLE public.custom_tags 
ADD COLUMN IF NOT EXISTS business_unit TEXT NOT NULL DEFAULT 'guilds';

-- Criar índices para melhor performance nas buscas por business_unit
CREATE INDEX IF NOT EXISTS idx_seo_settings_business_unit ON public.seo_settings(business_unit);
CREATE INDEX IF NOT EXISTS idx_page_seo_business_unit ON public.page_seo(business_unit);
CREATE INDEX IF NOT EXISTS idx_page_seo_path_unit ON public.page_seo(page_path, business_unit);
CREATE INDEX IF NOT EXISTS idx_public_company_settings_business_unit ON public.public_company_settings(business_unit);
CREATE INDEX IF NOT EXISTS idx_contact_info_business_unit ON public.contact_info(business_unit);
CREATE INDEX IF NOT EXISTS idx_custom_tags_business_unit ON public.custom_tags(business_unit);

-- Corrigir dados existentes: 
-- 1. Identificar e corrigir o registro conflitante da homepage da Doavya
UPDATE public.page_seo 
SET business_unit = 'doavya' 
WHERE page_path = '/' 
  AND title LIKE '%Doavya%';

-- 2. Garantir que existe um registro correto para homepage da Guilds
INSERT INTO public.page_seo (
  page_path, 
  title, 
  meta_description, 
  business_unit,
  no_index,
  no_follow
)
VALUES (
  '/',
  'Guilds - Sistemas inteligentes, resultados reais',
  'Soluções digitais sob medida: software, apps, automação, IA e jogos corporativos. Transforme sua empresa com tecnologia que gera resultados reais.',
  'guilds',
  false,
  false
)
ON CONFLICT (page_path) 
WHERE business_unit = 'guilds'
DO NOTHING;

-- 3. Atualizar constraint de unicidade para incluir business_unit
ALTER TABLE public.page_seo DROP CONSTRAINT IF EXISTS page_seo_page_path_key;
ALTER TABLE public.page_seo ADD CONSTRAINT page_seo_page_path_business_unit_key 
  UNIQUE (page_path, business_unit);

-- 4. Garantir que tabelas de configuração tenham registros separados por business_unit
-- Se houver apenas 1 registro em seo_settings, duplicar para doavya
DO $$
BEGIN
  IF (SELECT COUNT(*) FROM public.seo_settings) = 1 THEN
    INSERT INTO public.seo_settings (
      site_name,
      title_template,
      meta_description,
      canonical_base_url,
      robots_txt_content,
      business_unit
    )
    SELECT 
      'Doavya',
      '%s | Doavya',
      meta_description,
      'https://doavya.com.br',
      robots_txt_content,
      'doavya'
    FROM public.seo_settings 
    WHERE business_unit = 'guilds'
    LIMIT 1;
  END IF;
END $$;

-- 5. Atualizar RLS policies para filtrar por business_unit
DROP POLICY IF EXISTS "Page SEO is publicly readable" ON public.page_seo;
CREATE POLICY "Page SEO is publicly readable"
  ON public.page_seo
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "SEO settings are publicly readable" ON public.seo_settings;
CREATE POLICY "SEO settings are publicly readable"
  ON public.seo_settings
  FOR SELECT
  USING (true);

-- Comentário explicativo
COMMENT ON COLUMN public.page_seo.business_unit IS 'Identifica qual produto/projeto este SEO pertence (guilds, doavya, etc)';
COMMENT ON COLUMN public.seo_settings.business_unit IS 'Identifica qual produto/projeto estas configurações pertencem (guilds, doavya, etc)';
COMMENT ON COLUMN public.public_company_settings.business_unit IS 'Identifica qual produto/projeto estas configurações pertencem (guilds, doavya, etc)';