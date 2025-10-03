import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { History, Filter, Download, Calendar as CalendarIcon, X, TrendingUp, Users, Edit, Plus } from 'lucide-react';
import { AuditLogTimeline } from './AuditLogTimeline';
import { AddManualEventModal } from './AddManualEventModal';
import { EditHistoricalEventModal } from './EditHistoricalEventModal';
import { cn } from '@/lib/utils';
import type { CRMAuditLog } from '@/hooks/useCRMAuditLog';
import { Link } from 'react-router-dom';

interface HistoryStats {
  total_today: number;
  total_week: number;
  total_month: number;
  manual_events: number;
  most_edited_deals: Array<{ deal_id: string; deal_title: string; edit_count: number }>;
  most_active_users: Array<{ user_id: string; action_count: number }>;
}

export function CRMHistoryAdmin() {
  const [entityType, setEntityType] = useState<string>('all');
  const [actionType, setActionType] = useState<string>('all');
  const [userId, setUserId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedLog, setSelectedLog] = useState<CRMAuditLog | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch all audit logs
  const { data: allLogs = [], isLoading } = useQuery({
    queryKey: ['crm_audit_log_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_audit_log')
        .select('*')
        .order('event_timestamp', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data as CRMAuditLog[];
    },
  });

  // Fetch statistics
  const { data: stats } = useQuery({
    queryKey: ['crm_audit_stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfToday = startOfDay(now);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      const startOfMonth = new Date(now);
      startOfMonth.setDate(now.getDate() - 30);

      const { data: todayData } = await supabase
        .from('crm_audit_log')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfToday.toISOString());

      const { data: weekData } = await supabase
        .from('crm_audit_log')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfWeek.toISOString());

      const { data: monthData } = await supabase
        .from('crm_audit_log')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString());

      const { data: manualData } = await supabase
        .from('crm_audit_log')
        .select('id', { count: 'exact', head: true })
        .eq('is_manual_edit', true);

      return {
        total_today: todayData?.length || 0,
        total_week: weekData?.length || 0,
        total_month: monthData?.length || 0,
        manual_events: manualData?.length || 0,
      } as HistoryStats;
    },
  });

  // Filter logs
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      // Entity type filter
      if (entityType !== 'all' && log.entity_type !== entityType) return false;
      
      // Action type filter
      if (actionType !== 'all' && log.action_type !== actionType) return false;
      
      // User filter
      if (userId !== 'all' && log.changed_by !== userId) return false;
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const searchableText = [
          log.change_description,
          log.field_name,
          log.old_value,
          log.new_value,
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) return false;
      }
      
      // Date range
      if (dateRange.from) {
        const logDate = new Date(log.event_timestamp);
        if (logDate < startOfDay(dateRange.from)) return false;
      }
      if (dateRange.to) {
        const logDate = new Date(log.event_timestamp);
        if (logDate > endOfDay(dateRange.to)) return false;
      }
      
      return true;
    });
  }, [allLogs, entityType, actionType, userId, searchTerm, dateRange]);

  const clearFilters = () => {
    setEntityType('all');
    setActionType('all');
    setUserId('all');
    setSearchTerm('');
    setDateRange({});
  };

  const hasActiveFilters = entityType !== 'all' || actionType !== 'all' || 
                          userId !== 'all' || searchTerm || dateRange.from || dateRange.to;

  const handleExport = async (format: 'excel' | 'pdf' | 'csv') => {
    // TODO: Implement export functionality
    console.log(`Exporting ${format}...`);
  };

  const handleEditEvent = (log: CRMAuditLog) => {
    setSelectedLog(log);
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando histórico...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <History className="h-8 w-8" />
            Histórico Global do CRM
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe todas as alterações e eventos do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Evento Manual
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats?.total_today || 0}</div>
              <div className="text-sm text-muted-foreground">Eventos Hoje</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">{stats?.total_week || 0}</div>
              <div className="text-sm text-muted-foreground">Esta Semana</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{stats?.total_month || 0}</div>
              <div className="text-sm text-muted-foreground">Este Mês</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-warning">{stats?.manual_events || 0}</div>
              <div className="text-sm text-muted-foreground">Eventos Manuais</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                <X className="h-4 w-4 mr-1" />
                Limpar Filtros
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Entidade</label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="deal">Deals</SelectItem>
                  <SelectItem value="contact">Contatos</SelectItem>
                  <SelectItem value="interaction">Interações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ação</label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="created">Criado</SelectItem>
                  <SelectItem value="updated">Atualizado</SelectItem>
                  <SelectItem value="stage_changed">Mudança de Stage</SelectItem>
                  <SelectItem value="deleted">Deletado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Busca</label>
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredLogs.length} evento(s) encontrado(s)
          {hasActiveFilters && ` de ${allLogs.length} total`}
        </div>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="pt-6">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum evento encontrado</p>
            </div>
          ) : (
            <AuditLogTimeline logs={filteredLogs} onEditEvent={handleEditEvent} />
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddManualEventModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />

      <EditHistoricalEventModal
        log={selectedLog}
        open={showEditModal}
        onOpenChange={setShowEditModal}
      />
    </div>
  );
}
