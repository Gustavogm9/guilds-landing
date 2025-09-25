import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  MessageCircle,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'healthy' | 'warning' | 'critical';
}

interface RecentActivity {
  id: string;
  type: 'feedback' | 'campaign' | 'response';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success';
}

export function FeedbackLiveMetrics() {
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      id: '1',
      name: 'Feedback Hoje',
      value: 23,
      unit: 'entries',
      change: 12,
      trend: 'up',
      status: 'healthy'
    },
    {
      id: '2', 
      name: 'NPS Médio',
      value: 8.2,
      unit: '/10',
      change: -0.3,
      trend: 'down',
      status: 'warning'
    },
    {
      id: '3',
      name: 'Taxa Resposta',
      value: 78,
      unit: '%',
      change: 5,
      trend: 'up',
      status: 'healthy'
    },
    {
      id: '4',
      name: 'Tickets Abertos',
      value: 7,
      unit: 'tickets',
      change: -2,
      trend: 'down',
      status: 'healthy'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'feedback',
      message: 'Bug report recebido - Tela de login',
      timestamp: new Date().toISOString(),
      severity: 'warning'
    },
    {
      id: '2',
      type: 'campaign',
      message: 'Campaign NPS enviada para 45 usuários',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'success'
    }
  ]);

  const [isRealTime, setIsRealTime] = useState(false);

  useEffect(() => {
    if (!isRealTime) return;

    // Set up real-time subscriptions
    const feedbackChannel = supabase
      .channel('feedback-metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'feedback_entries'
        },
        (payload) => {
          console.log('New feedback received:', payload);
          
          // Update metrics
          setMetrics(prev => 
            prev.map(metric => 
              metric.id === '1' 
                ? { ...metric, value: metric.value + 1, change: metric.change + 1 }
                : metric
            )
          );

          // Add to activity feed
          const newActivity: RecentActivity = {
            id: Date.now().toString(),
            type: 'feedback',
            message: `Novo ${payload.new.type}: ${payload.new.verbatim?.slice(0, 50)}...`,
            timestamp: new Date().toISOString(),
            severity: payload.new.severity === 'high' ? 'warning' : 'info'
          };

          setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    const campaignChannel = supabase
      .channel('campaign-executions')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'feedback_campaign_executions'
        },
        (payload) => {
          console.log('Campaign execution updated:', payload);
          
          if (payload.new.status === 'sent') {
            const newActivity: RecentActivity = {
              id: Date.now().toString(),
              type: 'campaign',
              message: `Mensagem enviada via ${payload.new.channel}`,
              timestamp: new Date().toISOString(),
              severity: 'success'
            };

            setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(feedbackChannel);
      supabase.removeChannel(campaignChannel);
    };
  }, [isRealTime]);

  const getMetricIcon = (name: string) => {
    if (name.includes('Feedback')) return <MessageCircle className="h-4 w-4" />;
    if (name.includes('NPS')) return <BarChart3 className="h-4 w-4" />;
    if (name.includes('Taxa')) return <TrendingUp className="h-4 w-4" />;
    if (name.includes('Tickets')) return <AlertCircle className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up' && change > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down' && change < 0) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Activity className="h-3 w-3 text-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'feedback': return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'campaign': return <Mail className="h-4 w-4 text-green-500" />;
      case 'response': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'border-l-green-400';
      case 'warning': return 'border-l-yellow-400';
      case 'info': return 'border-l-blue-400';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Métricas em Tempo Real</h2>
          <p className="text-muted-foreground">
            Acompanhe feedback e campanhas ao vivo
          </p>
        </div>
        <Button
          variant={isRealTime ? "secondary" : "default"}
          onClick={() => setIsRealTime(!isRealTime)}
          className="gap-2"
        >
          <Activity className={`h-4 w-4 ${isRealTime ? 'animate-pulse' : ''}`} />
          {isRealTime ? 'Tempo Real ON' : 'Ativar Tempo Real'}
        </Button>
      </div>

      {/* Live Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getMetricIcon(metric.name)}
                  <span className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </span>
                </div>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {metric.value} 
                    <span className="text-sm text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(metric.trend, metric.change)}
                    <span className={`text-xs ${
                      metric.change > 0 ? 'text-green-600' : 
                      metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
              {isRealTime && (
                <Badge variant="outline" className="ml-auto">
                  <Activity className="h-3 w-3 mr-1 animate-pulse" />
                  Live
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start gap-3 p-3 border-l-2 ${getSeverityColor(activity.severity)} bg-muted/30 rounded-r`}
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade recente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">WhatsApp API</span>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-200">
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Email Provider</span>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
                  Ativo
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">SMS Gateway</span>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                  Em Desenvolvimento
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Última verificação:</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}