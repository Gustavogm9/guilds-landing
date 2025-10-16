-- ============================================================================
-- MEDIDAS PREVENTIVAS: Sistema de Bootstrap e Auto-criação de Perfis
-- ============================================================================

-- 1. Função para criar perfil automaticamente no primeiro login/signup
CREATE OR REPLACE FUNCTION public.handle_user_profile_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Criar perfil automaticamente se não existir
  INSERT INTO public.user_profiles (
    user_id, 
    display_name, 
    is_active, 
    last_login_at
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    ),
    true,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    last_login_at = now(),
    is_active = true;
  
  RETURN NEW;
END;
$$;

-- 2. Trigger para criar perfil em novo signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_profile_creation();

-- 3. Trigger para atualizar perfil em login
DROP TRIGGER IF EXISTS on_auth_user_login ON auth.users;
CREATE TRIGGER on_auth_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.handle_user_profile_creation();

-- 4. Função para validar que sempre existe pelo menos um superadmin
CREATE OR REPLACE FUNCTION public.validate_superadmin_exists()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  superadmin_count INTEGER;
BEGIN
  -- Se estamos tentando remover ou desativar um superadmin
  IF (TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.is_active = false)) THEN
    -- Contar quantos superadmins ativos restam
    SELECT COUNT(*) INTO superadmin_count
    FROM public.user_roles
    WHERE role = 'superadmin' 
      AND is_active = true
      AND id != COALESCE(OLD.id, NEW.id);
    
    -- Se for o último superadmin, bloquear operação
    IF superadmin_count = 0 THEN
      RAISE EXCEPTION 'Cannot remove the last superadmin. At least one superadmin must exist.';
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 5. Trigger para proteger último superadmin
DROP TRIGGER IF EXISTS protect_last_superadmin ON public.user_roles;
CREATE TRIGGER protect_last_superadmin
  BEFORE UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  WHEN (OLD.role = 'superadmin' AND OLD.is_active = true)
  EXECUTE FUNCTION public.validate_superadmin_exists();

-- 6. Função auxiliar para criar primeiro admin (pode ser chamada manualmente)
CREATE OR REPLACE FUNCTION public.create_first_superadmin(
  p_email TEXT,
  p_display_name TEXT DEFAULT NULL
)
RETURNS TABLE(user_id UUID, role app_role, success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_existing_superadmin_count INTEGER;
BEGIN
  -- Verificar se já existe algum superadmin
  SELECT COUNT(*) INTO v_existing_superadmin_count
  FROM public.user_roles
  WHERE role = 'superadmin' AND is_active = true;
  
  IF v_existing_superadmin_count > 0 THEN
    RETURN QUERY SELECT 
      NULL::UUID, 
      NULL::app_role, 
      false, 
      'A superadmin already exists. Use regular user management instead.'::TEXT;
    RETURN;
  END IF;
  
  -- Buscar usuário pelo email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = p_email
  LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 
      NULL::UUID, 
      NULL::app_role, 
      false, 
      'User with email ' || p_email || ' not found.'::TEXT;
    RETURN;
  END IF;
  
  -- Criar perfil se não existir
  INSERT INTO public.user_profiles (user_id, display_name, is_active)
  VALUES (
    v_user_id,
    COALESCE(p_display_name, split_part(p_email, '@', 1)),
    true
  )
  ON CONFLICT (user_id) DO UPDATE SET
    is_active = true,
    display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name);
  
  -- Criar role de superadmin
  INSERT INTO public.user_roles (user_id, role, is_active, assigned_at)
  VALUES (v_user_id, 'superadmin'::app_role, true, now())
  ON CONFLICT (user_id, role) DO UPDATE SET
    is_active = true,
    assigned_at = now();
  
  -- Log da operação
  INSERT INTO public.crm_audit_log (
    entity_type,
    entity_id,
    action_type,
    changed_by,
    change_description
  )
  VALUES (
    'user',
    v_user_id,
    'bootstrap_superadmin',
    v_user_id,
    'First superadmin created via bootstrap function'
  );
  
  RETURN QUERY SELECT 
    v_user_id, 
    'superadmin'::app_role, 
    true, 
    'First superadmin created successfully.'::TEXT;
END;
$$;

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================

COMMENT ON FUNCTION public.handle_user_profile_creation() IS 
'Automatically creates or updates user profile on signup and login. Ensures every authenticated user has a profile.';

COMMENT ON FUNCTION public.validate_superadmin_exists() IS 
'Prevents deletion or deactivation of the last superadmin to ensure system always has at least one active superadmin.';

COMMENT ON FUNCTION public.create_first_superadmin(TEXT, TEXT) IS 
'Bootstrap function to create the first superadmin. Can only be used when no superadmin exists. Usage: SELECT * FROM create_first_superadmin(''email@example.com'', ''Display Name'');';