import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { 
  Activity, 
  Database, 
  TrendingUp, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Zap,
  Server,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SystemPerformanceAdmin = () => {
  const {
    performanceLogs,
    dashboardSummary,
    projectStats,
    isLoading,
    refreshProjectStats,
    cleanupOldData,
    getPerformanceMetrics,
    getSystemHealthScore,
  } = usePerformanceMonitoring();

  const performanceMetrics = getPerformanceMetrics();
  const healthScore = getSystemHealthScore();

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance do Sistema</h2>
          <p className="text-muted-foreground">
            Monitoramento e métricas de performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refreshProjectStats.mutate()}
            disabled={refreshProjectStats.isPending}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {refreshProjectStats.isPending ? 'Atualizando...' : 'Atualizar Stats'}
          </Button>
          <Button 
            onClick={() => cleanupOldData.mutate()}
            disabled={cleanupOldData.isPending}
            variant="outline"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {cleanupOldData.isPending ? 'Limpando...' : 'Limpar Dados'}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saúde do Sistema</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}%
            </div>
            <Progress value={healthScore} className="mt-2" />
            <Badge variant={getHealthVariant(healthScore)} className="mt-2">
              {healthScore >= 90 ? 'Excelente' : healthScore >= 70 ? 'Bom' : 'Atenção'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações (24h)</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics?.totalOperations || 0}</div>
            <p className="text-xs text-muted-foreground">
              {performanceMetrics?.successfulOperations || 0} sucessos • {performanceMetrics?.failedOperations || 0} falhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.errorRate ? `${performanceMetrics.errorRate.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(performanceMetrics?.avgEmailDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Processamento de emails
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="operations">Operações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Projetos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total:</span>
                  <span className="font-medium">{dashboardSummary?.total_projects || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ativos:</span>
                  <span className="font-medium">{dashboardSummary?.active_projects || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Novos (30d):</span>
                  <span className="font-medium">{dashboardSummary?.new_projects_month || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">CRM</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Contatos:</span>
                  <span className="font-medium">{dashboardSummary?.total_contacts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Deals:</span>
                  <span className="font-medium">{dashboardSummary?.total_deals || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Novos (30d):</span>
                  <span className="font-medium">{dashboardSummary?.new_contacts_month || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Emails Pendentes:</span>
                  <span className="font-medium">{dashboardSummary?.pending_emails || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Webhooks Pendentes:</span>
                  <span className="font-medium">{dashboardSummary?.pending_webhooks || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Emails Falharam:</span>
                  <span className="font-medium text-red-600">{dashboardSummary?.failed_emails || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Projetos</CardTitle>
              <CardDescription>
                Última atualização: {projectStats?.last_updated ? 
                  formatDistanceToNow(new Date(projectStats.last_updated), { addSuffix: true, locale: ptBR }) 
                  : 'Nunca'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status dos Projetos</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Rascunho:</span>
                      <span>{projectStats?.draft_projects || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Em Desenvolvimento:</span>
                      <span>{projectStats?.active_projects || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Concluídos:</span>
                      <span>{projectStats?.completed_projects || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Em Pausa:</span>
                      <span>{projectStats?.on_hold_projects || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Métricas Gerais</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span>{projectStats?.total_projects || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Clientes Únicos:</span>
                      <span>{projectStats?.unique_clients || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Progresso Médio:</span>
                      <span>{projectStats?.avg_progress ? `${projectStats.avg_progress.toFixed(1)}%` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Orçamentos</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span>{formatCurrency(projectStats?.total_budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Médio:</span>
                      <span>{formatCurrency(projectStats?.avg_budget)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Atividade Recente</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Últimos 7 dias:</span>
                      <span>{projectStats?.projects_last_7_days || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Últimos 30 dias:</span>
                      <span>{projectStats?.projects_last_30_days || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance de Emails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Batches (24h):</span>
                  <span className="font-medium">{performanceMetrics?.emailBatches || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tempo Médio:</span>
                  <span className="font-medium">{formatDuration(performanceMetrics?.avgEmailDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pendentes:</span>
                  <span className="font-medium">{dashboardSummary?.pending_emails || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance de Webhooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Batches (24h):</span>
                  <span className="font-medium">{performanceMetrics?.webhookBatches || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tempo Médio:</span>
                  <span className="font-medium">{formatDuration(performanceMetrics?.avgWebhookDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pendentes:</span>
                  <span className="font-medium">{dashboardSummary?.pending_webhooks || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Logs de Performance</CardTitle>
              <CardDescription>
                Últimas 100 operações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {performanceLogs?.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {log.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {log.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {log.status === 'running' && <Clock className="h-4 w-4 text-yellow-600" />}
                      
                      <div>
                        <p className="font-medium">{log.operation_type}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {log.records_processed} processados
                      </p>
                      {log.duration_ms && (
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(log.duration_ms)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!performanceLogs || performanceLogs.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum log encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};