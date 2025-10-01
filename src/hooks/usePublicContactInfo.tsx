import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentProduct } from './useCurrentProduct';

export interface PublicContactInfo {
  id: string;
  type: 'email' | 'phone' | 'address' | 'social' | 'other';
  label: string;
  value: string;
  display_order: number;
  business_unit: string;
}

export const usePublicContactInfo = () => {
  const currentProduct = useCurrentProduct();

  // Fetch only public contact info items - this query will only work for publicly accessible data
  const { data: publicContacts = [], isLoading } = useQuery({
    queryKey: ['public-contact-info', currentProduct],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('id, type, label, value, display_order, business_unit')
        .eq('is_active', true)
        .eq('is_public', true)
        .eq('business_unit', currentProduct)
        .order('display_order');
      
      if (error) throw error;
      return data as PublicContactInfo[];
    },
  });

  // Helper functions for public access
  const getPublicSocialLinks = () => {
    const socialItems = publicContacts.filter(item => item.type === 'social');
    const socialObj: Record<string, string> = {};
    
    socialItems.forEach(item => {
      const platform = item.label.toLowerCase();
      socialObj[platform] = item.value;
    });
    
    return socialObj;
  };

  const getPublicEmail = () => {
    return publicContacts.find(item => item.type === 'email')?.value || null;
  };

  const getPublicPhone = () => {
    return publicContacts.find(item => item.type === 'phone')?.value || null;
  };

  const getPublicAddress = () => {
    const addressItem = publicContacts.find(item => item.type === 'address');
    if (addressItem) {
      try {
        return JSON.parse(addressItem.value);
      } catch {
        return addressItem.value;
      }
    }
    return null;
  };

  return {
    publicContacts,
    isLoading,
    getPublicSocialLinks,
    getPublicEmail,
    getPublicPhone,
    getPublicAddress,
  };
};