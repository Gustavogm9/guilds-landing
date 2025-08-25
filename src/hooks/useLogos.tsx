import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
    
    // Set up real-time subscription
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
          console.log('Logo change detected:', payload);
          // Refetch logos when any change occurs
          fetchLogos();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
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
      console.error('Error fetching logos:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logos');
    } finally {
      setLoading(false);
    }
  };

  const getLogoByType = (type: Logo['type'], variant?: Logo['variant']) => {
    return logos.find(logo => 
      logo.type === type && (variant ? logo.variant === variant : true)
    );
  };

  const getLogoByName = (name: string) => {
    return logos.find(logo => logo.name === name);
  };

  const getLogoByContext = (usageContext: string, type?: Logo['type'], variant?: Logo['variant']) => {
    // First try to find logo with specific context
    const contextLogo = logos.find(logo => 
      logo.usage_context?.includes(usageContext) && 
      (type ? logo.type === type : true) && 
      (variant ? logo.variant === variant : true)
    );
    
    if (contextLogo) return contextLogo;
    
    // Fallback to type/variant search if no context match
    if (type || variant) {
      return getLogoByType(type!, variant);
    }
    
    return null;
  };

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