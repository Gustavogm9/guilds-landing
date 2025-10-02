import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pause, Play, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  quarterly: 'Trimestral',
  yearly: 'Anual',
  custom: 'Personalizado',
};

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface RecurringActivitiesListProps {
  onEdit?: (recurrence: any) => void;
}

export function RecurringActivitiesList({ onEdit }: RecurringActivitiesListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recurrences, isLoading } = useQuery({
    queryKey: ['recurring-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_activity_recurrence')
        .select(`
          *,
          crm_deals!crm_activity_recurrence_deal_id_fkey(id, title),
          crm_contacts!crm_activity_recurrence_contact_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('crm_activity_recurrence')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-activities'] });
      toast({
        title: 'Status atualizado',
        description: 'Recorrência atualizada com sucesso',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a recorrência',
        variant: 'destructive',
      });
      console.error('Error toggling recurrence:', error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_activity_recurrence')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-activities'] });
      toast({
        title: 'Recorrência excluída',
        description: 'A recorrência e todas as suas ocorrências futuras foram removidas',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a recorrência',
        variant: 'destructive',
      });
      console.error('Error deleting recurrence:', error);
    },
  });

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta recorrência? Todas as ocorrências futuras serão removidas.')) {
      deleteMutation.mutate(id);
    }
  };

  const getFrequencyDescription = (recurrence: any) => {
    const parts: string[] = [];
    
    parts.push(FREQUENCY_LABELS[recurrence.frequency] || recurrence.frequency);
    
    if (recurrence.interval > 1) {
      parts.push(`a cada ${recurrence.interval}`);
    }

    if (recurrence.by_weekday && recurrence.by_weekday.length > 0) {
      const days = recurrence.by_weekday.map((d: number) => WEEKDAY_LABELS[d]).join(', ');
      parts.push(`- ${days}`);
    }

    if (recurrence.by_month_day && recurrence.by_month_day.length > 0) {
      parts.push(`- dia ${recurrence.by_month_day.join(', ')}`);
    }

    return parts.join(' ');
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando recorrências...</div>;
  }

  if (!recurrences || recurrences.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma atividade recorrente configurada
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recurrences.map((recurrence: any) => (
        <Card key={recurrence.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{recurrence.title}</CardTitle>
                  {!recurrence.is_active && (
                    <Badge variant="secondary">Pausada</Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {getFrequencyDescription(recurrence)}
                </CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(recurrence)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar Série
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => handleToggleActive(recurrence.id, recurrence.is_active)}
                  >
                    {recurrence.is_active ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Reativar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(recurrence.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Série
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {recurrence.description && (
              <p className="text-muted-foreground">{recurrence.description}</p>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Início:</span>{' '}
                {format(new Date(recurrence.start_date), 'dd/MM/yyyy', { locale: ptBR })}
              </div>
              {recurrence.end_date && (
                <div>
                  <span className="text-muted-foreground">Término:</span>{' '}
                  {format(new Date(recurrence.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              )}
              {recurrence.max_occurrences && (
                <div>
                  <span className="text-muted-foreground">Limite:</span>{' '}
                  {recurrence.max_occurrences} ocorrências
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Geradas:</span>{' '}
                {recurrence.occurrences_generated}
              </div>
            </div>

            {recurrence.crm_deals && (
              <div>
                <span className="text-muted-foreground">Deal:</span>{' '}
                {recurrence.crm_deals.title}
              </div>
            )}

            {recurrence.crm_contacts && (
              <div>
                <span className="text-muted-foreground">Contato:</span>{' '}
                {recurrence.crm_contacts.name}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
