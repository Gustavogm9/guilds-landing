import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { 
  Mail, 
  Webhook, 
  Send, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Settings
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NotificationsAdmin = () => {
  const {
    emailNotifications,
    webhookEvents,
    notificationPreferences,
    isLoading,
    processEmailNotifications,
    processWebhookEvents,
    retryNotification,
    getNotificationStats,
    getWebhookStats,
  } = useNotifications();

  const emailStats = getNotificationStats();
  const webhookStats = getWebhookStats();

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock },
      sent: { variant: 'default' as const, icon: CheckCircle },
      failed: { variant: 'destructive' as const, icon: AlertCircle },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
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
          <h2 className="text-2xl font-bold">Gerenciamento de Notificações</h2>
          <p className="text-muted-foreground">
            Monitore e gerencie notificações por email e webhooks
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => processEmailNotifications.mutate()}
            disabled={processEmailNotifications.isPending}
            variant="outline"
          >
            <Mail className="h-4 w-4 mr-2" />
            {processEmailNotifications.isPending ? 'Processando...' : 'Processar Emails'}
          </Button>
          <Button 
            onClick={() => processWebhookEvents.mutate()}
            disabled={processWebhookEvents.isPending}
            variant="outline"
          >
            <Webhook className="h-4 w-4 mr-2" />
            {processWebhookEvents.isPending ? 'Processando...' : 'Processar Webhooks'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Pendentes</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailStats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              {emailStats?.total || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Enviados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailStats?.sent || 0}</div>
            <p className="text-xs text-muted-foreground">
              Taxa: {emailStats?.total ? Math.round((emailStats.sent / emailStats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks Pendentes</CardTitle>
            <Webhook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhookStats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">
              {webhookStats?.total || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Configurados</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationPreferences?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Com preferências
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emails" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações por Email</CardTitle>
              <CardDescription>
                Lista de todas as notificações por email enviadas pelo sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailNotifications?.map((notification) => (
                  <div 
                    key={notification.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{notification.subject}</h4>
                        {getStatusBadge(notification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Para: {notification.recipient_email} ({notification.recipient_type})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tipo: {notification.notification_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                        {notification.sent_at && (
                          <span className="ml-2">
                            • Enviado {formatDistanceToNow(new Date(notification.sent_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {notification.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryNotification.mutate(notification.id)}
                        disabled={retryNotification.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Tentar Novamente
                      </Button>
                    )}
                  </div>
                ))}
                
                {(!emailNotifications || emailNotifications.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma notificação encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Webhook</CardTitle>
              <CardDescription>
                Lista de todos os eventos enviados para sistemas externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhookEvents?.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{event.event_type}</h4>
                        {getStatusBadge(event.status)}
                      </div>
                      {event.webhook_url && (
                        <p className="text-sm text-muted-foreground">
                          URL: {event.webhook_url}
                        </p>
                      )}
                      {event.response_code && (
                        <p className="text-sm text-muted-foreground">
                          Código de resposta: {event.response_code}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                        {event.sent_at && (
                          <span className="ml-2">
                            • Enviado {formatDistanceToNow(new Date(event.sent_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!webhookEvents || webhookEvents.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum evento de webhook encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferências dos Clientes</CardTitle>
              <CardDescription>
                Configurações de notificação por cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationPreferences?.map((preference) => (
                  <div 
                    key={preference.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <h4 className="font-medium">Cliente: {preference.client_contact_id}</h4>
                      <div className="flex gap-2 flex-wrap">
                        {preference.email_notifications && (
                          <Badge variant="secondary">Email Ativo</Badge>
                        )}
                        {preference.milestone_notifications && (
                          <Badge variant="secondary">Marcos</Badge>
                        )}
                        {preference.task_notifications && (
                          <Badge variant="secondary">Tarefas</Badge>
                        )}
                        {preference.report_notifications && (
                          <Badge variant="secondary">Relatórios</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Frequência: {preference.frequency}
                      </p>
                    </div>
                  </div>
                ))}
                
                {(!notificationPreferences || notificationPreferences.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma preferência configurada
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