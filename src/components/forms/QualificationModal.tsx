import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useQualificationForm } from '@/hooks/useQualificationForm';
import { useConfetti } from '@/hooks/useConfetti';
import { useRecaptcha } from '@/hooks/useRecaptcha';
import { LGPDNotice } from '@/components/legal/LGPDNotice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';
import { usePublicCompanySettings } from '@/hooks/usePublicCompanySettings';
import { useLocalizedNavigation } from '@/hooks/useLocalizedNavigation';

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePage?: string;
}

export const QualificationModal = ({ isOpen, onClose, sourcePage }: QualificationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { activeForm, formFields, submitForm } = useQualificationForm();
  const { publicSettings } = usePublicCompanySettings();
  const { celebrateFormSubmission } = useConfetti();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  // Create dynamic schema based on form fields + strategic fields
  const createFormSchema = () => {
    const schemaFields: Record<string, any> = {};

    formFields.forEach(field => {
      let fieldSchema;

      switch (field.field_type) {
        case 'email':
          fieldSchema = z.string().email('E-mail inválido');
          break;
        case 'tel':
          fieldSchema = z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos');
          break;
        case 'textarea':
          fieldSchema = z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres');
          break;
        default:
          fieldSchema = z.string().min(2, 'Campo deve ter pelo menos 2 caracteres');
      }

      if (!field.is_required) {
        fieldSchema = fieldSchema.optional().or(z.literal(''));
      }

      schemaFields[field.field_name] = fieldSchema;
    });

    // Adicionar campos estratégicos de qualificação (mapped to CRM fields)
    schemaFields.cargo = z.string().optional().or(z.literal('')); // → job_title
    schemaFields.industry = z.string().optional().or(z.literal('')); // → industry
    schemaFields.tamanho_empresa = z.string().optional().or(z.literal('')); // → company_size
    schemaFields.orcamento = z.string().optional().or(z.literal('')); // → budget_range
    schemaFields.prazo = z.string().optional().or(z.literal('')); // → decision_timeline
    schemaFields.autoridade_decisao = z.string().optional().or(z.literal('')); // → decision_authority

    return z.object(schemaFields);
  };

  type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      ...formFields.reduce((acc, field) => {
        acc[field.field_name] = '';
        return acc;
      }, {} as Record<string, string>),
      cargo: '',
      industry: '',
      tamanho_empresa: '',
      orcamento: '',
      prazo: '',
      autoridade_decisao: ''
    }
  });

  const onSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    
    try {
      const success = await submitForm(data, sourcePage);
      
      if (success) {
        setIsSubmitted(true);
        celebrateFormSubmission();
        
        // Redirect after delay
        setTimeout(() => {
          onClose();
          navigate(getLocalizedPath('/obrigado'));
        }, activeForm?.redirect_delay ? activeForm.redirect_delay * 1000 : 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      form.reset();
    }
  }, [isOpen, form]);

  if (!activeForm || !formFields.length) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          // Success State
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-brand-primary" />
            </div>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl text-brand-primary">
                {activeForm.thank_you_title}
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                {activeForm.thank_you_message}
              </DialogDescription>
            </DialogHeader>
            
            {activeForm.redirect_to_whatsapp && publicSettings?.public_whatsapp_number && (
              <div className="mt-6">
                <Button 
                  className="btn-forge"
                  onClick={() => {
                    const message = t('forms.whatsappMessage', { 
                      companyName: publicSettings.company_name 
                    }) || `Olá! Acabei de preencher o formulário de qualificação no site da ${publicSettings.company_name}. Gostaria de conversar sobre meu projeto.`;
                    const whatsappUrl = `https://wa.me/${publicSettings.public_whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  {t('common.buttons.talkOnWhatsApp')}
                </Button>
              </div>
            )}

            <p className="text-sm text-muted-foreground mt-4">
              Redirecionando em {activeForm.redirect_delay} segundos...
            </p>
          </div>
        ) : (
          // Form State
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">{activeForm.title}</DialogTitle>
              <DialogDescription>
                {activeForm.description}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Campos dinâmicos do formulário */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Informações de Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formFields.map((field) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={field.field_name}
                        render={({ field: formField }) => (
                          <FormItem className={field.field_type === 'textarea' ? 'md:col-span-2' : ''}>
                            <FormLabel>
                              {field.field_label}
                              {field.is_required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                            <FormControl>
                              {field.field_type === 'select' ? (
                                <Select onValueChange={formField.onChange} value={formField.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder_text || `Selecione ${field.field_label.toLowerCase()}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : field.field_type === 'textarea' ? (
                                <Textarea
                                  {...formField}
                                  placeholder={field.placeholder_text}
                                  rows={4}
                                  className="resize-none"
                                />
                              ) : (
                                <Input
                                  {...formField}
                                  type={field.field_type}
                                  placeholder={field.placeholder_text}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Campos estratégicos de qualificação */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground">Informações do Projeto (Opcional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione seu cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ceo">CEO / Presidente</SelectItem>
                              <SelectItem value="cto">CTO / Diretor de TI</SelectItem>
                              <SelectItem value="diretor">Diretor</SelectItem>
                              <SelectItem value="gerente">Gerente</SelectItem>
                              <SelectItem value="coordenador">Coordenador</SelectItem>
                              <SelectItem value="analista">Analista</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segmento/Indústria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o segmento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Tecnologia</SelectItem>
                              <SelectItem value="finance">Finanças</SelectItem>
                              <SelectItem value="healthcare">Saúde</SelectItem>
                              <SelectItem value="education">Educação</SelectItem>
                              <SelectItem value="retail">Varejo</SelectItem>
                              <SelectItem value="manufacturing">Indústria</SelectItem>
                              <SelectItem value="services">Serviços</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tamanho_empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tamanho da Empresa</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Número de funcionários" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 funcionários</SelectItem>
                              <SelectItem value="10-50">10-50 funcionários</SelectItem>
                              <SelectItem value="50-500">50-500 funcionários</SelectItem>
                              <SelectItem value="500+">500+ funcionários</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="orcamento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faixa de Orçamento</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Orçamento disponível" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<10k">Até R$ 10.000</SelectItem>
                              <SelectItem value="10-50k">R$ 10.000 - R$ 50.000</SelectItem>
                              <SelectItem value="50-100k">R$ 50.000 - R$ 100.000</SelectItem>
                              <SelectItem value=">100k">Acima de R$ 100.000</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prazo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prazo Desejado</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Quando precisa?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="imediato">Imediato (urgente)</SelectItem>
                              <SelectItem value="1-3_meses">1-3 meses</SelectItem>
                              <SelectItem value="3-6_meses">3-6 meses</SelectItem>
                              <SelectItem value="6+_meses">Mais de 6 meses</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoridade_decisao"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Você é o decisor do projeto?</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sim_decisor">Sim, sou o decisor final</SelectItem>
                              <SelectItem value="influenciador">Influencio a decisão</SelectItem>
                              <SelectItem value="preciso_aprovacao">Preciso de aprovação</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {t('common.buttons.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 btn-forge"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.buttons.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('common.buttons.sendProposal')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};