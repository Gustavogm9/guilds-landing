import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSecurityLogger } from './useSecurityLogger';
import { toast } from '@/hooks/use-toast';

export interface WorkshopEnrollmentData {
  workshop_id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  experience_level?: string;
  expectations?: string;
  preferred_modality?: string;
  source_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export const useWorkshopEnrollment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { logSecurityEvent } = useSecurityLogger();

  const enrollInWorkshop = async (enrollmentData: WorkshopEnrollmentData): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      // Get IP address for rate limiting
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();

      // Prepare data with security fields
      const submissionData = {
        ...enrollmentData,
        ip_address: ip,
        user_agent: navigator.userAgent,
        honeypot_field: null, // Honeypot field - should always be null
      };

      const { data, error } = await supabase
        .from('workshop_enrollments')
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        // Log the error for security monitoring
        await logSecurityEvent({
          event_type: 'workshop_enrollment_error',
          details: {
            error: error.message,
            workshop_id: enrollmentData.workshop_id,
            email: enrollmentData.email
          }
        });

        // Check for specific error types
        if (error.message.includes('rate limit')) {
          toast({
            title: "Muitos envios",
            description: "Você atingiu o limite de inscrições. Tente novamente mais tarde.",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid email')) {
          toast({
            title: "Email inválido",
            description: "Por favor, insira um email válido.",
            variant: "destructive",
          });
        } else if (error.message.includes('honeypot')) {
          toast({
            title: "Erro de validação",
            description: "Submissão inválida detectada.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro na inscrição",
            description: "Não foi possível realizar a inscrição. Tente novamente.",
            variant: "destructive",
          });
        }
        
        return false;
      }

      // Log successful enrollment
      await logSecurityEvent({
        event_type: 'workshop_enrollment_success',
        details: {
          enrollment_id: data.id,
          workshop_id: enrollmentData.workshop_id,
          email: enrollmentData.email
        }
      });

      toast({
        title: "Inscrição realizada!",
        description: "Sua inscrição foi enviada com sucesso. Nossa equipe entrará em contato em breve.",
      });

      return true;
    } catch (error: any) {
      await logSecurityEvent({
        event_type: 'workshop_enrollment_exception',
        details: {
          error: error.message,
          workshop_id: enrollmentData.workshop_id
        }
      });

      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    enrollInWorkshop,
    isSubmitting
  };
};