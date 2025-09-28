import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, CashFlowData } from '@/types/widgets';
import { TrendingDown, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CashFlowWidget(props: WidgetComponentProps) {
  const data = props.data.data as CashFlowData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!data) return null;

  const isHealthy = data.currentBalance > 0 && data.netFlow >= 0;
  const hasAlerts = data.alerts.length > 0;
  const status = hasAlerts ? 'warning' : isHealthy ? 'healthy' : 'error';

  return (
    <BaseWidget {...props} status={status} showFooter>
      <div className="space-y-4">
        {/* Current Balance */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Saldo Atual</span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            data.currentBalance >= 0 ? "text-success" : "text-danger"
          )}>
            {formatCurrency(data.currentBalance)}
          </p>
        </div>

        {/* Cash Flow Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-success" />
            </div>
            <p className="text-sm font-semibold text-success">
              {formatCurrency(data.inflow)}
            </p>
            <p className="text-xs text-muted-foreground">entrada</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingDown className="h-3 w-3 text-danger" />
            </div>
            <p className="text-sm font-semibold text-danger">
              {formatCurrency(data.outflow)}
            </p>
            <p className="text-xs text-muted-foreground">saída</p>
          </div>
          
          <div>
            <p className={cn(
              "text-sm font-semibold",
              data.netFlow >= 0 ? "text-success" : "text-danger"
            )}>
              {formatCurrency(data.netFlow)}
            </p>
            <p className="text-xs text-muted-foreground">líquido</p>
          </div>
        </div>

        {/* Projected Balance */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Projeção 90 dias</h4>
          <div className="text-center">
            <p className={cn(
              "text-lg font-bold",
              data.projectedBalance >= 0 ? "text-primary" : "text-warning"
            )}>
              {formatCurrency(data.projectedBalance)}
            </p>
            <p className="text-xs text-muted-foreground">saldo projetado</p>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="h-8 flex items-end justify-between gap-1">
          {data.predictions.slice(0, 12).map((point, index) => {
            const maxValue = Math.max(...data.predictions.map(p => Math.max(p.projected, p.optimistic)));
            const minValue = Math.min(...data.predictions.map(p => Math.min(p.projected, p.conservative)));
            const range = maxValue - minValue;
            
            const projectedHeight = Math.max(2, ((point.projected - minValue) / range) * 24);
            const optimisticHeight = Math.max(2, ((point.optimistic - minValue) / range) * 24);
            const conservativeHeight = Math.max(2, ((point.conservative - minValue) / range) * 24);
            
            return (
              <div key={index} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className="bg-primary/30 rounded-sm w-full"
                  style={{ height: `${optimisticHeight}px` }}
                />
                <div
                  className="bg-primary rounded-sm w-full -mt-1"
                  style={{ height: `${projectedHeight}px` }}
                />
                <div
                  className="bg-primary/60 rounded-sm w-full -mt-1"
                  style={{ height: `${conservativeHeight}px` }}
                />
              </div>
            );
          })}
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Alertas
            </h4>
            <div className="space-y-1">
              {data.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant={alert.type === 'danger' ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 mt-0.5"
                  >
                    {alert.type === 'danger' ? '!' : '⚠'}
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