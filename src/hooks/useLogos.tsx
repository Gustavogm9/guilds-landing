import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  return {
    logos,
    loading,
    error,
    refetch: fetchLogos,
    getLogoByType,
    getLogoByName,
  };
}