import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DealCard } from './DealCard';
import { CRMStage, CRMDeal } from '@/hooks/useCRM';
import { Skeleton } from '@/components/ui/skeleton';

interface KanbanColumnProps {
  stage: CRMStage;
  deals: CRMDeal[];
  isLoading: boolean;
}

export function KanbanColumn({ stage, deals, isLoading }: KanbanColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <Card className="w-80 bg-background/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: stage.color }}
            />
            {stage.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {deals.length}
          </Badge>
        </div>
        
        {stage.description && (
          <p className="text-xs text-muted-foreground">{stage.description}</p>
        )}
        
        {totalValue > 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            Total: R$ {totalValue.toLocaleString('pt-BR')}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3 min-h-[500px]">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))
          ) : deals.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs py-8">
              Nenhuma oportunidade neste estágio
            </div>
          ) : (
            deals.map((deal, index) => (
              <DealCard key={deal.id} deal={deal} index={index} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}