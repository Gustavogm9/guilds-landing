import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePermissionsContext } from '@/contexts/PermissionsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Filter, Shield, Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuditLogEntry {
  id: string;
  user_id: string;
  target_user_id?: string;
  action_type: string;
  resource?: string;
  permission?: string;
  old_value?: any;
  new_value?: any;
  ip_address?: unknown;
  user_agent?: string;
  created_at: string;
}

export const AuditLog: React.FC = () => {
  const { canManageUsers, isAdmin } = usePermissionsContext();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);

  const actionLabels: Record<string, string> = {
    grant: 'Permissão Concedida',
    revoke: 'Permissão Revogada',
    modify: 'Permissão Modificada',
    login_attempt: 'Tentativa de Login',
    role_assigned: 'Role Atribuído',
    role_removed: 'Role Removido'
  };

  const actionColors: Record<string, string> = {
    grant: 'bg-green-100 text-green-800',
    revoke: 'bg-red-100 text-red-800',
    modify: 'bg-yellow-100 text-yellow-800',
    login_attempt: 'bg-blue-100 text-blue-800',
    role_assigned: 'bg-purple-100 text-purple-800',
    role_removed: 'bg-orange-100 text-orange-800'
  };

  useEffect(() => {
    if (!canManageUsers() && !isAdmin()) {
      return;
    }
    fetchAuditLogs();
    fetchUsers();
  }, [canManageUsers, isAdmin]);

  const fetchAuditLogs = async () => {
    try {
      let query = supabase
        .from('permission_audit_log')
        .select(`
          *,
          profiles:user_id(display_name, user_id),
          target_profiles:target_user_id(display_name, user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (dateRange.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      setUsers(authUsers.users?.map(u => ({ id: u.id, email: u.email || '' })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const exportAuditLog = async () => {
    try {
      const csvContent = [
        ['Data/Hora', 'Usuário', 'Ação', 'Recurso', 'Permissão', 'IP', 'User Agent'].join(','),
        ...auditLogs.map(log => [
          format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }),
          log.user_id,
          actionLabels[log.action_type] || log.action_type,
          log.resource || '',
          log.permission || '',
          log.ip_address || '',
          log.user_agent || ''
        ].join(','))
      ].join('\\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting audit log:', error);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.resource && log.resource.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = filterAction === 'all' || log.action_type === filterAction;
    const matchesUser = filterUser === 'all' || log.user_id === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  if (!canManageUsers() && !isAdmin()) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-muted-foreground">
              Você não tem permissão para visualizar os logs de auditoria.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Log de Auditoria</h1>
        <p className="text-muted-foreground mt-2">
          Histórico completo de todas as ações relacionadas a permissões e roles
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total de Logs</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Permissões Concedidas</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter(log => log.action_type === 'grant').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Permissões Revogadas</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter(log => log.action_type === 'revoke').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Modificações</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter(log => log.action_type === 'modify').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por usuário ou recurso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tipo de ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as ações</SelectItem>
                <SelectItem value="grant">Permissão Concedida</SelectItem>
                <SelectItem value="revoke">Permissão Revogada</SelectItem>
                <SelectItem value="modify">Modificação</SelectItem>
                <SelectItem value="login_attempt">Login</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os usuários</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={exportAuditLog} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Auditoria</CardTitle>
          <CardDescription>
            Registro cronológico de todas as mudanças de permissões
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
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {format(new Date(log.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'HH:mm:ss', { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {users.find(u => u.id === log.user_id)?.email || log.user_id}
                      </div>
                      {log.target_user_id && log.target_user_id !== log.user_id && (
                        <div className="text-xs text-muted-foreground">
                          → {users.find(u => u.id === log.target_user_id)?.email || log.target_user_id}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action_type] || 'bg-gray-100 text-gray-800'}>
                        {actionLabels[log.action_type] || log.action_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {log.resource && (
                          <div className="font-medium capitalize">{log.resource}</div>
                        )}
                        {log.permission && (
                          <div className="text-xs text-muted-foreground capitalize">
                            {log.permission}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1 max-w-xs">
                        {log.old_value && (
                          <div>
                            <span className="text-red-600">Anterior:</span>{' '}
                            {JSON.stringify(log.old_value).substring(0, 50)}...
                          </div>
                        )}
                        {log.new_value && (
                          <div>
                            <span className="text-green-600">Novo:</span>{' '}
                            {JSON.stringify(log.new_value).substring(0, 50)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        {(log.ip_address as string) || '-'}
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