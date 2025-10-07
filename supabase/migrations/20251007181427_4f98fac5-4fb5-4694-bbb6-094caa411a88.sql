-- Drop existing table and recreate with correct structure
DROP TABLE IF EXISTS public.lead_scoring_rules CASCADE;

CREATE TABLE public.lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL,
  condition_field TEXT NOT NULL,
  condition_operator TEXT NOT NULL,
  condition_value JSONB NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  score_type TEXT NOT NULL DEFAULT 'lead_score',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view scoring rules"
  ON public.lead_scoring_rules FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage scoring rules"
  ON public.lead_scoring_rules FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_lead_scoring_rules_updated_at
  BEFORE UPDATE ON public.lead_scoring_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.lead_scoring_rules (rule_name, rule_type, condition_field, condition_operator, condition_value, points, score_type, description) VALUES
  ('Cargo C-Level', 'demographic', 'job_title', 'contains', '["CEO", "CTO", "CFO", "COO", "Diretor", "VP", "Presidente"]', 25, 'icp_score', 'Decisor de alto nível'),
  ('Cargo Gerencial', 'demographic', 'job_title', 'contains', '["Gerente", "Coordenador", "Líder", "Head"]', 15, 'icp_score', 'Influenciador importante'),
  ('Empresa Grande (500+)', 'firmographic', 'company_size', 'equals', '"500+"', 30, 'icp_score', 'Empresa de grande porte'),
  ('Empresa Média (50-500)', 'firmographic', 'company_size', 'equals', '"50-500"', 20, 'icp_score', 'Empresa de médio porte'),
  ('Empresa Pequena (10-50)', 'firmographic', 'company_size', 'equals', '"10-50"', 10, 'icp_score', 'Empresa de pequeno porte'),
  ('Orçamento Alto (>100k)', 'demographic', 'budget_range', 'equals', '">100k"', 30, 'icp_score', 'Budget significativo'),
  ('Orçamento Médio (50-100k)', 'demographic', 'budget_range', 'equals', '"50-100k"', 20, 'icp_score', 'Budget moderado'),
  ('Orçamento Baixo (10-50k)', 'demographic', 'budget_range', 'equals', '"10-50k"', 10, 'icp_score', 'Budget limitado'),
  ('Timeline Imediato', 'demographic', 'decision_timeline', 'equals', '"imediato"', 25, 'lead_score', 'Urgência alta'),
  ('Timeline 1-3 meses', 'demographic', 'decision_timeline', 'equals', '"1-3_meses"', 15, 'lead_score', 'Prazo médio'),
  ('Timeline 3-6 meses', 'demographic', 'decision_timeline', 'equals', '"3-6_meses"', 5, 'lead_score', 'Prazo longo'),
  ('Indústria Tecnologia', 'firmographic', 'industry', 'in_list', '["Tecnologia", "Software", "TI", "SaaS"]', 20, 'icp_score', 'Fit ideal de indústria'),
  ('Indústria Serviços', 'firmographic', 'industry', 'in_list', '["Consultoria", "Serviços", "Educação"]', 15, 'icp_score', 'Fit bom de indústria'),
  ('Múltiplos Produtos Interesse', 'behavioral', 'products_interest_count', 'greater_than', '2', 20, 'engagement_score', 'Interesse diversificado'),
  ('Interesse em Software', 'behavioral', 'products_interest', 'contains', '["software"]', 15, 'engagement_score', 'Produto core'),
  ('Interesse em IA', 'behavioral', 'products_interest', 'contains', '["ia", "automacao"]', 20, 'engagement_score', 'Produto estratégico'),
  ('Interesse em Jogos', 'behavioral', 'products_interest', 'contains', '["jogos"]', 10, 'engagement_score', 'Produto especializado'),
  ('Fonte Qualificação Direta', 'behavioral', 'lead_source', 'equals', '"qualification"', 25, 'engagement_score', 'Lead qualificado'),
  ('Fonte Workshop', 'behavioral', 'lead_source', 'equals', '"workshop"', 20, 'engagement_score', 'Engajamento educacional'),
  ('Fonte Contato Direto', 'behavioral', 'lead_source', 'equals', '"contact_form"', 15, 'engagement_score', 'Iniciativa direta'),
  ('Pain Points Identificados', 'behavioral', 'pain_points_count', 'greater_than', '1', 15, 'lead_score', 'Necessidade clara'),
  ('Email Corporativo', 'demographic', 'email', 'not_contains', '["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"]', 10, 'lead_score', 'Email profissional'),
  ('Empresa Preenchida', 'demographic', 'company', 'not_equals', '""', 10, 'lead_score', 'Dados completos'),
  ('Telefone Preenchido', 'demographic', 'phone', 'not_equals', '""', 5, 'lead_score', 'Contactável'),
  ('Interação Recente (<7 dias)', 'engagement', 'last_interaction_days', 'less_than', '7', 15, 'engagement_score', 'Engajamento recente'),
  ('Múltiplas Interações', 'engagement', 'interaction_count', 'greater_than', '2', 20, 'engagement_score', 'Engajamento alto');