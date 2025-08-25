import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SEOSettings {
  id: string;
  site_name: string;
  title_template: string;
  meta_description: string;
  og_image?: string;
  twitter_handle?: string;
  google_analytics_id?: string;
  google_tag_manager_id?: string;
  facebook_pixel_id?: string;
  hotjar_id?: string;
  robots_txt_content: string;
  schema_org_organization?: any;
  canonical_base_url: string;
}

export interface PageSEO {
  id: string;
  page_path: string;
  title: string;
  meta_description: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  keywords?: string[];
  schema_org_data?: any;
  canonical_url?: string;
  no_index: boolean;
  no_follow: boolean;
}

export interface CustomTag {
  id: string;
  name: string;
  tag_type: 'head' | 'body_start' | 'body_end' | 'script' | 'meta' | 'link';
  content: string;
  position: string;
  is_active: boolean;
  page_paths?: string[];
}

export function useSEO() {
  const [seoSettings, setSEOSettings] = useState<SEOSettings | null>(null);
  const [pageSEO, setPageSEO] = useState<PageSEO[]>([]);
  const [customTags, setCustomTags] = useState<CustomTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSEOSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSEOSettings(data);
      }
    } catch (err) {
      console.error('Error fetching SEO settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const fetchPageSEO = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .select('*')
        .order('page_path');

      if (error) throw error;
      setPageSEO(data || []);
    } catch (err) {
      console.error('Error fetching page SEO:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const fetchCustomTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('custom_tags')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCustomTags((data || []) as CustomTag[]);
    } catch (err) {
      console.error('Error fetching custom tags:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSEOSettings(),
        fetchPageSEO(),
        fetchCustomTags()
      ]);
      setLoading(false);
    };

    loadData();
  }, [fetchSEOSettings, fetchPageSEO, fetchCustomTags]);

  const getPageSEOByPath = useCallback((path: string): PageSEO | null => {
    return pageSEO.find(page => page.page_path === path) || null;
  }, [pageSEO]);

  const getCustomTagsForPage = useCallback((path: string): CustomTag[] => {
    return customTags.filter(tag => 
      !tag.page_paths || 
      tag.page_paths.length === 0 || 
      tag.page_paths.includes(path)
    );
  }, [customTags]);

  const updateSEOSettings = useCallback(async (updates: Partial<SEOSettings>) => {
    try {
      if (!seoSettings?.id) return;

      const { data, error } = await supabase
        .from('seo_settings')
        .update(updates)
        .eq('id', seoSettings.id)
        .select()
        .single();

      if (error) throw error;
      setSEOSettings(data);
      return data;
    } catch (err) {
      console.error('Error updating SEO settings:', err);
      throw err;
    }
  }, [seoSettings?.id]);

  const upsertPageSEO = useCallback(async (pageSEOData: Omit<PageSEO, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('page_seo')
        .upsert(pageSEOData, { 
          onConflict: 'page_path',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh page SEO data
      await fetchPageSEO();
      return data;
    } catch (err) {
      console.error('Error upserting page SEO:', err);
      throw err;
    }
  }, [fetchPageSEO]);

  const createCustomTag = useCallback(async (tagData: Omit<CustomTag, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('custom_tags')
        .insert(tagData)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh custom tags data
      await fetchCustomTags();
      return data;
    } catch (err) {
      console.error('Error creating custom tag:', err);
      throw err;
    }
  }, [fetchCustomTags]);

  const updateCustomTag = useCallback(async (id: string, updates: Partial<CustomTag>) => {
    try {
      const { data, error } = await supabase
        .from('custom_tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh custom tags data
      await fetchCustomTags();
      return data;
    } catch (err) {
      console.error('Error updating custom tag:', err);
      throw err;
    }
  }, [fetchCustomTags]);

  const deleteCustomTag = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh custom tags data
      await fetchCustomTags();
    } catch (err) {
      console.error('Error deleting custom tag:', err);
      throw err;
    }
  }, [fetchCustomTags]);

  return {
    seoSettings,
    pageSEO,
    customTags,
    loading,
    error,
    getPageSEOByPath,
    getCustomTagsForPage,
    updateSEOSettings,
    upsertPageSEO,
    createCustomTag,
    updateCustomTag,
    deleteCustomTag,
    refetch: useCallback(() => {
      fetchSEOSettings();
      fetchPageSEO();
      fetchCustomTags();
    }, [fetchSEOSettings, fetchPageSEO, fetchCustomTags])
  };
}