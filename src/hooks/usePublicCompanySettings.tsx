import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentProduct } from './useCurrentProduct';
import { BusinessHours, SocialMediaLinks } from './useContactInfo';

export interface PublicCompanySettings {
  id?: string;
  company_name: string;
  brand_primary_color: string;
  brand_accent_color: string;
  business_hours: BusinessHours;
  social_media: SocialMediaLinks;
  public_whatsapp_number?: string;
  public_support_email?: string;
  business_unit: string;
}

export const usePublicCompanySettings = () => {
  const currentProduct = useCurrentProduct();

  // Fetch only public company settings - safe for unauthenticated users
  const { data: publicSettings, isLoading } = useQuery({
    queryKey: ['public-company-settings', currentProduct],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_company_settings')
        .select('*')
        .eq('business_unit', currentProduct)
        .maybeSingle();

      if (error) throw error;
      return data as PublicCompanySettings;
    },
  });

  // Helper functions for public access
  const getCompanyName = () => {
    return publicSettings?.company_name || 'Guilds';
  };

  const getBrandColors = () => {
    return {
      primary: publicSettings?.brand_primary_color || 'hsl(240, 85%, 55%)',
      accent: publicSettings?.brand_accent_color || 'hsl(165, 85%, 45%)'
    };
  };

  const getBusinessHours = () => {
    return publicSettings?.business_hours || {};
  };

  const getSocialMediaLinks = () => {
    return publicSettings?.social_media || {};
  };

  const getPublicWhatsApp = () => {
    return publicSettings?.public_whatsapp_number || null;
  };

  const getPublicSupportEmail = () => {
    return publicSettings?.public_support_email || null;
  };

  return {
    publicSettings,
    isLoading,
    getCompanyName,
    getBrandColors,
    getBusinessHours,
    getSocialMediaLinks,
    getPublicWhatsApp,
    getPublicSupportEmail,
  };
};