import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeedback } from '@/hooks/useFeedback';
import { useProjects } from '@/hooks/useProjects';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Target, Clock, Users, MessageSquare } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MetricCard {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
  icon: React.ComponentType<any>;
}

export const FeedbackMetrics: React.FC = () => {
  const [dateRange, setDateRange] = useState('7');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { getFeedbackMetrics, getTicketMetrics } = useFeedback();
  const { projects } = useProjects();

  useEffect(() => {
    const loadMetrics = async () => {
      setLoading(true);
      try {
        const days = parseInt(dateRange);
        const startDate = startOfDay(subDays(new Date(), days));
        const endDate = endOfDay(new Date());

        const [feedbackMetrics, ticketMetrics] = await Promise.all([
          getFeedbackMetrics(startDate.toISOString(), endDate.toISOString()),
          getTicketMetrics(startDate.toISOString(), endDate.toISOString())
        ]);

        setMetrics({
          feedback: feedbackMetrics,
          tickets: ticketMetrics
        });
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [dateRange]);

  const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatTrend = (trend: number): string => {
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const metricCards: MetricCard[] = [
    {
      title: 'Total de Feedbacks',
      value: metrics?.feedback?.total || 0,
      change: calculateTrend(metrics?.feedback?.total || 0, metrics?.feedback?.previousTotal || 0),
      description: `${dateRange} dias`,
      icon: MessageSquare
    },
    {
      title: 'Bugs Reportados',
      value: metrics?.feedback?.bugs || 0,
      change: calculateTrend(metrics?.feedback?.bugs || 0, metrics?.feedback?.previousBugs || 0),
      description: 'Novos bugs',
      icon: Target
    },
    {
      title: 'Ideias Sugeridas',
      value: metrics?.feedback?.ideas || 0,
      change: calculateTrend(metrics?.feedback?.ideas || 0, metrics?.feedback?.previousIdeas || 0),
      description: 'Novas ideias',
      icon: TrendingUp
    },
    {
      title: 'NPS Médio',
      value: metrics?.feedback?.avgNPS ? metrics.feedback.avgNPS.toFixed(1) : 'N/A',
      change: metrics?.feedback?.avgNPS ? calculateTrend(metrics.feedback.avgNPS, metrics?.feedback?.previousAvgNPS || 0) : 0,
      description: 'Satisfação geral',
      icon: BarChart3
    },
    {
      title: 'Tickets Abertos',
      value: metrics?.tickets?.open || 0,
      description: 'Suporte ativo',
      icon: Clock
    },
    {
      title: 'Taxa de Resolução',
      value: metrics?.tickets?.resolutionRate ? `${metrics.tickets.resolutionRate.toFixed(1)}%` : '0%',
      description: 'Tickets resolvidos',
      icon: PieChart
    },
    {
      title: 'Tempo Médio de Resposta',
      value: metrics?.tickets?.avgResponseTime ? `${metrics.tickets.avgResponseTime}h` : 'N/A',
      description: 'Primeira resposta',
      icon: Clock
    },
    {
      title: 'Projetos Ativos',
      value: projects?.filter(p => p.status === 'in_development').length || 0,
      description: 'Com feedback ativo',
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Métricas de Feedback</h2>
          <p className="text-muted-foreground">
            Análise detalhada dos feedbacks e tickets
          </p>
        </div>
        
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const IconComponent = metric.icon;
          const hasTrend = metric.change !== undefined;
          const isPositiveTrend = hasTrend && metric.change! > 0;
          const isNegativeTrend = hasTrend && metric.change! < 0;
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                  {hasTrend && (
                    <div className="flex items-center gap-1">
                      {isPositiveTrend && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {isNegativeTrend && <TrendingDown className="h-3 w-3 text-red-500" />}
                      <Badge 
                        variant="outline"
                        className={
                          isPositiveTrend 
                            ? 'text-green-700 border-green-200' 
                            : isNegativeTrend 
                            ? 'text-red-700 border-red-200'
                            : 'text-gray-700 border-gray-200'
                        }
                      >
                        {formatTrend(metric.change!)}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feedback Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Feedback</CardTitle>
            <CardDescription>Por tipo nos últimos {dateRange} dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.feedback?.distribution && Object.entries(metrics.feedback.distribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'bug' ? 'bg-red-500' :
                      type === 'ideia' ? 'bg-blue-500' :
                      type === 'duvida' ? 'bg-yellow-500' :
                      type === 'nps' ? 'bg-green-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm font-medium capitalize">
                      {type === 'bug' ? 'Bugs' :
                       type === 'ideia' ? 'Ideias' :
                       type === 'duvida' ? 'Dúvidas' :
                       type === 'nps' ? 'NPS' :
                       type}
                    </span>
                  </div>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Prioridade</CardTitle>
            <CardDescription>Scores RICE/WSJF calculados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Itens de Alta Prioridade</span>
                <Badge className="bg-red-100 text-red-800">
                  {metrics?.feedback?.highPriority || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Itens de Média Prioridade</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {metrics?.feedback?.mediumPriority || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Itens de Baixa Prioridade</span>
                <Badge className="bg-green-100 text-green-800">
                  {metrics?.feedback?.lowPriority || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score Médio RICE</span>
                <Badge variant="outline">
                  {metrics?.feedback?.avgRiceScore ? metrics.feedback.avgRiceScore.toFixed(1) : 'N/A'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Status dos Feedbacks</CardTitle>
          <CardDescription>Progresso e resolução nos últimos {dateRange} dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {metrics?.feedback?.statusDistribution && Object.entries(metrics.feedback.statusDistribution).map(([status, count]) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold">{count as number}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {status === 'new' ? 'Novos' :
                   status === 'triaged' ? 'Triados' :
                   status === 'in_backlog' ? 'No Backlog' :
                   status === 'in_progress' ? 'Em Progresso' :
                   status === 'released' ? 'Entregues' :
                   status === 'wont_fix' ? 'Não será feito' :
                   status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};