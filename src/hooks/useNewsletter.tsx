import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '@/hooks/useConfetti';

interface NewsletterSubscription {
  id: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced';
  source_page?: string | null;
  created_at: string;
  confirmed_at?: string | null;
  confirmation_token?: string | null;
  unsubscribed_at?: string | null;
  updated_at?: string;
  ip_address?: unknown;
  user_agent?: string | null;
  utm_campaign?: string | null;
  utm_medium?: string | null;
  utm_source?: string | null;
}

interface UseNewsletterReturn {
  subscribe: (email: string, sourcePage?: string) => Promise<boolean>;
  unsubscribe: (email: string) => Promise<boolean>;
  getSubscriptionStatus: (email: string) => Promise<string | null>;
  isLoading: boolean;
  subscriptions: NewsletterSubscription[];
  fetchSubscriptions: () => Promise<void>;
  getStats: () => Promise<{ total: number; active: number; pending: number }>;
}

export function useNewsletter(): UseNewsletterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const { toast } = useToast();
  const { celebrateFormSubmission } = useConfetti();

  const subscribe = async (email: string, sourcePage?: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "E-mail inválido",
          description: "Por favor, insira um e-mail válido.",
          variant: "destructive",
        });
        return false;
      }

      // Check if already subscribed
      const { data: existingSubscription, error: checkError } = await supabase
        .from('newsletter_subscriptions')
        .select('id, status')
        .eq('email', email)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingSubscription) {
        if (existingSubscription.status === 'active') {
          toast({
            title: "Já inscrito!",
            description: "Este e-mail já está inscrito na nossa newsletter.",
          });
          return false;
        } else if (existingSubscription.status === 'pending') {
          toast({
            title: "Confirmação pendente",
            description: "Verifique seu e-mail para confirmar a inscrição.",
          });
          return false;
        }
      }

      // Get current page path and UTM parameters
      const currentPath = window.location.pathname;
      const urlParams = new URLSearchParams(window.location.search);
      
      // Insert or update subscription
      const subscriptionData = {
        email,
        status: 'pending' as const,
        source_page: sourcePage || currentPath,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        ip_address: null, // Will be set by edge function
        user_agent: navigator.userAgent,
      };

      const { error: insertError } = await supabase
        .from('newsletter_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'email',
        });

      if (insertError) throw insertError;

      // Trigger confetti celebration
      celebrateFormSubmission();

      toast({
        title: "Inscrição realizada!",
        description: "Verifique seu e-mail para confirmar a inscrição na newsletter.",
      });

      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
        })
        .eq('email', email);

      if (error) throw error;

      toast({
        title: "Descadastro realizado",
        description: "Você foi removido da nossa newsletter.",
      });

      return true;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      toast({
        title: "Erro no descadastro",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionStatus = async (email: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('status')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data?.status || null;
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }
  };

  const fetchSubscriptions = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions((data as NewsletterSubscription[]) || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: "Erro ao carregar inscrições",
        description: "Não foi possível carregar as inscrições da newsletter.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.filter(sub => sub.status === 'active').length || 0,
        pending: data?.filter(sub => sub.status === 'pending').length || 0,
      };

      return stats;
    } catch (error) {
      console.error('Error getting newsletter stats:', error);
      return { total: 0, active: 0, pending: 0 };
    }
  };

  return {
    subscribe,
    unsubscribe,
    getSubscriptionStatus,
    isLoading,
    subscriptions,
    fetchSubscriptions,
    getStats,
  };
}