import React, { Component, ErrorInfo, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class FinancialErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FinancialErrorBoundary caught an error:', error, errorInfo);
    
    try {
      // Log error to Supabase
      const { data, error: dbError } = await supabase.rpc('log_system_error', {
        p_error_type: error.constructor.name,
        p_error_message: error.message,
        p_error_stack: error.stack || null,
        p_component_name: this.props.componentName || 'FinancialComponent',
        p_metadata: {
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });

      if (data) {
        this.setState({ errorId: data });
      }

      if (dbError) {
        console.error('Failed to log error:', dbError);
      }
    } catch (logError) {
      console.error('Error logging to database:', logError);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorId: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-danger/20 bg-danger/5">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-danger/10 p-3">
                <AlertTriangle className="h-8 w-8 text-danger" />
              </div>
            </div>
            <CardTitle className="text-danger">Erro no Sistema Financeiro</CardTitle>
            <CardDescription>
              Ocorreu um erro inesperado no módulo financeiro. Nossa equipe foi notificada automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono">
                <strong className="text-danger">Erro (desenvolvimento):</strong>
                <br />
                {this.state.error.message}
              </div>
            )}
            
            {this.state.errorId && (
              <div className="text-sm text-muted-foreground text-center">
                ID do erro: <code className="text-xs">{this.state.errorId}</code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
              <Button onClick={this.handleReload} variant="secondary">
                Recarregar Página
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Se o problema persistir, entre em contato com o suporte técnico.
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default FinancialErrorBoundary;