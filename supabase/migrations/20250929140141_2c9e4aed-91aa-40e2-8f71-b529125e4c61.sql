-- FASE 1: Tabelas de Suporte para Automações de Marketing Avançadas
-- Criação de infraestrutura sem impacto no sistema atual

-- 1. Templates de automação reutilizáveis
CREATE TABLE public.marketing_automation_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('nurturing', 'onboarding', 'reengagement', 'upsell', 'retention')),
  target_persona TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]', -- Array de steps do workflow
  success_metrics JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_template BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Sequências de nutrição personalizadas
CREATE TABLE public.lead_nurturing_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.marketing_automation_workflows(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL,
  delay_hours INTEGER NOT NULL DEFAULT 24,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms', 'linkedin', 'push')),
  content_template_id UUID, -- Referência para email_templates
  personalization_rules JSONB DEFAULT '{}',
  conditions JSONB DEFAULT '{}', -- Condições para executar este step
  success_actions JSONB DEFAULT '[]', -- Ações se bem sucedido
  failure_actions JSONB DEFAULT '[]', -- Ações se falhar
  sequence_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Templates de email reutilizáveis e dinâmicos
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('welcome', 'nurturing', 'promotional', 'transactional', 'follow_up', 'reengagement')),
  subject_template TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  variables JSONB DEFAULT '[]', -- Variáveis disponíveis no template
  personalization_fields JSONB DEFAULT '{}',
  a_b_variants JSONB DEFAULT '[]', -- Variantes para A/B testing
  design_config JSONB DEFAULT '{}', -- Configurações de design
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  performance_metrics JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Gatilhos inteligentes para automações
CREATE TABLE public.automation_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('behavioral', 'temporal', 'score_based', 'lifecycle', 'external_event')),
  event_name TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  frequency_limit TEXT CHECK (frequency_limit IN ('once', 'daily', 'weekly', 'monthly', 'unlimited')),
  cooldown_hours INTEGER DEFAULT 24,
  priority INTEGER DEFAULT 1,
  target_workflows UUID[] DEFAULT '{}', -- Array de workflows que este trigger pode ativar
  is_active BOOLEAN NOT NULL DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Regras dinâmicas de pontuação de leads
CREATE TABLE public.lead_scoring_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('demographic', 'behavioral', 'engagement', 'firmographic', 'intent')),
  category TEXT NOT NULL, -- empresa, pessoa, produto, etc
  condition_field TEXT NOT NULL,
  condition_operator TEXT NOT NULL CHECK (condition_operator IN ('equals', 'contains', 'greater_than', 'less_than', 'in_list', 'not_in_list', 'regex')),
  condition_value TEXT NOT NULL,
  score_points INTEGER NOT NULL,
  score_multiplier DECIMAL DEFAULT 1.0,
  decay_days INTEGER, -- Pontos decaem após X dias
  max_times_applicable INTEGER DEFAULT 1, -- Quantas vezes a regra pode ser aplicada
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Histórico de execuções de automação (para auditoria e análise)
CREATE TABLE public.automation_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.marketing_automation_workflows(id),
  sequence_id UUID REFERENCES public.lead_nurturing_sequences(id),
  contact_id UUID REFERENCES public.crm_contacts(id),
  trigger_id UUID REFERENCES public.automation_triggers(id),
  execution_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  execution_data JSONB DEFAULT '{}',
  results JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}'
);

-- 7. Métricas de performance das automações
CREATE TABLE public.automation_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID REFERENCES public.marketing_automation_workflows(id),
  contact_id UUID REFERENCES public.crm_contacts(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  whatsapp_sent INTEGER DEFAULT 0,
  whatsapp_delivered INTEGER DEFAULT 0,
  whatsapp_replied INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue_generated DECIMAL DEFAULT 0,
  engagement_score DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workflow_id, contact_id, date)
);

-- Indexes para performance
CREATE INDEX idx_marketing_workflows_type ON public.marketing_automation_workflows(workflow_type);
CREATE INDEX idx_marketing_workflows_active ON public.marketing_automation_workflows(is_active);
CREATE INDEX idx_nurturing_sequences_workflow ON public.lead_nurturing_sequences(workflow_id);
CREATE INDEX idx_nurturing_sequences_channel ON public.lead_nurturing_sequences(channel);
CREATE INDEX idx_email_templates_type ON public.email_templates(template_type);
CREATE INDEX idx_automation_triggers_type ON public.automation_triggers(trigger_type);
CREATE INDEX idx_automation_triggers_active ON public.automation_triggers(is_active);
CREATE INDEX idx_lead_scoring_rules_type ON public.lead_scoring_rules(rule_type);
CREATE INDEX idx_lead_scoring_rules_active ON public.lead_scoring_rules(is_active);
CREATE INDEX idx_automation_executions_workflow ON public.automation_executions(workflow_id);
CREATE INDEX idx_automation_executions_contact ON public.automation_executions(contact_id);
CREATE INDEX idx_automation_executions_status ON public.automation_executions(status);
CREATE INDEX idx_automation_metrics_workflow_date ON public.automation_metrics(workflow_id, date);

-- RLS Policies
ALTER TABLE public.marketing_automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_nurturing_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_metrics ENABLE ROW LEVEL SECURITY;

-- Policies para workflows
CREATE POLICY "Only authenticated users can manage workflows" ON public.marketing_automation_workflows
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies para sequences
CREATE POLICY "Only authenticated users can manage sequences" ON public.lead_nurturing_sequences
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies para templates
CREATE POLICY "Only authenticated users can manage email templates" ON public.email_templates
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies para triggers
CREATE POLICY "Only authenticated users can manage triggers" ON public.automation_triggers
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies para scoring rules
CREATE POLICY "Only authenticated users can manage scoring rules" ON public.lead_scoring_rules
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Policies para executions
CREATE POLICY "Only authenticated users can view executions" ON public.automation_executions
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Policies para metrics
CREATE POLICY "Only authenticated users can view metrics" ON public.automation_metrics
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.marketing_automation_workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON public.lead_nurturing_sequences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_triggers_updated_at BEFORE UPDATE ON public.automation_triggers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scoring_updated_at BEFORE UPDATE ON public.lead_scoring_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();