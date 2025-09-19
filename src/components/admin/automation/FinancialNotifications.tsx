import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  Filter
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'email' | 'sms' | 'webhook';
  category: 'payment' | 'overdue' | 'report' | 'alert';
  isActive: boolean;
  recipients: string[];
  schedule?: string;
  lastSent?: string;
  sendCount: number;
}

export function FinancialNotifications() {
  const { 
    emailNotifications,
    processEmailNotifications,
    getNotificationStats,
    isLoading
  } = useNotifications();

  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Lembrete de Vencimento',
      subject: 'Sua fatura vence em 3 dias',
      type: 'email',
      category: 'payment',
      isActive: true,
      recipients: ['cliente@empresa.com'],
      lastSent: '2024-01-20T10:30:00Z',
      sendCount: 156
    },
    {
      id: '2',
      name: 'Alerta de Atraso',
      subject: 'Fatura vencida - Ação necessária',
      type: 'email',
      category: 'overdue',
      isActive: true,
      recipients: ['financeiro@guilds.com.br'],
      lastSent: '2024-01-20T14:15:00Z',
      sendCount: 23
    },
    {
      id: '3',
      name: 'Relatório Semanal',
      subject: 'Relatório Financeiro - Semana de {date}',
      type: 'email',
      category: 'report',
      isActive: true,
      recipients: ['gestao@guilds.com.br', 'financeiro@guilds.com.br'],
      schedule: 'weekly',
      lastSent: '2024-01-15T08:00:00Z',
      sendCount: 48
    },
    {
      id: '4',
      name: 'Fluxo de Caixa Crítico',
      subject: 'URGENTE: Fluxo de caixa abaixo do limite',
      type: 'email',
      category: 'alert',
      isActive: true,
      recipients: ['ceo@guilds.com.br', 'financeiro@guilds.com.br'],
      lastSent: '2024-01-18T16:45:00Z',
      sendCount: 8
    }
  ]);

  const stats = getNotificationStats();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return <Clock className="h-4 w-4 text-primary" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'report': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'alert': return <Bell className="h-4 w-4 text-warning" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'webhook': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      sent: 'default',
      failed: 'destructive'
    } as const;
    
    const labels = {
      pending: 'Pendente',
      sent: 'Enviado',
      failed: 'Falhou'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notificações Financeiras</h3>
          <p className="text-sm text-muted-foreground">
            Configure e monitore notificações automáticas do sistema financeiro
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button 
            size="sm"
            onClick={() => processEmailNotifications.mutate()}
            disabled={processEmailNotifications.isPending}
          >
            <Play className="h-4 w-4 mr-2" />
            Processar Fila
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-secondary">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enviados</p>
                  <p className="text-2xl font-bold text-success">{stats.sent}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Falharam</p>
                  <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="queue">Fila de Envio</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex flex-col items-center gap-1">
                        {getCategoryIcon(template.category)}
                        {getTypeIcon(template.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="secondary">{template.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {template.subject}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{template.recipients.length} destinatário(s)</span>
                          <span>{template.sendCount} envios</span>
                          {template.lastSent && (
                            <span>
                              Último: {new Date(template.lastSent).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          {template.schedule && (
                            <span>Agendado: {template.schedule}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={template.isActive}
                        onCheckedChange={() => {
                          // Handle toggle
                        }}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              {emailNotifications ? (
                <div className="space-y-4">
                  {emailNotifications
                    .filter(n => n.status === 'pending')
                    .slice(0, 10)
                    .map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{notification.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          Para: {notification.recipient_email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Criado: {new Date(notification.created_at).toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.status)}
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {emailNotifications.filter(n => n.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma notificação na fila</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando fila de notificações...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Notificações</CardTitle>
            </CardHeader>
            <CardContent>
              {emailNotifications ? (
                <div className="space-y-4">
                  {emailNotifications.slice(0, 20).map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{notification.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          Para: {notification.recipient_email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {notification.sent_at ? (
                            `Enviado: ${new Date(notification.sent_at).toLocaleString('pt-BR')}`
                          ) : (
                            `Criado: ${new Date(notification.created_at).toLocaleString('pt-BR')}`
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(notification.status)}
                        {notification.retry_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {notification.retry_count} tentativas
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando histórico...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}