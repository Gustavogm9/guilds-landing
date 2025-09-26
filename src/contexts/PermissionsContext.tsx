import React, { createContext, useContext } from 'react';
import { usePermissions, AppRole, AppResource, PermissionAction, UserProfile, UserRole } from '@/hooks/usePermissions';

interface PermissionsContextType {
  userProfile: UserProfile | null;
  userRoles: AppRole[];
  permissions: Record<string, boolean>;
  loading: boolean;
  hasRole: (role: AppRole) => boolean;
  hasPermission: (resource: AppResource, action: PermissionAction) => Promise<boolean>;
  hasPermissionSync: (resource: AppResource, action: PermissionAction) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  canManageUsers: () => boolean;
  canApproveFinancial: () => boolean;
  getHighestRole: () => AppRole | null;
  refreshPermissions: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const permissionsData = usePermissions();

  return (
    <PermissionsContext.Provider value={permissionsData}>
      {children}
    </PermissionsContext.Provider>
  );
};