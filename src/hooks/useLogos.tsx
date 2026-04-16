import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { RealtimeChannel } from '@supabase/supabase-js';

const log = logger.scope('useLogos');

interface Logo {
  id: string;
  name: string;
  type: 'symbol' | 'full' | 'text';
  variant: 'light' | 'dark' | 'color' | 'transparent';
  file_path: string;
  public_url: string;
  width?: number;
  height?: number;
  usage_context?: string;
  is_active: boolean;
}

export function useLogos() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogos();

    // Set up real-time subscription with error handling
    const channel: RealtimeChannel = supabase
      .channel('logos-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'logos'
        },
        (payload) => {
          log.debug('Logo change detected', { action: 'realtime', metadata: { payload } });
          // Refetch logos when any change occurs
          fetchLogos();
        }
      )
      .subscribe((status) => {
        // Handle subscription status to prevent console errors
        if (status === 'CHANNEL_ERROR') {
          log.warn('Logo realtime subscription failed, continuing with static data', { action: 'subscribe' });
        } else if (status === 'TIMED_OUT') {
          log.warn('Logo realtime subscription timed out, continuing with static data', { action: 'subscribe' });
        }
      });

    // Cleanup subscription on unmount
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        // Silently handle cleanup errors to prevent console noise
        log.warn('Error cleaning up logos subscription', { action: 'cleanup', metadata: { error: err } });
      }
    };
  }, []);

  const fetchLogos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type assertion to match our interface since Supabase returns strings
      setLogos((data as Logo[]) || []);
    } catch (err) {
      log.error(err instanceof Error ? err : new Error('Failed to fetch logos'), { action: 'fetch' });
      setError(err instanceof Error ? err.message : 'Failed to fetch logos');
    } finally {
      setLoading(false);
    }
  };

  const getLogoByType = useCallback((type: Logo['type'], variant?: Logo['variant']) => {
    return logos.find(logo =>
      logo.type === type && (variant ? logo.variant === variant : true)
    );
  }, [logos]);

  const getLogoByName = useCallback((name: string) => {
    return logos.find(logo => logo.name === name);
  }, [logos]);

  const getLogoByContext = useCallback((usageContext: string, type?: Logo['type'], variant?: Logo['variant']) => {
    // Clean the search context
    const cleanContext = usageContext.trim();

    log.debug(`Searching logos for context: "${cleanContext}"`, {
      action: 'getLogoByContext',
      metadata: {
        availableLogos: logos.map(l => ({
          name: l.name,
          context: l.usage_context,
          type: l.type,
          variant: l.variant
        }))
      }
    });

    // First try to find logo with specific context
    const contextLogo = logos.find(logo => {
      if (!logo.usage_context) return false;

      // Clean and split the usage contexts (handle commas and trim)
      const contexts = logo.usage_context.split(',').map(ctx => ctx.trim()).filter(ctx => ctx.length > 0);
      const hasContext = contexts.some(ctx => ctx.includes(cleanContext) || cleanContext.includes(ctx));

      const typeMatch = type ? logo.type === type : true;
      const variantMatch = variant ? logo.variant === variant : true;

      return hasContext && typeMatch && variantMatch;
    });

    if (contextLogo) {
      log.debug('Found logo with context', { action: 'getLogoByContext', metadata: { logo: contextLogo } });
      return contextLogo;
    }

    // If no exact context match but we have type/variant, try more flexible search
    if (type || variant) {
      // First try context match without strict variant
      if (variant) {
        const flexibleContextLogo = logos.find(logo => {
          if (!logo.usage_context) return false;
          const contexts = logo.usage_context.split(',').map(ctx => ctx.trim()).filter(ctx => ctx.length > 0);
          const hasContext = contexts.some(ctx => ctx.includes(cleanContext) || cleanContext.includes(ctx));
          const typeMatch = type ? logo.type === type : true;
          return hasContext && typeMatch;
        });

        if (flexibleContextLogo) {
          log.debug('Found flexible context logo', { action: 'getLogoByContext', metadata: { logo: flexibleContextLogo } });
          return flexibleContextLogo;
        }
      }

      // Fallback to type/variant search
      return getLogoByType(type!, variant);
    }

    return null;
  }, [logos, getLogoByType]);

  return {
    logos,
    loading,
    error,
    refetch: fetchLogos,
    getLogoByType,
    getLogoByName,
    getLogoByContext,
  };
}
