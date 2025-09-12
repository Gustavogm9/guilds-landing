-- Phase 4: Integration & Automation
-- Create email notifications table for project communications
CREATE TABLE public.project_email_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_type TEXT NOT NULL DEFAULT 'client', -- 'client', 'admin', 'team'
  notification_type TEXT NOT NULL, -- 'milestone_due', 'task_completed', 'project_started', 'access_granted'
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  retry_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_email_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only authenticated users can manage email notifications"
ON public.project_email_notifications
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create indexes for performance
CREATE INDEX idx_project_email_notifications_project_id ON public.project_email_notifications(project_id);
CREATE INDEX idx_project_email_notifications_status ON public.project_email_notifications(status);
CREATE INDEX idx_project_email_notifications_created_at ON public.project_email_notifications(created_at);

-- Create webhook events table for external integrations
CREATE TABLE public.project_webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'project_created', 'milestone_completed', 'task_updated', 'client_access_granted'
  payload JSONB NOT NULL,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  response_code INTEGER,
  response_body TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.project_webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only authenticated users can manage webhook events"
ON public.project_webhook_events
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX idx_project_webhook_events_project_id ON public.project_webhook_events(project_id);
CREATE INDEX idx_project_webhook_events_status ON public.project_webhook_events(status);

-- Create client notification preferences table
CREATE TABLE public.client_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_contact_id UUID NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  milestone_notifications BOOLEAN DEFAULT true,
  task_notifications BOOLEAN DEFAULT false,
  report_notifications BOOLEAN DEFAULT true,
  frequency TEXT DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only authenticated users can manage notification preferences"
ON public.client_notification_preferences
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Function to generate client access token and send notification
CREATE OR REPLACE FUNCTION public.generate_client_access_token(
  p_project_id UUID,
  p_client_contact_id UUID,
  p_access_level TEXT DEFAULT 'viewer'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_token TEXT;
  v_project_title TEXT;
  v_client_name TEXT;
  v_client_email TEXT;
BEGIN
  -- Generate secure token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Get project and client info
  SELECT p.title INTO v_project_title
  FROM public.projects p
  WHERE p.id = p_project_id;
  
  SELECT c.name, c.email INTO v_client_name, v_client_email
  FROM public.crm_contacts c
  WHERE c.id = p_client_contact_id;
  
  -- Insert or update client access
  INSERT INTO public.project_client_access (
    project_id,
    client_contact_id,
    access_level,
    access_token,
    token_expires_at,
    permissions
  )
  VALUES (
    p_project_id,
    p_client_contact_id,
    p_access_level,
    v_token,
    now() + interval '1 year',
    '{"view_timeline": true, "view_tasks": true, "view_reports": true, "comment": true, "approve_milestones": true}'
  )
  ON CONFLICT (project_id, client_contact_id)
  DO UPDATE SET
    access_token = v_token,
    token_expires_at = now() + interval '1 year',
    updated_at = now();
  
  -- Create email notification
  INSERT INTO public.project_email_notifications (
    project_id,
    recipient_email,
    recipient_type,
    notification_type,
    subject,
    content,
    metadata
  )
  VALUES (
    p_project_id,
    v_client_email,
    'client',
    'access_granted',
    'Acesso ao Portal do Projeto: ' || v_project_title,
    'Olá ' || v_client_name || ',

Você agora tem acesso ao portal do cliente para acompanhar o progresso do projeto "' || v_project_title || '".

Acesse através do link: ' || current_setting('app.base_url', true) || '/portal/cliente?token=' || v_token || '

Através do portal você poderá:
- Acompanhar o cronograma do projeto
- Visualizar as tarefas em andamento
- Aprovar marcos importantes
- Receber relatórios de progresso

Qualquer dúvida, estamos à disposição.

Atenciosamente,
Equipe Guilds',
    jsonb_build_object(
      'token', v_token,
      'project_title', v_project_title,
      'client_name', v_client_name
    )
  );
  
  -- Create webhook event
  INSERT INTO public.project_webhook_events (
    project_id,
    event_type,
    payload
  )
  VALUES (
    p_project_id,
    'client_access_granted',
    jsonb_build_object(
      'project_id', p_project_id,
      'project_title', v_project_title,
      'client_id', p_client_contact_id,
      'client_name', v_client_name,
      'client_email', v_client_email,
      'access_level', p_access_level,
      'token', v_token,
      'timestamp', now()
    )
  );
  
  RETURN v_token;
END;
$$;

-- Enhanced trigger for project status changes
CREATE OR REPLACE FUNCTION public.handle_project_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_client_email TEXT;
  v_client_name TEXT;
BEGIN
  -- Get client info if exists
  IF NEW.client_id IS NOT NULL THEN
    SELECT c.email, c.name INTO v_client_email, v_client_name
    FROM public.crm_contacts c
    WHERE c.id = NEW.client_id;
  END IF;
  
  -- Handle project activation (from draft to in_development)
  IF OLD.status = 'draft' AND NEW.status = 'in_development' THEN
    -- Generate client access token if client exists
    IF NEW.client_id IS NOT NULL AND v_client_email IS NOT NULL THEN
      PERFORM public.generate_client_access_token(NEW.id, NEW.client_id, 'viewer');
    END IF;
    
    -- Create project started notification for admin
    INSERT INTO public.project_email_notifications (
      project_id,
      recipient_email,
      recipient_type,
      notification_type,
      subject,
      content,
      metadata
    )
    VALUES (
      NEW.id,
      'projetos@guilds.com.br',
      'admin',
      'project_started',
      'Projeto Iniciado: ' || NEW.title,
      'O projeto "' || NEW.title || '" foi oficialmente iniciado.',
      jsonb_build_object('project_id', NEW.id, 'project_title', NEW.title)
    );
  END IF;
  
  -- Handle project completion
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Notify client
    IF v_client_email IS NOT NULL THEN
      INSERT INTO public.project_email_notifications (
        project_id,
        recipient_email,
        recipient_type,
        notification_type,
        subject,
        content,
        metadata
      )
      VALUES (
        NEW.id,
        v_client_email,
        'client',
        'project_completed',
        'Projeto Concluído: ' || NEW.title,
        'Olá ' || COALESCE(v_client_name, 'Cliente') || ',

Temos o prazer de informar que o projeto "' || NEW.title || '" foi concluído com sucesso!

Todos os deliverables foram finalizados e estão disponíveis para sua avaliação no portal do cliente.

Agradecemos pela confiança e esperamos trabalhar juntos em futuros projetos.

Atenciosamente,
Equipe Guilds',
        jsonb_build_object('project_id', NEW.id, 'project_title', NEW.title)
      );
    END IF;
    
    -- Create webhook event
    INSERT INTO public.project_webhook_events (
      project_id,
      event_type,
      payload
    )
    VALUES (
      NEW.id,
      'project_completed',
      jsonb_build_object(
        'project_id', NEW.id,
        'project_title', NEW.title,
        'client_id', NEW.client_id,
        'completion_date', NEW.actual_end_date,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for project status changes
DROP TRIGGER IF EXISTS project_status_change_trigger ON public.projects;
CREATE TRIGGER project_status_change_trigger
  AFTER UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_project_status_change();

-- Enhanced milestone completion trigger
CREATE OR REPLACE FUNCTION public.handle_milestone_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_project_title TEXT;
  v_client_email TEXT;
  v_client_name TEXT;
BEGIN
  -- Only handle status changes to completed
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    -- Get project and client info
    SELECT p.title, c.email, c.name 
    INTO v_project_title, v_client_email, v_client_name
    FROM public.projects p
    LEFT JOIN public.crm_contacts c ON c.id = p.client_id
    WHERE p.id = NEW.project_id;
    
    -- Create notification if client exists
    IF v_client_email IS NOT NULL THEN
      INSERT INTO public.project_email_notifications (
        project_id,
        recipient_email,
        recipient_type,
        notification_type,
        subject,
        content,
        metadata
      )
      VALUES (
        NEW.project_id,
        v_client_email,
        'client',
        'milestone_completed',
        'Marco Concluído - ' || v_project_title,
        'Olá ' || COALESCE(v_client_name, 'Cliente') || ',

O marco "' || NEW.title || '" do projeto "' || v_project_title || '" foi concluído!

' || CASE WHEN NEW.client_action_required THEN 
'⚠️ AÇÃO NECESSÁRIA: ' || COALESCE(NEW.client_action_description, 'Sua aprovação é necessária para continuar.')
ELSE 'O projeto continua conforme o cronograma planejado.' END || '

Acesse o portal do cliente para mais detalhes.

Atenciosamente,
Equipe Guilds',
        jsonb_build_object(
          'milestone_id', NEW.id,
          'milestone_title', NEW.title,
          'project_id', NEW.project_id,
          'project_title', v_project_title,
          'client_action_required', NEW.client_action_required
        )
      );
    END IF;
    
    -- Create webhook event
    INSERT INTO public.project_webhook_events (
      project_id,
      event_type,
      payload
    )
    VALUES (
      NEW.project_id,
      'milestone_completed',
      jsonb_build_object(
        'milestone_id', NEW.id,
        'milestone_title', NEW.title,
        'project_id', NEW.project_id,
        'project_title', v_project_title,
        'completion_date', NEW.completed_date,
        'client_action_required', NEW.client_action_required,
        'timestamp', now()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for milestone completion
DROP TRIGGER IF EXISTS milestone_completion_trigger ON public.project_milestones;
CREATE TRIGGER milestone_completion_trigger
  AFTER UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_milestone_completion();

-- Add updated_at triggers to new tables
CREATE TRIGGER update_project_email_notifications_updated_at
  BEFORE UPDATE ON public.project_email_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_notification_preferences_updated_at
  BEFORE UPDATE ON public.client_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();