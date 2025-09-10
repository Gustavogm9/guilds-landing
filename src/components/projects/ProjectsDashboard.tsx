import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Calendar,
  DollarSign,
  Plus
} from 'lucide-react';
import { useProjects, Project } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-500';
    case 'in_development': return 'bg-blue-500';
    case 'on_hold': return 'bg-yellow-500';
    case 'completed': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusLabel = (status: Project['status']) => {
  switch (status) {
    case 'draft': return 'Rascunho';
    case 'in_development': return 'Em Desenvolvimento';
    case 'on_hold': return 'Pausado';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    default: return status;
  }
};

const getPriorityColor = (priority: Project['priority']) => {
  switch (priority) {
    case 'low': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
    case 'medium': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950';
    case 'high': return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
    case 'urgent': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
    default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  }
};

export function ProjectsDashboard() {
  const { projects, projectsLoading } = useProjects();

  if (projectsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'in_development');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const overdueProjects = projects.filter(p => 
    p.expected_end_date && 
    new Date(p.expected_end_date) < new Date() && 
    p.status === 'in_development'
  );

  const totalBudget = projects.reduce((sum, project) => sum + (project.budget_value || 0), 0);
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress_percentage, 0) / projects.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              +{projects.filter(p => p.status === 'draft').length} em rascunho
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.length > 0 ? Math.round((completedProjects.length / projects.length) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção imediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos recentes */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Projetos Recentes</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Novo Projeto
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{project.title}</h3>
                      <Badge 
                        className={`${getStatusColor(project.status)} text-white text-xs`}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={getPriorityColor(project.priority)}
                      >
                        {project.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.client?.name || 'Cliente não definido'}
                      </span>
                      {project.budget_value && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          R$ {project.budget_value.toLocaleString('pt-BR')}
                        </span>
                      )}
                      {project.expected_end_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(project.expected_end_date).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-medium">{project.progress_percentage}%</div>
                    <Progress value={project.progress_percentage} className="w-20" />
                  </div>
                </div>
              ))}
              
              {projects.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum projeto encontrado</p>
                  <p className="text-sm">Crie seu primeiro projeto ou mova um deal para "Proposta"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas adicionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Orçamento Total</span>
                <span className="font-medium">R$ {totalBudget.toLocaleString('pt-BR')}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projetos Ativos</span>
                <span className="font-medium">
                  R$ {activeProjects.reduce((sum, p) => sum + (p.budget_value || 0), 0).toLocaleString('pt-BR')}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projetos Concluídos</span>
                <span className="font-medium text-green-600">
                  R$ {completedProjects.reduce((sum, p) => sum + (p.budget_value || 0), 0).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Por Tipo de Projeto</h4>
              <div className="space-y-2">
                {['software', 'automation', 'games', 'consulting'].map((type) => {
                  const typeProjects = projects.filter(p => p.project_type === type);
                  const count = typeProjects.length;
                  
                  if (count === 0) return null;
                  
                  return (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{type}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Alertas</h4>
              <div className="space-y-2">
                {overdueProjects.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{overdueProjects.length} projeto(s) em atraso</span>
                  </div>
                )}
                
                {projects.filter(p => p.progress_percentage < 10 && p.status === 'in_development').length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600">
                    <Clock className="h-3 w-3" />
                    <span>Projetos com baixo progresso</span>
                  </div>
                )}
                
                {overdueProjects.length === 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-3 w-3" />
                    <span>Todos os projetos no prazo</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}