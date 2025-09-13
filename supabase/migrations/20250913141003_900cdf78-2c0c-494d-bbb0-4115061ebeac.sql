-- Fix security issues from Phase 5
-- Drop the problematic view and create a secure function instead
DROP VIEW IF EXISTS public.admin_dashboard_summary;

-- Create secure function to get dashboard summary
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_summary()
RETURNS TABLE(
  total_projects BIGINT,
  active_projects BIGINT,
  new_projects_month BIGINT,
  total_contacts BIGINT,
  total_deals BIGINT,
  new_contacts_month BIGINT,
  pending_emails BIGINT,
  pending_webhooks BIGINT,
  failed_emails BIGINT,
  avg_email_processing_time NUMERIC,
  system_errors_today BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is authenticated (only authenticated users can access dashboard)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  RETURN QUERY
  SELECT 
    -- Project metrics
    (SELECT COUNT(*) FROM public.projects WHERE is_active = true)::BIGINT,
    (SELECT COUNT(*) FROM public.projects WHERE status = 'in_development')::BIGINT,
    (SELECT COUNT(*) FROM public.projects WHERE created_at >= now() - interval '30 days')::BIGINT,
    
    -- CRM metrics
    (SELECT COUNT(*) FROM public.crm_contacts WHERE is_active = true)::BIGINT,
    (SELECT COUNT(*) FROM public.crm_deals WHERE is_active = true)::BIGINT,
    (SELECT COUNT(*) FROM public.crm_contacts WHERE created_at >= now() - interval '30 days')::BIGINT,
    
    -- Notification metrics
    (SELECT COUNT(*) FROM public.project_email_notifications WHERE status = 'pending')::BIGINT,
    (SELECT COUNT(*) FROM public.project_webhook_events WHERE status = 'pending')::BIGINT,
    (SELECT COUNT(*) FROM public.project_email_notifications WHERE status = 'failed' AND retry_count >= 3)::BIGINT,
    
    -- System performance
    (SELECT AVG(duration_ms) FROM public.system_performance_logs WHERE operation_type = 'email_batch' AND created_at >= now() - interval '24 hours'),
    (SELECT COUNT(*) FROM public.system_performance_logs WHERE status = 'failed' AND created_at >= now() - interval '24 hours')::BIGINT;
END;
$$;

-- Update other functions to have proper search_path
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

Acesse através do link: https://guilds.com.br/portal/cliente?token=' || v_token || '

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

-- Update other functions with proper search_path
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

-- Restrict access to materialized view
REVOKE SELECT ON public.project_statistics FROM anon;
GRANT SELECT ON public.project_statistics TO authenticated;

-- Create a secure function to access project statistics for authenticated users only
CREATE OR REPLACE FUNCTION public.get_project_statistics()
RETURNS TABLE(
  total_projects BIGINT,
  draft_projects BIGINT,
  active_projects BIGINT,
  completed_projects BIGINT,
  on_hold_projects BIGINT,
  avg_progress NUMERIC,
  unique_clients BIGINT,
  total_budget NUMERIC,
  avg_budget NUMERIC,
  projects_last_30_days BIGINT,
  projects_last_7_days BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  RETURN QUERY
  SELECT * FROM public.project_statistics;
END;
$$;