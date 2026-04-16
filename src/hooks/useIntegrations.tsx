import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface APIEndpoint {
    id: string;
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers: Record<string, string>;
    body?: string;
    authentication: {
        type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth';
        config: Record<string, string>;
    };
    isActive: boolean;
    lastCalled?: string;
    responseTime?: number;
    successRate: number;
    callCount: number;
}

export interface Integration {
    id: string;
    name: string;
    description: string;
    provider: string;
    type: 'webhook' | 'api' | 'sync' | 'streaming';
    status: 'active' | 'inactive' | 'error' | 'testing';
    config: Record<string, any>;
    endpoints: APIEndpoint[];
    rateLimits: {
        requestsPerMinute: number;
        requestsPerHour: number;
        requestsPerDay: number;
    };
    monitoring: {
        healthCheckUrl?: string;
        healthCheckInterval: number;
        alertOnFailure: boolean;
    };
    security: {
        requireSSL: boolean;
        validateSignature: boolean;
        whitelistIPs: string[];
    };
    createdAt: string;
    lastSync?: string;
    syncCount: number;
}

export function useIntegrations() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch all integrations
    const { data: integrations = [], isLoading, error } = useQuery({
        queryKey: ['api-integrations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('api_integrations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching integrations:', error);
                throw error;
            }

            // Map DB fields (snake_case) to Frontend model (camelCase) if needed,
            // but since we structured JSONB using camelCase keys inside, we just need to map main columns.
            // The main columns: rate_limits -> rateLimits, created_at -> createdAt, last_sync -> lastSync, sync_count -> syncCount
            return data.map(item => ({
                ...item,
                rateLimits: item.rate_limits,
                createdAt: item.created_at,
                lastSync: item.last_sync,
                syncCount: item.sync_count
            })) as Integration[];
        }
    });

    // Create or Update integration
    const upsertIntegration = useMutation({
        mutationFn: async (integration: Partial<Integration>) => {
            // transform back to DB format
            const dbPayload = {
                name: integration.name,
                description: integration.description,
                provider: integration.provider,
                type: integration.type,
                status: integration.status,
                config: integration.config,
                endpoints: integration.endpoints,
                rate_limits: integration.rateLimits,
                monitoring: integration.monitoring,
                security: integration.security,
                sync_count: integration.syncCount,
                last_sync: integration.lastSync,
                updated_at: new Date().toISOString()
            };

            if (integration.id) {
                // Update
                const { data, error } = await supabase
                    .from('api_integrations')
                    .update(dbPayload)
                    .eq('id', integration.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // Insert
                const { data, error } = await supabase
                    .from('api_integrations')
                    .insert(dbPayload)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-integrations'] });
            toast({ title: 'Integração salva com sucesso' });
        },
        onError: (err) => {
            toast({
                title: 'Erro ao salvar integração',
                description: err.message,
                variant: 'destructive'
            });
        }
    });

    // Delete integration
    const deleteIntegration = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('api_integrations')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['api-integrations'] });
            toast({ title: 'Integração removida' });
        }
    });

    // Helper to "test" an endpoint (mock logic for now, or could call a real Edge Function)
    const testEndpoint = async (url: string, method: string) => {
        // This would ideally call an invalidation or an edge function proxy.
        // For now we simulate network latency to keep the UI responsive expectation.
        await new Promise(r => setTimeout(r, 1500));
        return {
            status: 200,
            responseTime: Math.floor(Math.random() * 500) + 100,
            success: true,
            message: 'Proxy de teste ainda não implementado (Simulado)'
        };
    };

    return {
        integrations,
        isLoading,
        error,
        upsertIntegration,
        deleteIntegration,
        testEndpoint
    };
}
