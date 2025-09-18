import { TrendingUp, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const kpis = [
    {
      title: 'Receitas a Receber',
      value: metrics.totalReceivable,
      icon: TrendingUp,
      trend: 'up',
      description: 'Total pendente',
      color: 'text-green-600',
    },
    {
      title: 'Contas a Pagar',
      value: metrics.totalPayable,
      icon: TrendingDown,
      trend: 'down',
      description: 'Total pendente',
      color: 'text-red-600',
    },
    {
      title: 'Fluxo de Caixa',
      value: metrics.cashFlow,
      icon: DollarSign,
      trend: metrics.cashFlow >= 0 ? 'up' : 'down',
      description: 'Projetado',
      color: metrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Em Atraso',
      value: metrics.overdueReceivable + metrics.overduePayable,
      icon: AlertTriangle,
      trend: 'warning',
      description: 'Vencidos',
      color: 'text-yellow-600',
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(kpi.value)}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{kpi.description}</span>
                {kpi.trend === 'warning' && kpi.value > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Atenção
                  </Badge>
                )}
              </div>
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
          </Card>
        );
      })}
    </div>
  );
}