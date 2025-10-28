import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type AppRole = 'superadmin' | 'admin' | 'manager' | 'analyst' | 'viewer';
export type AppResource = 'crm' | 'financial' | 'projects' | 'feedback' | 'analytics' | 'settings' | 'users' | 'campaigns' | 'newsletters' | 'workshops';
export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'manage';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  job_title?: string;
  is_active: boolean;
  last_login_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by?: string;
  assigned_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    // ✅ GUARD: Se não há usuário, retornar imediatamente sem fazer requests
    if (!user) {
      setUserProfile(null);
      setUserRoles([]);
      setPermissions({});
      setLoading(false);
      return; // ← PARA AQUI, sem fazer requests ao Supabase!
    }

    try {
      // Fetch user profile (silently fail if table doesn't exist or RLS blocks)
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileError) {
        setUserProfile(profile);
      }

      // Fetch user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .or('expires_at.is.null,expires_at.gt.now()');

      const roleList = roles?.map(r => r.role as AppRole) || [];
      setUserRoles(roleList);

      // Cache permissions for common operations
      const permissionCache: Record<string, boolean> = {};
      const resources: AppResource[] = ['crm', 'financial', 'projects', 'feedback', 'analytics', 'settings', 'users', 'campaigns'];
      const actions: PermissionAction[] = ['create', 'read', 'update', 'delete', 'approve', 'manage'];

      for (const resource of resources) {
        for (const action of actions) {
          const key = `${resource}:${action}`;
          const { data } = await supabase.rpc('has_permission', {
            p_user_id: user.id,
            p_resource: resource,
            p_action: action
          });
          permissionCache[key] = data || false;
        }
      }

      setPermissions(permissionCache);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const hasRole = (role: AppRole): boolean => {
    return userRoles.includes(role);
  };

  const hasPermission = async (resource: AppResource, action: PermissionAction): Promise<boolean> => {
    if (!user) return false;
    
    // Check cache first
    const cacheKey = `${resource}:${action}`;
    if (permissions[cacheKey] !== undefined) {
      return permissions[cacheKey];
    }

    // Fetch from database
    try {
      const { data } = await supabase.rpc('has_permission', {
        p_user_id: user.id,
        p_resource: resource,
        p_action: action
      });
      
      // Update cache
      setPermissions(prev => ({ ...prev, [cacheKey]: data || false }));
      return data || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  const hasPermissionSync = (resource: AppResource, action: PermissionAction): boolean => {
    const cacheKey = `${resource}:${action}`;
    return permissions[cacheKey] || false;
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('superadmin');
  };

  const isAdmin = (): boolean => {
    return hasRole('superadmin') || hasRole('admin');
  };

  const canManageUsers = (): boolean => {
    return hasPermissionSync('users', 'manage');
  };

  const canApproveFinancial = (): boolean => {
    return hasPermissionSync('financial', 'approve');
  };

  const getHighestRole = (): AppRole | null => {
    const roleHierarchy: AppRole[] = ['superadmin', 'admin', 'manager', 'analyst', 'viewer'];
    for (const role of roleHierarchy) {
      if (hasRole(role)) {
        return role;
      }
    }
    return null;
  };

  const refreshPermissions = () => {
    fetchUserData();
  };

  return {
    userProfile,
    userRoles,
    permissions,
    loading,
    hasRole,
    hasPermission,
    hasPermissionSync,
    isSuperAdmin,
    isAdmin,
    canManageUsers,
    canApproveFinancial,
    getHighestRole,
    refreshPermissions
  };
};