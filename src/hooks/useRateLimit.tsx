import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityLogger } from './useSecurityLogger';

export const useRateLimit = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const { logSuspiciousActivity } = useSecurityLogger();

  const getUserIdentifier = (): string => {
    // Use IP-based identification (in a real implementation, you'd get the actual IP)
    // For now, use a combination of user agent and timestamp as a basic identifier
    const userAgent = navigator.userAgent;
    const sessionId = sessionStorage.getItem('session_id') || 
      (() => {
        const id = Math.random().toString(36).substring(7);
        sessionStorage.setItem('session_id', id);
        return id;
      })();
    
    return `${userAgent}_${sessionId}`;
  };

  const checkRateLimit = async (maxRequests: number = 5, timeWindow: string = '1 hour'): Promise<boolean> => {
    try {
      const identifier = getUserIdentifier();
      
      const { data, error } = await supabase.rpc('check_rate_limit', {
        identifier,
        max_requests: maxRequests,
        time_window: timeWindow
      });

      if (error) {
        console.error('Rate limit check failed:', error);
        // If rate limit check fails, allow the request but log it
        await logSuspiciousActivity('rate_limit_check_failed', { error: error.message });
        return true;
      }

      const isAllowed = data as boolean;
      setIsRateLimited(!isAllowed);

      if (!isAllowed) {
        await logSuspiciousActivity('rate_limit_exceeded', {
          identifier,
          max_requests: maxRequests,
          time_window: timeWindow
        });
      }

      return isAllowed;
    } catch (error) {
      console.error('Rate limit error:', error);
      await logSuspiciousActivity('rate_limit_error', { error: String(error) });
      return true; // Allow on error to prevent blocking legitimate users
    }
  };

  return {
    checkRateLimit,
    isRateLimited
  };
};