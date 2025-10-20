-- ============================================================================
-- FASE 1: ESTRUTURA DE DADOS - Sistema de Notificações CRM
-- ============================================================================

-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.crm_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('deal', 'contact', 'activity')),
  entity_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_crm_notifications_user_unread 
  ON public.crm_notifications(user_id, is_read, is_archived, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crm_notifications_entity 
  ON public.crm_notifications(entity_type, entity_id);

-- RLS Policies
ALTER TABLE public.crm_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.crm_notifications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL); -- NULL = broadcast para todos

CREATE POLICY "System can create notifications"
  ON public.crm_notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.crm_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNÇÕES SQL PARA GERAR NOTIFICAÇÕES AUTOMÁTICAS
-- ============================================================================

-- Função 1: Notificar follow-ups atrasados
CREATE OR REPLACE FUNCTION public.notify_overdue_follow_ups()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_notifications (
    user_id, entity_type, entity_id, notification_type, 
    priority, title, message, action_url, action_label, metadata
  )
  SELECT DISTINCT
    NULL, -- broadcast para todos (ou adicionar assigned_to em crm_contacts)
    'contact',
    c.id,
    'follow_up',
    CASE 
      WHEN c.next_action_date < now() - interval '3 days' THEN 'urgent'
      WHEN c.next_action_date < now() - interval '1 day' THEN 'high'
      ELSE 'medium'
    END,
    'Follow-up pendente',
    'Contato ' || c.name || ' aguarda retorno desde ' || 
      to_char(c.next_action_date, 'DD/MM/YYYY'),
    '/admin/crm?contact=' || c.id,
    'Ver contato',
    jsonb_build_object(
      'contact_name', c.name,
      'days_overdue', extract(day from now() - c.next_action_date)::int
    )
  FROM public.crm_contacts c
  WHERE c.next_action_date < now()
    AND c.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.crm_notifications n 
      WHERE n.entity_id = c.id 
        AND n.notification_type = 'follow_up'
        AND n.is_archived = false
        AND n.created_at > now() - interval '1 day'
    );
END;
$$;

-- Função 2: Notificar leads quentes
CREATE OR REPLACE FUNCTION public.notify_hot_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_notifications (
    user_id, entity_type, entity_id, notification_type,
    priority, title, message, action_url, action_label, metadata
  )
  SELECT DISTINCT
    NULL, -- broadcast
    'contact',
    c.id,
    'hot_lead',
    'urgent',
    '🔥 Lead quente identificado',
    c.name || ' tem score ' || c.lead_score || ' e está pronto para contato imediato.',
    '/admin/crm?contact=' || c.id,
    'Entrar em contato',
    jsonb_build_object(
      'contact_name', c.name,
      'lead_score', c.lead_score,
      'lifecycle_stage', c.lifecycle_stage
    )
  FROM public.crm_contacts c
  WHERE c.lead_score >= 80
    AND c.lifecycle_stage IN ('lead', 'mql')
    AND c.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM public.crm_notifications n
      WHERE n.entity_id = c.id
        AND n.notification_type = 'hot_lead'
        AND n.created_at > now() - interval '7 days'
    );
END;
$$;

-- Função 3: Notificar deals parados
CREATE OR REPLACE FUNCTION public.notify_stale_deals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_notifications (
    user_id, entity_type, entity_id, notification_type,
    priority, title, message, action_url, action_label, metadata
  )
  SELECT DISTINCT
    d.assigned_to,
    'deal',
    d.id,
    'stale_deal',
    CASE 
      WHEN now() - d.updated_at > interval '30 days' THEN 'high'
      ELSE 'medium'
    END,
    '⏰ Oportunidade parada',
    'Deal "' || d.title || '" está sem movimento há ' || 
      extract(day from now() - d.updated_at)::int || ' dias.',
    '/admin/crm?deal=' || d.id,
    'Ver oportunidade',
    jsonb_build_object(
      'deal_title', d.title,
      'days_stale', extract(day from now() - d.updated_at)::int,
      'deal_value', d.value
    )
  FROM public.crm_deals d
  WHERE d.is_active = true
    AND d.is_won IS NULL
    AND d.updated_at < now() - interval '14 days'
    AND NOT EXISTS (
      SELECT 1 FROM public.crm_notifications n
      WHERE n.entity_id = d.id
        AND n.notification_type = 'stale_deal'
        AND n.created_at > now() - interval '7 days'
    );
END;
$$;

-- ============================================================================
-- TRIGGERS PARA NOTIFICAÇÕES AUTOMÁTICAS
-- ============================================================================

-- Trigger 1: Notificar ao criar novo deal
CREATE OR REPLACE FUNCTION public.notify_new_deal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_notifications (
    user_id, entity_type, entity_id, notification_type,
    priority, title, message, action_url, action_label, metadata
  ) VALUES (
    NEW.assigned_to,
    'deal',
    NEW.id,
    'new_deal',
    'medium',
    '✨ Nova oportunidade criada',
    'Deal "' || NEW.title || '" foi criado no pipeline.',
    '/admin/crm?deal=' || NEW.id,
    'Ver oportunidade',
    jsonb_build_object(
      'deal_title', NEW.title,
      'deal_value', NEW.value,
      'source', NEW.source
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_new_deal
  AFTER INSERT ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_deal();

-- Trigger 2: Notificar ao deal mudar de estágio
CREATE OR REPLACE FUNCTION public.notify_deal_stage_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stage_name TEXT;
BEGIN
  IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
    SELECT name INTO v_stage_name FROM public.crm_stages WHERE id = NEW.stage_id;
    
    INSERT INTO public.crm_notifications (
      user_id, entity_type, entity_id, notification_type,
      priority, title, message, action_url, action_label, metadata
    ) VALUES (
      NEW.assigned_to,
      'deal',
      NEW.id,
      'deal_moved',
      'low',
      '➡️ Oportunidade avançou',
      'Deal "' || NEW.title || '" foi movido para ' || v_stage_name,
      '/admin/crm?deal=' || NEW.id,
      'Ver oportunidade',
      jsonb_build_object(
        'deal_title', NEW.title,
        'new_stage', v_stage_name,
        'deal_value', NEW.value
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_deal_stage_change
  AFTER UPDATE ON public.crm_deals
  FOR EACH ROW
  WHEN (OLD.stage_id IS DISTINCT FROM NEW.stage_id)
  EXECUTE FUNCTION public.notify_deal_stage_change();

-- Trigger 3: Notificar ao deal ser fechado (ganho/perdido)
CREATE OR REPLACE FUNCTION public.notify_deal_closed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.is_won IS NULL AND NEW.is_won IS NOT NULL THEN
    INSERT INTO public.crm_notifications (
      user_id, entity_type, entity_id, notification_type,
      priority, title, message, action_url, action_label, metadata
    ) VALUES (
      NEW.assigned_to,
      'deal',
      NEW.id,
      CASE WHEN NEW.is_won THEN 'deal_won' ELSE 'deal_lost' END,
      CASE WHEN NEW.is_won THEN 'high' ELSE 'low' END,
      CASE 
        WHEN NEW.is_won THEN '🎉 Oportunidade ganha!'
        ELSE '😔 Oportunidade perdida'
      END,
      CASE 
        WHEN NEW.is_won THEN 'Parabéns! Deal "' || NEW.title || '" foi fechado com sucesso.'
        ELSE 'Deal "' || NEW.title || '" foi marcado como perdido.'
      END,
      '/admin/crm?deal=' || NEW.id,
      'Ver detalhes',
      jsonb_build_object(
        'deal_title', NEW.title,
        'deal_value', NEW.value,
        'is_won', NEW.is_won,
        'closed_at', NEW.closed_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_notify_deal_closed
  AFTER UPDATE ON public.crm_deals
  FOR EACH ROW
  WHEN (OLD.is_won IS DISTINCT FROM NEW.is_won)
  EXECUTE FUNCTION public.notify_deal_closed();

-- Habilitar realtime para notificações
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_notifications;