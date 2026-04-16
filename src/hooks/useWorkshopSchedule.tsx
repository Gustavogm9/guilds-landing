import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Workshop } from './useWorkshops';

export interface WorkshopSchedule {
    id: string;
    workshop_id: string;
    workshop?: Workshop;
    start_date: string;
    end_date: string;
    mode: 'online' | 'presencial' | 'hybrid';
    location?: string;
    current_seats: number;
    total_seats: number;
    price_override?: number;
    status: 'scheduled' | 'open' | 'full' | 'cancelled' | 'completed';
}

export const useWorkshopSchedule = () => {
    return useQuery({
        queryKey: ['workshop-schedules'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('workshop_schedules')
                .select(`
          *,
          workshop:workshops(*)
        `)
                .eq('status', 'open')
                .order('start_date', { ascending: true });

            if (error) throw error;
            return data as WorkshopSchedule[];
        }
    });
};
