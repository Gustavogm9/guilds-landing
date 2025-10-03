import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Edit, 
  Plus, 
  Trash2, 
  TrendingUp, 
  User,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CRMAuditLog } from '@/hooks/useCRMAuditLog';

interface AuditLogTimelineProps {
  logs: CRMAuditLog[];
  onEditEvent?: (log: CRMAuditLog) => void;
  showFilters?: boolean;
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

export const AuditLogTimeline: React.FC<AuditLogTimelineProps> = ({ logs, onEditEvent }) => {
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
      {logs.map((log, index) => (
        <Card key={log.id} className="p-4 relative">
          {/* Timeline connector */}
          {index < logs.length - 1 && (
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
                      <Calendar className="h-3 w-3" />
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
};
