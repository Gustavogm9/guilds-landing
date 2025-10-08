-- Sprint 3: Nurturing Sequences System
-- Tabela de sequências de nurturing
CREATE TABLE IF NOT EXISTS public.nurturing_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'score_based', 'manual', 'lifecycle_change', 'time_based'
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  min_score INTEGER,
  max_score INTEGER,
  target_lifecycle_stages TEXT[],
  target_tags TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1,
  enrollment_count INTEGER DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0,
  avg_engagement_score NUMERIC DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de passos da sequência
CREATE TABLE IF NOT EXISTS public.nurturing_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.nurturing_sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL, -- 'email', 'whatsapp', 'task', 'webhook', 'wait'
  delay_days INTEGER NOT NULL DEFAULT 0,
  delay_hours INTEGER NOT NULL DEFAULT 0,
  
  -- Email fields
  email_template_id UUID REFERENCES public.email_templates(id),
  email_subject TEXT,
  email_content TEXT,
  
  -- WhatsApp fields
  whatsapp_template_id TEXT,
  whatsapp_message TEXT,
  
  -- Task fields
  task_title TEXT,
  task_description TEXT,
  task_type TEXT,
  
  -- Webhook fields
  webhook_url TEXT,
  webhook_payload JSONB,
  
  -- Conditions
  skip_conditions JSONB DEFAULT '{}',
  success_criteria JSONB DEFAULT '{}',
  
  -- Metrics
  sent_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  replied_count INTEGER DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de inscrições em sequências
CREATE TABLE IF NOT EXISTS public.nurturing_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.nurturing_sequences(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  current_step_id UUID REFERENCES public.nurturing_sequence_steps(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'paused', 'failed'
  
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_action_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  paused_at TIMESTAMP WITH TIME ZONE,
  
  steps_completed INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  
  engagement_score INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  replies_received INTEGER DEFAULT 0,
  
  enrollment_data JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(sequence_id, contact_id)
);

-- Tabela de execuções de passos
CREATE TABLE IF NOT EXISTS public.nurturing_step_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.nurturing_enrollments(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.nurturing_sequence_steps(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'opened', 'clicked', 'replied', 'failed', 'skipped'
  
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE,
  
  execution_data JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Engagement tracking
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nurturing_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurturing_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurturing_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurturing_step_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Only authenticated users can manage nurturing sequences"
  ON public.nurturing_sequences
  FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage sequence steps"
  ON public.nurturing_sequence_steps
  FOR ALL
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can view enrollments"
  ON public.nurturing_enrollments
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can view step executions"
  ON public.nurturing_step_executions
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Triggers
CREATE TRIGGER update_nurturing_sequences_updated_at
  BEFORE UPDATE ON public.nurturing_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nurturing_sequence_steps_updated_at
  BEFORE UPDATE ON public.nurturing_sequence_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nurturing_enrollments_updated_at
  BEFORE UPDATE ON public.nurturing_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_nurturing_sequences_active ON public.nurturing_sequences(is_active);
CREATE INDEX idx_nurturing_sequence_steps_sequence ON public.nurturing_sequence_steps(sequence_id, step_order);
CREATE INDEX idx_nurturing_enrollments_contact ON public.nurturing_enrollments(contact_id, status);
CREATE INDEX idx_nurturing_enrollments_next_action ON public.nurturing_enrollments(next_action_at) WHERE status = 'active';
CREATE INDEX idx_nurturing_step_executions_scheduled ON public.nurturing_step_executions(scheduled_at, status);

-- Seed inicial com sequências básicas
INSERT INTO public.nurturing_sequences (name, description, trigger_type, trigger_conditions, min_score, max_score, target_lifecycle_stages, is_active, priority) VALUES
('Nurturing Leads Frios', 'Sequência para reativar leads com baixo engajamento', 'score_based', '{"score_threshold": 30}', 0, 30, ARRAY['lead', 'mql'], true, 1),
('Nurturing Leads Warm', 'Sequência para nutrir leads qualificados', 'score_based', '{"score_threshold": 60}', 30, 70, ARRAY['mql', 'sql'], true, 2),
('Aceleração Hot Leads', 'Sequência intensiva para leads quentes', 'score_based', '{"score_threshold": 80}', 70, 100, ARRAY['sql', 'opportunity'], true, 3)
ON CONFLICT DO NOTHING;