-- ============================================================================
-- BOOTSTRAP COM TRIGGERS DE USUÁRIO DESABILITADOS
-- ============================================================================

-- Desabilitar apenas triggers de usuário (não triggers de sistema/constraints)
ALTER TABLE public.user_roles DISABLE TRIGGER USER;

-- 1. Criar perfil do usuário  
INSERT INTO public.user_profiles (
  user_id,
  display_name,
  is_active,
  last_login_at
)
VALUES (
  'cf48dc11-1d53-481c-bbd9-e8c6eda29f5f'::uuid,
  'Gustavo Macedo',
  true,
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  last_login_at = now(),
  is_active = true;

-- 2. Criar role de superadmin
INSERT INTO public.user_roles (
  user_id,
  role,
  is_active,
  assigned_at
)
VALUES (
  'cf48dc11-1d53-481c-bbd9-e8c6eda29f5f'::uuid,
  'superadmin'::app_role,
  true,
  now()
)
ON CONFLICT (user_id, role) DO UPDATE SET
  is_active = true,
  assigned_at = now();

-- Reabilitar triggers de usuário
ALTER TABLE public.user_roles ENABLE TRIGGER USER;

-- 3. Remover permanentemente o trigger incorreto
DROP TRIGGER IF EXISTS user_roles_audit_trigger ON public.user_roles;