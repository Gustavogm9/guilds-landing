import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell,
  Clock,
  TrendingUp,
  AlertTriangle,
  Users,
  Target,
  X,
  CheckCircle,
  Calendar,
  MessageCircle,
  Star
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CRMNotification {
  id: string;
  type: 'follow_up' | 'hot_lead' | 'stale_deal' | 'new_lead' | 'milestone' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  isRead: boolean;
  isArchived: boolean;
}

interface CRMNotificationsProps {
  notifications: CRMNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onAction: (notification: CRMNotification) => void;
}

const NOTIFICATION_ICONS = {
  follow_up: Clock,
  hot_lead: TrendingUp,
  stale_deal: AlertTriangle,
  new_lead: Users,
  milestone: Star,
  reminder: Calendar
};

const NOTIFICATION_COLORS = {
  low: 'hsl(var(--muted-foreground))',
  medium: 'hsl(var(--primary))',
  high: 'hsl(var(--warning))',
  urgent: 'hsl(var(--destructive))'
};

const PRIORITY_LABELS = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};

export function CRMNotifications({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onAction
}: CRMNotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'high_priority'>('unread');
  
  const filteredNotifications = notifications.filter(notification => {
    if (notification.isArchived) return false;
    
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'high_priority':
        return notification.priority === 'high' || notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.isArchived).length;
  const highPriorityCount = notifications.filter(n => 
    (n.priority === 'high' || n.priority === 'urgent') && !n.isArchived
  ).length;

  const getNotificationIcon = (type: CRMNotification['type']) => {
    const Icon = NOTIFICATION_ICONS[type];
    return Icon || Bell;
  };

  const formatRelativeTime = (date: Date) => {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ptBR 
    });
  };

  const handleNotificationClick = (notification: CRMNotification) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      onAction(notification);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
            className="text-xs"
          >
            Todas
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
            className="text-xs"
          >
            Não lidas
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button
            variant={filter === 'high_priority' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter('high_priority')}
            className="text-xs"
          >
            Prioridade
            {highPriorityCount > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {highPriorityCount}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 
                 filter === 'high_priority' ? 'Nenhuma notificação de alta prioridade' :
                 'Nenhuma notificação'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map(notification => {
                const Icon = getNotificationIcon(notification.type);
                const priorityColor = NOTIFICATION_COLORS[notification.priority];
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group ${
                      !notification.isRead ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${priorityColor}20` }}
                      >
                        <Icon 
                          className="h-4 w-4" 
                          style={{ color: priorityColor }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ 
                                borderColor: priorityColor,
                                color: priorityColor
                              }}
                            >
                              {PRIORITY_LABELS[notification.priority]}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                onArchive(notification.id);
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          
                          {notification.actionLabel && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs"
                            >
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Hook for managing notifications
export function useCRMNotifications() {
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);

  // Generate mock notifications (would be replaced with real data)
  useEffect(() => {
    const mockNotifications: CRMNotification[] = [
      {
        id: '1',
        type: 'follow_up',
        priority: 'high',
        title: 'Follow-up pendente',
        message: 'João Silva está aguardando retorno há 3 dias sobre proposta de automação.',
        actionUrl: '/crm/contact/123',
        actionLabel: 'Ver contato',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRead: false,
        isArchived: false
      },
      {
        id: '2',
        type: 'hot_lead',
        priority: 'urgent',
        title: 'Lead quente identificado',
        message: 'Maria Santos tem score 95 e visitou a página de preços 5 vezes hoje.',
        actionUrl: '/crm/contact/456',
        actionLabel: 'Entrar em contato',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        isArchived: false
      },
      {
        id: '3',
        type: 'stale_deal',
        priority: 'medium',
        title: 'Oportunidade parada',
        message: 'Deal "Software para e-commerce" está no mesmo estágio há 15 dias.',
        actionUrl: '/crm/deal/789',
        actionLabel: 'Ver oportunidade',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: false,
        isArchived: false
      },
      {
        id: '4',
        type: 'new_lead',
        priority: 'medium',
        title: 'Novo lead qualificado',
        message: 'Carlos Oliveira se inscreveu no workshop e preencheu formulário de qualificação.',
        actionUrl: '/crm/contact/321',
        actionLabel: 'Ver perfil',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isRead: true,
        isArchived: false
      },
      {
        id: '5',
        type: 'milestone',
        priority: 'low',
        title: 'Meta atingida',
        message: 'Parabéns! Você atingiu 120% da meta mensal de oportunidades.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isRead: true,
        isArchived: false
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const archive = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isArchived: true }
          : notification
      )
    );
  };

  const handleAction = (notification: CRMNotification) => {
    // Navigate to the action URL
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    archive,
    handleAction
  };
}