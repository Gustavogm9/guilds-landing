import React from 'react';
import { Widget } from '@/types/widgets';
import { cn } from '@/lib/utils';

interface WidgetContainerProps {
  widgets: Widget[];
  isEditing?: boolean;
  onWidgetConfigChange: (widgetId: string, config: any) => void;
  onWidgetRefresh: (widgetId: string) => void;
  className?: string;
}

export function WidgetContainer({
  widgets,
  isEditing = false,
  onWidgetConfigChange,
  onWidgetRefresh,
  className
}: WidgetContainerProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-fr",
      "min-h-[400px]",
      className
    )}>
      {widgets.map((widget) => {
        const WidgetComponent = widget.component;
        
        return (
          <WidgetComponent
            key={widget.config.id}
            config={widget.config}
            data={widget.data}
            onConfigChange={(config) => onWidgetConfigChange(widget.config.id, config)}
            onRefresh={() => onWidgetRefresh(widget.config.id)}
            isEditing={isEditing}
          />
        );
      })}
      
      {/* Empty state */}
      {widgets.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Nenhum widget configurado</h3>
          <p className="text-muted-foreground mb-4">
            Adicione widgets para começar a visualizar seus dados
          </p>
          {isEditing && (
            <p className="text-sm text-muted-foreground">
              Use o botão "Adicionar Widget" no topo da página
            </p>
          )}
        </div>
      )}
    </div>
  );
}