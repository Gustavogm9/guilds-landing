import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Pause,
  Play,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Webhook,
  Mail,
  Database,
  Globe
} from 'lucide-react';

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'workflow' | 'webhook' | 'email' | 'api' | 'error';
  workflow?: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  duration?: number;
  message: string;
  details?: Record<string, any>;
}

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
  threshold: { warning: number; critical: number };
}

interface ActiveWorkflow {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped';
  currentStep: string;
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  error?: string;
}

export function RealTimeMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'workflow',
      workflow: 'Cobrança Automática',
      status: 'running',
      message: 'Executando processo de cobrança para 15 faturas vencidas',
      details: { invoices: 15, stage: 'Enviando emails' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'webhook',
      status: 'completed',
      duration: 1200,
      message: 'Webhook de pagamento processado com sucesso',
      details: { amount: 2500.00, payment_id: 'pay_123' }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      type: 'email',
      status: 'completed',
      duration: 3500,
      message: 'Relatório financeiro semanal enviado',
      details: { recipients: 5, report_type: 'weekly' }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      type: 'api',
      status: 'failed',
      message: 'Falha na sincronização com sistema bancário',
      details: { error: 'Connection timeout', retry_count: 3 }
    }
  ]);

  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: 'api_calls',
      name: 'Chamadas API/min',
      value: 45,
      unit: '/min',
      trend: 'up',
      status: 'healthy',
      threshold: { warning: 80, critical: 100 }
    },
    {
      id: 'webhook_success',
      name: 'Taxa Sucesso Webhooks',
      value: 98.5,
      unit: '%',
      trend: 'stable',
      status: 'healthy',
      threshold: { warning: 95, critical: 90 }
    },
    {
      id: 'email_queue',
      name: 'Emails na Fila',
      value: 23,
      unit: 'emails',
      trend: 'down',
      status: 'healthy',
      threshold: { warning: 100, critical: 200 }
    },
    {
      id: 'processing_time',
      name: 'Tempo Médio Processamento',
      value: 2.3,
      unit: 'seg',
      trend: 'stable',
      status: 'healthy',
      threshold: { warning: 5, critical: 10 }
    },
    {
      id: 'active_workflows',
      name: 'Workflows Ativos',
      value: 8,
      unit: 'workflows',
      trend: 'up',
      status: 'healthy',
      threshold: { warning: 20, critical: 30 }
    },
    {
      id: 'error_rate',
      name: 'Taxa de Erro',
      value: 1.2,
      unit: '%',
      trend: 'down',
      status: 'healthy',
      threshold: { warning: 5, critical: 10 }
    }
  ]);

  const [activeWorkflows, setActiveWorkflows] = useState<ActiveWorkflow[]>([
    {
      id: '1',
      name: 'Cobrança Automática - Lote 001',
      status: 'running',
      currentStep: 'Enviando segunda cobrança',
      progress: 65,
      startTime: new Date(Date.now() - 1800000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 900000).toISOString()
    },
    {
      id: '2',
      name: 'Relatório Mensal - Janeiro 2024',
      status: 'running',
      currentStep: 'Coletando dados financeiros',
      progress: 25,
      startTime: new Date(Date.now() - 600000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 1800000).toISOString()
    },
    {
      id: '3',
      name: 'Sincronização Bancária',
      status: 'paused',
      currentStep: 'Aguardando retry',
      progress: 0,
      startTime: new Date(Date.now() - 3600000).toISOString(),
      error: 'API temporariamente indisponível'
    }
  ]);

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simular nova atividade
      if (Math.random() > 0.7) {
        const newActivity: ActivityLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type: ['workflow', 'webhook', 'email', 'api'][Math.floor(Math.random() * 4)] as any,
          status: ['completed', 'running', 'failed'][Math.floor(Math.random() * 3)] as any,
          message: 'Nova atividade simulada',
          duration: Math.floor(Math.random() * 5000)
        };

        setActivityLogs(prev => [newActivity, ...prev.slice(0, 49)]);
      }

      // Atualizar métricas
      setSystemMetrics(prev => prev.map(metric => ({
        ...metric,
        value: metric.value + (Math.random() - 0.5) * 5,
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      })));

      // Atualizar progresso dos workflows
      setActiveWorkflows(prev => prev.map(workflow => ({
        ...workflow,
        progress: Math.min(100, workflow.progress + Math.random() * 10)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'running':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workflow':
        return <Zap className="h-4 w-4 text-primary" />;
      case 'webhook':
        return <Webhook className="h-4 w-4 text-accent" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'api':
        return <Database className="h-4 w-4 text-purple-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricStatus = (metric: SystemMetric) => {
    if (metric.value >= metric.threshold.critical) return 'critical';
    if (metric.value >= metric.threshold.warning) return 'warning';
    return 'healthy';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Monitoramento em Tempo Real
          </h2>
          <p className="text-muted-foreground">
            Acompanhe a execução de automações e performance do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Pausar' : 'Reativar'}
          </Button>
          
          <Button
            variant={isMonitoring ? "default" : "outline"}
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isMonitoring ? 'Pausar' : 'Iniciar'}
          </Button>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground truncate">
                  {metric.name}
                </div>
                {getTrendIcon(metric.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value.toFixed(metric.unit === '%' ? 1 : 0)}{metric.unit}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Status</span>
                  <Badge 
                    variant={
                      getMetricStatus(metric) === 'healthy' ? 'default' :
                      getMetricStatus(metric) === 'warning' ? 'destructive' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {getMetricStatus(metric) === 'healthy' ? 'OK' : 
                     getMetricStatus(metric) === 'warning' ? 'Atenção' : 'Crítico'}
                  </Badge>
                </div>
                <Progress 
                  value={Math.min(100, (metric.value / metric.threshold.critical) * 100)} 
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Log de Atividade</TabsTrigger>
          <TabsTrigger value="workflows">Workflows Ativos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atividade em Tempo Real</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getTypeIcon(log.type)}
                        {getStatusIcon(log.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{log.message}</span>
                          {log.workflow && (
                            <Badge variant="outline" className="text-xs">
                              {log.workflow}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(log.timestamp).toLocaleTimeString('pt-BR')}</span>
                          {log.duration && (
                            <span>{(log.duration / 1000).toFixed(1)}s</span>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {log.type}
                          </Badge>
                        </div>
                        
                        {log.details && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <pre className="text-muted-foreground">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Workflows em Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeWorkflows.map((workflow) => (
                  <div key={workflow.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {workflow.currentStep}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            workflow.status === 'running' ? 'default' :
                            workflow.status === 'paused' ? 'secondary' : 'outline'
                          }
                        >
                          {workflow.status === 'running' ? 'Executando' :
                           workflow.status === 'paused' ? 'Pausado' : 'Parado'}
                        </Badge>
                        
                        <Button variant="ghost" size="sm">
                          {workflow.status === 'running' ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span>{workflow.progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span>
                        Iniciado: {new Date(workflow.startTime).toLocaleTimeString('pt-BR')}
                      </span>
                      {workflow.estimatedCompletion && (
                        <span>
                          Conclusão: {new Date(workflow.estimatedCompletion).toLocaleTimeString('pt-BR')}
                        </span>
                      )}
                    </div>
                    
                    {workflow.error && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                        {workflow.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{metric.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Limite: {metric.threshold.warning}{metric.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {metric.value.toFixed(1)}{metric.unit}
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(metric.trend)}
                          <span className="text-xs text-muted-foreground">
                            {metric.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status dos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Processamento de Webhooks', status: 'healthy' },
                    { name: 'Envio de Emails', status: 'healthy' },
                    { name: 'Integração Bancária', status: 'warning' },
                    { name: 'Sistema de Relatórios', status: 'healthy' },
                    { name: 'Notificações Push', status: 'healthy' }
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{service.name}</span>
                      <div className="flex items-center gap-2">
                        {service.status === 'healthy' ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                        <Badge 
                          variant={service.status === 'healthy' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {service.status === 'healthy' ? 'Online' : 'Problema'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Alertas do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    level: 'warning',
                    message: 'API bancária com latência alta (> 5s)',
                    time: '2 min atrás'
                  },
                  {
                    level: 'info',
                    message: 'Workflow de cobrança processou 150 faturas',
                    time: '15 min atrás'
                  },
                  {
                    level: 'error',
                    message: 'Falha na sincronização de 3 transações',
                    time: '1 hora atrás'
                  }
                ].map((alert, index) => (
                  <div key={index} className={`p-3 border-l-4 ${
                    alert.level === 'error' ? 'border-l-destructive bg-destructive/5' :
                    alert.level === 'warning' ? 'border-l-warning bg-warning/5' :
                    'border-l-primary bg-primary/5'
                  } rounded`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground">{alert.time}</div>
                      </div>
                      {alert.level === 'error' && (
                        <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}