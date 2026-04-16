import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface SystemError {
  id?: string;
  type: string;
  message: string;
  stack?: string;
  component?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<SystemError[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  const logError = useCallback(async (error: SystemError) => {
    setIsLogging(true);

    try {
      // Add to local state
      setErrors(prev => [...prev, { ...error, timestamp: new Date() }]);

      // Log to Supabase
      const { error: dbError } = await supabase.rpc('log_system_error', {
        p_error_type: error.type,
        p_error_message: error.message,
        p_error_stack: error.stack || null,
        p_component_name: error.component || null,
        p_metadata: error.metadata || {}
      });

      if (dbError) {
        logger.error('Failed to log error to database', { component: 'ErrorHandler', metadata: { dbError } });
      }
    } catch (err) {
      logger.error('Error logging system error', { component: 'ErrorHandler', metadata: { error: err } });
    } finally {
      setIsLogging(false);
    }
  }, []);

  const handleError = useCallback((
    error: Error | string,
    component?: string,
    metadata?: Record<string, any>,
    showToast = true
  ) => {
    const errorObj: SystemError = {
      type: error instanceof Error ? error.constructor.name : 'GeneralError',
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      component,
      metadata,
      timestamp: new Date()
    };

    // Log the error
    logError(errorObj);

    // Show user-friendly toast
    if (showToast) {
      toast.error('Ocorreu um erro inesperado. Nossa equipe foi notificada.');
    }

    // Structured logging
    logger.error(errorObj.message, {
      component: component || errorObj.component || 'ErrorHandler',
      metadata: errorObj.metadata
    });
  }, [logError]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    isLogging,
    handleError,
    logError,
    clearErrors
  };
}