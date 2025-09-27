import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ProductLine = 'guilds' | 'doavya' | 'all';

export interface ProductFilter {
  product: ProductLine;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  source?: string[];
  tags?: string[];
}

export interface ProductMetrics {
  totalLeads: number;
  conversionRate: number;
  activeDeals: number;
  totalValue: number;
  avgDealSize: number;
  pipelineHealth: number;
}

export interface ProductConfig {
  id: string;
  name: string;
  slug: ProductLine;
  color: string;
  isActive: boolean;
  pipelines: string[];
  defaultPipeline?: string;
  leadSources: string[];
  automationTemplates: string[];
  settings: Record<string, any>;
}

interface MultiProductContextType {
  // Current filter state
  currentFilter: ProductFilter;
  setCurrentFilter: (filter: ProductFilter) => void;
  
  // Product configurations
  products: ProductConfig[];
  productsLoading: boolean;
  
  // Active product
  activeProduct: ProductLine;
  setActiveProduct: (product: ProductLine) => void;
  
  // Metrics
  getMetricsByProduct: (product: ProductLine) => Promise<ProductMetrics>;
  
  // Utilities
  getProductConfig: (product: ProductLine) => ProductConfig | null;
  isProductActive: (product: ProductLine) => boolean;
}

const MultiProductContext = createContext<MultiProductContextType | undefined>(undefined);

export const useMultiProduct = () => {
  const context = useContext(MultiProductContext);
  if (context === undefined) {
    throw new Error('useMultiProduct must be used within a MultiProductProvider');
  }
  return context;
};

interface MultiProductProviderProps {
  children: ReactNode;
}

export const MultiProductProvider: React.FC<MultiProductProviderProps> = ({ children }) => {
  const [activeProduct, setActiveProduct] = useState<ProductLine>('all');
  const [currentFilter, setCurrentFilter] = useState<ProductFilter>({
    product: 'all',
    dateRange: { start: null, end: null }
  });

  // Default product configurations
  const defaultProducts: ProductConfig[] = [
    {
      id: 'guilds-main',
      name: 'Guilds',
      slug: 'guilds',
      color: 'hsl(240, 85%, 55%)',
      isActive: true,
      pipelines: ['Inbound Marketing', 'Direct Sales'],
      defaultPipeline: 'Inbound Marketing',
      leadSources: ['website', 'qualification', 'contact_form', 'workshop'],
      automationTemplates: ['welcome_guilds', 'proposal_guilds', 'followup_guilds'],
      settings: {
        whatsapp: '+5511999999999',
        email: 'contato@guilds.com.br',
        brandColors: {
          primary: 'hsl(240, 85%, 55%)',
          accent: 'hsl(165, 85%, 45%)'
        }
      }
    },
    {
      id: 'doavya-partner',
      name: 'Doavya',
      slug: 'doavya',
      color: 'hsl(290, 85%, 55%)',
      isActive: true,
      pipelines: ['Doavya Partnership'],
      defaultPipeline: 'Doavya Partnership',
      leadSources: ['doavya'],
      automationTemplates: ['welcome_doavya', 'proposal_doavya', 'followup_doavya'],
      settings: {
        whatsapp: '+5511999999999',
        email: 'parceiros@guilds.com.br',
        brandColors: {
          primary: 'hsl(290, 85%, 55%)',
          accent: 'hsl(320, 85%, 45%)'
        }
      }
    }
  ];

  // For now, use default products (later can be fetched from database)
  const { data: products = defaultProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['product-configs'],
    queryFn: async () => {
      // In the future, fetch from database
      // For now, return default configurations
      return defaultProducts;
    }
  });

  // Get metrics by product
  const getMetricsByProduct = async (product: ProductLine): Promise<ProductMetrics> => {
    try {
      // Build filters based on product
      let sourceFilter: string[] = [];
      if (product === 'guilds') {
        sourceFilter = ['website', 'qualification', 'contact_form', 'workshop'];
      } else if (product === 'doavya') {
        sourceFilter = ['doavya'];
      } else {
        sourceFilter = []; // all sources
      }

      // Get leads data
      const leadsQuery = supabase
        .from('crm_contacts')
        .select('*', { count: 'exact' })
        .eq('is_active', true);
      
      if (sourceFilter.length > 0) {
        leadsQuery.in('source', sourceFilter);
      }

      // Get deals data
      const dealsQuery = supabase
        .from('crm_deals')
        .select('*, contact:crm_contacts(*)')
        .eq('is_active', true);

      const [leadsResult, dealsResult] = await Promise.all([
        leadsQuery,
        dealsQuery
      ]);

      if (leadsResult.error) throw leadsResult.error;
      if (dealsResult.error) throw dealsResult.error;

      const totalLeads = leadsResult.count || 0;
      const allDeals = dealsResult.data || [];
      
      // Filter deals by product source
      const productDeals = sourceFilter.length > 0 
        ? allDeals.filter(deal => 
            deal.contact && sourceFilter.includes((deal.contact as any).source)
          )
        : allDeals;

      const activeDeals = productDeals.length;
      const totalValue = productDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
      const avgDealSize = activeDeals > 0 ? totalValue / activeDeals : 0;
      const conversionRate = totalLeads > 0 ? (activeDeals / totalLeads) * 100 : 0;
      const pipelineHealth = productDeals.length > 0 ? 75 : 0; // Simplified calculation

      return {
        totalLeads,
        conversionRate,
        activeDeals,
        totalValue,
        avgDealSize,
        pipelineHealth
      };
    } catch (error) {
      console.error('Error fetching product metrics:', error);
      return {
        totalLeads: 0,
        conversionRate: 0,
        activeDeals: 0,
        totalValue: 0,
        avgDealSize: 0,
        pipelineHealth: 0
      };
    }
  };

  // Utility functions
  const getProductConfig = (product: ProductLine): ProductConfig | null => {
    if (product === 'all') return null;
    return products.find(p => p.slug === product) || null;
  };

  const isProductActive = (product: ProductLine): boolean => {
    if (product === 'all') return true;
    const config = getProductConfig(product);
    return config?.isActive || false;
  };

  return (
    <MultiProductContext.Provider
      value={{
        currentFilter,
        setCurrentFilter,
        products,
        productsLoading,
        activeProduct,
        setActiveProduct,
        getMetricsByProduct,
        getProductConfig,
        isProductActive
      }}
    >
      {children}
    </MultiProductContext.Provider>
  );
};