import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClientMilestonesViewProps {
  projectId: string;
  permissions: {
    approve_milestones: boolean;
  };
}

export const ClientMilestonesView = ({ projectId, permissions }: ClientMilestonesViewProps) => {
  const { data: milestones, isLoading, refetch } = useQuery({
    queryKey: ['client_project_milestones', projectId],
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

  const handleApprove = async (milestoneId: string) => {
    try {
      const { error } = await supabase
        .from('project_milestones')
        .update({
          status: 'completed',
          completed_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', milestoneId);

      if (error) throw error;

      toast.success('Marco aprovado com sucesso!');
      refetch();
    } catch (error) {
      console.error('Erro ao aprovar marco:', error);
      toast.error('Erro ao aprovar marco');
    }
  };

  if (isLoading) {
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

  const getMilestoneTypeText = (type: string) => {
    const types = {
      delivery: 'Entrega',
      review: 'Revisão',
      approval: 'Aprovação',
      payment: 'Pagamento',
      kickoff: 'Kickoff',
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Marcos e Entregas
          </CardTitle>
          <CardDescription>
            Acompanhe os marcos importantes do seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {milestones && milestones.length > 0 ? (
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="p-2 rounded-full bg-muted">
                        {getStatusIcon(milestone.status)}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-px h-16 bg-border mt-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{milestone.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {getMilestoneTypeText(milestone.milestone_type)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(milestone.status)}>
                            {getStatusText(milestone.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      {milestone.description && (
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Prazo: {new Date(milestone.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        
                        {milestone.completed_date && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span>Concluído: {new Date(milestone.completed_date).toLocaleDateString('pt-BR')}</span>
                          </div>
                        )}
                      </div>

                      {milestone.deliverables && milestone.deliverables.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Entregas Previstas:</p>
                          <ul className="space-y-1">
                            {milestone.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {milestone.client_action_required && milestone.client_action_description && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <p className="font-medium text-sm text-yellow-800 dark:text-yellow-200">
                              Ação Necessária
                            </p>
                          </div>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            {milestone.client_action_description}
                          </p>
                          
                          {permissions.approve_milestones && milestone.status === 'in_progress' && (
                            <div className="mt-3">
                              <Button 
                                onClick={() => handleApprove(milestone.id)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Aprovar Marco
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
    </div>
  );
};