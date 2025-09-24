import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Tipos para o sistema de projetos
export interface Project {
  id: string;
  deal_id?: string;
  title: string;
  description?: string;
  status: 'draft' | 'in_development' | 'on_hold' | 'completed' | 'cancelled';
  client_id?: string;
  project_manager_id?: string;
  start_date?: string;
  expected_end_date?: string;
  actual_end_date?: string;
  budget_value?: number;
  progress_percentage: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_type: 'software' | 'automation' | 'ai' | 'games' | 'consulting';
  tags?: string[];
  custom_fields?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  client?: {
    id: string;
    name: string;
    email?: string;
    company?: string;
  };
  deal?: {
    id: string;
    title: string;
    value?: number;
  };
}

export interface ProjectSprint {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  sprint_number: number;
  start_date: string;
  end_date: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  goal_description?: string;
  velocity_points?: number;
  burndown_data?: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectTask {
  id: string;
  project_id: string;
  sprint_id?: string;
  title: string;
  description?: string;
  task_type: 'feature' | 'bug' | 'improvement' | 'research' | 'documentation' | 'testing';
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  reporter_id?: string;
  story_points?: number;
  estimated_hours?: number;
  actual_hours?: number;
  due_date?: string;
  completed_at?: string;
  tags?: string[];
  dependencies?: string[];
  client_visible: boolean;
  acceptance_criteria?: string[];
  custom_fields?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  milestone_type: 'delivery' | 'review' | 'approval' | 'payment' | 'kickoff';
  due_date: string;
  completed_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  deliverables?: string[];
  client_action_required: boolean;
  client_action_description?: string;
  dependencies?: string[];
  notification_sent: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectClientAccess {
  id: string;
  project_id: string;
  client_contact_id: string;
  access_level: 'viewer' | 'collaborator' | 'admin';
  access_token?: string;
  token_expires_at?: string;
  permissions: {
    view_timeline: boolean;
    view_tasks: boolean;
    view_reports: boolean;
    comment: boolean;
    approve_milestones: boolean;
  };
  last_accessed_at?: string;
  invitation_sent_at?: string;
  invitation_accepted_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Fetch all projects
  const { data: projects = [], isLoading: projectsLoading, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          client:crm_contacts(id, name, email, company),
          deal:crm_deals(id, title, value)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    }
  });

  // Fetch sprints by project
  const fetchSprintsByProject = async (projectId: string): Promise<ProjectSprint[]> => {
    const { data, error } = await supabase
      .from('project_sprints')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('sprint_number', { ascending: true });

    if (error) throw error;
    return data as ProjectSprint[];
  };

  // Fetch tasks by project
  const fetchTasksByProject = async (projectId: string): Promise<ProjectTask[]> => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProjectTask[];
  };

  // Fetch milestones by project
  const fetchMilestonesByProject = async (projectId: string): Promise<ProjectMilestone[]> => {
    const { data, error } = await supabase
      .from('project_milestones')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data as ProjectMilestone[];
  };

  // Fetch client access by project
  const fetchClientAccessByProject = async (projectId: string): Promise<ProjectClientAccess[]> => {
    const { data, error } = await supabase
      .from('project_client_access')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ProjectClientAccess[];
  };

  // Create project mutation
  const createProject = useMutation({
    mutationFn: async (projectData: any) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar projeto: ' + error.message);
    }
  });

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Projeto atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar projeto: ' + error.message);
    }
  });

  // Create sprint mutation
  const createSprint = useMutation({
    mutationFn: async (sprintData: any) => {
      const { data, error } = await supabase
        .from('project_sprints')
        .insert([sprintData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_sprints'] });
      toast.success('Sprint criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar sprint: ' + error.message);
    }
  });

  // Create task mutation
  const createTask = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_tasks'] });
      toast.success('Tarefa criada com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar tarefa: ' + error.message);
    }
  });

  // Update task status mutation
  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: ProjectTask['status'] }) => {
      const { data, error } = await supabase
        .from('project_tasks')
        .update({ 
          status,
          completed_at: status === 'done' ? new Date().toISOString() : null
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_tasks'] });
      toast.success('Status da tarefa atualizado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao atualizar tarefa: ' + error.message);
    }
  });

  // Create milestone mutation
  const createMilestone = useMutation({
    mutationFn: async (milestoneData: any) => {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert([milestoneData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_milestones'] });
      toast.success('Marco criado com sucesso!');
    },
    onError: (error: any) => {
      toast.error('Erro ao criar marco: ' + error.message);
    }
  });

  // Grant client access mutation
  const grantClientAccess = useMutation({
    mutationFn: async (accessData: any) => {
      const { data, error } = await supabase
        .from('project_client_access')
        .insert([accessData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project_client_access'] });
      toast.success('Acesso do cliente configurado!');
    },
    onError: (error: any) => {
      toast.error('Erro ao configurar acesso: ' + error.message);
    }
  });

  // Fetch feedback modules for a project
  const fetchFeedbackModulesByProject = async (projectId: string) => {
    const { data, error } = await supabase
      .from('feedback_modules')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data;
  };

  // Fetch feedback entries for a project
  const fetchFeedbackByProject = async (projectId: string) => {
    const { data, error } = await supabase
      .from('feedback_entries')
      .select(`
        *,
        module:feedback_modules(name, key),
        contact:crm_contacts(name, email)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  };

  return {
    // Data
    projects,
    projectsLoading,
    projectsError,
    
    // Fetch functions
    fetchSprintsByProject,
    fetchTasksByProject,
    fetchMilestonesByProject,
    fetchClientAccessByProject,
    fetchFeedbackModulesByProject,
    fetchFeedbackByProject,
    
    // Mutations
    createProject,
    updateProject,
    createSprint,
    createTask,
    updateTaskStatus,
    createMilestone,
    grantClientAccess,
    
    // Mutation states
    isCreatingProject: createProject.isPending,
    isUpdatingProject: updateProject.isPending,
    isCreatingSprint: createSprint.isPending,
    isCreatingTask: createTask.isPending,
    isUpdatingTask: updateTaskStatus.isPending,
    isCreatingMilestone: createMilestone.isPending,
    isGrantingAccess: grantClientAccess.isPending,
  };
};