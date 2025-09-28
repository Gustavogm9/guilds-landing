import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, AIInsightsData } from '@/types/widgets';
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AIInsightsWidget(props: WidgetComponentProps) {
  const data = props.data.data as AIInsightsData;

  if (!data) return null;

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '💡';
      default: return '🤖';
    }
  };

  const getImpactVariant = (impact: string) => {
    switch (impact) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-success';
      case 'operations': return 'text-primary';
      case 'team': return 'text-accent';
      case 'market': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const highImpactInsights = data.insights.filter(i => i.impact === 'high').length;
  const anomalies = data.anomalies.length;
  const status = anomalies > 0 || highImpactInsights > 0 ? 'warning' : 'healthy';

  return (
    <BaseWidget {...props} status={status} showFooter>
      <div className="space-y-4">
        {/* AI Status */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Brain className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">AI Insights</span>
          </div>
          <p className="text-lg font-bold text-primary">
            {data.insights.length} insights
          </p>
        </div>

        {/* Key Insights */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Principais Insights
          </h4>
          
          {data.insights.slice(0, 3).map((insight, index) => (
            <div key={insight.id} className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-xs mt-0.5">
                  {getImpactIcon(insight.impact)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <p className="text-xs font-medium truncate">
                      {insight.title}
                    </p>
                    <Badge 
                      variant={getImpactVariant(insight.impact)}
                      className="text-xs px-1 py-0"
                    >
                      {insight.confidence}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs px-1 py-0", getCategoryColor(insight.category))}
                    >
                      {insight.category}
                    </Badge>
                    {insight.actionable && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        Acionável
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {index < data.insights.slice(0, 3).length - 1 && (
                <div className="h-px bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Anomalies */}
        {data.anomalies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Anomalias Detectadas ({data.anomalies.length})
            </h4>
            
            {data.anomalies.slice(0, 2).map((anomaly, index) => {
              const deviationPercent = Math.abs((anomaly.currentValue - anomaly.expectedValue) / anomaly.expectedValue * 100);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {anomaly.metric}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {anomaly.currentValue.toLocaleString()} vs {anomaly.expectedValue.toLocaleString()} esperado
                    </p>
                  </div>
                  <Badge 
                    variant={deviationPercent > 50 ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 ml-2"
                  >
                    {anomaly.currentValue > anomaly.expectedValue ? '+' : '-'}
                    {deviationPercent.toFixed(0)}%
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
          <div>
            <p className="text-sm font-bold text-success">
              {data.insights.filter(i => i.impact === 'high').length}
            </p>
            <p className="text-xs text-muted-foreground">alto impacto</p>
          </div>
          
          <div>
            <p className="text-sm font-bold text-primary">
              {data.insights.filter(i => i.actionable).length}
            </p>
            <p className="text-xs text-muted-foreground">acionáveis</p>
          </div>
          
          <div>
            <p className="text-sm font-bold text-warning">
              {data.anomalies.length}
            </p>
            <p className="text-xs text-muted-foreground">anomalias</p>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}