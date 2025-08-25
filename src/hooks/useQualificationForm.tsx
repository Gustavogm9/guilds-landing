import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FormField {
  id: string;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  placeholder_text?: string;
  is_required: boolean;
  options?: string[];
  field_order: number;
  validation_rules?: any;
}

export interface QualificationForm {
  id: string;
  name: string;
  title: string;
  description: string;
  thank_you_title: string;
  thank_you_message: string;
  redirect_delay: number;
  redirect_to_whatsapp: boolean;
  page_paths?: string[];
  is_active: boolean;
}

export interface CompanySettings {
  id: string;
  whatsapp_number: string;
  company_name: string;
  support_email: string;
  brand_primary_color: string;
  brand_accent_color: string;
}

export const useQualificationForm = () => {
  const [forms, setForms] = useState<QualificationForm[]>([]);
  const [activeForm, setActiveForm] = useState<QualificationForm | null>(null);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch qualification forms
  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from('qualification_forms')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setForms(data || []);
      
      // Set the first active form as default
      if (data && data.length > 0) {
        setActiveForm(data[0]);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os formulários.",
        variant: "destructive"
      });
    }
  };

  // Fetch form fields for active form
  const fetchFormFields = async (formId: string) => {
    try {
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_id', formId)
        .order('field_order', { ascending: true });

      if (error) throw error;
      setFormFields((data || []).map(field => ({
        ...field,
        field_type: field.field_type as 'text' | 'email' | 'tel' | 'textarea' | 'select'
      })));
    } catch (error) {
      console.error('Error fetching form fields:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os campos do formulário.",
        variant: "destructive"
      });
    }
  };

  // Fetch company settings
  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) throw error;
      setCompanySettings(data);
    } catch (error) {
      console.error('Error fetching company settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações da empresa.",
        variant: "destructive"
      });
    }
  };

  // Submit form data
  const submitForm = async (formData: Record<string, any>, sourcePage?: string) => {
    if (!activeForm) return false;

    try {
      // Get UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');

      const submissionData = {
        form_id: activeForm.id,
        form_data: formData,
        source_page: sourcePage || window.location.pathname,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        user_agent: navigator.userAgent,
        status: 'new'
      };

      const { error } = await supabase
        .from('qualification_submissions')
        .insert([submissionData]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Formulário enviado com sucesso. Nossa equipe entrará em contato em breve.",
      });

      return true;
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o formulário. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Get form for specific page
  const getFormForPage = (pagePath: string) => {
    return forms.find(form => 
      !form.page_paths || 
      form.page_paths.length === 0 || 
      form.page_paths.includes(pagePath)
    ) || forms[0];
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchForms(),
        fetchCompanySettings()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (activeForm?.id) {
      fetchFormFields(activeForm.id);
    }
  }, [activeForm?.id]);

  return {
    forms,
    activeForm,
    formFields,
    companySettings,
    isLoading,
    setActiveForm,
    fetchForms,
    fetchFormFields,
    fetchCompanySettings,
    submitForm,
    getFormForPage
  };
};