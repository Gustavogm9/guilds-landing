import { useState, useEffect, useCallback } from 'react';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { useRaioXSession } from './useRaioXSession';

export interface Diagnostic {
  id: string;
  status: 'draft' | 'processing' | 'completed' | 'archived' | 'error';
  current_step: number;
}

export function useDiagnostic() {
  const { session } = useRaioXSession();
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDiagnostic = useCallback(async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabaseRaiox
        .from('diagnostics')
        .select('id, status, current_step')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setDiagnostic(data as Diagnostic);
    } catch (err) {
      console.error('Error fetching diagnostic:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchDiagnostic();
  }, [fetchDiagnostic]);

  const updateCurrentStep = async (step: number) => {
    if (!diagnostic?.id) return;

    try {
      const { error } = await supabaseRaiox
        .from('diagnostics')
        .update({ current_step: step })
        .eq('id', diagnostic.id);

      if (error) throw error;
      setDiagnostic(prev => prev ? { ...prev, current_step: step } : null);
    } catch (err) {
      console.error('Error updating diagnostic step:', err);
      throw err;
    }
  };

  return { diagnostic, loading, fetchDiagnostic, updateCurrentStep };
}
