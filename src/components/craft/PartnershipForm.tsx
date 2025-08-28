import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCraft } from '@/hooks/useCraft';

const partnershipSchema = z.object({
  partner_name: z.string().min(2, 'Nome é obrigatório'),
  partner_email: z.string().email('Email inválido'),
  company: z.string().optional(),
  partner_type: z.string().min(1, 'Tipo de parceria é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
  skills_offered: z.string().optional(),
  investment_capacity: z.string().optional(),
  portfolio_url: z.string().url('URL inválida').optional().or(z.literal('')),
});

type PartnershipFormData = z.infer<typeof partnershipSchema>;

interface PartnershipFormProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId?: string;
  ideaTitle?: string;
}

export const PartnershipForm = ({ isOpen, onClose, ideaId, ideaTitle }: PartnershipFormProps) => {
  const { submitPartnershipInquiry, isSubmittingPartnership } = useCraft();

  const form = useForm<PartnershipFormData>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      partner_name: '',
      partner_email: '',
      company: '',
      partner_type: '',
      message: ideaTitle ? `Tenho interesse em colaborar com o projeto "${ideaTitle}".` : '',
      skills_offered: '',
      investment_capacity: '',
      portfolio_url: '',
    },
  });

  const onSubmit = async (data: PartnershipFormData) => {
    try {
      const submissionData = {
        partner_name: data.partner_name,
        partner_email: data.partner_email,
        company: data.company,
        partner_type: data.partner_type,
        message: data.message,
        idea_id: ideaId,
        skills_offered: data.skills_offered ? data.skills_offered.split(',').map(s => s.trim()) : undefined,
        investment_capacity: data.investment_capacity,
        portfolio_url: data.portfolio_url,
      };

      submitPartnershipInquiry(submissionData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error submitting partnership form:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ideaTitle ? `Propor Parceria - ${ideaTitle}` : 'Propor Parceria'}
          </DialogTitle>
          <DialogDescription>
            Conte-nos sobre seu interesse e como você pode contribuir para este projeto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="partner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de parceria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">Técnica - Desenvolvimento</SelectItem>
                        <SelectItem value="financial">Financeira - Investimento</SelectItem>
                        <SelectItem value="strategic">Estratégica - Mercado</SelectItem>
                        <SelectItem value="advisor">Mentoria - Consultoria</SelectItem>
                        <SelectItem value="research">Pesquisa - Acadêmica</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conte-nos sobre seu interesse no projeto e como você pode contribuir..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills_offered"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades oferecidas (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: React, Node.js, Marketing Digital (separadas por vírgula)"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="investment_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidade de investimento (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: R$ 50k - R$ 100k" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="portfolio_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio/LinkedIn (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmittingPartnership}>
                {isSubmittingPartnership ? 'Enviando...' : 'Enviar proposta'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};