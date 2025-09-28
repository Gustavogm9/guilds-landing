import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps } from '@/types/widgets';
import { Activity, Zap, Globe, Server, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PerformanceData {
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    fcp: number; // First Contentful Paint
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  alerts: Array<{
    type: 'performance' | 'error' | 'availability';
    message: string;
    severity: 'high' | 'medium' | 'low';
    timestamp: Date;
  }>;
  trends: Array<{
    timestamp: string;
    responseTime: number;
    errorRate: number;
  }>;
}

export default function PerformanceMonitoringWidget(props: WidgetComponentProps) {
  const data = props.data.data as PerformanceData;

  if (!data) return null;

  const getVitalStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1.8, poor: 3.0 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-success';
      case 'needs-improvement': return 'text-warning';
      case 'poor': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
      case 'fcp':
        return `${value.toFixed(1)}s`;
      case 'fid':
        return `${value.toFixed(0)}ms`;
      case 'cls':
        return value.toFixed(3);
      default:
        return value.toString();
    }
  };

  return (
    <BaseWidget {...props} showFooter>
      <div className="space-y-4">
        {/* System Health Overview */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="h-3 w-3 text-success" />
            </div>
            <p className="text-sm font-semibold text-success">{data.systemHealth.uptime.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-semibold">{data.systemHealth.responseTime}ms</p>
            <p className="text-xs text-muted-foreground">Response</p>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Core Web Vitals
          </h5>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.coreWebVitals).map(([metric, value]) => {
              const status = getVitalStatus(metric, value);
              return (
                <div key={metric} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground uppercase">
                    {metric}
                  </span>
                  <span className={cn("text-xs font-medium", getStatusColor(status))}>
                    {formatValue(metric, value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Trend */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Tendência (24h)</h5>
          <div className="h-8 flex items-end justify-between gap-1">
            {data.trends.slice(-12).map((point, index) => {
              const maxResponse = Math.max(...data.trends.map(t => t.responseTime));
              const height = (point.responseTime / maxResponse) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={cn(
                      "bg-primary rounded-sm w-full",
                      point.errorRate > 5 ? "bg-danger" : 
                      point.errorRate > 1 ? "bg-warning" : "bg-primary"
                    )}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* System Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Taxa de Erro</span>
            <span className={cn(
              "text-xs font-medium",
              data.systemHealth.errorRate < 1 ? "text-success" :
              data.systemHealth.errorRate < 5 ? "text-warning" : "text-danger"
            )}>
              {data.systemHealth.errorRate.toFixed(2)}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Throughput</span>
            <span className="text-xs font-medium">
              {data.systemHealth.throughput} req/s
            </span>
          </div>
        </div>

        {/* Active Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Alertas Ativos
            </h5>
            <div className="space-y-1">
              {data.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 mt-0.5"
                  >
                    {alert.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground flex-1">
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}