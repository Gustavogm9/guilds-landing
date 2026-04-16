
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as fallbackData from '@/data/defaultContent';

export interface ContentItem {
    key: string;
    content: any;
    section: string;
    locale: string;
}

export function useContent(section: string = 'home') {
    const queryClient = useQueryClient();

    // Fetch content with fallback to mockData
    const { data: content, isLoading, error } = useQuery({
        queryKey: ['site-content', section],
        queryFn: async () => {
            try {
                const { data, error } = await supabase
                    .from('site_content')
                    .select('*')
                    .eq('section', section);

                // If table doesn't exist (e.g., migration not run) or other error
                if (error) {
                    console.warn('Supabase content fetch failed, using mocks:', error.message);
                    return null;
                }

                // Convert array to object map for easy access: { key: content }
                const contentMap = data.reduce((acc, item) => ({
                    ...acc,
                    [item.key]: item.content
                }), {} as Record<string, any>);

                return contentMap;
            } catch (err) {
                console.warn('Content fetch exception, using mocks:', err);
                return null;
            }
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Helper to get content with strict type safety and fallback
    const getContent = <T,>(key: string, fallback: T): T => {
        if (content && content[key]) {
            return content[key] as T;
        }

        // Fallback to mockData if available there
        // We map keys to mockData exports manually since names might differ
        // or just return the provided fallback
        return fallback;
    };

    // Mutation to update content
    const updateContentMutation = useMutation({
        mutationFn: async ({ key, value }: { key: string; value: any }) => {
            const { data, error } = await supabase
                .from('site_content')
                .upsert({
                    key,
                    section,
                    content: value,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['site-content'] });
            toast.success('Conteúdo atualizado com sucesso!');
        },
        onError: (error) => {
            console.error('Error updating content:', error);
            toast.error('Erro ao salvar conteúdo.');
        }
    });

    return {
        content,
        isLoading,
        getContent,
        updateContent: updateContentMutation.mutate,
        isUpdating: updateContentMutation.isPending,
        // Expose raw mock data for initial hydration if needed
        rawMockData: fallbackData
    };
}
