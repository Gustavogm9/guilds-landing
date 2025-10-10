-- Sprint 7: Métricas e Relatórios de Nurturing

-- Tabela para histórico de mudanças de score dos contatos
CREATE TABLE IF NOT EXISTS public.crm_contact_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  score_type TEXT NOT NULL CHECK (score_type IN ('lead_score', 'engagement_score', 'icp_score')),
  old_value INTEGER,
  new_value INTEGER NOT NULL,
  change_reason TEXT,
  changed_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_score_history_contact ON public.crm_contact_score_history(contact_id);
CREATE INDEX idx_score_history_created ON public.crm_contact_score_history(created_at DESC);

-- RLS policies
ALTER TABLE public.crm_contact_score_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view score history"
  ON public.crm_contact_score_history
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert score history"
  ON public.crm_contact_score_history
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger para registrar mudanças de score automaticamente
CREATE OR REPLACE FUNCTION public.log_contact_score_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log lead_score changes
  IF OLD.lead_score IS DISTINCT FROM NEW.lead_score THEN
    INSERT INTO public.crm_contact_score_history (
      contact_id,
      score_type,
      old_value,
      new_value,
      change_reason,
      changed_by
    )
    VALUES (
      NEW.id,
      'lead_score',
      OLD.lead_score,
      NEW.lead_score,
      CASE 
        WHEN OLD.lifecycle_stage != NEW.lifecycle_stage THEN 'Mudança de lifecycle: ' || OLD.lifecycle_stage || ' → ' || NEW.lifecycle_stage
        ELSE 'Atualização manual ou automática'
      END,
      auth.uid()
    );
  END IF;

  -- Log engagement_score changes
  IF OLD.engagement_score IS DISTINCT FROM NEW.engagement_score THEN
    INSERT INTO public.crm_contact_score_history (
      contact_id,
      score_type,
      old_value,
      new_value,
      change_reason,
      changed_by
    )
    VALUES (
      NEW.id,
      'engagement_score',
      OLD.engagement_score,
      NEW.engagement_score,
      'Atualização de engajamento',
      auth.uid()
    );
  END IF;

  -- Log icp_score changes
  IF OLD.icp_score IS DISTINCT FROM NEW.icp_score THEN
    INSERT INTO public.crm_contact_score_history (
      contact_id,
      score_type,
      old_value,
      new_value,
      change_reason,
      changed_by
    )
    VALUES (
      NEW.id,
      'icp_score',
      OLD.icp_score,
      NEW.icp_score,
      'Atualização de ICP score',
      auth.uid()
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_log_contact_score_changes
  AFTER UPDATE ON public.crm_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.log_contact_score_changes();

-- Adicionar campos de tracking em nurturing_enrollments
ALTER TABLE public.nurturing_enrollments
ADD COLUMN IF NOT EXISTS email_opens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS email_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS whatsapp_delivered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS whatsapp_read INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS whatsapp_replied INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conversion_value NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS converted_to_deal_id UUID REFERENCES public.crm_deals(id);

-- Tabela para rastrear eventos individuais de email
CREATE TABLE IF NOT EXISTS public.email_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES public.nurturing_enrollments(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  resend_event_id TEXT,
  email_subject TEXT,
  link_clicked TEXT,
  user_agent TEXT,
  ip_address INET,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_events_enrollment ON public.email_tracking_events(enrollment_id);
CREATE INDEX idx_email_events_contact ON public.email_tracking_events(contact_id);
CREATE INDEX idx_email_events_type ON public.email_tracking_events(event_type);
CREATE INDEX idx_email_events_created ON public.email_tracking_events(created_at DESC);

ALTER TABLE public.email_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only authenticated users can view email events"
  ON public.email_tracking_events
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert email events"
  ON public.email_tracking_events
  FOR INSERT
  WITH CHECK (true);

-- Função para atualizar métricas de enrollment com base em eventos
CREATE OR REPLACE FUNCTION public.update_enrollment_metrics_from_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.event_type = 'opened' THEN
    UPDATE public.nurturing_enrollments
    SET email_opens = email_opens + 1
    WHERE id = NEW.enrollment_id;
  ELSIF NEW.event_type = 'clicked' THEN
    UPDATE public.nurturing_enrollments
    SET email_clicks = email_clicks + 1
    WHERE id = NEW.enrollment_id;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_enrollment_metrics
  AFTER INSERT ON public.email_tracking_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_enrollment_metrics_from_event();

-- View materializada para métricas de sequences
CREATE MATERIALIZED VIEW IF NOT EXISTS public.nurturing_sequence_metrics AS
SELECT
  ns.id AS sequence_id,
  ns.name AS sequence_name,
  COUNT(DISTINCT ne.id) AS total_enrollments,
  COUNT(DISTINCT ne.id) FILTER (WHERE ne.status = 'active') AS active_enrollments,
  COUNT(DISTINCT ne.id) FILTER (WHERE ne.status = 'completed') AS completed_enrollments,
  COUNT(DISTINCT ne.id) FILTER (WHERE ne.status = 'failed') AS failed_enrollments,
  ROUND(
    COUNT(DISTINCT ne.id) FILTER (WHERE ne.status = 'completed')::NUMERIC / 
    NULLIF(COUNT(DISTINCT ne.id), 0) * 100, 
    2
  ) AS completion_rate,
  SUM(ne.email_opens) AS total_email_opens,
  SUM(ne.email_clicks) AS total_email_clicks,
  ROUND(
    SUM(ne.email_opens)::NUMERIC / 
    NULLIF(COUNT(DISTINCT ne.id), 0),
    2
  ) AS avg_opens_per_enrollment,
  ROUND(
    SUM(ne.email_clicks)::NUMERIC / 
    NULLIF(SUM(ne.email_opens), 0) * 100,
    2
  ) AS click_through_rate,
  COUNT(DISTINCT ne.converted_to_deal_id) AS total_conversions,
  ROUND(
    COUNT(DISTINCT ne.converted_to_deal_id)::NUMERIC /
    NULLIF(COUNT(DISTINCT ne.id), 0) * 100,
    2
  ) AS conversion_rate,
  SUM(ne.conversion_value) AS total_conversion_value,
  MAX(ne.updated_at) AS last_activity
FROM public.nurturing_sequences ns
LEFT JOIN public.nurturing_enrollments ne ON ne.sequence_id = ns.id
WHERE ns.is_active = true
GROUP BY ns.id, ns.name;

CREATE UNIQUE INDEX idx_sequence_metrics_id ON public.nurturing_sequence_metrics(sequence_id);

-- Função para refresh das métricas
CREATE OR REPLACE FUNCTION public.refresh_nurturing_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.nurturing_sequence_metrics;
END;
$$;