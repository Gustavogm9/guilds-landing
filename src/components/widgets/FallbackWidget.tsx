import React from 'react';
import { BaseWidget } from './BaseWidget';
import { WidgetComponentProps } from '@/types/widgets';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FallbackWidget(props: WidgetComponentProps) {
  return (
    <BaseWidget {...props} status="error">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
        <h3 className="font-semibold mb-2">Widget não encontrado</h3>
        <p className="text-sm text-muted-foreground mb-4">
          O componente do widget "{props.config.type}" não pôde ser carregado.
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={props.onRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </BaseWidget>
  );
}