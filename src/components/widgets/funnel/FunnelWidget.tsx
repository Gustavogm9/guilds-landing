import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, FunnelWidgetData } from '@/types/widgets';
import { TrendingUp, Users, DollarSign, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function FunnelWidget(props: WidgetComponentProps) {
  const data = props.data.data as FunnelWidgetData;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${Math.round(hours)}h`;
    const days = Math.round(hours / 24);
    return `${days}d`;
  };

  if (!data) return null;

  const maxCount = Math.max(...data.stages.map(s => s.count));

  return (
    <BaseWidget {...props} status="healthy" showFooter>
      <div className="space-y-3">
        {/* Overall metrics */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-bold">{data.totalLeads}</p>
            <p className="text-xs text-muted-foreground">leads</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-3 w-3 text-accent" />
            </div>
            <p className="text-sm font-bold">{formatCurrency(data.totalValue)}</p>
            <p className="text-xs text-muted-foreground">valor</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-success" />
            </div>
            <p className="text-sm font-bold">{data.overallConversion.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">conversão</p>
          </div>
        </div>

        {/* Funnel stages */}
        <div className="space-y-2">
          {data.stages.map((stage, index) => {
            const width = (stage.count / maxCount) * 100;
            const isFirstStage = index === 0;
            
            return (
              <div key={stage.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">
                    {stage.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {stage.count}
                    </Badge>
                    {!isFirstStage && (
                      <Badge 
                        variant={stage.conversionRate > 20 ? "default" : "destructive"} 
                        className="text-xs px-1 py-0"
                      >
                        {stage.conversionRate.toFixed(1)}%
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Progress 
                  value={width} 
                  className="h-2"
                  style={{
                    '--progress-background': `hsl(var(--primary) / ${0.2 + (index * 0.15)})`,
                    '--progress-foreground': `hsl(var(--primary) / ${0.6 + (index * 0.1)})`
                  } as any}
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatCurrency(stage.value)}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(stage.avgTimeInStage)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick insights */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status do funil:</span>
            <Badge variant={data.overallConversion > 15 ? "default" : "destructive"}>
              {data.overallConversion > 15 ? "Saudável" : "Atenção"}
            </Badge>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}