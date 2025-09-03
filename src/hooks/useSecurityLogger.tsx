import { supabase } from '@/integrations/supabase/client';

export interface SecurityEvent {
  event_type: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
}

export const useSecurityLogger = () => {
  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      const { error } = await supabase.rpc('log_security_event', {
        event_type: event.event_type,
        user_id: event.user_id || null,
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || navigator.userAgent,
        details: event.details || {}
      });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (error) {
      console.error('Security logging error:', error);
    }
  };

  const logFormSubmission = async (formType: string, additionalData?: Record<string, any>) => {
    await logSecurityEvent({
      event_type: 'form_submission',
      details: {
        form_type: formType,
        timestamp: new Date().toISOString(),
        ...additionalData
      }
    });
  };

  const logSuspiciousActivity = async (activity: string, details?: Record<string, any>) => {
    await logSecurityEvent({
      event_type: 'suspicious_activity',
      details: {
        activity,
        ...details
      }
    });
  };

  return {
    logSecurityEvent,
    logFormSubmission,
    logSuspiciousActivity
  };
};