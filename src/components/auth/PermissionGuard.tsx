import React, { useState, useEffect } from 'react';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { AppRole, AppResource, PermissionAction } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  role?: AppRole;
  resource?: AppResource;
  action?: PermissionAction;
  fallback?: React.ReactNode;
  showError?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  role,
  resource,
  action,
  fallback = null,
  showError = false
}) => {
  const { hasRole, hasPermission, hasPermissionSync, loading } = usePermissionsContext();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      let access = false;

      // Check role-based access
      if (role) {
        access = hasRole(role);
      }

      // Check permission-based access
      if (resource && action) {
        // Try sync first for performance
        access = hasPermissionSync(resource, action);
        
        // If not in cache, check async
        if (!access) {
          access = await hasPermission(resource, action);
        }
      }

      // If both role and resource/action are specified, user needs both
      if (role && resource && action) {
        access = hasRole(role) && (hasPermissionSync(resource, action) || await hasPermission(resource, action));
      }

      setHasAccess(access);
      setCheckComplete(true);
    };

    checkAccess();
  }, [role, resource, action, hasRole, hasPermission, hasPermissionSync, loading]);

  if (loading || !checkComplete) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (showError) {
      return (
        <Alert className="m-4">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para acessar este recurso.
          </AlertDescription>
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Higher-order component for role-based rendering
export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  role?: AppRole,
  resource?: AppResource,
  action?: PermissionAction
) => {
  return (props: P) => (
    <PermissionGuard role={role} resource={resource} action={action}>
      <WrappedComponent {...props} />
    </PermissionGuard>
  );
};

// Utility components for common permission checks
export const SuperAdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PermissionGuard role="superadmin">{children}</PermissionGuard>
);

export const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PermissionGuard resource="users" action="manage">{children}</PermissionGuard>
);

export const ManagerOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PermissionGuard role="manager">{children}</PermissionGuard>
);