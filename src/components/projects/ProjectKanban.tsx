import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  AlertTriangle,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useProjects, Project } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';

const statusColumns = [
  { 
    key: 'draft', 
    title: 'Rascunho', 
    color: 'border-gray-200 bg-gray-50/50',
    count: 0 
  },
  { 
    key: 'in_development', 
    title: 'Em Desenvolvimento', 
    color: 'border-blue-200 bg-blue-50/50',
    count: 0 
  },
  { 
    key: 'on_hold', 
    title: 'Pausado', 
    color: 'border-yellow-200 bg-yellow-50/50',
    count: 0 
  },
  { 
    key: 'completed', 
    title: 'Concluído', 
    color: 'border-green-200 bg-green-50/50',
    count: 0 
  },
] as const;

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

const getPriorityIcon = (priority: Project['priority']) => {
  switch (priority) {
    case 'urgent': return <AlertTriangle className="h-3 w-3 text-red-500" />;
    case 'high': return <AlertTriangle className="h-3 w-3 text-orange-500" />;
    case 'medium': return <Clock className="h-3 w-3 text-yellow-500" />;
    case 'low': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    default: return null;
  }
};

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const isOverdue = project.expected_end_date && 
    new Date(project.expected_end_date) < new Date() && 
    project.status !== 'completed';

  return (
    <Card 
      className={`mb-3 cursor-pointer transition-all hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{project.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                className={`${getStatusColor(project.status)} text-white text-xs`}
              >
                {project.status}
              </Badge>
              {getPriorityIcon(project.priority)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{project.progress_percentage}%</span>
            </div>
            <Progress value={project.progress_percentage} className="h-1.5" />
          </div>

          {/* Client info */}
          {project.client && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="truncate">{project.client.name}</span>
            </div>
          )}

          {/* Budget */}
          {project.budget_value && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>R$ {project.budget_value.toLocaleString('pt-BR')}</span>
            </div>
          )}

          {/* Due date */}
          {project.expected_end_date && (
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3" />
              <span className={isOverdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                {new Date(project.expected_end_date).toLocaleDateString('pt-BR')}
                {isOverdue && ' (Atrasado)'}
              </span>
            </div>
          )}

          {/* Project Manager */}
          {project.project_manager_id && (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">PM</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">Gerente do Projeto</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProjectKanban() {
  const { projects, projectsLoading } = useProjects();

  if (projectsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((column) => (
          <Card key={column.key} className="min-h-[600px]">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const projectsByStatus = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statusColumns.map((column) => {
        const columnProjects = projectsByStatus[column.key] || [];
        
        return (
          <Card key={column.key} className={`min-h-[600px] ${column.color}`}>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>{column.title}</span>
                <Badge variant="secondary" className="text-xs">
                  {columnProjects.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-0">
                {columnProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {columnProjects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📋</div>
                    <p className="text-sm">Nenhum projeto</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}