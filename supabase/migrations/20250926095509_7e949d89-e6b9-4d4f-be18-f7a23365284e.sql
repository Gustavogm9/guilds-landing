-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'manager', 'analyst', 'viewer');

-- Create enum for permission actions
CREATE TYPE public.permission_action AS ENUM ('create', 'read', 'update', 'delete', 'approve', 'export', 'manage');

-- Create enum for resources/modules
CREATE TYPE public.app_resource AS ENUM ('crm', 'financial', 'projects', 'feedback', 'analytics', 'settings', 'users', 'campaigns', 'newsletters', 'workshops');

-- Create user profiles table (connects auth.users to employees)
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  department TEXT,
  job_title TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  UNIQUE(user_id, role)
);

-- Create role permissions table (what each role can do by default)
CREATE TABLE public.role_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role public.app_role NOT NULL,
  resource public.app_resource NOT NULL,
  action public.permission_action NOT NULL,
  conditions JSONB DEFAULT '{}',
  is_granted BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(role, resource, action)
);

-- Create user-specific permissions (overrides role defaults)
CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource public.app_resource NOT NULL,
  action public.permission_action NOT NULL,
  is_granted BOOLEAN NOT NULL,
  conditions JSONB DEFAULT '{}',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  UNIQUE(user_id, resource, action)
);

-- Create permission audit log
CREATE TABLE public.permission_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  target_user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL, -- 'grant', 'revoke', 'modify', 'login_attempt'
  resource public.app_resource,
  permission public.permission_action,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_audit_log ENABLE ROW LEVEL SECURITY;

-- Security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_roles(p_user_id UUID)
RETURNS TABLE(role_name public.app_role)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT ur.role
  FROM public.user_roles ur
  WHERE ur.user_id = p_user_id
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > now());
$$;

CREATE OR REPLACE FUNCTION public.has_role(p_user_id UUID, p_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.get_user_roles(p_user_id) WHERE role_name = p_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(p_user_id UUID, p_resource public.app_resource, p_action public.permission_action)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  user_specific_perm BOOLEAN;
  role_perm BOOLEAN;
  user_role public.app_role;
BEGIN
  -- Check for user-specific permission (overrides role)
  SELECT up.is_granted INTO user_specific_perm
  FROM public.user_permissions up
  WHERE up.user_id = p_user_id
    AND up.resource = p_resource
    AND up.action = p_action
    AND (up.expires_at IS NULL OR up.expires_at > now());
  
  IF user_specific_perm IS NOT NULL THEN
    RETURN user_specific_perm;
  END IF;
  
  -- Check role-based permissions
  FOR user_role IN 
    SELECT role_name FROM public.get_user_roles(p_user_id)
  LOOP
    SELECT rp.is_granted INTO role_perm
    FROM public.role_permissions rp
    WHERE rp.role = user_role
      AND rp.resource = p_resource
      AND rp.action = p_action;
    
    IF role_perm = true THEN
      RETURN true;
    END IF;
  END LOOP;
  
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT public.has_role(p_user_id, 'superadmin');
$$;

-- RLS Policies
-- User profiles: users can see their own, admins can see all
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT USING (public.has_permission(auth.uid(), 'users', 'read'));

CREATE POLICY "Superadmins can manage all profiles" ON public.user_profiles
  FOR ALL USING (public.is_superadmin());

-- User roles: only superadmins and admins can manage
CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT USING (public.has_permission(auth.uid(), 'users', 'read'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_permission(auth.uid(), 'users', 'manage'));

-- Role permissions: readable by authenticated users, manageable by superadmins
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Superadmins can manage role permissions" ON public.role_permissions
  FOR ALL USING (public.is_superadmin());

-- User permissions: manageable by admins
CREATE POLICY "Admins can view user permissions" ON public.user_permissions
  FOR SELECT USING (public.has_permission(auth.uid(), 'users', 'read'));

CREATE POLICY "Admins can manage user permissions" ON public.user_permissions
  FOR ALL USING (public.has_permission(auth.uid(), 'users', 'manage'));

-- Audit log: readable by admins
CREATE POLICY "Admins can view audit log" ON public.permission_audit_log
  FOR SELECT USING (public.has_permission(auth.uid(), 'users', 'read'));

-- Trigger to update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default role permissions
INSERT INTO public.role_permissions (role, resource, action, is_granted) VALUES
-- Superadmin: can do everything
('superadmin', 'crm', 'create', true),
('superadmin', 'crm', 'read', true),
('superadmin', 'crm', 'update', true),
('superadmin', 'crm', 'delete', true),
('superadmin', 'crm', 'manage', true),
('superadmin', 'financial', 'create', true),
('superadmin', 'financial', 'read', true),
('superadmin', 'financial', 'update', true),
('superadmin', 'financial', 'delete', true),
('superadmin', 'financial', 'approve', true),
('superadmin', 'financial', 'manage', true),
('superadmin', 'projects', 'create', true),
('superadmin', 'projects', 'read', true),
('superadmin', 'projects', 'update', true),
('superadmin', 'projects', 'delete', true),
('superadmin', 'projects', 'manage', true),
('superadmin', 'feedback', 'read', true),
('superadmin', 'feedback', 'update', true),
('superadmin', 'feedback', 'manage', true),
('superadmin', 'analytics', 'read', true),
('superadmin', 'settings', 'read', true),
('superadmin', 'settings', 'update', true),
('superadmin', 'settings', 'manage', true),
('superadmin', 'users', 'read', true),
('superadmin', 'users', 'create', true),
('superadmin', 'users', 'update', true),
('superadmin', 'users', 'delete', true),
('superadmin', 'users', 'manage', true),
('superadmin', 'campaigns', 'create', true),
('superadmin', 'campaigns', 'read', true),
('superadmin', 'campaigns', 'update', true),
('superadmin', 'campaigns', 'delete', true),
('superadmin', 'campaigns', 'manage', true),

-- Admin: most things except user management
('admin', 'crm', 'create', true),
('admin', 'crm', 'read', true),
('admin', 'crm', 'update', true),
('admin', 'crm', 'delete', true),
('admin', 'financial', 'create', true),
('admin', 'financial', 'read', true),
('admin', 'financial', 'update', true),
('admin', 'financial', 'approve', true),
('admin', 'projects', 'create', true),
('admin', 'projects', 'read', true),
('admin', 'projects', 'update', true),
('admin', 'projects', 'delete', true),
('admin', 'feedback', 'read', true),
('admin', 'feedback', 'update', true),
('admin', 'analytics', 'read', true),
('admin', 'settings', 'read', true),
('admin', 'campaigns', 'create', true),
('admin', 'campaigns', 'read', true),
('admin', 'campaigns', 'update', true),

-- Manager: operations and team management
('manager', 'crm', 'create', true),
('manager', 'crm', 'read', true),
('manager', 'crm', 'update', true),
('manager', 'financial', 'read', true),
('manager', 'projects', 'create', true),
('manager', 'projects', 'read', true),
('manager', 'projects', 'update', true),
('manager', 'feedback', 'read', true),
('manager', 'analytics', 'read', true),
('manager', 'campaigns', 'read', true),

-- Analyst: data analysis and reporting
('analyst', 'crm', 'read', true),
('analyst', 'financial', 'read', true),
('analyst', 'projects', 'read', true),
('analyst', 'feedback', 'read', true),
('analyst', 'analytics', 'read', true),
('analyst', 'campaigns', 'read', true),

-- Viewer: read-only access
('viewer', 'crm', 'read', true),
('viewer', 'projects', 'read', true),
('viewer', 'feedback', 'read', true);

-- Create function to log permission changes
CREATE OR REPLACE FUNCTION public.log_permission_audit()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.permission_audit_log (user_id, target_user_id, action_type, resource, permission, new_value)
    VALUES (auth.uid(), NEW.user_id, 'grant', NEW.resource, NEW.action, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.permission_audit_log (user_id, target_user_id, action_type, resource, permission, old_value, new_value)
    VALUES (auth.uid(), NEW.user_id, 'modify', NEW.resource, NEW.action, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.permission_audit_log (user_id, target_user_id, action_type, resource, permission, old_value)
    VALUES (auth.uid(), OLD.user_id, 'revoke', OLD.resource, OLD.action, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Trigger for audit logging
CREATE TRIGGER user_permissions_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_permissions
  FOR EACH ROW EXECUTE FUNCTION public.log_permission_audit();

CREATE TRIGGER user_roles_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_permission_audit();