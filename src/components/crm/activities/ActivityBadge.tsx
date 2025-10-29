import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Bell, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, isPast, isThisWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityBadgeProps {
  dealId: string;
}

export function ActivityBadge({ dealId }: ActivityBadgeProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['deal-activities', dealId],
    queryFn: async () => {
      // Validação extra antes de executar query
      if (!dealId || dealId === '') {
        return [];
      }
      
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('deal_id', dealId)
        .eq('completed', false)
        .order('due_date', { ascending: true, nullsFirst: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!dealId && dealId !== '',
  });

  if (isLoading || !activities || activities.length === 0) {
    return null;
  }

  const now = new Date();
  const overdue = activities.filter(a => a.due_date && isPast(new Date(a.due_date)) && !isToday(new Date(a.due_date)));
  const today = activities.filter(a => a.due_date && isToday(new Date(a.due_date)));
  const thisWeek = activities.filter(a => a.due_date && isThisWeek(new Date(a.due_date)) && !isToday(new Date(a.due_date)));

  const getVariant = () => {
    if (overdue.length > 0) return 'destructive';
    if (today.length > 0) return 'default';
    return 'secondary';
  };

  const getIcon = () => {
    if (overdue.length > 0) return <AlertCircle className="h-3 w-3" />;
    return <Bell className="h-3 w-3" />;
  };

  const getLabel = () => {
    if (overdue.length > 0) return `${overdue.length} atrasada${overdue.length > 1 ? 's' : ''}`;
    if (today.length > 0) return `${today.length} hoje`;
    if (thisWeek.length > 0) return `${thisWeek.length} esta semana`;
    return `${activities.length}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getVariant()} 
            className="h-5 gap-1 px-1.5 cursor-help shrink-0"
          >
            {getIcon()}
            <span className="text-xs font-medium">{getLabel()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-xs">Atividades Pendentes:</p>
            <div className="space-y-1">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="text-xs">
                  <p className="font-medium">{activity.title}</p>
                  {activity.due_date && (
                    <p className="text-muted-foreground">
                      {format(new Date(activity.due_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>
              ))}
              {activities.length > 3 && (
                <p className="text-xs text-muted-foreground pt-1">
                  +{activities.length - 3} atividade{activities.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
