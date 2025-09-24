import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  FileText,
  LogOut,
  Calendar,
  Target,
  MessageSquare,
  BarChart3,
  CheckSquare
} from 'lucide-react';
import { ClientAccess } from '@/hooks/useClientAuth';
import { ClientProjectTimeline } from './ClientProjectTimeline';
import { ClientTasksView } from './ClientTasksView';
import { ClientMilestonesView } from './ClientMilestonesView';
import { ClientReportsView } from './ClientReportsView';
import { ClientFeedbackView } from './ClientFeedbackView';

interface ClientDashboardProps {
  clientAccess: ClientAccess;
}

export const ClientDashboard = ({ clientAccess }: ClientDashboardProps) => {
  const { project, permissions } = clientAccess;
  
  if (!project) return null;

  const getStatusColor = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      in_development: 'bg-blue-500',
      on_hold: 'bg-yellow-500',
      completed: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const statusTexts = {
      draft: 'Rascunho',
      in_development: 'Em Desenvolvimento',
      on_hold: 'Pausado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  const logout = () => {
    window.location.href = '/';
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo ao portal do seu projeto
            </p>
          </div>
          
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
        
        {/* Project Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {getStatusText(project.status)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Progresso</span>
                </div>
                <div className="space-y-1">
                  <Progress value={project.progress_percentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {project.progress_percentage}% concluído
                  </p>
                </div>
              </div>
              
              {project.start_date && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Início</span>
                  </div>
                  <p className="text-sm">
                    {new Date(project.start_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              
              {project.expected_end_date && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Previsão</span>
                  </div>
                  <p className="text-sm">
                    {new Date(project.expected_end_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
            
            {project.description && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Descrição do Projeto</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          {permissions.view_timeline && (
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          )}
          
          {permissions.view_tasks && (
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Tarefas</span>
            </TabsTrigger>
          )}
          
          <TabsTrigger value="milestones" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Marcos</span>
          </TabsTrigger>
          
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Feedback</span>
          </TabsTrigger>
          
          {permissions.view_reports && (
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
          )}
        </TabsList>

        {permissions.view_timeline && (
          <TabsContent value="timeline" className="space-y-6">
            <ClientProjectTimeline projectId={project.id} />
          </TabsContent>
        )}

        {permissions.view_tasks && (
          <TabsContent value="tasks" className="space-y-6">
            <ClientTasksView projectId={project.id} />
          </TabsContent>
        )}

        <TabsContent value="milestones" className="space-y-6">
          <ClientMilestonesView projectId={project.id} permissions={permissions} />
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <ClientFeedbackView
            projectId={project.id}
            contactId={clientAccess.client_contact_id}
            user={{
              id: clientAccess.client_contact_id,
              name: 'Cliente',
              email: '',
              role: 'gestor'
            }}
          />
        </TabsContent>

        {permissions.view_reports && (
          <TabsContent value="reports" className="space-y-6">
            <ClientReportsView projectId={project.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};