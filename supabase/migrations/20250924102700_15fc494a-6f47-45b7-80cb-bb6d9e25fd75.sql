-- Add the missing trigger for feedback entries to create CRM activities
CREATE TRIGGER trigger_create_crm_activity_from_feedback
  AFTER INSERT ON public.feedback_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_crm_activity_from_feedback();

-- Insert some seed data for demonstration
INSERT INTO public.feedback_modules (project_id, key, name, path_hint, description) 
SELECT 
  p.id,
  'dashboard',
  'Dashboard Principal',
  '/dashboard',
  'Tela principal do sistema'
FROM public.projects p
WHERE p.is_active = true
LIMIT 1;

INSERT INTO public.feedback_modules (project_id, key, name, path_hint, description) 
SELECT 
  p.id,
  'reports',
  'Relatórios',
  '/reports',
  'Seção de relatórios e análises'
FROM public.projects p
WHERE p.is_active = true
LIMIT 1;

-- Insert sample feedback entries
INSERT INTO public.feedback_entries (
  project_id,
  module_id,
  persona,
  channel,
  type,
  severity,
  verbatim,
  context,
  priority_score
)
SELECT 
  p.id,
  fm.id,
  'usuario_final',
  'inapp',
  'bug',
  'high',
  'O botão de salvar não funciona quando clico duas vezes rapidamente',
  '{"url": "/dashboard", "browser": "Chrome", "timestamp": "2025-01-20T10:30:00Z"}',
  85
FROM public.projects p
CROSS JOIN public.feedback_modules fm
WHERE p.is_active = true AND fm.key = 'dashboard'
LIMIT 1;

INSERT INTO public.feedback_entries (
  project_id,
  module_id,
  persona,
  channel,
  type,
  severity,
  verbatim,
  context,
  priority_score
)
SELECT 
  p.id,
  fm.id,
  'gestor',
  'email',
  'ideia',
  'medium',
  'Seria interessante ter filtros por período nos relatórios',
  '{"source": "reunião semanal", "stakeholder": "gerente financeiro"}',
  65
FROM public.projects p
CROSS JOIN public.feedback_modules fm
WHERE p.is_active = true AND fm.key = 'reports'
LIMIT 1;