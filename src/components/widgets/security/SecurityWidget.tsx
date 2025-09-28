import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, SecurityWidgetData } from '@/types/widgets';
import { Shield, AlertTriangle, Clock, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function SecurityWidget(props: WidgetComponentProps) {
  const data = props.data.data as SecurityWidgetData;

  if (!data) return null;

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-danger';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getThreatLevelVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🛡️';
      case 'low': return '✅';
      default: return '🔒';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'blocked_ip': return '🚫';
      case 'rate_limit': return '⏱️';
      case 'failed_login': return '🔑';
      case 'vulnerability': return '🐛';
      default: return '🔍';
    }
  };

  const criticalEvents = data.recentEvents.filter(e => e.severity === 'high').length;
  const status = data.metrics.threatLevel === 'critical' || criticalEvents > 0 ? 'error' : 
                data.metrics.threatLevel === 'high' || data.metrics.activeIncidents > 0 ? 'warning' : 'healthy';

  const formatLastScan = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'agora mesmo';
    if (hours < 24) return `${hours}h atrás`;
    
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  return (
    <BaseWidget {...props} status={status} showFooter>
      <div className="space-y-4">
        {/* Security Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Score de Segurança</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            data.overallScore > 80 ? "text-success" : 
            data.overallScore > 60 ? "text-warning" : "text-danger"
          )}>
            {data.overallScore}
          </p>
          <Progress 
            value={data.overallScore} 
            className="mt-2 h-2"
          />
        </div>

        {/* Threat Level */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-lg">
              {getThreatLevelIcon(data.metrics.threatLevel)}
            </span>
            <Badge 
              variant={getThreatLevelVariant(data.metrics.threatLevel)}
              className="text-xs"
            >
              {data.metrics.threatLevel.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Último scan: {formatLastScan(data.metrics.lastScan)}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold text-warning">
              {data.metrics.vulnerabilities}
            </p>
            <p className="text-xs text-muted-foreground">vulnerabilidades</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-bold text-success">
              {data.metrics.blockedAttempts.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">bloqueados</p>
          </div>
        </div>

        {/* Compliance */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Conformidade</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">LGPD</span>
              <div className="flex items-center gap-2">
                <Progress value={data.compliance.lgpd} className="w-16 h-1.5" />
                <span className="text-xs text-muted-foreground">
                  {data.compliance.lgpd}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs">GDPR</span>
              <div className="flex items-center gap-2">
                <Progress value={data.compliance.gdpr} className="w-16 h-1.5" />
                <span className="text-xs text-muted-foreground">
                  {data.compliance.gdpr}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs">ISO 27001</span>
              <div className="flex items-center gap-2">
                <Progress value={data.compliance.iso27001} className="w-16 h-1.5" />
                <span className="text-xs text-muted-foreground">
                  {data.compliance.iso27001}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        {data.recentEvents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Eventos Recentes
            </h4>
            
            <div className="space-y-1">
              {data.recentEvents.slice(0, 3).map((event, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5">
                    {getEventIcon(event.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {event.message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatLastScan(event.timestamp)}
                        </span>
                      </div>
                      <Badge 
                        variant={event.severity === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs px-1 py-0"
                      >
                        {event.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Incidents */}
        {data.metrics.activeIncidents > 0 && (
          <div className="text-center pt-2 border-t">
            <div className="flex items-center justify-center gap-1">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span className="text-sm font-medium text-danger">
                {data.metrics.activeIncidents} incidente{data.metrics.activeIncidents > 1 ? 's' : ''} ativo{data.metrics.activeIncidents > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}