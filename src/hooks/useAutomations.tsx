import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AutomationConfig {
    id: string;
    key: string;
    name: string;
    description?: string;
    category: 'core' | 'lab' | 'craft' | 'cross';
    is_enabled: boolean;
    config: Record<string, any>;
    webhook_url?: string;
    webhook_secret?: string;
    last_triggered_at?: string;
    trigger_count: number;
    created_at: string;
    updated_at: string;
}

export interface AutomationLog {
    id: string;
    automation_id?: string;
    automation_key: string;
    status: 'success' | 'error' | 'skipped' | 'webhook_sent';
    trigger_data?: Record<string, any>;
    result_data?: Record<string, any>;
    error_message?: string;
    execution_time_ms?: number;
    created_at: string;
}

export function useAutomations() {
    const queryClient = useQueryClient();

    // Fetch all automation configs
    const { data: automations = [], isLoading } = useQuery({
        queryKey: ['automation-configs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('automation_configs')
                .select('*')
                .order('category', { ascending: true });

            if (error) throw error;
            return data as unknown as AutomationConfig[];
        }
    });

    // Fetch automation logs
    const fetchLogs = async (automationKey?: string, limit = 50): Promise<AutomationLog[]> => {
        let query = supabase
            .from('automation_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (automationKey) {
            query = query.eq('automation_key', automationKey);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as unknown as AutomationLog[];
    };

    // Toggle automation on/off
    const toggleAutomation = useMutation({
        mutationFn: async ({ key, enabled }: { key: string; enabled: boolean }) => {
            const { error } = await supabase
                .from('automation_configs')
                .update({ is_enabled: enabled, updated_at: new Date().toISOString() })
                .eq('key', key);

            if (error) throw error;
            return { key, enabled };
        },
        onSuccess: ({ key, enabled }) => {
            queryClient.invalidateQueries({ queryKey: ['automation-configs'] });
            toast({
                title: enabled ? '✅ Automação ativada' : '⏸️ Automação pausada',
                description: `${key} ${enabled ? 'está ativa' : 'foi desativada'}`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Erro ao atualizar automação',
                description: error.message,
                variant: 'destructive',
            });
        }
    });

    // Update automation config
    const updateConfig = useMutation({
        mutationFn: async ({ key, config, webhook_url, webhook_secret }: {
            key: string;
            config?: Record<string, any>;
            webhook_url?: string;
            webhook_secret?: string;
        }) => {
            const updates: any = { updated_at: new Date().toISOString() };
            if (config !== undefined) updates.config = config;
            if (webhook_url !== undefined) updates.webhook_url = webhook_url;
            if (webhook_secret !== undefined) updates.webhook_secret = webhook_secret;

            const { error } = await supabase
                .from('automation_configs')
                .update(updates)
                .eq('key', key);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['automation-configs'] });
            toast({
                title: '⚙️ Configuração salva',
                description: 'Parâmetros da automação atualizados.',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Erro ao salvar configuração',
                description: error.message,
                variant: 'destructive',
            });
        }
    });

    // Trigger automation manually or programmatically
    const triggerAutomation = async (
        key: string,
        payload: Record<string, any>
    ): Promise<{ success: boolean; result?: any; error?: string }> => {
        const startTime = Date.now();

        try {
            // Get automation config
            const automation = automations.find(a => a.key === key);
            if (!automation) {
                return { success: false, error: 'Automação não encontrada' };
            }

            if (!automation.is_enabled) {
                // Log as skipped
                await logExecution(key, 'skipped', payload, null, 'Automação desativada');
                return { success: false, error: 'Automação desativada' };
            }

            // If has webhook, call it
            if (automation.webhook_url) {
                try {
                    const response = await fetch(automation.webhook_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(automation.webhook_secret && {
                                'X-Webhook-Secret': automation.webhook_secret
                            }),
                        },
                        body: JSON.stringify({
                            automation_key: key,
                            timestamp: new Date().toISOString(),
                            payload,
                            config: automation.config,
                        }),
                    });

                    const executionTime = Date.now() - startTime;

                    if (response.ok) {
                        await logExecution(key, 'webhook_sent', payload, { status: response.status }, null, executionTime);
                    } else {
                        await logExecution(key, 'error', payload, null, `Webhook failed: ${response.status}`, executionTime);
                    }
                } catch (webhookError: any) {
                    await logExecution(key, 'error', payload, null, `Webhook error: ${webhookError.message}`, Date.now() - startTime);
                }
            }

            // Update trigger count
            await supabase
                .from('automation_configs')
                .update({
                    last_triggered_at: new Date().toISOString(),
                    trigger_count: (automation.trigger_count || 0) + 1
                })
                .eq('key', key);

            const executionTime = Date.now() - startTime;
            await logExecution(key, 'success', payload, null, null, executionTime);

            return { success: true };
        } catch (error: any) {
            await logExecution(key, 'error', payload, null, error.message, Date.now() - startTime);
            return { success: false, error: error.message };
        }
    };

    // Log execution
    const logExecution = async (
        automationKey: string,
        status: AutomationLog['status'],
        triggerData?: Record<string, any>,
        resultData?: Record<string, any>,
        errorMessage?: string | null,
        executionTimeMs?: number
    ) => {
        const automation = automations.find(a => a.key === automationKey);

        await supabase.from('automation_logs').insert({
            automation_id: automation?.id,
            automation_key: automationKey,
            status,
            trigger_data: triggerData,
            result_data: resultData,
            error_message: errorMessage,
            execution_time_ms: executionTimeMs,
        } as any);
    };

    // Get automation by key
    const getAutomation = (key: string): AutomationConfig | undefined => {
        return automations.find(a => a.key === key);
    };

    // Check if automation is enabled
    const isEnabled = (key: string): boolean => {
        const automation = getAutomation(key);
        return automation?.is_enabled ?? false;
    };

    // Get config value
    const getConfig = <T = any>(key: string, configKey: string, defaultValue: T): T => {
        const automation = getAutomation(key);
        return automation?.config?.[configKey] ?? defaultValue;
    };

    return {
        automations,
        isLoading,
        fetchLogs,
        toggleAutomation: toggleAutomation.mutate,
        updateConfig: updateConfig.mutate,
        triggerAutomation,
        getAutomation,
        isEnabled,
        getConfig,
        isToggling: toggleAutomation.isPending,
        isUpdating: updateConfig.isPending,
    };
}
