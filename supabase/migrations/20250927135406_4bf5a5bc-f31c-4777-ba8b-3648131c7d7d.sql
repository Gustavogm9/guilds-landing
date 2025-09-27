-- Criar configurações de sistema para templates default_clauses
CREATE TABLE IF NOT EXISTS public.system_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração para mapeamento de templates
INSERT INTO public.system_configurations (key, value, description) VALUES 
('template_default_clauses_mapping', '{}', 'Mapeamento de cláusulas padrão por template')
ON CONFLICT (key) DO NOTHING;

-- RLS para system_configurations
ALTER TABLE public.system_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can read system configurations" 
ON public.system_configurations FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage system configurations" 
ON public.system_configurations FOR ALL 
USING (auth.uid() IS NOT NULL);