import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientAccess {
  id: string;
  project_id: string;
  client_contact_id: string;
  access_level: 'viewer' | 'collaborator' | 'admin';
  permissions: {
    view_timeline: boolean;
    view_tasks: boolean;
    view_reports: boolean;
    comment: boolean;
    approve_milestones: boolean;
  };
  project?: {
    id: string;
    title: string;
    description?: string;
    status: string;
    progress_percentage: number;
    start_date?: string;
    expected_end_date?: string;
    client?: {
      id: string;
      name: string;
      email?: string;
    };
  };
}

export const useClientAuth = (token?: string) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Validate client access token
  const { data: clientAccess, isLoading, error } = useQuery({
    queryKey: ['client_access', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('Token de acesso requerido');
      }

      const { data, error } = await supabase
        .from('project_client_access')
        .select(`
          *,
          project:projects(
            *,
            client:crm_contacts(id, name, email)
          )
        `)
        .eq('access_token', token)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Token de acesso inválido');

      // Check if token is expired
      if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
        throw new Error('Token de acesso expirado');
      }

      // Update last accessed timestamp
      await supabase
        .from('project_client_access')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', data.id);

      return {
        ...data,
        permissions: data.permissions as any
      } as ClientAccess;
    },
    enabled: !!token,
    retry: 1,
  });

  useEffect(() => {
    setIsAuthenticated(!isLoading && !!clientAccess && !error);
  }, [isLoading, clientAccess, error]);

  const logout = () => {
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return {
    clientAccess,
    isAuthenticated,
    isLoading,
    error: error as Error | null,
    logout,
  };
};