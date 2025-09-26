import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { AppRole, AppResource, PermissionAction } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Users, UserPlus, Shield, Eye, Edit, Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UserWithRoles {
  id: string;
  email: string;
  profile?: {
    display_name: string;
    department?: string;
    job_title?: string;
    is_active: boolean;
    last_login_at?: string;
  };
  roles: {
    role: AppRole;
    assigned_at: string;
    expires_at?: string;
  }[];
}

interface RolePermission {
  role: AppRole;
  resource: AppResource;
  action: PermissionAction;
  is_granted: boolean;
}

export const UserManagement: React.FC = () => {
  const { canManageUsers, isSuperAdmin } = usePermissionsContext();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<AppRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);

  const roles: AppRole[] = ['superadmin', 'admin', 'manager', 'analyst', 'viewer'];
  const resources: AppResource[] = ['crm', 'financial', 'projects', 'feedback', 'analytics', 'settings', 'users', 'campaigns'];
  const actions: PermissionAction[] = ['create', 'read', 'update', 'delete', 'approve', 'export', 'manage'];

  const roleLabels: Record<AppRole, string> = {
    superadmin: 'Super Admin',
    admin: 'Administrador',
    manager: 'Gerente',
    analyst: 'Analista',
    viewer: 'Visualizador'
  };

  const roleColors: Record<AppRole, string> = {
    superadmin: 'bg-gradient-to-r from-purple-500 to-pink-500',
    admin: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    manager: 'bg-gradient-to-r from-green-500 to-emerald-500',
    analyst: 'bg-gradient-to-r from-orange-500 to-yellow-500',
    viewer: 'bg-gradient-to-r from-gray-500 to-slate-500'
  };

  useEffect(() => {
    if (!canManageUsers()) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para gerenciar usuários.",
        variant: "destructive"
      });
      return;
    }

    fetchUsers();
    fetchRolePermissions();
  }, [canManageUsers]);

  const fetchUsers = async () => {
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      
      const usersWithProfiles = await Promise.all(
        (authUsers.users || []).map(async (user) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          const { data: roles } = await supabase
            .from('user_roles')
            .select('role, assigned_at, expires_at')
            .eq('user_id', user.id)
            .eq('is_active', true);

          return {
            id: user.id,
            email: user.email || '',
            profile,
            roles: roles || []
          };
        })
      );

      setUsers(usersWithProfiles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const { data } = await supabase
        .from('role_permissions')
        .select('*')
        .order('role, resource, action');

      setRolePermissions(data || []);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  const assignRole = async (userId: string, role: AppRole, expiresAt?: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role,
          expires_at: expiresAt || null,
          notes: notes || null,
          is_active: true
        }, { onConflict: 'user_id,role' });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Role ${roleLabels[role]} atribuído com sucesso.`
      });

      fetchUsers();
      setIsRoleDialogOpen(false);
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Erro",
        description: "Falha ao atribuir role.",
        variant: "destructive"
      });
    }
  };

  const revokeRole = async (userId: string, role: AppRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('role', role);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Role ${roleLabels[role]} revogado com sucesso.`
      });

      fetchUsers();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast({
        title: "Erro",
        description: "Falha ao revogar role.",
        variant: "destructive"
      });
    }
  };

  const updateRolePermission = async (role: AppRole, resource: AppResource, action: PermissionAction, isGranted: boolean) => {
    try {
      const { error } = await supabase
        .from('role_permissions')
        .upsert({
          role,
          resource,
          action,
          is_granted: isGranted
        }, { onConflict: 'role,resource,action' });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Permissão atualizada com sucesso."
      });

      fetchRolePermissions();
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar permissão.",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesRole = filterRole === 'all' || user.roles.some(r => r.role === filterRole);
    
    return matchesSearch && matchesRole;
  });

  if (!canManageUsers()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar o gerenciamento de usuários.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie usuários, roles e permissões do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Super Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.roles.some(r => r.role === 'superadmin')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.roles.some(r => r.role === 'admin')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.profile?.is_active !== false).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={(value) => setFilterRole(value as AppRole | 'all')}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isSuperAdmin() && (
              <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Configurar Permissões
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Matriz de Permissões por Role</DialogTitle>
                    <DialogDescription>
                      Configure as permissões padrão para cada role no sistema
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {roles.map(role => (
                      <Card key={role}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Badge className={roleColors[role]}>{roleLabels[role]}</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map(resource => (
                              <div key={resource} className="space-y-2">
                                <Label className="font-medium capitalize">{resource}</Label>
                                <div className="space-y-1">
                                  {actions.map(action => {
                                    const permission = rolePermissions.find(
                                      p => p.role === role && p.resource === resource && p.action === action
                                    );
                                    
                                    return (
                                      <div key={action} className="flex items-center space-x-2">
                                        <Switch
                                          checked={permission?.is_granted || false}
                                          onCheckedChange={(checked) => 
                                            updateRolePermission(role, resource, action, checked)
                                          }
                                        />
                                        <Label className="text-sm capitalize">{action}</Label>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários e suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {user.profile?.display_name || user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.profile?.job_title && (
                          <p className="text-xs text-muted-foreground">{user.profile.job_title}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((userRole, index) => (
                          <Badge 
                            key={index} 
                            className={roleColors[userRole.role]}
                          >
                            {roleLabels[userRole.role]}
                          </Badge>
                        ))}
                        {user.roles.length === 0 && (
                          <Badge variant="outline">Sem role</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.profile?.department || '-'}
                    </TableCell>
                    <TableCell>
                      {user.profile?.last_login_at ? 
                        format(new Date(user.profile.last_login_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) 
                        : 'Nunca'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.profile?.is_active !== false ? "default" : "destructive"}>
                        {user.profile?.is_active !== false ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Gerenciar Roles</DialogTitle>
                              <DialogDescription>
                                Atribua ou remova roles para {user.profile?.display_name || user.email}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <Label>Roles Atuais</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {user.roles.map((userRole, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <Badge className={roleColors[userRole.role]}>
                                        {roleLabels[userRole.role]}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => revokeRole(user.id, userRole.role)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <Label>Adicionar Role</Label>
                                <div className="flex gap-2 mt-2">
                                  {roles
                                    .filter(role => !user.roles.some(ur => ur.role === role))
                                    .map(role => (
                                      <Button
                                        key={role}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => assignRole(user.id, role)}
                                      >
                                        {roleLabels[role]}
                                      </Button>
                                    ))
                                  }
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};