import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { AppRole, AppResource, PermissionAction } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Users, 
  Settings, 
  TrendingUp, 
  FileText, 
  DollarSign,
  FolderOpen,
  MessageSquare,
  Mail,
  BookOpen,
  ArrowRight,
  Crown,
  Key
} from 'lucide-react';

interface RoleStats {
  role: AppRole;
  userCount: number;
  permissions: {
    resource: AppResource;
    actions: PermissionAction[];
  }[];
}

interface RoleHierarchyData {
  role: AppRole;
  level: number;
  description: string;
  permissions: string[];
  canDelegateTo: AppRole[];
  userCount: number;
}

export const RoleHierarchy: React.FC = () => {
  const { isSuperAdmin, isAdmin } = usePermissionsContext();
  const [roleStats, setRoleStats] = useState<RoleStats[]>([]);
  const [loading, setLoading] = useState(true);

  const roleHierarchy: RoleHierarchyData[] = [
    {
      role: 'superadmin',
      level: 1,
      description: 'Controle total do sistema. Pode gerenciar usuários, configurações e todas as funcionalidades.',
      permissions: ['Gerenciar usuários', 'Configurar sistema', 'Aprovar tudo', 'Auditoria completa'],
      canDelegateTo: ['admin', 'manager', 'analyst', 'viewer'],
      userCount: 0
    },
    {
      role: 'admin',
      level: 2,
      description: 'Administrador do sistema. Pode gerenciar operações, projetos e equipe.',
      permissions: ['Gerenciar CRM', 'Aprovar financeiro', 'Gerenciar projetos', 'Ver relatórios'],
      canDelegateTo: ['manager', 'analyst', 'viewer'],
      userCount: 0
    },
    {
      role: 'manager',
      level: 3,
      description: 'Gerente operacional. Pode criar e gerenciar deals, projetos e acompanhar equipe.',
      permissions: ['Criar deals', 'Gerenciar projetos', 'Ver financeiro', 'Gerenciar feedback'],
      canDelegateTo: ['analyst', 'viewer'],
      userCount: 0
    },
    {
      role: 'analyst',
      level: 4,
      description: 'Analista de dados. Acesso aos relatórios e análises do sistema.',
      permissions: ['Ver relatórios', 'Analisar dados', 'Exportar dados', 'Ver feedback'],
      canDelegateTo: ['viewer'],
      userCount: 0
    },
    {
      role: 'viewer',
      level: 5,
      description: 'Visualizador. Acesso apenas de leitura aos dados básicos.',
      permissions: ['Ver CRM', 'Ver projetos', 'Ver feedback básico'],
      canDelegateTo: [],
      userCount: 0
    }
  ];

  const roleLabels: Record<AppRole, string> = {
    superadmin: 'Super Administrador',
    admin: 'Administrador',
    manager: 'Gerente',
    analyst: 'Analista',
    viewer: 'Visualizador'
  };

  const roleIcons: Record<AppRole, React.ReactNode> = {
    superadmin: <Crown className="h-5 w-5 text-purple-500" />,
    admin: <Shield className="h-5 w-5 text-blue-500" />,
    manager: <Users className="h-5 w-5 text-green-500" />,
    analyst: <TrendingUp className="h-5 w-5 text-orange-500" />,
    viewer: <FileText className="h-5 w-5 text-gray-500" />
  };

  const resourceIcons: Record<AppResource, React.ReactNode> = {
    crm: <Users className="h-4 w-4" />,
    financial: <DollarSign className="h-4 w-4" />,
    projects: <FolderOpen className="h-4 w-4" />,
    feedback: <MessageSquare className="h-4 w-4" />,
    analytics: <TrendingUp className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />,
    users: <Shield className="h-4 w-4" />,
    campaigns: <Mail className="h-4 w-4" />,
    newsletters: <Mail className="h-4 w-4" />,
    workshops: <BookOpen className="h-4 w-4" />
  };

  useEffect(() => {
    if (!isAdmin() && !isSuperAdmin()) {
      return;
    }
    fetchRoleStats();
  }, [isAdmin, isSuperAdmin]);

  const fetchRoleStats = async () => {
    try {
      // Fetch user counts by role
      const { data: userCounts } = await supabase
        .from('user_roles')
        .select('role')
        .eq('is_active', true);

      // Fetch role permissions
      const { data: permissions } = await supabase
        .from('role_permissions')
        .select('role, resource, action')
        .eq('is_granted', true);

      // Process data
      const roleStatsMap = new Map<AppRole, RoleStats>();
      
      // Initialize with zero counts
      roleHierarchy.forEach(rh => {
        roleStatsMap.set(rh.role, {
          role: rh.role,
          userCount: 0,
          permissions: []
        });
      });

      // Count users per role
      userCounts?.forEach(uc => {
        const stats = roleStatsMap.get(uc.role as AppRole);
        if (stats) {
          stats.userCount++;
        }
      });

      // Group permissions by role and resource
      permissions?.forEach(perm => {
        const stats = roleStatsMap.get(perm.role as AppRole);
        if (stats) {
          let resourcePerms = stats.permissions.find(p => p.resource === perm.resource);
          if (!resourcePerms) {
            resourcePerms = { resource: perm.resource as AppResource, actions: [] };
            stats.permissions.push(resourcePerms);
          }
          resourcePerms.actions.push(perm.action as PermissionAction);
        }
      });

      setRoleStats(Array.from(roleStatsMap.values()));
    } catch (error) {
      console.error('Error fetching role stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPermissions = (role: AppRole): number => {
    const stats = roleStats.find(s => s.role === role);
    return stats?.permissions.reduce((total, perm) => total + perm.actions.length, 0) || 0;
  };

  const getPermissionCoverage = (role: AppRole): number => {
    const total = getTotalPermissions(role);
    const maxPossible = Object.keys(resourceIcons).length * 7; // 7 actions per resource
    return Math.round((total / maxPossible) * 100);
  };

  if (!isAdmin() && !isSuperAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar a hierarquia de roles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Hierarquia de Roles</h1>
        <p className="text-muted-foreground mt-2">
          Visualize a estrutura de permissões e delegação do sistema
        </p>
      </div>

      {/* Hierarchy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Estrutura Hierárquica</span>
          </CardTitle>
          <CardDescription>
            Cada nível pode delegar permissões para os níveis abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roleHierarchy.map((roleData, index) => {
              const stats = roleStats.find(s => s.role === roleData.role);
              const userCount = stats?.userCount || 0;
              const coverage = getPermissionCoverage(roleData.role);
              
              return (
                <div key={roleData.role}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {roleIcons[roleData.role]}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {roleLabels[roleData.role]}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Nível {roleData.level} da hierarquia
                              </p>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold">{userCount}</div>
                              <div className="text-sm text-muted-foreground">usuários</div>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4">
                            {roleData.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Permissões Principais</h4>
                              <div className="space-y-1">
                                {roleData.permissions.map((perm, idx) => (
                                  <div key={idx} className="flex items-center text-sm">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                    {perm}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Cobertura de Permissões</h4>
                              <div className="space-y-2">
                                <Progress value={coverage} className="h-2" />
                                <div className="flex justify-between text-sm text-muted-foreground">
                                  <span>{getTotalPermissions(roleData.role)} permissões</span>
                                  <span>{coverage}% cobertura</span>
                                </div>
                              </div>
                              
                              {roleData.canDelegateTo.length > 0 && (
                                <div className="mt-3">
                                  <div className="text-sm text-muted-foreground mb-1">
                                    Pode delegar para:
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {roleData.canDelegateTo.map((delegateRole) => (
                                      <Badge key={delegateRole} variant="outline" className="text-xs">
                                        {roleLabels[delegateRole]}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Resource Permissions Breakdown */}
                          {stats && stats.permissions.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <h4 className="font-medium mb-2">Permissões por Módulo</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {stats.permissions.map((perm) => (
                                  <div key={perm.resource} className="flex items-center space-x-2">
                                    {resourceIcons[perm.resource]}
                                    <div>
                                      <div className="text-sm font-medium capitalize">
                                        {perm.resource}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {perm.actions.length} ações
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {index < roleHierarchy.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground transform rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions for SuperAdmin */}
      {isSuperAdmin() && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerenciamento avançado para Super Administradores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Convidar Usuário</div>
                  <div className="text-sm text-muted-foreground">
                    Enviar convite por email
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Auditoria de Acesso</div>
                  <div className="text-sm text-muted-foreground">
                    Ver log de permissões
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4">
                <div className="text-center">
                  <Settings className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">Configurar Roles</div>
                  <div className="text-sm text-muted-foreground">
                    Personalizar permissões
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};