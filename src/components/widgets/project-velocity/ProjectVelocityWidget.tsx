import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps } from '@/types/widgets';
import { Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectVelocityData {
  currentSprint: {
    name: string;
    velocity: number;
    targetVelocity: number;
    completedStoryPoints: number;
    totalStoryPoints: number;
    daysRemaining: number;
  };
  velocityTrend: Array<{
    sprint: string;
    velocity: number;
    target: number;
  }>;
  blockers: Array<{
    id: string;
    title: string;
    severity: 'high' | 'medium' | 'low';
    daysBlocked: number;
  }>;
  teamPerformance: {
    averageVelocity: number;
    predictedCompletion: string;
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export default function ProjectVelocityWidget(props: WidgetComponentProps) {
  const data = props.data.data as ProjectVelocityData;

  if (!data) return null;

  const velocityPercentage = (data.currentSprint.velocity / data.currentSprint.targetVelocity) * 100;
  const completionPercentage = (data.currentSprint.completedStoryPoints / data.currentSprint.totalStoryPoints) * 100;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <BaseWidget {...props} showFooter>
      <div className="space-y-4">
        {/* Current Sprint Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">{data.currentSprint.name}</h4>
            <Badge variant="secondary" className="text-xs">
              {data.currentSprint.daysRemaining}d restantes
            </Badge>
          </div>

          {/* Velocity Gauge */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Velocity Atual</span>
              <span>{data.currentSprint.velocity}/{data.currentSprint.targetVelocity}</span>
            </div>
            <div className="w-full bg-muted h-2 rounded">
              <div
                className={cn(
                  "h-2 rounded transition-all",
                  velocityPercentage >= 100 ? "bg-success" :
                  velocityPercentage >= 80 ? "bg-primary" : 
                  velocityPercentage >= 60 ? "bg-warning" : "bg-danger"
                )}
                style={{ width: `${Math.min(velocityPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Story Points Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Story Points</span>
              <span>{data.currentSprint.completedStoryPoints}/{data.currentSprint.totalStoryPoints}</span>
            </div>
            <div className="w-full bg-muted h-1.5 rounded">
              <div
                className="bg-primary h-1.5 rounded transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Velocity Trend Mini Chart */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Tendência (últimos sprints)</h5>
          <div className="h-8 flex items-end justify-between gap-1">
            {data.velocityTrend.slice(-6).map((sprint, index) => {
              const maxVelocity = Math.max(...data.velocityTrend.map(s => Math.max(s.velocity, s.target)));
              const velocityHeight = (sprint.velocity / maxVelocity) * 100;
              const targetHeight = (sprint.target / maxVelocity) * 100;
              
              return (
                <div key={index} className="flex flex-col items-center gap-1 flex-1">
                  <div className="relative w-full h-6">
                    {/* Target line */}
                    <div
                      className="absolute bottom-0 w-full bg-muted-foreground/30 rounded-sm"
                      style={{ height: `${targetHeight}%` }}
                    />
                    {/* Actual velocity */}
                    <div
                      className={cn(
                        "absolute bottom-0 w-full rounded-sm",
                        sprint.velocity >= sprint.target ? "bg-success" : "bg-primary"
                      )}
                      style={{ height: `${velocityHeight}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Performance Summary */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-semibold">{data.teamPerformance.averageVelocity}</p>
            <p className="text-xs text-muted-foreground">Velocity Média</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className={cn("h-3 w-3", getRiskColor(data.teamPerformance.riskLevel))} />
            </div>
            <p className="text-sm font-semibold">{data.teamPerformance.predictedCompletion}</p>
            <p className="text-xs text-muted-foreground">Previsão</p>
          </div>
        </div>

        {/* Active Blockers */}
        {data.blockers.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Blockers Ativos
            </h5>
            <div className="space-y-1">
              {data.blockers.slice(0, 2).map((blocker) => (
                <div key={blocker.id} className="flex items-start gap-2">
                  <Badge 
                    variant={blocker.severity === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0 mt-0.5"
                  >
                    {blocker.daysBlocked}d
                  </Badge>
                  <p className="text-xs text-muted-foreground flex-1">
                    {blocker.title}
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