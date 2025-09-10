import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useProjects, Project } from '@/hooks/useProjects';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'draft': return 'bg-gray-500 hover:bg-gray-600';
    case 'in_development': return 'bg-blue-500 hover:bg-blue-600';
    case 'on_hold': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'completed': return 'bg-green-500 hover:bg-green-600';
    case 'cancelled': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
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
    case 'low': return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950';
    case 'high': return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-950';
    case 'urgent': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950';
    default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950';
  }
};

const getPriorityLabel = (priority: Project['priority']) => {
  switch (priority) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    case 'urgent': return 'Urgente';
    default: return priority;
  }
};

export function ProjectsList() {
  const { projects, projectsLoading } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (projectsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos, clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="in_development">Em Desenvolvimento</SelectItem>
                <SelectItem value="on_hold">Pausado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de projetos */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => {
                const isOverdue = project.expected_end_date && 
                  new Date(project.expected_end_date) < new Date() && 
                  project.status !== 'completed';

                return (
                  <TableRow key={project.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{project.title}</div>
                        {project.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        {project.client ? (
                          <>
                            <div className="font-medium text-sm">{project.client.name}</div>
                            {project.client.company && (
                              <div className="text-xs text-muted-foreground">{project.client.company}</div>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground text-sm">Cliente não definido</span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {getStatusLabel(project.status)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={getPriorityColor(project.priority)}
                      >
                        {getPriorityLabel(project.priority)}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1 w-24">
                        <div className="text-sm font-medium">{project.progress_percentage}%</div>
                        <Progress value={project.progress_percentage} className="h-1.5" />
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {project.budget_value ? (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          R$ {project.budget_value.toLocaleString('pt-BR')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      {project.expected_end_date ? (
                        <div className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          {new Date(project.expected_end_date).toLocaleDateString('pt-BR')}
                          {isOverdue && <span className="font-medium">(Atrasado)</span>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Nenhum projeto encontrado com os filtros aplicados'
                      : 'Nenhum projeto encontrado'
                    }
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}