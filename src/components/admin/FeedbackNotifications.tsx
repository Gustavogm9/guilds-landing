import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { useFeedback } from '@/hooks/useFeedback';
import { 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  TrendingDown,
  Mail,
  Bell,
  CheckCircle 
} from 'lucide-react';

interface CriticalAlert {
  id: string;
  type: 'critical_bug' | 'low_nps' | 'high_volume' | 'response_time';
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
  acknowledged: boolean;
  project_id?: string;
  feedback_count?: number;
  metric_value?: number;
}

export const FeedbackNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([]);
  const [emailSettings, setEmailSettings] = useState({
    criticalBugs: true,
    lowNPS: true,
    highVolume: true,
    dailyReports: false
  });

  const { getFeedbackMetrics } = useFeedback();

  // Check for critical conditions
  useEffect(() => {
    const checkCriticalConditions = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const today = new Date();
        
        const metrics = await getFeedbackMetrics(
          yesterday.toISOString().split('T')[0],
          today.toISOString().split('T')[0]
        );

        const newAlerts: CriticalAlert[] = [];

        // Check for critical bugs
        const criticalBugs = metrics.highPriority || 0;
        if (criticalBugs > 0) {
          newAlerts.push({
            id: `critical-bugs-${Date.now()}`,
            type: 'critical_bug',
            title: 'Bugs Críticos Detectados',
            message: `${criticalBugs} bug(s) crítico(s) reportado(s) nas últimas 24h`,
            severity: 'high',
            timestamp: new Date(),
            acknowledged: false,
            feedback_count: criticalBugs
          });
        }

        // Check for low NPS
        if (metrics.avgNPS && metrics.avgNPS < 6) {
          newAlerts.push({
            id: `low-nps-${Date.now()}`,
            type: 'low_nps',
            title: 'NPS Baixo Detectado',
            message: `NPS médio caiu para ${metrics.avgNPS.toFixed(1)} (< 6)`,
            severity: 'medium',
            timestamp: new Date(),
            acknowledged: false,
            metric_value: metrics.avgNPS
          });
        }

        // Check for high feedback volume
        if (metrics.total > 50) {
          newAlerts.push({
            id: `high-volume-${Date.now()}`,
            type: 'high_volume',
            title: 'Alto Volume de Feedback',
            message: `${metrics.total} feedbacks recebidos nas últimas 24h`,
            severity: 'medium',
            timestamp: new Date(),
            acknowledged: false,
            feedback_count: metrics.total
          });
        }

        // Check response time (using a mock value since not available in current metrics)
        const mockResponseTime = 24; // In real implementation, this would come from metrics
        if (mockResponseTime > 48) {
          newAlerts.push({
            id: `response-time-${Date.now()}`,
            type: 'response_time',
            title: 'Tempo de Resposta Alto',
            message: `Tempo médio de resposta: ${mockResponseTime.toFixed(1)}h (> 48h)`,
            severity: 'medium',
            timestamp: new Date(),
            acknowledged: false,
            metric_value: mockResponseTime
          });
        }

        setAlerts(prev => [...prev.filter(a => a.acknowledged), ...newAlerts]);

        // Send notifications for new alerts
        newAlerts.forEach(alert => {
          if (alert.severity === 'high') {
            toast({
              title: alert.title,
              description: alert.message,
              variant: "destructive"
            });
          }
        });

      } catch (error) {
        console.error('Error checking critical conditions:', error);
      }
    };

    checkCriticalConditions();
    const interval = setInterval(checkCriticalConditions, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [getFeedbackMetrics]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const getAlertIcon = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'critical_bug': return AlertTriangle;
      case 'low_nps': return TrendingDown;
      case 'high_volume': return MessageSquare;
      case 'response_time': return Clock;
      default: return Bell;
    }
  };

  const getAlertColor = (severity: CriticalAlert['severity']): "default" | "destructive" => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'default';
    }
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Ativos
            {activeAlerts.length > 0 && (
              <Badge variant="destructive">{activeAlerts.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real de condições críticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Tudo funcionando bem!</AlertTitle>
              <AlertDescription>
                Nenhum alerta crítico no momento.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map(alert => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <Alert key={alert.id} variant={getAlertColor(alert.severity)}>
                    <Icon className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      {alert.title}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Reconhecer
                      </Button>
                    </AlertTitle>
                    <AlertDescription>
                      {alert.message}
                      <div className="text-xs text-muted-foreground mt-1">
                        {alert.timestamp.toLocaleString('pt-BR')}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Notificação
          </CardTitle>
          <CardDescription>
            Configure quando receber alertas por email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries({
            criticalBugs: 'Bugs críticos (bloqueantes)',
            lowNPS: 'NPS baixo (< 6)',
            highVolume: 'Alto volume de feedback (> 50/dia)',
            dailyReports: 'Relatório diário de métricas'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <Button
                size="sm"
                variant={emailSettings[key as keyof typeof emailSettings] ? "default" : "outline"}
                onClick={() => setEmailSettings(prev => ({
                  ...prev,
                  [key]: !prev[key as keyof typeof emailSettings]
                }))}
              >
                {emailSettings[key as keyof typeof emailSettings] ? 'Ativo' : 'Inativo'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {acknowledgedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Alertas Reconhecidos ({acknowledgedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {acknowledgedAlerts.slice(0, 5).map(alert => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                    <Icon className="h-3 w-3" />
                    <span className="flex-1">{alert.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString('pt-BR')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};