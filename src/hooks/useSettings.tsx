import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface SystemSettings {
    general: {
        companyName: string;
        supportEmail: string;
        supportPhone: string;
        timezone: string;
        language: string;
        currency: string;
    };
    automation: {
        enabled: boolean;
        dailyLimit: number;
        rateLimitPerContact: number;
        retryAttempts: number;
        enableWebhooks: boolean;
        webhookUrl: string;
        enableSlack: boolean;
        slackWebhook: string;
    };
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        pushNotifications: boolean;
        dailyReports: boolean;
        weeklyReports: boolean;
        errorAlerts: boolean;
    };
    integrations: {
        whatsappToken: string;
        emailProvider: string;
        resendApiKey: string;
        openaiApiKey: string;
        zapierWebhook: string;
    };
}

const DEFAULT_SETTINGS: SystemSettings = {
    general: {
        companyName: 'Guilds',
        supportEmail: 'contato@guilds.com.br',
        supportPhone: '+5511999999999',
        timezone: 'America/Sao_Paulo',
        language: 'pt-BR',
        currency: 'BRL'
    },
    automation: {
        enabled: true,
        dailyLimit: 100,
        rateLimitPerContact: 3,
        retryAttempts: 3,
        enableWebhooks: false,
        webhookUrl: '',
        enableSlack: false,
        slackWebhook: ''
    },
    notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        dailyReports: true,
        weeklyReports: true,
        errorAlerts: true
    },
    integrations: {
        whatsappToken: '',
        emailProvider: 'resend',
        resendApiKey: '',
        openaiApiKey: '',
        zapierWebhook: ''
    }
};

export function useSettings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch all settings
    const { data: settings = DEFAULT_SETTINGS, isLoading, error } = useQuery({
        queryKey: ['system-settings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('system_settings')
                .select('*');

            if (error) {
                console.error('Error fetching settings:', error);
                throw error;
            }

            // Merge fetched settings with default structure to ensure type safety
            const fetchedSettings = data.reduce((acc, curr) => ({
                ...acc,
                [curr.key]: curr.value
            }), {} as Partial<SystemSettings>);

            return {
                ...DEFAULT_SETTINGS,
                ...fetchedSettings
            };
        },
        // Fallback to defaults on error to prevent breaking UI
        retry: 1
    });

    // Update a setting category
    const updateSettingsMutation = useMutation({
        mutationFn: async ({ key, value }: { key: keyof SystemSettings, value: any }) => {
            const { data, error } = await supabase
                .from('system_settings')
                .upsert({
                    key,
                    value,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system-settings'] });
            toast({
                title: "Configurações salvas",
                description: "As alterações foram aplicadas com sucesso.",
            });
        },
        onError: (error) => {
            toast({
                title: "Erro ao salvar",
                description: "Não foi possível salvar as configurações. Tente novamente.",
                variant: "destructive",
            });
            console.error('Error saving settings:', error);
        }
    });

    const updateSettingCategory = async (key: keyof SystemSettings, value: any) => {
        return updateSettingsMutation.mutateAsync({ key, value });
    };

    return {
        settings,
        isLoading,
        updateSettingCategory,
        isUpdating: updateSettingsMutation.isPending
    };
}
