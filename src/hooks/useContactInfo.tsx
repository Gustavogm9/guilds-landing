import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessUnit } from './useCurrentProduct';

// Specific interfaces to replace any types
export interface ContactMetadata {
  icon?: string;
  country_code?: string;
  extension?: string;
  platform?: string;
  verified?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface ContactEmail {
  email: string;
  label: string;
  is_primary: boolean;
}

export interface ContactPhone {
  phone: string;
  label: string;
  country_code?: string;
  is_primary: boolean;
}

export interface Address {
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_primary?: boolean;
  isPrimary?: boolean; // Alternative naming
}

export interface SocialMediaLinks {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
  github?: string;
  tiktok?: string;
  whatsapp?: string;
  [key: string]: string | undefined;
}

export interface BusinessHours {
  monday?: { open: string; close: string; closed?: boolean };
  tuesday?: { open: string; close: string; closed?: boolean };
  wednesday?: { open: string; close: string; closed?: boolean };
  thursday?: { open: string; close: string; closed?: boolean };
  friday?: { open: string; close: string; closed?: boolean };
  saturday?: { open: string; close: string; closed?: boolean };
  sunday?: { open: string; close: string; closed?: boolean };
  timezone?: string;
}

export interface ContactInfoItem {
  id?: string;
  type: 'email' | 'phone' | 'address' | 'social' | 'other';
  label: string;
  value: string;
  is_primary: boolean;
  is_active: boolean;
  is_public: boolean;
  metadata?: ContactMetadata;
  display_order: number;
  business_unit: string;
}

export interface CompanySettings {
  id?: string;
  company_name: string;
  support_email: string;
  whatsapp_number: string;
  contact_emails: ContactEmail[];
  contact_phones: ContactPhone[];
  addresses: Address[];
  social_media: SocialMediaLinks;
  business_hours: BusinessHours;
  response_time_hours: number;
  auto_response_message: string;
}

export const useContactInfo = (selectedProduct?: BusinessUnit) => {
  const queryClient = useQueryClient();

  // Fetch company settings
  const { data: companySettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) throw error;
      // Cast through unknown for Supabase Json compatibility
      return data as unknown as CompanySettings;
    },
  });

  // Fetch contact info items - filter by product if provided (admin context)
  const { data: contactItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['contact-info', selectedProduct],
    queryFn: async () => {
      let query = supabase
        .from('contact_info')
        .select('*')
        .eq('is_active', true);

      // Filter by business_unit if in admin context
      if (selectedProduct) {
        query = query.eq('business_unit', selectedProduct);
      }

      const { data, error } = await query.order('display_order');

      if (error) throw error;
      return data as ContactInfoItem[];
    },
  });

  // Update company settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<CompanySettings>) => {
      // Cast to unknown for Supabase compatibility
      const { data, error } = await supabase
        .from('company_settings')
        .update(settings as unknown as Record<string, unknown>)
        .eq('id', companySettings?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast.success('Configurações atualizadas com sucesso');
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
    },
  });

  // Add contact info item
  const addContactMutation = useMutation({
    mutationFn: async (item: Omit<ContactInfoItem, 'id'>) => {
      // Garantir que business_unit está definido
      const itemWithUnit = {
        ...item,
        business_unit: item.business_unit || selectedProduct || 'guilds'
      };

      const { data, error } = await supabase
        .from('contact_info')
        .insert(itemWithUnit)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast.success('Contato adicionado com sucesso');
    },
    onError: (error) => {
      console.error('Error adding contact:', error);
      toast.error('Erro ao adicionar contato');
    },
  });

  // Update contact info item
  const updateContactMutation = useMutation({
    mutationFn: async ({ id, ...item }: ContactInfoItem) => {
      const { data, error } = await supabase
        .from('contact_info')
        .update(item)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast.success('Contato atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Error updating contact:', error);
      toast.error('Erro ao atualizar contato');
    },
  });

  // Delete contact info item
  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast.success('Contato removido com sucesso');
    },
    onError: (error) => {
      console.error('Error deleting contact:', error);
      toast.error('Erro ao remover contato');
    },
  });

  // Helper functions to get specific contact types
  const getPrimaryEmail = () => {
    return contactItems.find(item => item.type === 'email' && item.is_primary)?.value ||
      companySettings?.support_email ||
      'contato@guilds.com.br';
  };

  const getPrimaryPhone = () => {
    return contactItems.find(item => item.type === 'phone' && item.is_primary)?.value ||
      companySettings?.whatsapp_number ||
      '+5511999999999';
  };

  const getSocialMediaLinks = () => {
    const socialItems = contactItems.filter(item => item.type === 'social');
    const socialObj: Record<string, string> = {};

    socialItems.forEach(item => {
      const platform = item.label.toLowerCase();
      socialObj[platform] = item.value;
    });

    return {
      ...companySettings?.social_media,
      ...socialObj
    };
  };

  const getPrimaryAddress = () => {
    const addressItem = contactItems.find(item => item.type === 'address' && item.is_primary);
    if (addressItem) {
      try {
        return JSON.parse(addressItem.value);
      } catch {
        return null;
      }
    }

    if (companySettings?.addresses && companySettings.addresses.length > 0) {
      return companySettings.addresses.find((addr) => addr.isPrimary || addr.is_primary) || companySettings.addresses[0];
    }

    return null;
  };

  const getBusinessHours = () => {
    return companySettings?.business_hours || {};
  };

  return {
    // Data
    companySettings,
    contactItems,

    // Loading states
    isLoading: settingsLoading || itemsLoading,

    // Mutations
    updateSettings: updateSettingsMutation.mutate,
    addContact: addContactMutation.mutate,
    updateContact: updateContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,

    // Mutation states
    isUpdatingSettings: updateSettingsMutation.isPending,
    isAddingContact: addContactMutation.isPending,
    isUpdatingContact: updateContactMutation.isPending,
    isDeletingContact: deleteContactMutation.isPending,

    // Helper functions
    getPrimaryEmail,
    getPrimaryPhone,
    getSocialMediaLinks,
    getPrimaryAddress,
    getBusinessHours,
  };
};