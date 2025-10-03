import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  FileText, 
  Edit, 
  ArrowRightLeft, 
  Trash, 
  Plus,
  AlertCircle,
  User,
  Filter,
  X,
  Calendar as CalendarIcon,
  TrendingUp,
  Trash2
} from 'lucide-react';
import type { CRMAuditLog } from '@/hooks/useCRMAuditLog';
import { cn } from '@/lib/utils';
import { startOfDay, endOfDay, isWithinInterval } from 'date-fns';

interface AuditLogTimelineWithFiltersProps {
  logs: CRMAuditLog[];
  onEditEvent?: (log: CRMAuditLog) => void;
}

const getActionIcon = (actionType: string) => {
  switch (actionType) {
    case 'created':
      return <Plus className="h-4 w-4" />;
    case 'updated':
      return <Edit className="h-4 w-4" />;
    case 'stage_changed':
      return <TrendingUp className="h-4 w-4" />;
    case 'deleted':
      return <Trash2 className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getActionColor = (actionType: string) => {
  switch (actionType) {
    case 'created':
      return 'bg-green-500/10 text-green-700 border-green-500/20';
    case 'updated':
      return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    case 'stage_changed':
      return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
    case 'deleted':
      return 'bg-red-500/10 text-red-700 border-red-500/20';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export function AuditLogTimelineWithFilters({ logs, onEditEvent }: AuditLogTimelineWithFiltersProps) {
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [manualFilter, setManualFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [userFilter, setUserFilter] = useState<string>('all');

  // Get unique users
  const uniqueUsers = useMemo(() => {
    const users = new Set(logs.map(log => log.changed_by).filter(Boolean));
    return Array.from(users);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Action type filter
      if (actionFilter !== 'all' && log.action_type !== actionFilter) return false;
      
      // Manual/automatic filter
      if (manualFilter === 'manual' && !log.is_manual_edit) return false;
      if (manualFilter === 'automatic' && log.is_manual_edit) return false;
      
      // User filter
      if (userFilter !== 'all' && log.changed_by !== userFilter) return false;
      
      // Date range filter
      if (dateRange.from || dateRange.to) {
        const logDate = new Date(log.event_timestamp);
        if (dateRange.from && dateRange.to) {
          if (!isWithinInterval(logDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to)
          })) return false;
        } else if (dateRange.from) {
          if (logDate < startOfDay(dateRange.from)) return false;
        } else if (dateRange.to) {
          if (logDate > endOfDay(dateRange.to)) return false;
        }
      }
      
      return true;
    });
  }, [logs, actionFilter, manualFilter, userFilter, dateRange]);

  const clearFilters = () => {
    setActionFilter('all');
    setManualFilter('all');
    setUserFilter('all');
    setDateRange({});
  };

  const hasActiveFilters = actionFilter !== 'all' || manualFilter !== 'all' || 
                          userFilter !== 'all' || dateRange.from || dateRange.to;

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Nenhum histórico disponível</h3>
        <p className="text-sm text-muted-foreground">
          Ainda não há eventos registrados para este item.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros da Timeline
            </h4>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Tipo de Ação</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-8">
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

            <div className="space-y-1">
              <label className="text-xs font-medium">Origem</label>
              <Select value={manualFilter} onValueChange={setManualFilter}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="manual">Manuais</SelectItem>
                  <SelectItem value="automatic">Automáticos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">Data Início</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn("w-full h-8 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM', { locale: ptBR }) : 'De'}
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

            <div className="space-y-1">
              <label className="text-xs font-medium">Data Fim</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn("w-full h-8 justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {dateRange.to ? format(dateRange.to, 'dd/MM', { locale: ptBR }) : 'Até'}
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
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Nenhum evento encontrado com os filtros selecionados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="text-xs text-muted-foreground mb-2">
          {filteredLogs.length} evento(s) {hasActiveFilters && `de ${logs.length} total`}
        </div>
      )}

      {/* Timeline */}
      {filteredLogs.map((log, index) => (
        <Card key={log.id} className="p-4 relative">
          {/* Timeline connector */}
          {index < filteredLogs.length - 1 && (
            <div className="absolute left-[27px] top-[48px] w-0.5 h-[calc(100%+16px)] bg-border" />
          )}
          
          <div className="flex gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${getActionColor(log.action_type)}`}>
              {getActionIcon(log.action_type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {log.change_description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(log.event_timestamp), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                    {log.is_manual_edit && (
                      <Badge variant="outline" className="text-xs">
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>
                
                {log.is_manual_edit && onEditEvent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditEvent(log)}
                    className="flex-shrink-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Details */}
              {log.field_name && (log.old_value || log.new_value) && (
                <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mt-2">
                  {log.old_value && (
                    <div>
                      <span className="font-medium">De:</span> {log.old_value}
                    </div>
                  )}
                  {log.new_value && (
                    <div>
                      <span className="font-medium">Para:</span> {log.new_value}
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                    Ver detalhes técnicos
                  </summary>
                  <pre className="text-xs bg-muted/50 rounded p-2 mt-1 overflow-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
