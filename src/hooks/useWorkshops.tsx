import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  duration_hours: number;
  difficulty_level: string;
  target_audience?: string[];
  prerequisites?: string[];
  learning_objectives?: string[];
  practical_project?: string;
  certificate_included: boolean;
  modalities: string[];
  price_type: string;
  price_amount?: number;
  is_featured: boolean;
  meta_description?: string;
  keywords?: string[];
  category?: {
    id: string;
    name: string;
    slug: string;
    icon_name?: string;
    color?: string;
  };
  instructors?: {
    id: string;
    name: string;
    slug: string;
    bio?: string;
    specialties?: string[];
    avatar_url?: string;
    years_experience?: number;
  }[];
  modules?: {
    id: string;
    title: string;
    description?: string;
    duration_hours?: number;
    module_order: number;
    topics?: string[];
  }[];
}

export interface WorkshopCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon_name?: string;
  color?: string;
  display_order: number;
}

export interface WorkshopInstructor {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  specialties?: string[];
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  years_experience?: number;
}

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          category:workshop_categories(id, name, slug, icon_name, color),
          instructors:workshop_instructor_assignments(
            instructor:workshop_instructors(id, name, slug, bio, specialties, avatar_url, years_experience)
          ),
          modules:workshop_modules(id, title, description, duration_hours, module_order, topics)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(workshop => ({
        ...workshop,
        instructors: workshop.instructors?.map(item => item.instructor) || [],
        modules: workshop.modules?.sort((a, b) => a.module_order - b.module_order) || []
      })) as Workshop[];
    }
  });
};

export const useWorkshop = (slug: string) => {
  return useQuery({
    queryKey: ['workshop', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          category:workshop_categories(id, name, slug, icon_name, color),
          instructors:workshop_instructor_assignments(
            instructor:workshop_instructors(id, name, slug, bio, specialties, avatar_url, linkedin_url, github_url, portfolio_url, years_experience)
          ),
          modules:workshop_modules(id, title, description, duration_hours, module_order, topics)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        instructors: data.instructors?.map(item => item.instructor) || [],
        modules: data.modules?.sort((a, b) => a.module_order - b.module_order) || []
      } as Workshop;
    },
    enabled: !!slug
  });
};

export const useWorkshopCategories = () => {
  return useQuery({
    queryKey: ['workshop-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as WorkshopCategory[];
    }
  });
};

export const useWorkshopInstructors = () => {
  return useQuery({
    queryKey: ['workshop-instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshop_instructors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data as WorkshopInstructor[];
    }
  });
};

export const useWorkshopsByCategory = (categorySlug: string) => {
  return useQuery({
    queryKey: ['workshops', 'category', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          category:workshop_categories!inner(id, name, slug, icon_name, color),
          instructors:workshop_instructor_assignments(
            instructor:workshop_instructors(id, name, slug, bio, specialties, avatar_url, years_experience)
          )
        `)
        .eq('workshop_categories.slug', categorySlug)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(workshop => ({
        ...workshop,
        instructors: workshop.instructors?.map(item => item.instructor) || []
      })) as Workshop[];
    },
    enabled: !!categorySlug
  });
};