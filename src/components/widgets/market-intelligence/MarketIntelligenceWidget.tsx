import React from 'react';
import { BaseWidget } from '../BaseWidget';
import { WidgetComponentProps } from '@/types/widgets';
import { TrendingUp, Users, Target, Briefcase, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MarketIntelligenceData {
  competitorAnalysis: {
    totalCompetitors: number;
    newCompetitors: number;
    marketShare: number;
    positionRanking: number;
  };
  marketTrends: Array<{
    trend: string;
    impact: 'high' | 'medium' | 'low';
    growth: number;
    category: string;
  }>;
  opportunities: Array<{
    title: string;
    potential: number;
    difficulty: 'easy' | 'medium' | 'hard';
    timeToMarket: string;
  }>;
  threats: Array<{
    threat: string;
    severity: 'high' | 'medium' | 'low';
    probability: number;
    mitigation?: string;
  }>;
  industryMetrics: {
    averageGrowthRate: number;
    marketSize: number;
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
  };
}

export default function MarketIntelligenceWidget(props: WidgetComponentProps) {
  const data = props.data.data as MarketIntelligenceData;

  if (!data) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact'
    }).format(value);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-danger';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <BaseWidget {...props} showFooter>
      <div className="space-y-4">
        {/* Market Position Overview */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-semibold">{data.competitorAnalysis.marketShare.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Market Share</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Briefcase className="h-3 w-3 text-primary" />
            </div>
            <p className="text-sm font-semibold">#{data.competitorAnalysis.positionRanking}</p>
            <p className="text-xs text-muted-foreground">Posição</p>
          </div>
        </div>

        {/* Industry Metrics */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground">Métricas da Indústria</h5>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Crescimento Médio</span>
              <span className={cn(
                "text-xs font-medium",
                data.industryMetrics.averageGrowthRate > 0 ? "text-success" : "text-danger"
              )}>
                {data.industryMetrics.averageGrowthRate > 0 ? '+' : ''}{data.industryMetrics.averageGrowthRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tamanho do Mercado</span>
              <span className="text-xs font-medium">
                {formatCurrency(data.industryMetrics.marketSize)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">CAC/LTV Ratio</span>
              <span className={cn(
                "text-xs font-medium",
                (data.industryMetrics.customerLifetimeValue / data.industryMetrics.customerAcquisitionCost) > 3 
                  ? "text-success" : "text-warning"
              )}>
                1:{(data.industryMetrics.customerLifetimeValue / data.industryMetrics.customerAcquisitionCost).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Market Trends */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Tendências do Mercado
          </h5>
          <div className="space-y-1">
            {data.marketTrends.slice(0, 3).map((trend, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge 
                  variant="secondary"
                  className="text-xs px-1 py-0 mt-0.5"
                >
                  {trend.growth > 0 ? '+' : ''}{trend.growth}%
                </Badge>
                <div className="flex-1">
                  <p className="text-xs font-medium">{trend.trend}</p>
                  <p className={cn("text-xs", getImpactColor(trend.impact))}>
                    {trend.category} • {trend.impact} impact
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities & Threats */}
        <div className="grid grid-cols-2 gap-2">
          {/* Opportunities */}
          <div className="space-y-2">
            <h6 className="text-xs font-medium text-success">Oportunidades</h6>
            <div className="space-y-1">
              {data.opportunities.slice(0, 2).map((opportunity, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs font-medium">{opportunity.title}</p>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {opportunity.timeToMarket}
                    </span>
                    <span className="text-xs text-success">
                      +{opportunity.potential}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Threats */}
          <div className="space-y-2">
            <h6 className="text-xs font-medium text-danger">Ameaças</h6>
            <div className="space-y-1">
              {data.threats.slice(0, 2).map((threat, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs font-medium">{threat.threat}</p>
                  <div className="flex justify-between">
                    <span className={cn("text-xs", getSeverityColor(threat.severity))}>
                      {threat.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {threat.probability}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitor Update */}
        {data.competitorAnalysis.newCompetitors > 0 && (
          <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-md">
            <AlertCircle className="h-3 w-3 text-warning" />
            <p className="text-xs text-warning">
              {data.competitorAnalysis.newCompetitors} novos competidores identificados
            </p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
}