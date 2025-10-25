-- Create ICP Criteria Configuration Table
CREATE TABLE IF NOT EXISTS public.icp_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  criterion_name TEXT NOT NULL,
  criterion_type TEXT NOT NULL, -- 'company_size', 'industry', 'job_title', 'budget', 'timeline'
  criterion_field TEXT NOT NULL, -- campo em crm_contacts
  target_values JSONB NOT NULL DEFAULT '[]'::jsonb, -- valores ideais
  weight INTEGER NOT NULL DEFAULT 10, -- peso na pontuação (0-100)
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.icp_criteria ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "ICP criteria are publicly readable"
  ON public.icp_criteria
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only authenticated users can manage ICP criteria"
  ON public.icp_criteria
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Insert default ICP criteria
INSERT INTO public.icp_criteria (criterion_name, criterion_type, criterion_field, target_values, weight, description) VALUES
('Tamanho Ideal de Empresa', 'company_size', 'company_size', '["11-50", "51-200", "201-500"]'::jsonb, 20, 'Empresas de porte médio são nosso ICP ideal'),
('Indústrias-Alvo', 'industry', 'industry', '["Tecnologia", "Serviços Financeiros", "E-commerce", "SaaS"]'::jsonb, 25, 'Setores com maior fit para nossas soluções'),
('Nível de Decisor', 'job_title', 'job_title', '["CTO", "CEO", "Diretor", "VP"]'::jsonb, 30, 'Contatos em posição de decisão'),
('Orçamento Adequado', 'budget', 'budget_range', '["R$ 50-100k", "R$ 100-300k", "R$ 300k+"]'::jsonb, 15, 'Budget alinhado com nossas soluções'),
('Timeline Realista', 'timeline', 'decision_timeline', '["1-3 meses", "3-6 meses"]'::jsonb, 10, 'Timeline de implementação viável');