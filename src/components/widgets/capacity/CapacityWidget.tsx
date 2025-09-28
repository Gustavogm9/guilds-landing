import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps, CapacityData } from '@/types/widgets';
import { Users, AlertTriangle, Activity } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CapacityWidget(props: WidgetComponentProps) {
  const data = props.data.data as CapacityData;

  if (!data) return null;

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return 'text-danger';
    if (utilization > 75) return 'text-warning';
    return 'text-success';
  };

  const getUtilizationVariant = (utilization: number) => {
    if (utilization > 90) return 'destructive';
    if (utilization > 75) return 'secondary';
    return 'default';
  };

  const hasBottlenecks = data.bottlenecks.length > 0;
  const criticalBottlenecks = data.bottlenecks.filter(b => b.severity === 'high').length;
  const status = criticalBottlenecks > 0 ? 'error' : hasBottlenecks ? 'warning' : 'healthy';

  return (
    <BaseWidget {...props} status={status} showFooter>
      <div className="space-y-4">
        {/* Overall Utilization */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Utilização Geral</span>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            getUtilizationColor(data.overallUtilization)
          )}>
            {data.overallUtilization.toFixed(1)}%
          </p>
          <Progress 
            value={data.overallUtilization} 
            className="mt-2 h-2"
          />
        </div>

        {/* Teams Capacity */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Capacidade por Equipe</h4>
          {data.teams.slice(0, 3).map((team, index) => {
            const utilization = (team.usedCapacity / team.totalCapacity) * 100;
            
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium truncate">
                    {team.name}
                  </span>
                  <Badge 
                    variant={getUtilizationVariant(utilization)}
                    className="text-xs px-1 py-0"
                  >
                    {utilization.toFixed(0)}%
                  </Badge>
                </div>
                
                <Progress 
                  value={utilization} 
                  className="h-1.5"
                />
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{team.usedCapacity}h / {team.totalCapacity}h</span>
                  <span>{team.availableCapacity}h disponível</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottlenecks */}
        {data.bottlenecks.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Gargalos ({data.bottlenecks.length})
            </h4>
            <div className="space-y-1">
              {data.bottlenecks.slice(0, 2).map((bottleneck, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge 
                    variant={bottleneck.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 mt-0.5"
                  >
                    {bottleneck.severity === 'high' ? '🔥' : '⚠️'}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{bottleneck.team}</p>
                    <p className="text-xs text-muted-foreground">{bottleneck.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-bold">{data.teams.length}</p>
            <p className="text-xs text-muted-foreground">equipes</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-bold">
              {data.teams.reduce((acc, team) => acc + team.projects.length, 0)}
            </p>
            <p className="text-xs text-muted-foreground">projetos</p>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}