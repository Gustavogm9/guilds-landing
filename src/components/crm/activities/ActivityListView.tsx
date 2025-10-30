import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, Edit2, Trash2, User, Briefcase } from 'lucide-react';
import { format, isToday, isPast, isFuture } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCRM } from '@/hooks/useCRM';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ActivityListViewProps {
  filterDealId?: string;
  filterContactId?: string;
  onEdit?: (activity: any) => void;
  daysAhead?: number;
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  call: '📞 Ligação',
  meeting: '🤝 Reunião',
  email: '📧 E-mail',
  whatsapp: '💬 WhatsApp',
  task: '✅ Tarefa',
  follow_up: '🔄 Follow-up',
  proposal: '📄 Proposta',
  demo: '🎯 Demonstração',
  note: '📝 Nota',
  feedback: '💡 Feedback',
};

export function ActivityListView({ 
  filterDealId, 
  filterContactId,
  onEdit,
  daysAhead = 30
}: ActivityListViewProps) {
  const { markActivityAsCompleted, isCompletingActivity } = useCRM();
  const [activeTab, setActiveTab] = useState('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { data: activities, isLoading, refetch } = useQuery({
    queryKey: ['activities', filterDealId, filterContactId, daysAhead],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + daysAhead);

      let query = supabase
        .from('crm_activities')
        .select(`
          *,
          deal:crm_deals(id, title),
          contact:crm_contacts(id, name, email)
        `)
        .order('due_date', { ascending: true, nullsFirst: false });

      // Aplicar filtro de data apenas se não for "Todas" (daysAhead < 365)
      if (daysAhead < 365) {
        query = query
          .gte('due_date', today.toISOString())
          .lte('due_date', endDate.toISOString());
      }

      if (filterDealId) {
        query = query.eq('deal_id', filterDealId);
      }

      if (filterContactId) {
        query = query.eq('contact_id', filterContactId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: 30000, // Cache de 30 segundos
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Evita refetch ao voltar para janela
  });

  const filteredActivities = activities?.filter(activity => {
    const matchesTab = activeTab === 'pending' ? !activity.completed : activity.completed;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    return matchesTab && matchesType;
  }) || [];

  const getUrgencyBadge = (dueDate: string | null) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) {
      return <Badge variant="destructive" className="text-xs">Atrasada</Badge>;
    }
    
    if (isToday(date)) {
      return <Badge variant="default" className="text-xs">Hoje</Badge>;
    }
    
    return <Badge variant="secondary" className="text-xs">Agendada</Badge>;
  };

  const handleMarkCompleted = (activityId: string) => {
    markActivityAsCompleted(activityId);
    setTimeout(() => refetch(), 500);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Carregando atividades...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Atividades</CardTitle>
            <CardDescription>
              {filteredActivities.length} atividade{filteredActivities.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {Object.entries(ACTIVITY_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pendentes ({activities?.filter(a => !a.completed).length || 0})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Concluídas ({activities?.filter(a => a.completed).length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-2 mt-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade pendente</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={activity.completed}
                        onCheckedChange={() => handleMarkCompleted(activity.id)}
                        disabled={isCompletingActivity}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1">{activity.title}</h4>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {activity.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 items-center shrink-0">
                            {activity.due_date && getUrgencyBadge(activity.due_date)}
                            {activity.is_recurring && (
                              <Badge variant="outline" className="text-xs">
                                🔄
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            {ACTIVITY_TYPE_LABELS[activity.type] || activity.type}
                          </span>
                          
                          {activity.due_date && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(activity.due_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                            </span>
                          )}
                          
                          {activity.contact_id && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Contato
                            </span>
                          )}
                          
                          {activity.deal_id && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              Deal
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => onEdit(activity)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2 mt-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma atividade concluída</p>
              </div>
            ) : (
              filteredActivities.map((activity) => (
                <Card key={activity.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-through">{activity.title}</h4>
                        {activity.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                            {activity.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span>{ACTIVITY_TYPE_LABELS[activity.type] || activity.type}</span>
                          
                          {activity.completed_at && (
                            <span>
                              Concluída em {format(new Date(activity.completed_at), "dd/MM/yyyy", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
