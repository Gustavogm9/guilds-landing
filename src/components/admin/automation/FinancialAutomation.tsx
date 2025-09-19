import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Settings, 
  Clock, 
  Bell, 
  Bot, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react';
import { AutomationWorkflows } from './AutomationWorkflows';
import { AutomationTriggers } from './AutomationTriggers';
import { FinancialNotifications } from './FinancialNotifications';
import { FinancialIntegrations } from './FinancialIntegrations';
import { useFinancialEdgeFunctions } from '@/hooks/useFinancialEdgeFunctions';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: string;
  action: string;
  lastExecuted?: string;
  executionCount: number;
  type: 'alert' | 'notification' | 'workflow' | 'report';
}

export function FinancialAutomation() {
  const {
    processOverdueAccounts,
    sendFinancialAlerts,
    generateWeeklyReport,
    generateMonthlyReport,
    isProcessingAutomation,
    isGeneratingReport
  } = useFinancialEdgeFunctions();
  const [automationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Alerta de Vencimento',
      description: 'Notifica 3 dias antes do vencimento de contas a pagar',
      isActive: true,
      trigger: 'due_date_approaching',
      action: 'send_notification',
      lastExecuted: '2024-01-20T10:30:00Z',
      executionCount: 45,
      type: 'alert'
    },
    {
      id: '2',
      name: 'Cobrança Automática',
      description: 'Envia cobrança automática para contas vencidas',
      isActive: true,
      trigger: 'invoice_overdue',
      action: 'send_reminder',
      lastExecuted: '2024-01-20T08:15:00Z',
      executionCount: 23,
      type: 'notification'
    },
    {
      id: '3',
      name: 'Relatório Semanal',
      description: 'Gera relatório financeiro toda segunda-feira',
      isActive: true,
      trigger: 'weekly_schedule',
      action: 'generate_report',
      lastExecuted: '2024-01-15T09:00:00Z',
      executionCount: 12,
      type: 'report'
    },
    {
      id: '4',
      name: 'Fluxo de Caixa Negativo',
      description: 'Alerta quando fluxo de caixa fica negativo',
      isActive: true,
      trigger: 'negative_cash_flow',
      action: 'urgent_alert',
      lastExecuted: '2024-01-18T14:22:00Z',
      executionCount: 8,
      type: 'alert'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'notification': return <Bell className="h-4 w-4 text-primary" />;
      case 'workflow': return <Bot className="h-4 w-4 text-accent" />;
      case 'report': return <TrendingUp className="h-4 w-4 text-success" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      alert: 'destructive',
      notification: 'default',
      workflow: 'secondary',
      report: 'outline'
    } as const;
    
    const labels = {
      alert: 'Alerta',
      notification: 'Notificação',
      workflow: 'Workflow',
      report: 'Relatório'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Automação Financeira
          </h2>
          <p className="text-muted-foreground">
            Configure e gerencie processos automáticos para otimizar sua gestão financeira
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button 
            size="sm"
            onClick={processOverdueAccounts}
            disabled={isProcessingAutomation}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isProcessingAutomation ? 'Processando...' : 'Executar Automação'}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automações Ativas</p>
                <p className="text-2xl font-bold text-primary">
                  {automationRules.filter(r => r.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Execuções Hoje</p>
                <p className="text-2xl font-bold text-accent">47</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                <p className="text-2xl font-bold text-success">98.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Economizado</p>
                <p className="text-2xl font-bold text-warning">12h</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="triggers">Gatilhos</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Automação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(rule.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rule.name}</h4>
                          {getTypeBadge(rule.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {rule.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Execuções: {rule.executionCount}</span>
                          {rule.lastExecuted && (
                            <span>
                              Última: {new Date(rule.lastExecuted).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={rule.isActive} 
                        onCheckedChange={() => {
                          // Toggle rule active state
                        }}
                      />
                      <Button variant="ghost" size="sm">
                        {rule.isActive ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <AutomationWorkflows />
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
          <AutomationTriggers />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <FinancialNotifications />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <FinancialIntegrations />
        </TabsContent>
      </Tabs>
    </div>
  );
}