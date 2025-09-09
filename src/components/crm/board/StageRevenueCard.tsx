import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Target } from 'lucide-react';
import { CRMDeal } from '@/hooks/useCRM';

interface StageRevenueCardProps {
  deals: CRMDeal[];
  stageColor: string;
}

export function StageRevenueCard({ deals, stageColor }: StageRevenueCardProps) {
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const dealCount = deals.length;
  const averageTicket = dealCount > 0 ? totalValue / dealCount : 0;
  const highestDeal = Math.max(...deals.map(deal => deal.value || 0));

  const getValueColor = (value: number) => {
    if (value >= 100000) return 'text-green-600 dark:text-green-400';
    if (value >= 50000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="mb-4 border-l-4 bg-card/50 backdrop-blur-sm" style={{ borderLeftColor: stageColor }}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Potencial de Receita
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {dealCount} {dealCount === 1 ? 'oportunidade' : 'oportunidades'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className={`text-lg font-bold ${getValueColor(totalValue)}`}>
              R$ {totalValue.toLocaleString('pt-BR')}
            </span>
          </div>
          
          {dealCount > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Ticket médio</span>
                </div>
                <span className="text-sm font-medium">
                  R$ {averageTicket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Maior oportunidade</span>
                </div>
                <span className="text-sm font-medium text-primary">
                  R$ {highestDeal.toLocaleString('pt-BR')}
                </span>
              </div>
            </>
          )}
        </div>
        
        {totalValue > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((totalValue / 500000) * 100, 100)}%`,
                  backgroundColor: stageColor 
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1 text-center">
              Meta: R$ 500.000
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}