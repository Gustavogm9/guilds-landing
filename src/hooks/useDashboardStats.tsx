import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalContacts: number;
  contactsChange: number;
  newsletterSubscribers: number;
  newsletterChange: number;
  formSubmissions: number;
  formsChange: number;
  teamMembers: number;
  teamChange: number;
}

interface RecentActivity {
  id: string;
  type: 'contact' | 'newsletter' | 'team' | 'craft';
  title: string;
  description: string;
  time: string;
  created_at: string;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    contactsChange: 0,
    newsletterSubscribers: 0,
    newsletterChange: 0,
    formSubmissions: 0,
    formsChange: 0,
    teamMembers: 0,
    teamChange: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current month dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Parallel queries for better performance
      const [
        qualificationSubmissionsResult,
        newsletterSubscriptionsResult,
        teamMembersResult,
      ] = await Promise.all([
        // Qualification submissions
        supabase
          .from('qualification_submissions')
          .select('created_at, status'),
        
        // Newsletter subscriptions  
        supabase
          .from('newsletter_subscriptions')
          .select('created_at, status'),

        // Team members
        supabase
          .from('team_members')
          .select('created_at, is_active'),
      ]);

      if (qualificationSubmissionsResult.error) throw qualificationSubmissionsResult.error;
      if (newsletterSubscriptionsResult.error) throw newsletterSubscriptionsResult.error;
      if (teamMembersResult.error) throw teamMembersResult.error;

      // Calculate stats
      const submissions = qualificationSubmissionsResult.data || [];
      const newsletters = newsletterSubscriptionsResult.data || [];
      const team = teamMembersResult.data || [];

      // Current month counts
      const currentSubmissions = submissions.filter(s => 
        new Date(s.created_at) >= currentMonthStart
      ).length;
      
      const currentNewsletters = newsletters.filter(n => 
        new Date(n.created_at) >= currentMonthStart && n.status === 'active'
      ).length;

      const activeTeam = team.filter(t => t.is_active).length;

      // Previous month counts for comparison
      const lastSubmissions = submissions.filter(s => {
        const date = new Date(s.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd;
      }).length;

      const lastNewsletters = newsletters.filter(n => {
        const date = new Date(n.created_at);
        return date >= lastMonthStart && date <= lastMonthEnd && n.status === 'active';
      }).length;

      // Calculate percentage changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      setStats({
        totalContacts: submissions.length,
        contactsChange: calculateChange(currentSubmissions, lastSubmissions),
        newsletterSubscribers: newsletters.filter(n => n.status === 'active').length,
        newsletterChange: calculateChange(currentNewsletters, lastNewsletters),
        formSubmissions: currentSubmissions,
        formsChange: calculateChange(currentSubmissions, lastSubmissions),
        teamMembers: activeTeam,
        teamChange: 0, // Team changes are less frequent
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Erro ao carregar estatísticas do dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      // Get recent submissions
      const { data: submissions } = await supabase
        .from('qualification_submissions')
        .select('id, created_at, form_data')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent newsletter subscriptions
      const { data: newsletters } = await supabase
        .from('newsletter_subscriptions')
        .select('id, created_at, email')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

      // Get recent team updates
      const { data: teamUpdates } = await supabase
        .from('team_members')
        .select('id, created_at, updated_at, name')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(3);

      // Get recent craft inquiries
      const { data: craftInquiries } = await supabase
        .from('craft_partnership_inquiries')
        .select('id, created_at, partner_name')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities: RecentActivity[] = [];

      // Process submissions
      submissions?.forEach(sub => {
        const formData = sub.form_data as any;
        const name = formData?.nome || formData?.name || 'Usuário';
        activities.push({
          id: `sub-${sub.id}`,
          type: 'contact',
          title: 'Nova qualificação recebida',
          description: `${name} enviou formulário`,
          time: formatTimeAgo(sub.created_at),
          created_at: sub.created_at,
        });
      });

      // Process newsletters
      newsletters?.forEach(news => {
        activities.push({
          id: `news-${news.id}`,
          type: 'newsletter',
          title: 'Nova inscrição newsletter',
          description: `${news.email} se inscreveu`,
          time: formatTimeAgo(news.created_at),
          created_at: news.created_at,
        });
      });

      // Process team updates
      teamUpdates?.forEach(team => {
        if (team.updated_at !== team.created_at) {
          activities.push({
            id: `team-${team.id}`,
            type: 'team',
            title: 'Perfil da equipe atualizado',
            description: `${team.name} atualizou informações`,
            time: formatTimeAgo(team.updated_at),
            created_at: team.updated_at,
          });
        }
      });

      // Process craft inquiries
      craftInquiries?.forEach(craft => {
        activities.push({
          id: `craft-${craft.id}`,
          type: 'craft',
          title: 'Nova consulta de parceria',
          description: `${craft.partner_name} enviou proposta`,
          time: formatTimeAgo(craft.created_at),
          created_at: craft.created_at,
        });
      });

      // Sort by most recent and limit to 8
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivities(activities.slice(0, 8));

    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const refetch = async () => {
    await Promise.all([fetchStats(), fetchRecentActivities()]);
  };

  useEffect(() => {
    refetch();
    
    // Auto refresh every 5 minutes
    const interval = setInterval(refetch, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    recentActivities,
    isLoading,
    error,
    refetch,
  };
}