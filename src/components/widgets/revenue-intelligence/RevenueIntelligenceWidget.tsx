import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, RevenueIntelligenceData } from '@/types/widgets';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function RevenueIntelligenceWidget(props: WidgetComponentProps) {
  const data = props.data.data as RevenueIntelligenceData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (!data) return null;

  return (
    <BaseWidget {...props} status="healthy" showFooter>
      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">MRR</span>
            </div>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(data.mrr)}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">ARR</span>
            </div>
            <p className="text-lg font-bold text-accent">
              {formatCurrency(data.arr)}
            </p>
          </div>
        </div>

        {/* Growth & Churn */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
              data.growth >= 0 
                ? "bg-success/10 text-success" 
                : "bg-danger/10 text-danger"
            )}>
              {data.growth >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatPercentage(data.growth)}
            </div>
            <span className="text-xs text-muted-foreground">crescimento</span>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">churn</p>
            <p className="text-sm font-semibold text-warning">
              {formatPercentage(data.churn)}
            </p>
          </div>
        </div>

        {/* Predictions */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Projeções</h4>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs">30 dias</span>
              <Badge variant="secondary" className="text-xs">
                {formatCurrency(data.predictions.next30Days)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">90 dias</span>
              <Badge variant="secondary" className="text-xs">
                {formatCurrency(data.predictions.next90Days)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs">1 ano</span>
              <Badge variant="default" className="text-xs">
                {formatCurrency(data.predictions.nextYear)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Mini trend chart */}
        <div className="h-8 flex items-end justify-between gap-1">
          {data.trends.slice(-12).map((point, index) => {
            const height = Math.max(4, (point.value / Math.max(...data.trends.map(t => t.value))) * 32);
            return (
              <div
                key={index}
                className="bg-gradient-to-t from-primary to-primary/50 rounded-sm flex-1"
                style={{ height: `${height}px` }}
              />
            );
          })}
        </div>
      </div>
    </BaseWidget>
  );
}