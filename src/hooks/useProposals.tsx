import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Proposal {
  id: string;
  proposal_number: string;
  deal_id: string;
  contact_id: string;
  template_id: string;
  title: string;
  status: 'draft' | 'internal_review' | 'sent' | 'negotiation' | 'approved' | 'rejected' | 'expired';
  current_version: number;
  flags: {
    partnership?: boolean;
    whitelabel?: boolean;
    maintenanceEnabled?: boolean;
  };
  valid_until: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProposalVersion {
  id: string;
  proposal_id: string;
  version_number: number;
  sections: any;
  variables: any;
  pricing: any;
  pdf_url?: string;
  docx_url?: string;
  published_url?: string;
  published_token?: string;
  published_expires_at?: string;
  created_by?: string;
  created_at: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  description?: string;
  business_unit?: string;
  schema: any;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingCatalogItem {
  id: string;
  name: string;
  category: 'maintenance' | 'partnership' | 'whitelabel';
  value: number;
  currency: string;
  benefits: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export const useProposals = () => {
  const queryClient = useQueryClient();

  // Fetch all proposals
  const { data: proposals, isLoading: proposalsLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Proposal[];
    },
  });

  // Fetch proposals by deal
  const useProposalsByDeal = (dealId: string) => {
    return useQuery({
      queryKey: ['proposals', 'deal', dealId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('deal_id', dealId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Proposal[];
      },
      enabled: !!dealId,
    });
  };

  // Fetch single proposal
  const useProposal = (proposalId: string) => {
    return useQuery({
      queryKey: ['proposals', proposalId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('proposals')
          .select('*')
          .eq('id', proposalId)
          .single();
        
        if (error) throw error;
        return data as Proposal;
      },
      enabled: !!proposalId,
    });
  };

  // Fetch versions
  const useProposalVersions = (proposalId: string) => {
    return useQuery({
      queryKey: ['proposal_versions', proposalId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('proposal_versions')
          .select('*')
          .eq('proposal_id', proposalId)
          .order('version_number', { ascending: false });
        
        if (error) throw error;
        return data as ProposalVersion[];
      },
      enabled: !!proposalId,
    });
  };

  // Fetch templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['proposal_templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as ProposalTemplate[];
    },
  });

  // Fetch pricing catalog
  const { data: pricingCatalog, isLoading: pricingLoading } = useQuery({
    queryKey: ['proposal_pricing_catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_pricing_catalog')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data as PricingCatalogItem[];
    },
  });

  // Create proposal
  const createProposal = useMutation({
    mutationFn: async (proposal: Partial<Proposal>) => {
      const { data, error } = await supabase
        .from('proposals')
        .insert([proposal as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      toast({ title: 'Proposta criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar proposta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update proposal
  const updateProposal = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Proposal> & { id: string }) => {
      const { data, error } = await supabase
        .from('proposals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['proposals', variables.id] });
      toast({ title: 'Proposta atualizada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar proposta',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create version
  const createVersion = useMutation({
    mutationFn: async (version: Partial<ProposalVersion>) => {
      const { data, error } = await supabase
        .from('proposal_versions')
        .insert([version as any])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal_versions', variables.proposal_id] });
      toast({ title: 'Nova versão criada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar versão',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    proposals,
    proposalsLoading,
    useProposalsByDeal,
    useProposal,
    useProposalVersions,
    templates,
    templatesLoading,
    pricingCatalog,
    pricingLoading,
    createProposal,
    updateProposal,
    createVersion,
  };
};
