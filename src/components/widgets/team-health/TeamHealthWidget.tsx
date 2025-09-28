import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, TeamHealthData } from '@/types/widgets';
import { Heart, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function TeamHealthWidget(props: WidgetComponentProps) {
  const data = props.data.data as TeamHealthData;

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const criticalAlerts = data.alerts.filter(a => a.severity === 'high').length;
  const status = criticalAlerts > 0 ? 'error' : data.overallScore < 60 ? 'warning' : 'healthy';

  return (
    <BaseWidget {...props} status={status} showFooter>
      <div className="space-y-4">
        {/* Overall Health Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Heart className="h-4 w-4 text-danger" />
            <span className="text-xs text-muted-foreground">Saúde da Equipe</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            getScoreColor(data.overallScore)
          )}>
            {data.overallScore.toFixed(0)}
          </p>
          <Progress 
            value={data.overallScore} 
            className="mt-2 h-2"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Satisfação</span>
              <Badge 
                variant={getScoreVariant(data.metrics.satisfaction)}
                className="text-xs px-1 py-0"
              >
                {data.metrics.satisfaction}
              </Badge>
            </div>
            <Progress value={data.metrics.satisfaction} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Engajamento</span>
              <Badge 
                variant={getScoreVariant(data.metrics.engagement)}
                className="text-xs px-1 py-0"
              >
                {data.metrics.engagement}
              </Badge>
            </div>
            <Progress value={data.metrics.engagement} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Carga</span>
              <Badge 
                variant={data.metrics.workload > 80 ? 'destructive' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {data.metrics.workload}
              </Badge>
            </div>
            <Progress value={data.metrics.workload} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Burnout</span>
              <Badge 
                variant={data.metrics.burnoutRisk > 70 ? 'destructive' : 'secondary'}
                className="text-xs px-1 py-0"
              >
                {data.metrics.burnoutRisk}
              </Badge>
            </div>
            <Progress value={data.metrics.burnoutRisk} className="h-1.5" />
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">Sentimento Geral</h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs">{data.sentiment.positive}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-neutral-400" />
              <span className="text-xs">{data.sentiment.neutral}%</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-danger" />
              <span className="text-xs">{data.sentiment.negative}%</span>
            </div>
          </div>
          
          {/* Sentiment bar */}
          <div className="flex h-2 rounded-full overflow-hidden">
            <div 
              className="bg-success" 
              style={{ width: `${data.sentiment.positive}%` }}
            />
            <div 
              className="bg-neutral-400" 
              style={{ width: `${data.sentiment.neutral}%` }}
            />
            <div 
              className="bg-danger" 
              style={{ width: `${data.sentiment.negative}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Alertas ({data.alerts.length})
            </h4>
            <div className="space-y-1">
              {data.alerts.slice(0, 2).map((alert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 mt-0.5"
                  >
                    {alert.type === 'burnout' ? '🔥' : 
                     alert.type === 'satisfaction' ? '😔' : '📉'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{alert.member}</p>
                    <p className="text-xs text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}