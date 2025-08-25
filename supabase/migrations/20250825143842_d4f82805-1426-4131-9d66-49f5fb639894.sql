-- Create SEO settings table for global configurations
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'Guilds',
  title_template TEXT NOT NULL DEFAULT '{title} | Guilds - Sistemas inteligentes, resultados reais',
  meta_description TEXT NOT NULL DEFAULT 'A Guilds é uma empresa de tecnologia especializada em desenvolvimento de software, automação com IA, jogos corporativos e consultoria digital. Transformamos negócios através de soluções inovadoras.',
  og_image TEXT,
  twitter_handle TEXT DEFAULT '@guilds',
  google_analytics_id TEXT,
  google_tag_manager_id TEXT,
  facebook_pixel_id TEXT,
  hotjar_id TEXT,
  robots_txt_content TEXT NOT NULL DEFAULT 'User-agent: *\nAllow: /\nSitemap: https://guilds.com.br/sitemap.xml',
  schema_org_organization JSONB,
  canonical_base_url TEXT NOT NULL DEFAULT 'https://guilds.com.br',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create page-specific SEO configurations
CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  keywords TEXT[],
  schema_org_data JSONB,
  canonical_url TEXT,
  no_index BOOLEAN NOT NULL DEFAULT false,
  no_follow BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom tags table for GTM and other scripts
CREATE TABLE public.custom_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tag_type TEXT NOT NULL CHECK (tag_type IN ('head', 'body_start', 'body_end', 'script', 'meta', 'link')),
  content TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT 'head',
  is_active BOOLEAN NOT NULL DEFAULT true,
  page_paths TEXT[], -- null means all pages
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a public website)
CREATE POLICY "SEO settings are publicly readable" ON public.seo_settings FOR SELECT USING (true);
CREATE POLICY "Page SEO is publicly readable" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Custom tags are publicly readable" ON public.custom_tags FOR SELECT USING (true);

-- Admin policies (for now, anyone can modify - add authentication later)
CREATE POLICY "Anyone can insert SEO settings" ON public.seo_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update SEO settings" ON public.seo_settings FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert page SEO" ON public.page_seo FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update page SEO" ON public.page_seo FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete page SEO" ON public.page_seo FOR DELETE USING (true);
CREATE POLICY "Anyone can insert custom tags" ON public.custom_tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update custom tags" ON public.custom_tags FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete custom tags" ON public.custom_tags FOR DELETE USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON public.seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_seo_updated_at
  BEFORE UPDATE ON public.page_seo
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_tags_updated_at
  BEFORE UPDATE ON public.custom_tags
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO settings
INSERT INTO public.seo_settings (
  site_name,
  title_template,
  meta_description,
  canonical_base_url,
  schema_org_organization
) VALUES (
  'Guilds',
  '{title} | Guilds - Sistemas inteligentes, resultados reais',
  'A Guilds é uma empresa de tecnologia especializada em desenvolvimento de software, automação com IA, jogos corporativos e consultoria digital. Transformamos negócios através de soluções inovadoras.',
  'https://guilds.com.br',
  '{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Guilds",
    "url": "https://guilds.com.br",
    "logo": "https://guilds.com.br/logo.png",
    "description": "Empresa de tecnologia especializada em desenvolvimento de software, automação com IA, jogos corporativos e consultoria digital.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-11-99999-9999",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese", "English"]
    },
    "sameAs": [
      "https://linkedin.com/company/guilds"
    ]
  }'::jsonb
);

-- Insert default page SEO configurations
INSERT INTO public.page_seo (page_path, title, meta_description) VALUES 
('/about', 'Sobre a Guilds - Nossa História e Missão', 'Conheça a história da Guilds, nossa missão de transformar negócios através de tecnologia e nossa equipe de especialistas em desenvolvimento, IA e inovação digital.'),
('/services', 'Nossos Serviços - Desenvolvimento, IA e Consultoria', 'Descubra nossos serviços especializados: desenvolvimento de software sob medida, automação com IA, jogos corporativos e consultoria digital para transformar seu negócio.'),
('/software-apps', 'Desenvolvimento de Software e Apps Sob Medida', 'Criamos software e aplicativos personalizados com foco em resultados. Soluções escaláveis, seguras e otimizadas para acelerar o crescimento do seu negócio.'),
('/automacao-ia', 'Automação com Inteligência Artificial - Guilds', 'Automatize processos e potencialize resultados com nossas soluções de IA. Reduzimos custos operacionais e aumentamos a eficiência através de automação inteligente.'),
('/jogos-gamificacao', 'Jogos Corporativos e Gamificação Empresarial', 'Engaje equipes e melhore resultados com nossos jogos corporativos e estratégias de gamificação. Treinamento inovador que gera impacto real no desempenho.'),
('/consultoria', 'Consultoria em Transformação Digital', 'Acelere sua transformação digital com nossa consultoria especializada. Estratégias personalizadas para modernizar processos e implementar tecnologias inovadoras.'),
('/contact', 'Entre em Contato - Guilds Tecnologia', 'Fale conosco e descubra como a Guilds pode transformar seu negócio. Consultoria gratuita para identificar oportunidades de melhoria através da tecnologia.');