-- Feedback Modules (conectado aos projetos existentes)
CREATE TABLE public.feedback_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  name TEXT NOT NULL,
  path_hint TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, key)
);

-- Feedback Entries (núcleo do sistema)
CREATE TABLE public.feedback_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.feedback_modules(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  persona TEXT NOT NULL CHECK (persona IN ('gestor', 'usuario_final', 'parceiro')),
  channel TEXT NOT NULL CHECK (channel IN ('inapp', 'whatsapp', 'email', 'import', 'api')),
  type TEXT NOT NULL CHECK (type IN ('bug', 'ideia', 'duvida', 'srs', 'nps', 'csat', 'ces', 'pmf', 'usability')),
  score INTEGER CHECK (score >= 0 AND score <= 10),
  severity TEXT NOT NULL CHECK (severity IN ('blocker', 'high', 'medium', 'low', 'idea')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('new', 'triaged', 'in_backlog', 'in_progress', 'released', 'wont_fix')) DEFAULT 'new',
  verbatim TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  context JSONB DEFAULT '{}'::jsonb,
  -- RICE scoring fields
  rice_reach INTEGER CHECK (rice_reach >= 1 AND rice_reach <= 10),
  rice_impact INTEGER CHECK (rice_impact >= 1 AND rice_impact <= 3),
  rice_confidence INTEGER CHECK (rice_confidence >= 1 AND rice_confidence <= 100),
  rice_effort INTEGER CHECK (rice_effort >= 1 AND rice_effort <= 10),
  rice_score NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN rice_reach IS NOT NULL AND rice_impact IS NOT NULL 
           AND rice_confidence IS NOT NULL AND rice_effort IS NOT NULL 
           AND rice_effort > 0
      THEN (rice_reach * rice_impact * rice_confidence / 100.0) / rice_effort
      ELSE NULL
    END
  ) STORED,
  -- WSJF scoring
  wsjf_user_value INTEGER CHECK (wsjf_user_value >= 1 AND wsjf_user_value <= 10),
  wsjf_time_criticality INTEGER CHECK (wsjf_time_criticality >= 1 AND wsjf_time_criticality <= 10),
  wsjf_risk_reduction INTEGER CHECK (wsjf_risk_reduction >= 1 AND wsjf_risk_reduction <= 10),
  wsjf_job_size INTEGER CHECK (wsjf_job_size >= 1 AND wsjf_job_size <= 10),
  wsjf_score NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN wsjf_user_value IS NOT NULL AND wsjf_time_criticality IS NOT NULL 
           AND wsjf_risk_reduction IS NOT NULL AND wsjf_job_size IS NOT NULL 
           AND wsjf_job_size > 0
      THEN (wsjf_user_value + wsjf_time_criticality + wsjf_risk_reduction) / wsjf_job_size::NUMERIC
      ELSE NULL
    END
  ) STORED,
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  locale TEXT DEFAULT 'pt-BR',
  priority_score INTEGER DEFAULT 0,
  resolution_note TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback Tickets (gestão de suporte)
CREATE TABLE public.feedback_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES public.feedback_entries(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'pending', 'solved', 'closed')) DEFAULT 'open',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_to UUID,
  csat_score INTEGER CHECK (csat_score >= 1 AND csat_score <= 5),
  csat_comment TEXT,
  resolution_note TEXT,
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback Campaigns (cadências automáticas)
CREATE TABLE public.feedback_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('srs', 'nps', 'csat', 'ces', 'pmf', 'onboarding')),
  trigger_event TEXT NOT NULL CHECK (trigger_event IN ('milestone_completed', 'project_started', 'ticket_closed', 'scheduled', 'manual')),
  trigger_delay_hours INTEGER DEFAULT 24,
  target_persona TEXT NOT NULL CHECK (target_persona IN ('gestor', 'usuario_final', 'todos')),
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email', 'inapp')) DEFAULT 'whatsapp',
  message_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback Campaign Executions (histórico de envios)
CREATE TABLE public.feedback_campaign_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.feedback_campaigns(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'responded')) DEFAULT 'pending',
  channel TEXT NOT NULL,
  message_sent TEXT,
  response_feedback_id UUID REFERENCES public.feedback_entries(id) ON DELETE SET NULL,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feedback Metrics Daily (KPIs consolidados)
CREATE TABLE public.feedback_metrics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  -- Volume metrics
  total_feedback INTEGER DEFAULT 0,
  bugs_count INTEGER DEFAULT 0,
  ideas_count INTEGER DEFAULT 0,
  questions_count INTEGER DEFAULT 0,
  -- Satisfaction metrics
  nps_score NUMERIC,
  nps_responses INTEGER DEFAULT 0,
  csat_score NUMERIC,
  csat_responses INTEGER DEFAULT 0,
  ces_score NUMERIC,
  ces_responses INTEGER DEFAULT 0,
  pmf_score NUMERIC,
  pmf_responses INTEGER DEFAULT 0,
  -- Response metrics
  avg_first_response_hours NUMERIC,
  avg_resolution_hours NUMERIC,
  tickets_created INTEGER DEFAULT 0,
  tickets_closed INTEGER DEFAULT 0,
  -- Channel breakdown
  inapp_feedback INTEGER DEFAULT 0,
  whatsapp_feedback INTEGER DEFAULT 0,
  email_feedback INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(project_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.feedback_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_campaign_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_metrics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active feedback modules" 
ON public.feedback_modules 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage feedback modules" 
ON public.feedback_modules 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can create feedback entries" 
ON public.feedback_entries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can read feedback entries" 
ON public.feedback_entries 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update feedback entries" 
ON public.feedback_entries 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage feedback tickets" 
ON public.feedback_tickets 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can manage feedback campaigns" 
ON public.feedback_campaigns 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can read campaign executions" 
ON public.feedback_campaign_executions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can read feedback metrics" 
ON public.feedback_metrics_daily 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Indexes for performance
CREATE INDEX idx_feedback_entries_project_id ON public.feedback_entries(project_id);
CREATE INDEX idx_feedback_entries_status ON public.feedback_entries(status);
CREATE INDEX idx_feedback_entries_type ON public.feedback_entries(type);
CREATE INDEX idx_feedback_entries_created_at ON public.feedback_entries(created_at DESC);
CREATE INDEX idx_feedback_entries_priority ON public.feedback_entries(priority_score DESC);
CREATE INDEX idx_feedback_tickets_project_id ON public.feedback_tickets(project_id);
CREATE INDEX idx_feedback_tickets_status ON public.feedback_tickets(status);
CREATE INDEX idx_feedback_tickets_assigned_to ON public.feedback_tickets(assigned_to);
CREATE INDEX idx_feedback_metrics_project_date ON public.feedback_metrics_daily(project_id, date);

-- Triggers for updated_at
CREATE TRIGGER update_feedback_modules_updated_at
  BEFORE UPDATE ON public.feedback_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_entries_updated_at
  BEFORE UPDATE ON public.feedback_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_tickets_updated_at
  BEFORE UPDATE ON public.feedback_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_campaigns_updated_at
  BEFORE UPDATE ON public.feedback_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to auto-create CRM activity when feedback is created
CREATE OR REPLACE FUNCTION public.create_crm_activity_from_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create activity if contact_id is present
  IF NEW.contact_id IS NOT NULL THEN
    INSERT INTO public.crm_activities (
      contact_id,
      type,
      title,
      description,
      completed,
      created_at
    )
    VALUES (
      NEW.contact_id,
      'feedback',
      'Feedback: ' || CASE 
        WHEN NEW.type = 'bug' THEN 'Bug Report'
        WHEN NEW.type = 'ideia' THEN 'Idea'
        WHEN NEW.type = 'duvida' THEN 'Question'
        WHEN NEW.type = 'srs' THEN 'Sprint Review'
        WHEN NEW.type = 'nps' THEN 'NPS'
        WHEN NEW.type = 'csat' THEN 'CSAT'
        ELSE UPPER(NEW.type)
      END,
      'Feedback recebido via ' || NEW.channel || ': ' || 
      CASE 
        WHEN LENGTH(NEW.verbatim) > 100 THEN LEFT(NEW.verbatim, 100) || '...'
        ELSE NEW.verbatim
      END,
      true,
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;