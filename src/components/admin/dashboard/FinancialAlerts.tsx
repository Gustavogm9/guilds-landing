import { useState } from 'react';
import { AlertTriangle, Calendar, DollarSign, TrendingDown, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useFinancial } from '@/hooks/useFinancial';

export function FinancialAlerts() {
  const { accountsReceivable, accountsPayable, metrics } = useFinancial();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  const alerts = [
    // Contas vencidas
    ...(metrics.overdueReceivable > 0 ? [{
      id: 'overdue-receivable',
      type: 'error' as const,
      icon: AlertTriangle,
      title: 'Contas a Receber Vencidas',
      description: `Há ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.overdueReceivable)} em contas vencidas para receber.`,
      action: 'Verificar contas',
    }] : []),
    
    ...(metrics.overduePayable > 0 ? [{
      id: 'overdue-payable',
      type: 'error' as const,
      icon: AlertTriangle,
      title: 'Contas a Pagar Vencidas',
      description: `Há ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.overduePayable)} em contas vencidas para pagar.`,
      action: 'Verificar contas',
    }] : []),

    // Contas próximas do vencimento (próximos 7 dias)
    ...(() => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const dueSoonReceivable = accountsReceivable.filter(item => 
        item.status === 'pending' && 
        new Date(item.due_date) <= nextWeek &&
        new Date(item.due_date) >= new Date()
      );

      const dueSoonPayable = accountsPayable.filter(item => 
        item.status === 'pending' && 
        new Date(item.due_date) <= nextWeek &&
        new Date(item.due_date) >= new Date()
      );

      const alerts = [];

      if (dueSoonReceivable.length > 0) {
        const totalAmount = dueSoonReceivable.reduce((sum, item) => sum + item.amount, 0);
        alerts.push({
          id: 'due-soon-receivable',
          type: 'warning' as const,
          icon: Calendar,
          title: 'Contas a Receber - Vencem em 7 dias',
          description: `${dueSoonReceivable.length} conta(s) totalizam ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)} para receber nos próximos 7 dias.`,
          action: 'Acompanhar',
        });
      }

      if (dueSoonPayable.length > 0) {
        const totalAmount = dueSoonPayable.reduce((sum, item) => sum + item.amount, 0);
        alerts.push({
          id: 'due-soon-payable',
          type: 'warning' as const,
          icon: Calendar,
          title: 'Contas a Pagar - Vencem em 7 dias',
          description: `${dueSoonPayable.length} conta(s) totalizam ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAmount)} para pagar nos próximos 7 dias.`,
          action: 'Programar pagamento',
        });
      }

      return alerts;
    })(),

    // Fluxo de caixa negativo
    ...(metrics.cashFlow < 0 ? [{
      id: 'negative-cashflow',
      type: 'warning' as const,
      icon: TrendingDown,
      title: 'Fluxo de Caixa Negativo',
      description: `O fluxo de caixa projetado está negativo em ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.abs(metrics.cashFlow))}.`,
      action: 'Revisar planejamento',
    }] : []),

    // Alertas de alta concentração
    ...(() => {
      const highValueReceivable = accountsReceivable.filter(item => item.amount > 50000);
      const highValuePayable = accountsPayable.filter(item => item.amount > 50000);
      
      const alerts = [];

      if (highValueReceivable.length > 0) {
        alerts.push({
          id: 'high-value-receivable',
          type: 'info' as const,
          icon: DollarSign,
          title: 'Contas de Alto Valor a Receber',
          description: `${highValueReceivable.length} conta(s) acima de R$ 50.000 para acompanhamento especial.`,
          action: 'Monitorar',
        });
      }

      if (highValuePayable.length > 0) {
        alerts.push({
          id: 'high-value-payable',
          type: 'info' as const,
          icon: DollarSign,
          title: 'Contas de Alto Valor a Pagar',
          description: `${highValuePayable.length} conta(s) acima de R$ 50.000 para planejamento de caixa.`,
          action: 'Planejar',
        });
      }

      return alerts;
    })(),
  ].filter(alert => !dismissedAlerts.includes(alert.id));

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Alertas Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <p>Tudo certo! Nenhum alerta no momento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Alertas Financeiros
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          return (
            <Alert key={alert.id} className={
              alert.type === 'error' ? 'border-red-200 bg-red-50' :
              alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <AlertDescription>{alert.description}</AlertDescription>
                    <Button variant="outline" size="sm" className="mt-2">
                      {alert.action}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissAlert(alert.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}