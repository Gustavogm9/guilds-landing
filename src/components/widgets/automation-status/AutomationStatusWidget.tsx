import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps } from '@/types/widgets';
import { Zap, CheckCircle, XCircle, Clock, Settings, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AutomationStatusData {
  activeWorkflows: number;
  totalWorkflows: number;
  successRate: number;
  executionsToday: number;
  recentExecutions: Array<{
    id: string;
    name: string;
    status: 'success' | 'failure' | 'running' | 'pending';
    duration: number;
    timestamp: Date;
    errorMessage?: string;
  }>;
  workflows: Array<{
    id: string;
    name: string;
    type: 'email' | 'webhook' | 'data_sync' | 'notification';
    isActive: boolean;
    lastRun: Date;
    nextRun?: Date;
    successRate: number;
  }>;
  systemHealth: {
    queueSize: number;
    avgProcessingTime: number;
    failureRate: number;
  };
}

export default function AutomationStatusWidget(props: WidgetComponentProps) {
  const data = props.data.data as AutomationStatusData;

  if (!data) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-3 w-3 text-success" />;
      case 'failure': return <XCircle className="h-3 w-3 text-danger" />;
      case 'running': return <Clock className="h-3 w-3 text-primary animate-spin" />;
      case 'pending': return <Clock className="h-3 w-3 text-warning" />;
      default: return <Settings className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'failure': return 'text-danger';
      case 'running': return 'text-primary';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'webhook': return '🔗';
      case 'data_sync': return '🔄';
      case 'notification': return '🔔';
      default: return '⚙️';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 60) return `${diffMins}min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <BaseWidget {...props} showFooter>
      <div className="space-y-4">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-semibold text-primary">
              {data.activeWorkflows}/{data.totalWorkflows}
            </p>
            <p className="text-xs text-muted-foreground">Workflows Ativos</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-3 w-3 text-success" />
            </div>
            <p className="text-sm font-semibold text-success">{data.successRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Sistema</h5>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs font-semibold">{data.executionsToday}</p>
              <p className="text-xs text-muted-foreground">Execuções Hoje</p>
            </div>
            <div>
              <p className="text-xs font-semibold">{data.systemHealth.queueSize}</p>
              <p className="text-xs text-muted-foreground">Na Fila</p>
            </div>
            <div>
              <p className="text-xs font-semibold">{formatDuration(data.systemHealth.avgProcessingTime)}</p>
              <p className="text-xs text-muted-foreground">Tempo Médio</p>
            </div>
          </div>
        </div>

        {/* Recent Executions */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Execuções Recentes</h5>
          <div className="space-y-1">
            {data.recentExecutions.slice(0, 3).map((execution) => (
              <div key={execution.id} className="flex items-center gap-2">
                {getStatusIcon(execution.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{execution.name}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(execution.timestamp)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(execution.duration)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Workflows */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Workflows Principais</h5>
          <div className="space-y-1">
            {data.workflows.filter(w => w.isActive).slice(0, 3).map((workflow) => (
              <div key={workflow.id} className="flex items-center gap-2">
                <span className="text-xs">{getTypeIcon(workflow.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{workflow.name}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(workflow.lastRun)}
                    </span>
                    <span className={cn(
                      "text-xs",
                      workflow.successRate > 95 ? "text-success" :
                      workflow.successRate > 80 ? "text-warning" : "text-danger"
                    )}>
                      {workflow.successRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alert */}
        {data.systemHealth.failureRate > 10 && (
          <div className="flex items-center gap-2 p-2 bg-danger/10 rounded-md">
            <AlertTriangle className="h-3 w-3 text-danger" />
            <p className="text-xs text-danger">
              Taxa de falha alta: {data.systemHealth.failureRate.toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}