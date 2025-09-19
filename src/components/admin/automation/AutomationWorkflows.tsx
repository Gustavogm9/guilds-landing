import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Play, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Plus,
  Calendar
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  description: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: string;
  steps: WorkflowStep[];
  executionCount: number;
  successRate: number;
  lastRun?: string;
  nextRun?: string;
  category: 'payment' | 'invoice' | 'report' | 'alert';
}

export function AutomationWorkflows() {
  const [workflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Processo de Cobrança Automática',
      description: 'Workflow completo para cobrança de faturas vencidas',
      isActive: true,
      trigger: 'invoice_overdue',
      executionCount: 156,
      successRate: 94.2,
      lastRun: '2024-01-20T09:15:00Z',
      nextRun: '2024-01-21T09:00:00Z',
      category: 'payment',
      steps: [
        {
          id: '1',
          name: 'Detectar Vencimento',
          type: 'trigger',
          status: 'completed',
          description: 'Verifica faturas vencidas há mais de 3 dias'
        },
        {
          id: '2',
          name: 'Verificar Histórico',
          type: 'condition',
          status: 'completed',
          description: 'Analisa histórico de pagamento do cliente'
        },
        {
          id: '3',
          name: 'Enviar Primeira Cobrança',
          type: 'action',
          status: 'completed',
          duration: 2,
          description: 'Email automático com lembrete de pagamento'
        },
        {
          id: '4',
          name: 'Aguardar 7 dias',
          type: 'delay',
          status: 'running',
          description: 'Período de carência para pagamento'
        },
        {
          id: '5',
          name: 'Segunda Cobrança',
          type: 'action',
          status: 'pending',
          description: 'Email com tom mais assertivo'
        },
        {
          id: '6',
          name: 'Notificar Financeiro',
          type: 'action',
          status: 'pending',
          description: 'Alerta para equipe financeira'
        }
      ]
    },
    {
      id: '2',
      name: 'Geração de Relatórios Periódicos',
      description: 'Relatórios financeiros automáticos semanais e mensais',
      isActive: true,
      trigger: 'schedule_weekly',
      executionCount: 48,
      successRate: 100,
      lastRun: '2024-01-15T08:00:00Z',
      nextRun: '2024-01-22T08:00:00Z',
      category: 'report',
      steps: [
        {
          id: '1',
          name: 'Coletar Dados',
          type: 'action',
          status: 'completed',
          description: 'Agrega dados financeiros da semana'
        },
        {
          id: '2',
          name: 'Calcular KPIs',
          type: 'action',
          status: 'completed',
          description: 'Processa indicadores-chave'
        },
        {
          id: '3',
          name: 'Gerar Relatório',
          type: 'action',
          status: 'completed',
          description: 'Cria PDF com análise financeira'
        },
        {
          id: '4',
          name: 'Enviar por Email',
          type: 'action',
          status: 'completed',
          description: 'Distribui para stakeholders'
        }
      ]
    },
    {
      id: '3',
      name: 'Alerta de Fluxo de Caixa',
      description: 'Monitora e alerta sobre situações críticas do fluxo',
      isActive: true,
      trigger: 'cash_flow_monitor',
      executionCount: 23,
      successRate: 87.0,
      lastRun: '2024-01-20T14:30:00Z',
      category: 'alert',
      steps: [
        {
          id: '1',
          name: 'Monitorar Fluxo',
          type: 'trigger',
          status: 'completed',
          description: 'Verifica fluxo de caixa a cada hora'
        },
        {
          id: '2',
          name: 'Verificar Limite',
          type: 'condition',
          status: 'completed',
          description: 'Compara com limite mínimo configurado'
        },
        {
          id: '3',
          name: 'Alerta Urgente',
          type: 'action',
          status: 'completed',
          description: 'Notificação imediata para gestores'
        }
      ]
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'running':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      payment: 'hsl(var(--primary))',
      invoice: 'hsl(var(--accent))',
      report: 'hsl(var(--success))',
      alert: 'hsl(var(--destructive))'
    };
    return colors[category as keyof typeof colors] || 'hsl(var(--muted))';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workflows de Automação</h3>
          <p className="text-sm text-muted-foreground">
            Configure e monitore fluxos de trabalho automatizados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Workflow
        </Button>
      </div>

      <div className="grid gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-base">{workflow.name}</CardTitle>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: getCategoryColor(workflow.category),
                        color: getCategoryColor(workflow.category)
                      }}
                    >
                      {workflow.category}
                    </Badge>
                    <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                      {workflow.isActive ? 'Ativo' : 'Pausado'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {workflow.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {workflow.executionCount} execuções
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {workflow.successRate}% sucesso
                    </div>
                    {workflow.lastRun && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Última: {new Date(workflow.lastRun).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    {workflow.nextRun && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Próxima: {new Date(workflow.nextRun).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GitBranch className="h-4 w-4" />
                  Fluxo de Execução
                </div>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-8 bottom-0 w-px bg-border" />
                  
                  <div className="space-y-4">
                    {workflow.steps.map((step, index) => (
                      <div key={step.id} className="relative flex items-start gap-4">
                        <div className="relative z-10 bg-background">
                          {getStatusIcon(step.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{step.name}</h5>
                            {step.duration && (
                              <span className="text-xs text-muted-foreground">
                                ({step.duration}min)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {step.description}
                          </p>
                        </div>

                        <Badge variant="outline" className="text-xs">
                          {step.type}
                        </Badge>

                        {index < workflow.steps.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground absolute right-0 top-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Rate Progress */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taxa de Sucesso</span>
                    <span className="text-sm text-muted-foreground">
                      {workflow.successRate}%
                    </span>
                  </div>
                  <Progress value={workflow.successRate} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}