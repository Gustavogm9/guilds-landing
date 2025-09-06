import { supabase } from '@/integrations/supabase/client';

// Função para automaticamente criar contatos no CRM a partir de diferentes fontes
export class LeadAutomation {
  
  static async createContactFromNewsletter(email: string, utmData?: any) {
    try {
      const { data, error } = await supabase.rpc('create_contact_from_lead_source', {
        p_name: email.split('@')[0], // Nome temporário baseado no email
        p_email: email,
        p_source: 'newsletter',
        p_source_data: {
          utm_source: utmData?.utm_source,
          utm_medium: utmData?.utm_medium,
          utm_campaign: utmData?.utm_campaign,
          subscribed_at: new Date().toISOString()
        },
        p_pipeline_name: 'Inbound Marketing'
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar contato da newsletter:', error);
      throw error;
    }
  }

  static async createContactFromQualificationForm(formData: any) {
    try {
      // Extrair dados do formulário de qualificação
      const contactData = formData.form_data || {};
      
      const { data, error } = await supabase.rpc('create_contact_from_lead_source', {
        p_name: contactData.name || contactData.nome || 'Lead Qualificado',
        p_email: contactData.email,
        p_phone: contactData.phone || contactData.telefone,
        p_company: contactData.company || contactData.empresa,
        p_source: 'qualification',
        p_source_data: {
          form_id: formData.form_id,
          project_type: contactData.project_type || contactData.tipo_projeto,
          budget: contactData.budget || contactData.orcamento,
          timeline: contactData.timeline || contactData.prazo,
          submitted_at: formData.created_at,
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign
        },
        p_pipeline_name: 'Qualificação'
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar contato do formulário de qualificação:', error);
      throw error;
    }
  }

  static async createContactFromWorkshopEnrollment(enrollmentData: any) {
    try {
      const { data, error } = await supabase.rpc('create_contact_from_lead_source', {
        p_name: enrollmentData.name,
        p_email: enrollmentData.email,
        p_phone: enrollmentData.phone,
        p_company: enrollmentData.company,
        p_source: 'workshop',
        p_source_data: {
          workshop_id: enrollmentData.workshop_id,
          experience_level: enrollmentData.experience_level,
          expectations: enrollmentData.expectations,
          preferred_modality: enrollmentData.preferred_modality,
          enrolled_at: enrollmentData.created_at,
          utm_source: enrollmentData.utm_source,
          utm_medium: enrollmentData.utm_medium,
          utm_campaign: enrollmentData.utm_campaign
        },
        p_pipeline_name: 'Educacional'
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar contato do enrollment de workshop:', error);
      throw error;
    }
  }

  static async createContactFromContactForm(contactData: any) {
    try {
      const { data, error } = await supabase.rpc('create_contact_from_lead_source', {
        p_name: contactData.name || contactData.nome,
        p_email: contactData.email,
        p_phone: contactData.phone || contactData.telefone,
        p_company: contactData.company || contactData.empresa,
        p_source: 'contact_form',
        p_source_data: {
          message: contactData.message || contactData.mensagem,
          subject: contactData.subject || contactData.assunto,
          page_source: contactData.page_source || '/contact',
          submitted_at: new Date().toISOString(),
          utm_source: contactData.utm_source,
          utm_medium: contactData.utm_medium,
          utm_campaign: contactData.utm_campaign
        },
        p_pipeline_name: 'Contato Direto'
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar contato do formulário de contato:', error);
      throw error;
    }
  }

  // Função para atualizar score de engajamento baseado em atividades
  static async updateEngagementScore(contactId: string, activity: string) {
    try {
      const scoreIncrement = this.getScoreIncrement(activity);
      
      // First get current score
      const { data: currentContact } = await supabase
        .from('crm_contacts')
        .select('engagement_score')
        .eq('id', contactId)
        .single();
      
      const currentScore = currentContact?.engagement_score || 0;
      const newScore = currentScore + scoreIncrement;
      
      const { error } = await supabase
        .from('crm_contacts')
        .update({ 
          engagement_score: newScore,
          last_interaction_date: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar score de engajamento:', error);
    }
  }

  private static getScoreIncrement(activity: string): number {
    const scoreMap = {
      'newsletter_subscription': 5,
      'form_submission': 15,
      'workshop_enrollment': 20,
      'qualification_form': 25,
      'contact_form': 20,
      'email_reply': 10,
      'website_visit': 2,
      'content_download': 8
    };

    return scoreMap[activity] || 1;
  }

  // Função para calcular ICP score automaticamente
  static async calculateICPScore(contactData: any): Promise<number> {
    let score = 0;
    
    // Critérios de ICP (exemplo - ajustar conforme necessário)
    if (contactData.company) score += 20;
    if (contactData.job_title?.toLowerCase().includes('cto') || 
        contactData.job_title?.toLowerCase().includes('diretor') ||
        contactData.job_title?.toLowerCase().includes('gerente')) score += 25;
    
    if (contactData.company_size === 'medium' || contactData.company_size === 'large') score += 20;
    if (contactData.budget_range && parseFloat(contactData.budget_range.replace(/[^\d]/g, '')) > 10000) score += 15;
    if (contactData.industry === 'technology' || contactData.industry === 'financial') score += 10;
    if (contactData.lead_source === 'qualification' || contactData.lead_source === 'referral') score += 10;

    return Math.min(score, 100); // Cap no máximo 100%
  }
}

// Hook para usar a automação de leads
export function useLeadAutomation() {
  const handleNewsletterSubscription = async (email: string, utmData?: any) => {
    return LeadAutomation.createContactFromNewsletter(email, utmData);
  };

  const handleQualificationSubmission = async (formData: any) => {
    return LeadAutomation.createContactFromQualificationForm(formData);
  };

  const handleWorkshopEnrollment = async (enrollmentData: any) => {
    return LeadAutomation.createContactFromWorkshopEnrollment(enrollmentData);
  };

  const handleContactForm = async (contactData: any) => {
    return LeadAutomation.createContactFromContactForm(contactData);
  };

  const updateEngagement = async (contactId: string, activity: string) => {
    return LeadAutomation.updateEngagementScore(contactId, activity);
  };

  return {
    handleNewsletterSubscription,
    handleQualificationSubmission,
    handleWorkshopEnrollment,
    handleContactForm,
    updateEngagement
  };
}