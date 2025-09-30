import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Clock, 
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  FileText,
  Package,
  AlertCircle
} from 'lucide-react';
import { CRMDeal, CRMPipeline, CRMStage } from '@/hooks/useCRM';
import { useCRMContractIntegration } from '@/hooks/useCRMContractIntegration';
import { TemplateSelectionModal } from './TemplateSelectionModal';

interface CRMDashboardProps {
  deals: CRMDeal[];
  pipelines: CRMPipeline[];
  stages: CRMStage[];
  selectedPipelineId: string;
}

interface PipelineMetrics {
  totalDeals: number;
  totalValue: number;
  averageValue: number;
  winRate: number;
  averageTime: number;
  conversionRates: { [stageId: string]: number };
}

interface StageAnalysis {
  id: string;
  name: string;
  color: string;
  dealCount: number;
  totalValue: number;
  averageValue: number;
  conversionRate: number;
  avgTimeInStage: number;
}

export function CRMDashboard({ deals, pipelines, stages, selectedPipelineId }: CRMDashboardProps) {
  const { generateContractFromDeal, isGenerating } = useCRMContractIntegration();
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedDealForContract, setSelectedDealForContract] = useState<CRMDeal | null>(null);

  // Calculate pipeline metrics
  const calculateMetrics = (): PipelineMetrics => {
    const pipelineDeals = deals.filter(deal => deal.pipeline_id === selectedPipelineId);
    
    return {
      totalDeals: pipelineDeals.length,
      totalValue: pipelineDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
      averageValue: pipelineDeals.length > 0 ? 
        pipelineDeals.reduce((sum, deal) => sum + (deal.value || 0), 0) / pipelineDeals.length : 0,
      winRate: 85, // Mock data - would calculate from closed deals
      averageTime: 32, // Mock data - days to close
      conversionRates: {} // Would calculate stage-to-stage conversion
    };
  };

  // Analyze stages
  const analyzeStages = (): StageAnalysis[] => {
    return stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage_id === stage.id);
      const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      
      return {
        id: stage.id,
        name: stage.name,
        color: stage.color,
        dealCount: stageDeals.length,
        totalValue,
        averageValue: stageDeals.length > 0 ? totalValue / stageDeals.length : 0,
        conversionRate: Math.random() * 100, // Mock - would calculate actual conversion
        avgTimeInStage: Math.floor(Math.random() * 15) + 5 // Mock - would calculate from timestamps
      };
    });
  };

  // Analyze by source
  const analyzeBySource = () => {
    const pipelineDeals = deals.filter(deal => deal.pipeline_id === selectedPipelineId);
    const sourceAnalysis = pipelineDeals
      .filter(deal => deal.source)
      .reduce((acc, deal) => {
        const source = deal.source || 'Não informado';
        if (!acc[source]) {
          acc[source] = {
            count: 0,
            totalValue: 0,
            deals: []
          };
        }
        acc[source].count++;
        acc[source].totalValue += deal.value || 0;
        acc[source].deals.push(deal);
        return acc;
      }, {} as Record<string, { count: number; totalValue: number; deals: CRMDeal[] }>);
    
    return Object.entries(sourceAnalysis).map(([source, data]) => ({
      source,
      count: data.count,
      totalValue: data.totalValue,
      averageValue: data.totalValue / data.count,
      percentage: (data.count / pipelineDeals.length) * 100
    })).sort((a, b) => b.count - a.count);
  };

  // Analyze by business unit
  const analyzeByBusinessUnit = () => {
    const pipelineDeals = deals.filter(deal => deal.pipeline_id === selectedPipelineId);
    const unitAnalysis = pipelineDeals
      .filter(deal => deal.business_unit)
      .reduce((acc, deal) => {
        const unit = deal.business_unit || 'Não informado';
        if (!acc[unit]) {
          acc[unit] = {
            count: 0,
            totalValue: 0,
            deals: []
          };
        }
        acc[unit].count++;
        acc[unit].totalValue += deal.value || 0;
        acc[unit].deals.push(deal);
        return acc;
      }, {} as Record<string, { count: number; totalValue: number; deals: CRMDeal[] }>);
    
    return Object.entries(unitAnalysis).map(([unit, data]) => ({
      unit: getBusinessUnitLabel(unit),
      unitValue: unit,
      count: data.count,
      totalValue: data.totalValue,
      averageValue: data.totalValue / data.count,
      percentage: (data.count / pipelineDeals.length) * 100
    })).sort((a, b) => b.count - a.count);
  };

  // Analyze forecast
  const analyzeForecast = () => {
    const today = new Date();
    const next30Days = new Date(today);
    next30Days.setDate(next30Days.getDate() + 30);
    const next60Days = new Date(today);
    next60Days.setDate(next60Days.getDate() + 60);
    const next90Days = new Date(today);
    next90Days.setDate(next90Days.getDate() + 90);

    const pipelineDeals = deals.filter(deal => deal.pipeline_id === selectedPipelineId);

    return {
      overdue: pipelineDeals.filter(d => 
        d.expected_close_date && new Date(d.expected_close_date) < today
      ),
      next30: pipelineDeals.filter(d => 
        d.expected_close_date && 
        new Date(d.expected_close_date) >= today && 
        new Date(d.expected_close_date) <= next30Days
      ),
      next60: pipelineDeals.filter(d => 
        d.expected_close_date && 
        new Date(d.expected_close_date) > next30Days && 
        new Date(d.expected_close_date) <= next60Days
      ),
      next90: pipelineDeals.filter(d => 
        d.expected_close_date && 
        new Date(d.expected_close_date) > next60Days && 
        new Date(d.expected_close_date) <= next90Days
      ),
    };
  };

  const metrics = calculateMetrics();
  const stageAnalysis = analyzeStages();
  const sourceAnalysis = analyzeBySource();
  const businessUnitAnalysis = analyzeByBusinessUnit();
  const forecast = analyzeForecast();
  const selectedPipeline = pipelines.find(p => p.id === selectedPipelineId);

  // Mock data for trends (would come from time-series analysis)
  const trendData = {
    dealsGrowth: 12.5,
    valueGrowth: 8.3,
    winRateChange: -2.1,
    avgTimeChange: 5.2
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-emerald-500" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-rose-500" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-emerald-600';
    if (value < 0) return 'text-rose-600';
    return 'text-slate-600';
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'website': 'Website',
      'referral': 'Indicação',
      'networking': 'Rede de Networking',
      'social_media': 'Redes Sociais',
      'cold_call': 'Cold Call',
      'email_marketing': 'Email Marketing',
      'event': 'Evento',
      'other': 'Outros'
    };
    return labels[source] || source;
  };

  const getBusinessUnitLabel = (unit: string) => {
    const labels: Record<string, string> = {
      'guilds': 'Guilds',
      'guilds_lab': 'Guilds Lab',
      'guilds_craft': 'Guilds Craft',
      'doavya': 'Doavya',
      'outros': 'Outros'
    };
    return labels[unit] || unit;
  };

  const handleGenerateContractFromDashboard = (deal: CRMDeal) => {
    setSelectedDealForContract(deal);
    setIsTemplateModalOpen(true);
  };

  const handleTemplateSelected = async (templateId: string) => {
    if (!selectedDealForContract) return;
    
    try {
      const contractId = await generateContractFromDeal(selectedDealForContract.id, templateId);
      window.location.href = `/admin/contratos?id=${contractId}`;
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
    } finally {
      setSelectedDealForContract(null);
    }
  };

  const closeTemplateModal = () => {
    setIsTemplateModalOpen(false);
    setSelectedDealForContract(null);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Performance</h2>
          <p className="text-muted-foreground">
            Análise detalhada do pipeline {selectedPipeline?.name}
          </p>
        </div>
        {selectedPipeline && (
          <Badge 
            variant="secondary"
            className="px-3 py-1"
            style={{ 
              backgroundColor: `${selectedPipeline.color}20`, 
              color: selectedPipeline.color,
              borderColor: `${selectedPipeline.color}40`
            }}
          >
            {selectedPipeline.name}
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Oportunidades</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalDeals}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(trendData.dealsGrowth)}
              <span className={getTrendColor(trendData.dealsGrowth)}>
                {formatPercentage(Math.abs(trendData.dealsGrowth))} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(trendData.valueGrowth)}
              <span className={getTrendColor(trendData.valueGrowth)}>
                {formatPercentage(Math.abs(trendData.valueGrowth))} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(metrics.winRate)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(trendData.winRateChange)}
              <span className={getTrendColor(trendData.winRateChange)}>
                {formatPercentage(Math.abs(trendData.winRateChange))} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageTime}d</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(-trendData.avgTimeChange)}
              <span className={getTrendColor(-trendData.avgTimeChange)}>
                {formatPercentage(Math.abs(trendData.avgTimeChange))} vs mês anterior
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance por Estágio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageAnalysis.map(stage => (
              <div key={stage.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-sm">{stage.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{stage.dealCount} deals</div>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(stage.totalValue)}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Taxa de conversão</span>
                    <span>{formatPercentage(stage.conversionRate)}</span>
                  </div>
                  <Progress value={stage.conversionRate} className="h-2" />
                </div>
                <div className="text-xs text-muted-foreground">
                  Tempo médio: {stage.avgTimeInStage} dias
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Funil de Conversão
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const firstDeal = deals.find(d => d.pipeline_id === selectedPipelineId);
                  if (firstDeal) {
                    handleGenerateContractFromDashboard(firstDeal);
                  }
                }}
                size="sm"
                variant="outline"
                disabled={isGenerating}
              >
                <FileText className="mr-2 h-4 w-4" />
                {isGenerating ? 'Gerando...' : 'Gerar Contrato'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stageAnalysis.map((stage, index) => {
                const isFirst = index === 0;
                const isLast = index === stageAnalysis.length - 1;
                const width = isFirst ? 100 : Math.max(20, 100 - (index * 15));
                
                return (
                  <div key={stage.id} className="relative">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div 
                          className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg p-3 transition-all duration-300 hover:from-primary/30 hover:to-primary/20"
                          style={{ width: `${width}%` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: stage.color }}
                              />
                              <span className="text-sm font-medium">{stage.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {stage.dealCount}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-medium">
                          {formatPercentage(stage.conversionRate)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(stage.averageValue)}
                        </div>
                      </div>
                    </div>
                    
                    {!isLast && (
                      <div className="flex justify-center my-2">
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Análise por Origem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceAnalysis.length > 0 ? (
                sourceAnalysis.map((item, index) => (
                  <div key={item.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}º</Badge>
                        <span className="font-medium text-sm">{getSourceLabel(item.source)}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.count} deals</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.totalValue)}
                        </div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatPercentage(item.percentage)} do total</span>
                      <span>Ticket médio: {formatCurrency(item.averageValue)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum dado de origem disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Unit Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Análise por Negócio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessUnitAnalysis.length > 0 ? (
                businessUnitAnalysis.map((item) => (
                  <div key={item.unitValue} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.unit}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{item.count} deals</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(item.totalValue)}
                        </div>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Ticket médio: {formatCurrency(item.averageValue)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Nenhum negócio informado
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Forecast Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Previsão de Fechamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecast.overdue.length > 0 && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-lg border border-rose-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                      <span className="font-medium text-rose-900 dark:text-rose-100">
                        Atrasadas
                      </span>
                    </div>
                    <Badge variant="destructive">{forecast.overdue.length}</Badge>
                  </div>
                  <div className="text-sm text-rose-800 dark:text-rose-200 mt-1">
                    {formatCurrency(forecast.overdue.reduce((sum, d) => sum + (d.value || 0), 0))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Próximos 30 dias</span>
                  <div className="text-right">
                    <Badge variant="secondary">{forecast.next30.length}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(forecast.next30.reduce((sum, d) => sum + (d.value || 0), 0))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">30-60 dias</span>
                  <div className="text-right">
                    <Badge variant="secondary">{forecast.next60.length}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(forecast.next60.reduce((sum, d) => sum + (d.value || 0), 0))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">60-90 dias</span>
                  <div className="text-right">
                    <Badge variant="secondary">{forecast.next90.length}</Badge>
                    <div className="text-xs text-muted-foreground">
                      {formatCurrency(forecast.next90.reduce((sum, d) => sum + (d.value || 0), 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">Oportunidade</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                O estágio "{stageAnalysis[0]?.name}" tem alta conversão. 
                Considere otimizar os estágios anteriores para alimentá-lo melhor.
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-900 dark:text-amber-100">Atenção</span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Algumas oportunidades estão paradas há mais de 30 dias. 
                Considere ações de follow-up.
              </p>
            </div>
            
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-900 dark:text-emerald-100">Meta</span>
              </div>
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                Você está 12% acima da meta mensal. 
                Continue focando em leads qualificados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={closeTemplateModal}
        onSelectTemplate={handleTemplateSelected}
        dealTitle={selectedDealForContract?.title}
      />
    </div>
  );
}