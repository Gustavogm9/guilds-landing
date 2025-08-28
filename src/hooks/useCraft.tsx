import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CraftStage {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon_name: string;
  display_order: number;
}

interface CraftIdea {
  id: string;
  slug: string;
  title: string;
  status: string;
  current_stage: string;
  problem_thesis: string;
  target_persona: string;
  pain_points: string[];
  proposed_solution: string;
  mvp_description: string;
  business_model: string;
  revenue_streams: string[];
  risk_assessment: string;
  development_roadmap: string;
  ideal_partners: string[];
  required_skills: string[];
  estimated_timeline: string;
  estimated_investment: string;
  next_steps: string;
  is_featured: boolean;
  meta_description: string;
  keywords: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
  stage?: CraftStage;
}

interface PartnershipInquiry {
  idea_id?: string;
  partner_name: string;
  partner_email: string;
  company?: string;
  partner_type: string;
  message: string;
  skills_offered?: string[];
  investment_capacity?: string;
  portfolio_url?: string;
  source_page?: string;
}

export const useCraft = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch craft stages
  const { data: stages = [], isLoading: stagesLoading } = useQuery({
    queryKey: ['craft-stages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craft_stages')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as CraftStage[];
    }
  });

  // Fetch craft ideas
  const { data: ideas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ['craft-ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craft_ideas')
        .select(`
          *,
          stage:current_stage(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CraftIdea[];
    }
  });

  // Fetch featured ideas
  const { data: featuredIdeas = [] } = useQuery({
    queryKey: ['craft-ideas-featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craft_ideas')
        .select(`
          *,
          stage:current_stage(*)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CraftIdea[];
    }
  });

  // Fetch single idea by slug
  const getIdeaBySlug = async (slug: string) => {
    const { data, error } = await supabase
      .from('craft_ideas')
      .select(`
        *,
        stage:current_stage(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data as CraftIdea;
  };

  // Submit partnership inquiry
  const submitPartnershipInquiry = useMutation({
    mutationFn: async (inquiry: PartnershipInquiry) => {
      const { data, error } = await supabase
        .from('craft_partnership_inquiries')
        .insert({
          ...inquiry,
          source_page: window.location.pathname,
          ip_address: undefined, // Will be set by database
          user_agent: navigator.userAgent
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Interesse enviado!",
        description: "Nossa equipe entrará em contato em breve para discutir a parceria.",
      });
      queryClient.invalidateQueries({ queryKey: ['craft-partnership-inquiries'] });
    },
    onError: (error) => {
      console.error('Error submitting partnership inquiry:', error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar seu interesse. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  return {
    stages,
    ideas,
    featuredIdeas,
    stagesLoading,
    ideasLoading,
    getIdeaBySlug,
    submitPartnershipInquiry: submitPartnershipInquiry.mutate,
    isSubmittingPartnership: submitPartnershipInquiry.isPending
  };
};