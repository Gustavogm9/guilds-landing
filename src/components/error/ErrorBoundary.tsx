import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log detailed error information
    console.group('🚨 React Error Boundary - Detailed Error');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Current URL:', window.location.href);
    console.error('User agent:', navigator.userAgent);
    console.groupEnd();
    
    // In a real app, you would send this to your error reporting service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Send error to monitoring service
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🚨 React Error Boundary');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error Data:', errorData);
        console.groupEnd();
      }

    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private redirectTo500 = () => {
    window.location.href = '/erro-500';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-guild-hero">
          <div className="container max-w-2xl mx-auto text-center px-6">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-danger/10 rounded-3xl mb-6">
                <svg 
                  className="w-10 h-10 text-danger" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-sora font-bold text-foreground mb-4">
                Algo deu errado
              </h1>
            </div>

            <div className="space-y-6 mb-8">
              <p className="text-lg text-muted-foreground">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="text-left bg-muted/50 rounded-lg p-4 text-sm font-mono">
                  <strong className="text-danger">Erro (apenas em desenvolvimento):</strong>
                  <br />
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-hero px-6 py-3 rounded-xl font-semibold"
              >
                Tentar Novamente
              </button>
              
              <button
                onClick={this.redirectTo500}
                className="btn-glass px-6 py-3 rounded-xl font-medium"
              >
                Ver Página de Erro
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;