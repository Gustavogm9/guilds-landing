import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Calendar, Target, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useFinancial } from '@/hooks/useFinancial';

export function FinancialKPIs() {
  const { metrics, isLoading } = useFinancial();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calcular métricas avançadas
  const calculateAdvancedMetrics = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    // Receitas do mês atual vs anterior
    const currentMonthReceivable = metrics.totalReceivable || 0;
    const lastMonthReceivable = (metrics.totalReceivable || 0) * 0.85; // Mock data
    const receivableGrowth = lastMonthReceivable > 0 
      ? ((currentMonthReceivable - lastMonthReceivable) / lastMonthReceivable) * 100 
      : 0;

    // Days Sales Outstanding (DSO)
    const averageDailyReceivable = currentMonthReceivable / 30;
    const dso = averageDailyReceivable > 0 ? (metrics.totalReceivable || 0) / averageDailyReceivable : 0;

    // Liquidez
    const liquidityRatio = metrics.totalPayable > 0 
      ? (metrics.totalReceivable || 0) / metrics.totalPayable 
      : 0;

    // Margem de contribuição (mock)
    const revenue = currentMonthReceivable;
    const costs = metrics.totalPayable || 0;
    const contributionMargin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0;

    return {
      receivableGrowth,
      dso,
      liquidityRatio,
      contributionMargin
    };
  };

  const advancedMetrics = calculateAdvancedMetrics();

  const kpis = [
    {
      title: 'Receitas a Receber',
      value: metrics.totalReceivable,
      icon: TrendingUp,
      trend: advancedMetrics.receivableGrowth >= 0 ? 'up' : 'down',
      description: `${advancedMetrics.receivableGrowth >= 0 ? '+' : ''}${advancedMetrics.receivableGrowth.toFixed(1)}% vs mês anterior`,
      color: 'text-green-600',
      progress: Math.min((metrics.totalReceivable || 0) / 100000 * 100, 100),
    },
    {
      title: 'Contas a Pagar',
      value: metrics.totalPayable,
      icon: TrendingDown,
      trend: 'down',
      description: 'Total pendente',
      color: 'text-red-600',
      progress: Math.min((metrics.totalPayable || 0) / 80000 * 100, 100),
    },
    {
      title: 'DSO (Dias)',
      value: advancedMetrics.dso,
      icon: Calendar,
      trend: advancedMetrics.dso <= 30 ? 'up' : 'warning',
      description: 'Prazo médio recebimento',
      color: advancedMetrics.dso <= 30 ? 'text-green-600' : 'text-yellow-600',
      showAsCurrency: false,
      suffix: ' dias',
    },
    {
      title: 'Índice de Liquidez',
      value: advancedMetrics.liquidityRatio,
      icon: Target,
      trend: advancedMetrics.liquidityRatio >= 1.2 ? 'up' : advancedMetrics.liquidityRatio >= 1 ? 'neutral' : 'down',
      description: 'Capacidade de pagamento',
      color: advancedMetrics.liquidityRatio >= 1.2 ? 'text-green-600' : advancedMetrics.liquidityRatio >= 1 ? 'text-blue-600' : 'text-red-600',
      showAsCurrency: false,
      suffix: 'x',
    },
    {
      title: 'Margem Contribuição',
      value: advancedMetrics.contributionMargin,
      icon: PieChart,
      trend: advancedMetrics.contributionMargin >= 30 ? 'up' : advancedMetrics.contributionMargin >= 20 ? 'neutral' : 'down',
      description: 'Rentabilidade',
      color: advancedMetrics.contributionMargin >= 30 ? 'text-green-600' : advancedMetrics.contributionMargin >= 20 ? 'text-blue-600' : 'text-red-600',
      showAsCurrency: false,
      suffix: '%',
    },
    {
      title: 'Em Atraso',
      value: metrics.overdueReceivable + metrics.overduePayable,
      icon: AlertTriangle,
      trend: 'warning',
      description: 'Vencidos',
      color: 'text-yellow-600',
      urgent: (metrics.overdueReceivable + metrics.overduePayable) > 0,
    },
  ];

  const formatValue = (value: number, showAsCurrency = true, suffix = '') => {
    if (!showAsCurrency) {
      return `${value.toFixed(value % 1 === 0 ? 0 : 1)}${suffix}`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className={`relative overflow-hidden transition-all hover:shadow-md ${kpi.urgent ? 'ring-2 ring-warning' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {formatValue(kpi.value || 0, kpi.showAsCurrency !== false, kpi.suffix)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{kpi.description}</span>
                {kpi.trend === 'warning' && kpi.value > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Atenção
                  </Badge>
                )}
                {kpi.trend === 'up' && (
                  <Badge variant="default" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Positivo
                  </Badge>
                )}
                {kpi.trend === 'neutral' && (
                  <Badge variant="secondary" className="text-xs">
                    Neutro
                  </Badge>
                )}
              </div>
              {kpi.progress !== undefined && (
                <Progress value={kpi.progress} className="h-1 mt-2" />
              )}
            </CardContent>
            {kpi.trend === 'up' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600" />
            )}
            {kpi.trend === 'down' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-red-500 to-red-600" />
            )}
            {kpi.trend === 'warning' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-500 to-yellow-600" />
            )}
            {kpi.trend === 'neutral' && (
              <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600" />
            )}
          </Card>
        );
      })}
    </div>
  );
}