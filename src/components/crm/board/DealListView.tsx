import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CRMDeal, CRMStage } from '@/hooks/useCRM';
import { DealTableRow } from './DealTableRow';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  TrendingUp,
  DollarSign,
  Target,
  Package,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DealListViewProps {
  deals: CRMDeal[];
  stages: CRMStage[];
  isLoading: boolean;
  onViewDetails: (deal: CRMDeal) => void;
  onAddInteraction: (deal: CRMDeal) => void;
  onEmailInteraction: (deal: CRMDeal) => void;
  onPhoneInteraction: (deal: CRMDeal) => void;
  onEdit: (deal: CRMDeal) => void;
  onDuplicate: (deal: CRMDeal) => void;
  onDelete: (deal: CRMDeal) => void;
  onScheduleActivity: (deal: CRMDeal) => void;
}

type SortField = 'value' | 'date' | 'score' | 'probability' | 'stage';
type SortOrder = 'asc' | 'desc';

export function DealListView({
  deals,
  stages,
  isLoading,
  onViewDetails,
  onAddInteraction,
  onEmailInteraction,
  onPhoneInteraction,
  onEdit,
  onDuplicate,
  onDelete,
  onScheduleActivity,
}: DealListViewProps) {
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [groupByStage, setGroupByStage] = useState(false);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgProbability = deals.length > 0
      ? deals.reduce((sum, deal) => sum + (deal.probability || 0), 0) / deals.length
      : 0;
    const weightedValue = deals.reduce(
      (sum, deal) => sum + ((deal.value || 0) * (deal.probability || 0)) / 100,
      0
    );

    return {
      totalDeals: deals.length,
      totalValue,
      avgProbability,
      weightedValue,
    };
  }, [deals]);

  // Sort deals
  const sortedDeals = useMemo(() => {
    const sorted = [...deals];
    
    sorted.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'value':
          comparison = (a.value || 0) - (b.value || 0);
          break;
        case 'date':
          comparison = new Date(a.expected_close_date || '').getTime() - 
                      new Date(b.expected_close_date || '').getTime();
          break;
        case 'score':
          comparison = (a.contact?.lead_score || 0) - (b.contact?.lead_score || 0);
          break;
        case 'probability':
          comparison = (a.probability || 0) - (b.probability || 0);
          break;
        case 'stage':
          const stageNameA = stages.find(s => s.id === a.stage_id)?.name || '';
          const stageNameB = stages.find(s => s.id === b.stage_id)?.name || '';
          comparison = stageNameA.localeCompare(stageNameB);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [deals, sortField, sortOrder, stages]);

  // Group deals by stage if enabled
  const groupedDeals = useMemo(() => {
    if (!groupByStage) {
      return { ungrouped: sortedDeals };
    }

    const grouped: Record<string, CRMDeal[]> = {};
    
    sortedDeals.forEach(deal => {
      const stageId = deal.stage_id;
      if (!grouped[stageId]) {
        grouped[stageId] = [];
      }
      grouped[stageId].push(deal);
    });

    return grouped;
  }, [sortedDeals, groupByStage]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-2 opacity-50" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-2" />
      : <ArrowDown className="h-4 w-4 ml-2" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum deal encontrado</h3>
            <p className="text-muted-foreground">
              Não há deals neste pipeline. Adicione um novo deal para começar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium text-muted-foreground">Total Deals</div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDeals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium text-muted-foreground">Valor Total</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium text-muted-foreground">Valor Ponderado</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.weightedValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Baseado em probabilidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="text-sm font-medium text-muted-foreground">Prob. Média</div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgProbability.toFixed(0)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Ordenar por:</label>
              <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="value">Valor</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="score">Lead Score</SelectItem>
                  <SelectItem value="probability">Probabilidade</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              variant={groupByStage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGroupByStage(!groupByStage)}
            >
              {groupByStage ? 'Desagrupar' : 'Agrupar por Stage'}
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Contato</TableHead>
                  <TableHead className="w-[250px]">Deal</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('value')}
                  >
                    <div className="flex items-center justify-end">
                      Valor
                      <SortIcon field="value" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('probability')}
                  >
                    <div className="flex items-center justify-center">
                      Prob.
                      <SortIcon field="probability" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('stage')}
                  >
                    <div className="flex items-center">
                      Stage
                      <SortIcon field="stage" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center justify-center">
                      Previsão
                      <SortIcon field="date" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center justify-center">
                      Score
                      <SortIcon field="score" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right w-[180px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupByStage ? (
                  // Grouped view
                  Object.entries(groupedDeals).map(([stageId, stageDeals]) => {
                    const stage = stages.find(s => s.id === stageId);
                    return (
                      <React.Fragment key={stageId}>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <td colSpan={8} className="py-3 px-4 font-semibold">
                            <div className="flex items-center gap-2">
                              <Badge
                                style={{
                                  backgroundColor: `${stage?.color || '#6366f1'}20`,
                                  color: stage?.color || '#6366f1',
                                  borderColor: `${stage?.color || '#6366f1'}40`
                                }}
                                className="border"
                              >
                                {stage?.name || 'Sem stage'}
                              </Badge>
                              <span className="text-muted-foreground text-sm">
                                ({stageDeals.length} deals)
                              </span>
                            </div>
                          </td>
                        </TableRow>
                        {stageDeals.map(deal => (
                          <DealTableRow
                            key={deal.id}
                            deal={deal}
                            stages={stages}
                            onViewDetails={onViewDetails}
                            onAddInteraction={onAddInteraction}
                            onEmailInteraction={onEmailInteraction}
                            onPhoneInteraction={onPhoneInteraction}
                            onEdit={onEdit}
                            onDuplicate={onDuplicate}
                            onDelete={onDelete}
                            onScheduleActivity={onScheduleActivity}
                          />
                        ))}
                      </React.Fragment>
                    );
                  })
                ) : (
                  // Normal view
                  sortedDeals.map(deal => (
                    <DealTableRow
                      key={deal.id}
                      deal={deal}
                      stages={stages}
                      onViewDetails={onViewDetails}
                      onAddInteraction={onAddInteraction}
                      onEmailInteraction={onEmailInteraction}
                      onPhoneInteraction={onPhoneInteraction}
                      onEdit={onEdit}
                      onDuplicate={onDuplicate}
                      onDelete={onDelete}
                      onScheduleActivity={onScheduleActivity}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
