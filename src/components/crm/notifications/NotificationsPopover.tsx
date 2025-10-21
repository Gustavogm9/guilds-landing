import React from 'react';
import { Bell, Check, Archive, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  notification_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onArchive: (id: string) => void;
  onNavigateToFull: () => void;
}

const getNotificationIcon = (type: string, priority: string) => {
  const iconProps = { className: 'h-4 w-4' };
  
  if (priority === 'urgent') return <Bell {...iconProps} className="h-4 w-4 text-destructive" />;
  if (priority === 'high') return <Bell {...iconProps} className="h-4 w-4 text-orange-500" />;
  
  switch (type) {
    case 'deal_stage_change':
      return <Bell {...iconProps} className="h-4 w-4 text-primary" />;
    case 'new_deal':
      return <Bell {...iconProps} className="h-4 w-4 text-green-500" />;
    case 'follow_up_reminder':
      return <Bell {...iconProps} className="h-4 w-4 text-blue-500" />;
    default:
      return <Bell {...iconProps} />;
  }
};

const getPriorityBadge = (priority: string) => {
  if (priority === 'urgent') {
    return <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">URGENTE</Badge>;
  }
  if (priority === 'high') {
    return <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-orange-500/10 text-orange-600">ALTA</Badge>;
  }
  return null;
};

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchive,
  onNavigateToFull,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  
  const recentNotifications = notifications.slice(0, 5);
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    
    if (notification.action_url) {
      navigate(notification.action_url);
    }
    
    setOpen(false);
  };
  
  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onMarkAsRead(id);
  };
  
  const handleArchive = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onArchive(id);
  };
  
  const handleViewAll = () => {
    onNavigateToFull();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-8 w-8 p-0"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className={cn(
                "absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold",
                "animate-in zoom-in-50"
              )}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={onMarkAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        {/* Content */}
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[400px]">
              <div className="divide-y">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.is_read && "bg-primary/5"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.notification_type, notification.priority)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm leading-tight line-clamp-1",
                            !notification.is_read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          {notification.action_url && (
                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                          {getPriorityBadge(notification.priority)}
                        </div>
                      </div>
                      
                      {/* Unread indicator */}
                      {!notification.is_read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => handleMarkAsRead(e, notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => handleArchive(e, notification.id)}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Footer */}
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs h-8"
                onClick={handleViewAll}
              >
                Ver todas as notificações
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};
