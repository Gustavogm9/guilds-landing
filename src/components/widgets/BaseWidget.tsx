import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RefreshCw,
  Settings,
  Maximize2,
  Minimize2,
  X,
  AlertTriangle,
  Clock,
  Trash2,
  GripVertical
} from 'lucide-react';
import { WidgetComponentProps, WidgetSize } from '@/types/widgets';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

const log = logger.scope('BaseWidget');

interface BaseWidgetProps extends WidgetComponentProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  status?: 'healthy' | 'warning' | 'error';
}

const sizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-2 row-span-1',
  large: 'col-span-2 row-span-2',
  full: 'col-span-full row-span-2'
};

const statusColors = {
  healthy: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  error: 'hsl(var(--danger))'
};

export function BaseWidget({
  config,
  data,
  onConfigChange,
  onRefresh,
  isEditing = false,
  children,
  className,
  actions,
  showHeader = true,
  showFooter = false,
  status = 'healthy'
}: BaseWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    onConfigChange({
      size: isExpanded ? config.size : 'full'
    });
  };

  const handleRefresh = () => {
    onRefresh();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    log.debug('Removing widget', { metadata: { widgetId: config.id } });
    // Assuming onRemove is passed as a prop or handled by a context
    // For now, it's just logging as per the original comment's intent
    // If onRemove is meant to be called, it needs to be passed as a prop.
    // onRemove(config.id);
  };

  const formatLastUpdate = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const getStatusIcon = () => {
    if (data.error) return <AlertTriangle className="h-4 w-4 text-danger" />;
    if (data.isLoading) return <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />;
    return null;
  };

  return (
    <Card
      className={cn(
        'relative transition-all duration-200 group',
        sizeClasses[isExpanded ? 'full' : config.size],
        isEditing && 'ring-2 ring-primary/50',
        data.error && 'border-destructive/50',
        className
      )}
    >
      {/* Status indicator */}
      <div
        className="absolute top-0 left-0 w-full h-1 rounded-t-lg"
        style={{ backgroundColor: statusColors[status] }}
      />

      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CardTitle className="text-sm font-medium truncate">
                {config.title}
              </CardTitle>
              {getStatusIcon()}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {actions}

              <Button
                size="sm"
                variant="ghost"
                onClick={handleRefresh}
                disabled={data.isLoading}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={cn(
                  "h-3 w-3",
                  data.isLoading && "animate-spin"
                )} />
              </Button>

              {config.isResizable && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleExpand}
                  className="h-6 w-6 p-0"
                >
                  {isExpanded ? (
                    <Minimize2 className="h-3 w-3" />
                  ) : (
                    <Maximize2 className="h-3 w-3" />
                  )}
                </Button>
              )}

              {isEditing && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowSettings(!showSettings)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemove}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Category badge */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {config.category}
            </Badge>

            {showFooter && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatLastUpdate(data.timestamp)}
              </div>
            )}
          </div>
        </CardHeader>
      )}

      <CardContent className={cn(
        "flex-1",
        !showHeader && "pt-6"
      )}>
        {data.isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : data.error ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive font-medium">Erro ao carregar dados</p>
            <p className="text-xs text-muted-foreground mt-1">{data.error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              className="mt-3"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          children
        )}
      </CardContent>

      {/* Settings overlay */}
      {showSettings && isEditing && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Configurações do Widget</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowSettings(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Título</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => onConfigChange({ title: e.target.value })}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Intervalo de Atualização</label>
              <select
                value={config.refreshInterval}
                onChange={(e) => onConfigChange({ refreshInterval: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
              >
                <option value="realtime">Tempo Real</option>
                <option value="1m">1 minuto</option>
                <option value="5m">5 minutos</option>
                <option value="15m">15 minutos</option>
                <option value="30m">30 minutos</option>
                <option value="1h">1 hora</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}