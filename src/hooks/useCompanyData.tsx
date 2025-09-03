import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Principle {
  title: string;
  description: string;
  icon: string;
}

export interface CompanyManifesto {
  id: string;
  manifesto_title: string;
  manifesto_content: string;
  history_title: string;
  history_content: string;
  dna_title: string;
  dna_content: string;
  principles: Principle[];
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  avatar_url?: string;
  expertise: string[];
  social_links?: Record<string, string>;
  curriculum_slug?: string;
  curriculum_content?: string;
  curriculum_is_public?: boolean;
  display_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobPosition {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  differentials: string[];
  modality: string;
  location: string;
  salary_range?: string;
  status: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface SelectionStep {
  step: number;
  title: string;
  description: string;
}

export interface CompanyCulture {
  id: string;
  benefits: Benefit[];
  culture_description?: string;
  selection_process: SelectionStep[];
  application_info?: string;
}

export const useCompanyManifesto = () => {
  const [manifesto, setManifesto] = useState<CompanyManifesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManifesto = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_manifesto')
        .select('*')
        .single();

      if (error) throw error;
      setManifesto({
        ...data,
        principles: Array.isArray(data.principles) ? data.principles as unknown as Principle[] : []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch manifesto');
    } finally {
      setLoading(false);
    }
  };

  const updateManifesto = async (updates: Partial<CompanyManifesto>) => {
    try {
      const { error } = await supabase
        .from('company_manifesto')
        .update({
          ...updates,
          principles: updates.principles ? JSON.stringify(updates.principles) : undefined
        })
        .eq('id', manifesto?.id);

      if (error) throw error;
      await fetchManifesto();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update manifesto');
    }
  };

  useEffect(() => {
    fetchManifesto();
  }, []);

  return {
    manifesto,
    loading,
    error,
    refetch: fetchManifesto,
    updateManifesto
  };
};

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setMembers((data || []).map(member => ({
        ...member,
        expertise: Array.isArray(member.expertise) ? member.expertise.filter(e => typeof e === 'string') as string[] : [],
        social_links: typeof member.social_links === 'object' && !Array.isArray(member.social_links) && member.social_links !== null ? member.social_links as Record<string, string> : {}
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([{
          ...member,
          expertise: JSON.stringify(member.expertise),
          social_links: JSON.stringify(member.social_links)
        }]);

      if (error) throw error;
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create team member');
    }
  };

  const updateMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          ...updates,
          expertise: updates.expertise ? JSON.stringify(updates.expertise) : undefined,
          social_links: updates.social_links ? JSON.stringify(updates.social_links) : undefined
        })
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update team member');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMembers();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete team member');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    createMember,
    updateMember,
    deleteMember
  };
};

export const useJobPositions = () => {
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_positions')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPositions((data || []).map(position => ({
        ...position,
        requirements: Array.isArray(position.requirements) ? position.requirements.filter(r => typeof r === 'string') as string[] : [],
        differentials: Array.isArray(position.differentials) ? position.differentials.filter(d => typeof d === 'string') as string[] : []
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch job positions');
    } finally {
      setLoading(false);
    }
  };

  const createPosition = async (position: Omit<JobPosition, 'id'>) => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .insert([{
          ...position,
          requirements: JSON.stringify(position.requirements),
          differentials: JSON.stringify(position.differentials)
        }]);

      if (error) throw error;
      await fetchPositions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create job position');
    }
  };

  const updatePosition = async (id: string, updates: Partial<JobPosition>) => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .update({
          ...updates,
          requirements: updates.requirements ? JSON.stringify(updates.requirements) : undefined,
          differentials: updates.differentials ? JSON.stringify(updates.differentials) : undefined
        })
        .eq('id', id);

      if (error) throw error;
      await fetchPositions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update job position');
    }
  };

  const deletePosition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('job_positions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPositions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete job position');
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return {
    positions,
    loading,
    error,
    refetch: fetchPositions,
    createPosition,
    updatePosition,
    deletePosition
  };
};

export const useCompanyCulture = () => {
  const [culture, setCulture] = useState<CompanyCulture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCulture = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_culture')
        .select('*')
        .single();

      if (error) throw error;
      setCulture({
        ...data,
        benefits: Array.isArray(data.benefits) ? data.benefits as unknown as Benefit[] : [],
        selection_process: Array.isArray(data.selection_process) ? data.selection_process as unknown as SelectionStep[] : []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company culture');
    } finally {
      setLoading(false);
    }
  };

  const updateCulture = async (updates: Partial<CompanyCulture>) => {
    try {
      const { error } = await supabase
        .from('company_culture')
        .update({
          ...updates,
          benefits: updates.benefits ? JSON.stringify(updates.benefits) : undefined,
          selection_process: updates.selection_process ? JSON.stringify(updates.selection_process) : undefined
        })
        .eq('id', culture?.id);

      if (error) throw error;
      await fetchCulture();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update company culture');
    }
  };

  useEffect(() => {
    fetchCulture();
  }, []);

  return {
    culture,
    loading,
    error,
    refetch: fetchCulture,
    updateCulture
  };
};