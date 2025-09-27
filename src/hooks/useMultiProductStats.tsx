import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductLine } from '@/contexts/MultiProductContext';

export interface MultiProductStats {
  totalContacts: number;
  contactsChange: number;
  formSubmissions: number;
  formsChange: number;
  newsletterSubscribers: number;
  newsletterChange: number;
  teamMembers: number;
  teamChange: number;
  // Product-specific stats
  guildStats: ProductStats;
  doavyaStats: ProductStats;
}

export interface ProductStats {
  leads: number;
  leadsChange: number;
  deals: number;
  dealsChange: number;
  conversionRate: number;
  avgDealValue: number;
  pipelineHealth: number;
}

export interface RecentActivity {
  id: string;
  type: 'contact' | 'newsletter' | 'team' | 'craft' | 'deal' | 'lead';
  title: string;
  description: string;
  time: string;
  product?: ProductLine;
  metadata?: Record<string, any>;
}

interface UseMultiProductStatsOptions {
  productFilter?: ProductLine;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
}

export function useMultiProductStats(options: UseMultiProductStatsOptions = {}) {
  const { productFilter = 'all', dateRange } = options;

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['multi-product-stats', productFilter, dateRange],
    queryFn: async () => {
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Apply date range filter if provided
      const effectiveStartDate = dateRange?.start || startOfCurrentMonth;
      const effectiveEndDate = dateRange?.end || now;

      // Build source filters based on product
      let sourceFilter: string[] = [];
      if (productFilter === 'guilds') {
        sourceFilter = ['website', 'qualification', 'contact_form', 'workshop'];
      } else if (productFilter === 'doavya') {
        sourceFilter = ['doavya'];
      }

      // Get current period data
      const contactsQuery = supabase
        .from('crm_contacts')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .gte('created_at', effectiveStartDate.toISOString())
        .lte('created_at', effectiveEndDate.toISOString());

      if (sourceFilter.length > 0) {
        contactsQuery.in('source', sourceFilter);
      }

      const formsQuery = supabase
        .from('qualification_submissions')
        .select('*', { count: 'exact' })
        .gte('created_at', effectiveStartDate.toISOString())
        .lte('created_at', effectiveEndDate.toISOString());

      const newsletterQuery = supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .gte('created_at', effectiveStartDate.toISOString())
        .lte('created_at', effectiveEndDate.toISOString());

      const teamQuery = supabase
        .from('team_members')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Get previous period data for comparison
      const prevContactsQuery = supabase
        .from('crm_contacts')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      if (sourceFilter.length > 0) {
        prevContactsQuery.in('source', sourceFilter);
      }

      const prevFormsQuery = supabase
        .from('qualification_submissions')
        .select('*', { count: 'exact' })
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      const prevNewsletterQuery = supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString());

      // Execute all queries
      const [
        contactsResult,
        formsResult,
        newsletterResult,
        teamResult,
        prevContactsResult,
        prevFormsResult,
        prevNewsletterResult
      ] = await Promise.all([
        contactsQuery,
        formsQuery,
        newsletterQuery,
        teamQuery,
        prevContactsQuery,
        prevFormsQuery,
        prevNewsletterQuery
      ]);

      // Check for errors
      if (contactsResult.error) throw contactsResult.error;
      if (formsResult.error) throw formsResult.error;
      if (newsletterResult.error) throw newsletterResult.error;
      if (teamResult.error) throw teamResult.error;
      if (prevContactsResult.error) throw prevContactsResult.error;
      if (prevFormsResult.error) throw prevFormsResult.error;
      if (prevNewsletterResult.error) throw prevNewsletterResult.error;

      // Calculate current values
      const totalContacts = contactsResult.count || 0;
      const formSubmissions = formsResult.count || 0;
      const newsletterSubscribers = newsletterResult.count || 0;
      const teamMembers = teamResult.count || 0;

      // Calculate previous values
      const prevContacts = prevContactsResult.count || 0;
      const prevForms = prevFormsResult.count || 0;
      const prevNewsletter = prevNewsletterResult.count || 0;

      // Calculate percentage changes
      const contactsChange = prevContacts > 0 ? ((totalContacts - prevContacts) / prevContacts) * 100 : 0;
      const formsChange = prevForms > 0 ? ((formSubmissions - prevForms) / prevForms) * 100 : 0;
      const newsletterChange = prevNewsletter > 0 ? ((newsletterSubscribers - prevNewsletter) / prevNewsletter) * 100 : 0;

      // Get product-specific stats
      const guildStats = await getProductStats('guilds', effectiveStartDate, effectiveEndDate);
      const doavyaStats = await getProductStats('doavya', effectiveStartDate, effectiveEndDate);

      return {
        totalContacts,
        contactsChange: Math.round(contactsChange),
        formSubmissions,
        formsChange: Math.round(formsChange),
        newsletterSubscribers,
        newsletterChange: Math.round(newsletterChange),
        teamMembers,
        teamChange: 0, // Team members don't change frequently
        guildStats,
        doavyaStats
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities', productFilter],
    queryFn: async () => {
      const activities: RecentActivity[] = [];

      // Build source filter based on product
      let sourceFilter: string[] = [];
      if (productFilter === 'guilds') {
        sourceFilter = ['website', 'qualification', 'contact_form', 'workshop'];
      } else if (productFilter === 'doavya') {
        sourceFilter = ['doavya'];
      }

      // Get recent qualification submissions
      const qualificationQuery = supabase
        .from('qualification_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Get recent contacts
      const contactsQuery = supabase
        .from('crm_contacts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (sourceFilter.length > 0) {
        contactsQuery.in('source', sourceFilter);
      }

      // Get recent newsletter subscriptions
      const newsletterQuery = supabase
        .from('newsletter_subscriptions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent deals
      const dealsQuery = supabase
        .from('crm_deals')
        .select('*, contact:crm_contacts(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      const [qualificationResult, contactsResult, newsletterResult, dealsResult] = await Promise.all([
        qualificationQuery,
        contactsQuery,
        newsletterQuery,
        dealsQuery
      ]);

      // Process qualification submissions
      if (qualificationResult.data) {
        qualificationResult.data.forEach(submission => {
          const formData = submission.form_data as any;
          const product = formData?.doavya_tags ? 'doavya' : 'guilds';
          if (productFilter === 'all' || productFilter === product) {
            activities.push({
              id: `qual-${submission.id}`,
              type: 'lead',
              title: 'Nova qualificação recebida',
              description: `${formData?.name || 'Lead'} interessado em ${formData?.service_interest || 'serviços'}`,
              time: formatTimeAgo(new Date(submission.created_at)),
              product,
              metadata: formData as Record<string, any> || {}
            });
          }
        });
      }

      // Process contacts
      if (contactsResult.data) {
        contactsResult.data.forEach(contact => {
          const product = (contact as any).source === 'doavya' ? 'doavya' : 'guilds';
          if (productFilter === 'all' || productFilter === product) {
            activities.push({
              id: `contact-${contact.id}`,
              type: 'contact',
              title: 'Novo contato adicionado',
              description: `${contact.name} ${contact.company ? `da ${contact.company}` : ''}`,
              time: formatTimeAgo(new Date(contact.created_at)),
              product,
              metadata: { source: (contact as any).source, tags: contact.tags }
            });
          }
        });
      }

      // Process newsletter subscriptions
      if (newsletterResult.data && (productFilter === 'all' || productFilter === 'guilds')) {
        newsletterResult.data.forEach(subscription => {
          activities.push({
            id: `newsletter-${subscription.id}`,
            type: 'newsletter',
            title: 'Nova inscrição newsletter',
            description: subscription.email,
            time: formatTimeAgo(new Date(subscription.created_at)),
            product: 'guilds'
          });
        });
      }

      // Process deals
      if (dealsResult.data) {
        dealsResult.data.forEach(deal => {
          const contact = deal.contact as any;
          const product = contact?.source === 'doavya' ? 'doavya' : 'guilds';
          if (productFilter === 'all' || productFilter === product) {
            activities.push({
              id: `deal-${deal.id}`,
              type: 'deal',
              title: 'Nova oportunidade criada',
              description: `${deal.title} - ${deal.value ? formatCurrency(deal.value) : 'Valor não definido'}`,
              time: formatTimeAgo(new Date(deal.created_at)),
              product,
              metadata: { stage: deal.stage_id, tags: deal.tags }
            });
          }
        });
      }

      // Sort by time and return top 20
      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 20);
    },
  });

  return {
    stats: stats || {
      totalContacts: 0,
      contactsChange: 0,
      formSubmissions: 0,
      formsChange: 0,
      newsletterSubscribers: 0,
      newsletterChange: 0,
      teamMembers: 0,
      teamChange: 0,
      guildStats: getEmptyProductStats(),
      doavyaStats: getEmptyProductStats()
    },
    recentActivities: recentActivities || [],
    isLoading: isLoading || activitiesLoading,
    error,
    refetch
  };
}

// Helper functions
async function getProductStats(product: ProductLine, startDate: Date, endDate: Date): Promise<ProductStats> {
  try {
    let sourceFilter: string[] = [];
    if (product === 'guilds') {
      sourceFilter = ['website', 'qualification', 'contact_form', 'workshop'];
    } else if (product === 'doavya') {
      sourceFilter = ['doavya'];
    }

    // Get leads (contacts)
    const leadsQuery = supabase
      .from('crm_contacts')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (sourceFilter.length > 0) {
      leadsQuery.in('source', sourceFilter);
    }

    // Get deals
    const dealsQuery = supabase
      .from('crm_deals')
      .select('*, contact:crm_contacts(*)')
      .eq('is_active', true)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const [leadsResult, dealsResult] = await Promise.all([leadsQuery, dealsQuery]);

    if (leadsResult.error) throw leadsResult.error;
    if (dealsResult.error) throw dealsResult.error;

    const leads = leadsResult.count || 0;
    const allDeals = dealsResult.data || [];
    
    // Filter deals by product source
    const productDeals = sourceFilter.length > 0 
      ? allDeals.filter(deal => 
          deal.contact && sourceFilter.includes((deal.contact as any).source)
        )
      : allDeals;

    const deals = productDeals.length;
    const totalDealValue = productDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    const avgDealValue = deals > 0 ? totalDealValue / deals : 0;
    const conversionRate = leads > 0 ? (deals / leads) * 100 : 0;
    const pipelineHealth = deals > 0 ? 75 : 0; // Simplified calculation

    return {
      leads,
      leadsChange: 0, // Would need previous period data
      deals,
      dealsChange: 0, // Would need previous period data
      conversionRate,
      avgDealValue,
      pipelineHealth
    };
  } catch (error) {
    console.error(`Error getting stats for ${product}:`, error);
    return getEmptyProductStats();
  }
}

function getEmptyProductStats(): ProductStats {
  return {
    leads: 0,
    leadsChange: 0,
    deals: 0,
    dealsChange: 0,
    conversionRate: 0,
    avgDealValue: 0,
    pipelineHealth: 0
  };
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'agora mesmo';
  if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d atrás`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}sem atrás`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mês atrás`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}