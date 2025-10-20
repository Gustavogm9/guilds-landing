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
  entity_type: 'deal' | 'contact' | 'activity';
  entity_id: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  read_at?: string;
  archived_at?: string;
  metadata?: Record<string, any>;
}

interface CRMNotificationsProps {
  notifications: CRMNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onAction: (notification: CRMNotification) => void;
}

const getNotificationIcon = (type: string) => {
  const icons: Record<string, any> = {
    follow_up: Clock,
    hot_lead: TrendingUp,
    stale_deal: AlertTriangle,
    new_deal: Users,
    deal_moved: Target,
    deal_won: Star,
    deal_lost: X,
    reminder: Calendar
  };
  return icons[type] || Bell;
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
    if (notification.is_archived) return false;
    
    switch (filter) {
      case 'unread':
        return !notification.is_read;
      case 'high_priority':
        return notification.priority === 'high' || notification.priority === 'urgent';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read && !n.is_archived).length;
  const highPriorityCount = notifications.filter(n => 
    (n.priority === 'high' || n.priority === 'urgent') && !n.is_archived
  ).length;

  const handleNotificationClick = (notification: CRMNotification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
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
                const Icon = getNotificationIcon(notification.notification_type);
                const priorityColor = NOTIFICATION_COLORS[notification.priority];
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer group ${
                      !notification.is_read ? 'bg-primary/5' : ''
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
                          <h4 className={`text-sm font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
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
                            {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </span>
                          
                          {notification.action_label && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs"
                            >
                              {notification.action_label}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {!notification.is_read && (
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

// Re-export the hook from the dedicated file
export { useCRMNotifications } from '@/hooks/useCRMNotifications';