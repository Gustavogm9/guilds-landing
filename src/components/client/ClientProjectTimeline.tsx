import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, AlertCircle, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientProjectTimelineProps {
  projectId: string;
}

export const ClientProjectTimeline = ({ projectId }: ClientProjectTimelineProps) => {
  // Fetch project milestones and recent activities
  const { data: milestones, isLoading: milestonesLoading } = useQuery({
    queryKey: ['client_milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  const { data: statusLogs, isLoading: logsLoading } = useQuery({
    queryKey: ['client_status_logs', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_status_logs')
        .select('*')
        .eq('project_id', projectId)
        .eq('client_visible', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  if (milestonesLoading || logsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendente',
      in_progress: 'Em Progresso',
      completed: 'Concluído',
      overdue: 'Atrasado',
      cancelled: 'Cancelado',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="space-y-6">
      {/* Timeline de Marcos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Marcos do Projeto
          </CardTitle>
          <CardDescription>
            Principais entregas e marcos do seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {milestones && milestones.length > 0 ? (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="p-2 rounded-full bg-muted">
                      {getStatusIcon(milestone.status)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{milestone.title}</h3>
                      <Badge className={getStatusColor(milestone.status)}>
                        {getStatusText(milestone.status)}
                      </Badge>
                    </div>
                    
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Prazo: {new Date(milestone.due_date).toLocaleDateString('pt-BR')}
                      </div>
                      
                      {milestone.completed_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Concluído: {new Date(milestone.completed_date).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>

                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Entregas:
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {milestone.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum marco definido ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atividades Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>
            Últimas atualizações do seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusLogs && statusLogs.length > 0 ? (
            <div className="space-y-3">
              {statusLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{log.change_description}</p>
                    <p className="text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma atividade registrada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};