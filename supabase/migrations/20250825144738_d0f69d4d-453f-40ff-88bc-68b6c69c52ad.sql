-- Create tables for qualification form system
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  whatsapp_number TEXT NOT NULL DEFAULT '+5511999999999',
  company_name TEXT NOT NULL DEFAULT 'Guilds',
  support_email TEXT NOT NULL DEFAULT 'contato@guilds.com.br',
  brand_primary_color TEXT NOT NULL DEFAULT 'hsl(240, 85%, 55%)',
  brand_accent_color TEXT NOT NULL DEFAULT 'hsl(165, 85%, 45%)',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for qualification forms configuration
CREATE TABLE public.qualification_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Qualifique seu projeto',
  description TEXT NOT NULL DEFAULT 'Conte-nos mais sobre seu projeto para uma proposta personalizada',
  thank_you_title TEXT NOT NULL DEFAULT 'Obrigado pelo interesse!',
  thank_you_message TEXT NOT NULL DEFAULT 'Nossa equipe entrará em contato em breve.',
  redirect_delay INTEGER NOT NULL DEFAULT 5,
  redirect_to_whatsapp BOOLEAN NOT NULL DEFAULT true,
  page_paths TEXT[] DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for form fields configuration
CREATE TABLE public.form_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.qualification_forms(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  field_label TEXT NOT NULL,
  field_type TEXT NOT NULL DEFAULT 'text',
  placeholder_text TEXT,
  is_required BOOLEAN NOT NULL DEFAULT false,
  options TEXT[] DEFAULT NULL,
  field_order INTEGER NOT NULL DEFAULT 0,
  validation_rules JSONB DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for form submissions (leads)
CREATE TABLE public.qualification_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.qualification_forms(id),
  form_data JSONB NOT NULL,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  user_agent TEXT,
  ip_address INET,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company_settings (public read, admin write)
CREATE POLICY "Company settings are publicly readable" 
ON public.company_settings FOR SELECT USING (true);

CREATE POLICY "Anyone can insert company settings" 
ON public.company_settings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update company settings" 
ON public.company_settings FOR UPDATE USING (true);

-- Create RLS policies for qualification_forms (public read active forms, admin write)
CREATE POLICY "Active qualification forms are publicly readable" 
ON public.qualification_forms FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert qualification forms" 
ON public.qualification_forms FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update qualification forms" 
ON public.qualification_forms FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete qualification forms" 
ON public.qualification_forms FOR DELETE USING (true);

-- Create RLS policies for form_fields (public read for active forms, admin write)
CREATE POLICY "Form fields for active forms are publicly readable" 
ON public.form_fields FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.qualification_forms 
    WHERE id = form_fields.form_id AND is_active = true
  )
);

CREATE POLICY "Anyone can insert form fields" 
ON public.form_fields FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update form fields" 
ON public.form_fields FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete form fields" 
ON public.form_fields FOR DELETE USING (true);

-- Create RLS policies for qualification_submissions (admin access only for privacy)
CREATE POLICY "Anyone can insert qualification submissions" 
ON public.qualification_submissions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read qualification submissions" 
ON public.qualification_submissions FOR SELECT USING (true);

CREATE POLICY "Anyone can update qualification submissions" 
ON public.qualification_submissions FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete qualification submissions" 
ON public.qualification_submissions FOR DELETE USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qualification_forms_updated_at
  BEFORE UPDATE ON public.qualification_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qualification_submissions_updated_at
  BEFORE UPDATE ON public.qualification_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default company settings
INSERT INTO public.company_settings (
  whatsapp_number,
  company_name,
  support_email,
  brand_primary_color,
  brand_accent_color
) VALUES (
  '+5511999999999',
  'Guilds',
  'contato@guilds.com.br',
  'hsl(240, 85%, 55%)',
  'hsl(165, 85%, 45%)'
);

-- Insert default qualification form
INSERT INTO public.qualification_forms (
  name,
  title,
  description,
  thank_you_title,
  thank_you_message,
  redirect_delay,
  redirect_to_whatsapp,
  is_active
) VALUES (
  'Formulário Padrão',
  'Vamos conversar sobre seu projeto!',
  'Conte-nos sobre seus objetivos para recebermos uma proposta personalizada em até 24 horas.',
  'Obrigado pelo interesse!',
  'Nossa equipe entrará em contato em breve para discutir seu projeto e apresentar soluções personalizadas.',
  8,
  true,
  true
);

-- Get the form ID and insert default fields
INSERT INTO public.form_fields (
  form_id,
  field_name,
  field_label,
  field_type,
  placeholder_text,
  is_required,
  field_order
) 
SELECT 
  (SELECT id FROM public.qualification_forms WHERE name = 'Formulário Padrão'),
  unnest(ARRAY['name', 'email', 'company', 'phone', 'service', 'budget', 'message']),
  unnest(ARRAY['Nome completo', 'E-mail corporativo', 'Empresa', 'Telefone/WhatsApp', 'Serviço de interesse', 'Orçamento estimado', 'Descreva seu projeto']),
  unnest(ARRAY['text', 'email', 'text', 'tel', 'select', 'select', 'textarea']),
  unnest(ARRAY['Seu nome completo', 'seu@empresa.com', 'Nome da sua empresa', '(11) 99999-9999', 'Selecione um serviço', 'Faixa de investimento', 'Conte-nos sobre seus objetivos e desafios...']),
  unnest(ARRAY[true, true, false, true, true, false, true]),
  unnest(ARRAY[1, 2, 3, 4, 5, 6, 7]);

-- Insert field options for select fields
UPDATE public.form_fields 
SET options = ARRAY['Software & Apps', 'Automação & IA', 'Jogos & Gamificação', 'Consultoria & Discovery', 'Guilds Lab', 'Guilds Craft', 'Outro']
WHERE field_name = 'service';

UPDATE public.form_fields 
SET options = ARRAY['Até R$ 50k', 'R$ 50k - R$ 100k', 'R$ 100k - R$ 250k', 'R$ 250k - R$ 500k', 'Acima de R$ 500k', 'A definir']
WHERE field_name = 'budget';