-- Criar tabela de projetos vinculados aos deals do CRM
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_development', 'on_hold', 'completed', 'cancelled')),
  client_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  project_manager_id UUID,
  start_date DATE,
  expected_end_date DATE,
  actual_end_date DATE,
  budget_value NUMERIC(12, 2),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  project_type TEXT DEFAULT 'software' CHECK (project_type IN ('software', 'automation', 'ai', 'games', 'consulting')),
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de sprints/fases do projeto
CREATE TABLE public.project_sprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sprint_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  goal_description TEXT,
  velocity_points INTEGER DEFAULT 0,
  burndown_data JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, sprint_number)
);

-- Criar tabela de tarefas e funcionalidades
CREATE TABLE public.project_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.project_sprints(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'feature' CHECK (task_type IN ('feature', 'bug', 'improvement', 'research', 'documentation', 'testing')),
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'testing', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID,
  reporter_id UUID,
  story_points INTEGER,
  estimated_hours NUMERIC(8, 2),
  actual_hours NUMERIC(8, 2),
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  dependencies UUID[],
  client_visible BOOLEAN DEFAULT false,
  acceptance_criteria TEXT[],
  custom_fields JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de marcos e entregas
CREATE TABLE public.project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  milestone_type TEXT DEFAULT 'delivery' CHECK (milestone_type IN ('delivery', 'review', 'approval', 'payment', 'kickoff')),
  due_date DATE NOT NULL,
  completed_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled')),
  deliverables TEXT[],
  client_action_required BOOLEAN DEFAULT false,
  client_action_description TEXT,
  dependencies UUID[],
  notification_sent BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de controle de acesso dos clientes
CREATE TABLE public.project_client_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  access_level TEXT DEFAULT 'viewer' CHECK (access_level IN ('viewer', 'collaborator', 'admin')),
  access_token TEXT UNIQUE,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  permissions JSONB DEFAULT '{"view_timeline": true, "view_tasks": true, "view_reports": true, "comment": false, "approve_milestones": false}',
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  invitation_accepted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, client_contact_id)
);

-- Criar tabela de relatórios automáticos
CREATE TABLE public.project_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('weekly', 'biweekly', 'monthly', 'milestone', 'custom')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_start DATE,
  period_end DATE,
  sent_to_client BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE,
  metrics JSONB DEFAULT '{}',
  template_used TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de histórico de atualizações
CREATE TABLE public.project_status_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('project', 'sprint', 'task', 'milestone')),
  entity_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'updated', 'deleted', 'status_changed', 'assigned', 'completed')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID,
  change_description TEXT,
  client_visible BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS em todas as tabelas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_client_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_status_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para projects
CREATE POLICY "Only authenticated users can manage projects" 
ON public.projects 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Projects are readable by authenticated users and clients with access" 
ON public.projects 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL OR 
  EXISTS (
    SELECT 1 FROM public.project_client_access pca 
    WHERE pca.project_id = projects.id 
    AND pca.is_active = true
  )
);

-- Políticas RLS para project_sprints
CREATE POLICY "Only authenticated users can manage sprints" 
ON public.project_sprints 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Sprints are readable by authenticated users and clients with access" 
ON public.project_sprints 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL OR 
  EXISTS (
    SELECT 1 FROM public.project_client_access pca 
    WHERE pca.project_id = project_sprints.project_id 
    AND pca.is_active = true
  )
);

-- Políticas RLS para project_tasks  
CREATE POLICY "Only authenticated users can manage tasks" 
ON public.project_tasks 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Tasks are readable by authenticated users and clients with appropriate access" 
ON public.project_tasks 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL OR 
  (client_visible = true AND EXISTS (
    SELECT 1 FROM public.project_client_access pca 
    WHERE pca.project_id = project_tasks.project_id 
    AND pca.is_active = true
    AND (pca.permissions->>'view_tasks')::boolean = true
  ))
);

-- Políticas RLS para project_milestones
CREATE POLICY "Only authenticated users can manage milestones" 
ON public.project_milestones 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Milestones are readable by authenticated users and clients with access" 
ON public.project_milestones 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL OR 
  EXISTS (
    SELECT 1 FROM public.project_client_access pca 
    WHERE pca.project_id = project_milestones.project_id 
    AND pca.is_active = true
  )
);

-- Políticas RLS para project_client_access
CREATE POLICY "Only authenticated users can manage client access" 
ON public.project_client_access 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Políticas RLS para project_reports
CREATE POLICY "Only authenticated users can manage reports" 
ON public.project_reports 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Reports are readable by authenticated users and clients with access" 
ON public.project_reports 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL OR 
  EXISTS (
    SELECT 1 FROM public.project_client_access pca 
    WHERE pca.project_id = project_reports.project_id 
    AND pca.is_active = true
    AND (pca.permissions->>'view_reports')::boolean = true
  )
);

-- Políticas RLS para project_status_logs
CREATE POLICY "Only authenticated users can read status logs" 
ON public.project_status_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can insert status logs" 
ON public.project_status_logs 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Criar índices para melhor performance
CREATE INDEX idx_projects_deal_id ON public.projects(deal_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_active ON public.projects(is_active);

CREATE INDEX idx_project_sprints_project_id ON public.project_sprints(project_id);
CREATE INDEX idx_project_sprints_status ON public.project_sprints(status);

CREATE INDEX idx_project_tasks_project_id ON public.project_tasks(project_id);
CREATE INDEX idx_project_tasks_sprint_id ON public.project_tasks(sprint_id);
CREATE INDEX idx_project_tasks_status ON public.project_tasks(status);
CREATE INDEX idx_project_tasks_assigned_to ON public.project_tasks(assigned_to);

CREATE INDEX idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX idx_project_milestones_due_date ON public.project_milestones(due_date);
CREATE INDEX idx_project_milestones_status ON public.project_milestones(status);

CREATE INDEX idx_project_client_access_project_id ON public.project_client_access(project_id);
CREATE INDEX idx_project_client_access_client_id ON public.project_client_access(client_contact_id);
CREATE INDEX idx_project_client_access_token ON public.project_client_access(access_token);

CREATE INDEX idx_project_reports_project_id ON public.project_reports(project_id);
CREATE INDEX idx_project_reports_type ON public.project_reports(report_type);

CREATE INDEX idx_project_status_logs_project_id ON public.project_status_logs(project_id);
CREATE INDEX idx_project_status_logs_entity ON public.project_status_logs(entity_type, entity_id);

-- Criar triggers para updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_sprints_updated_at
  BEFORE UPDATE ON public.project_sprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_client_access_updated_at
  BEFORE UPDATE ON public.project_client_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para automaticamente criar projeto quando deal muda para "Proposta"
CREATE OR REPLACE FUNCTION public.auto_create_project_from_deal()
RETURNS TRIGGER AS $$
DECLARE
  v_stage_name TEXT;
BEGIN
  -- Verificar se o deal mudou para um stage específico
  SELECT name INTO v_stage_name
  FROM public.crm_stages cs
  WHERE cs.id = NEW.stage_id;

  -- Se o deal está em "Proposta" e ainda não tem projeto, criar um projeto draft
  IF v_stage_name = 'Proposta' AND OLD.stage_id != NEW.stage_id THEN
    INSERT INTO public.projects (
      deal_id,
      title,
      description,
      status,
      client_id,
      budget_value,
      project_type
    )
    SELECT 
      NEW.id,
      'Projeto: ' || NEW.title,
      NEW.description,
      'draft',
      NEW.contact_id,
      NEW.value,
      CASE 
        WHEN 'software' = ANY(NEW.tags) THEN 'software'
        WHEN 'automacao' = ANY(NEW.tags) OR 'ia' = ANY(NEW.tags) THEN 'automation'
        WHEN 'jogos' = ANY(NEW.tags) THEN 'games'
        ELSE 'software'
      END
    WHERE NOT EXISTS (
      SELECT 1 FROM public.projects p WHERE p.deal_id = NEW.id
    );
  END IF;

  -- Se o deal foi fechado/ganho, ativar o projeto
  IF v_stage_name IN ('Fechado', 'Ganho', 'Closed Won') AND OLD.stage_id != NEW.stage_id THEN
    UPDATE public.projects 
    SET 
      status = 'in_development',
      start_date = CURRENT_DATE,
      updated_at = now()
    WHERE deal_id = NEW.id AND status = 'draft';

    -- Criar acesso para o cliente
    INSERT INTO public.project_client_access (
      project_id,
      client_contact_id,
      access_level,
      access_token,
      permissions
    )
    SELECT 
      p.id,
      NEW.contact_id,
      'viewer',
      encode(gen_random_bytes(32), 'hex'),
      '{"view_timeline": true, "view_tasks": true, "view_reports": true, "comment": true, "approve_milestones": true}'
    FROM public.projects p
    WHERE p.deal_id = NEW.id
    AND NOT EXISTS (
      SELECT 1 FROM public.project_client_access pca 
      WHERE pca.project_id = p.id AND pca.client_contact_id = NEW.contact_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar trigger para automatização
CREATE TRIGGER trigger_auto_create_project_from_deal
  AFTER UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_project_from_deal();

-- Criar função para log de mudanças
CREATE OR REPLACE FUNCTION public.log_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log para mudanças em projetos
  IF TG_TABLE_NAME = 'projects' THEN
    INSERT INTO public.project_status_logs (
      project_id,
      entity_type,
      entity_id,
      action_type,
      old_values,
      new_values,
      change_description,
      client_visible
    )
    VALUES (
      COALESCE(NEW.id, OLD.id),
      'project',
      COALESCE(NEW.id, OLD.id),
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'created'
        WHEN TG_OP = 'UPDATE' THEN 'updated'
        WHEN TG_OP = 'DELETE' THEN 'deleted'
      END,
      CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'Projeto criado'
        WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Status alterado de ' || OLD.status || ' para ' || NEW.status
        WHEN TG_OP = 'UPDATE' THEN 'Projeto atualizado'
        WHEN TG_OP = 'DELETE' THEN 'Projeto removido'
      END,
      CASE 
        WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN true
        ELSE false
      END
    );
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar triggers para log
CREATE TRIGGER trigger_log_project_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.log_project_changes();