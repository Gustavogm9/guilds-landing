import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertTriangle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientTasksViewProps {
  projectId: string;
}

export const ClientTasksView = ({ projectId }: ClientTasksViewProps) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['client_tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('client_visible', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4">
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
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'review':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      backlog: 'bg-gray-500',
      todo: 'bg-slate-500',
      in_progress: 'bg-blue-500',
      review: 'bg-yellow-500',
      testing: 'bg-purple-500',
      done: 'bg-green-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts = {
      backlog: 'Backlog',
      todo: 'A Fazer',
      in_progress: 'Em Progresso',
      review: 'Em Revisão',
      testing: 'Em Teste',
      done: 'Concluído',
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      urgent: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getPriorityText = (priority: string) => {
    const texts = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return texts[priority as keyof typeof texts] || priority;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Tarefas do Projeto
          </CardTitle>
          <CardDescription>
            Acompanhe o progresso das tarefas visíveis para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <h3 className="font-medium">{task.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status)}>
                        {getStatusText(task.status)}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-sm text-muted-foreground pl-6">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pl-6">
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    
                    {task.completed_at && (
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Concluído: {new Date(task.completed_at).toLocaleDateString('pt-BR')}
                      </div>
                    )}

                    {task.story_points && (
                      <div>
                        Story Points: {task.story_points}
                      </div>
                    )}
                  </div>

                  {task.acceptance_criteria && task.acceptance_criteria.length > 0 && (
                    <div className="pl-6">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Critérios de Aceitação:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {task.acceptance_criteria.map((criteria, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 mt-0.5 text-green-600" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma tarefa visível para você ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};