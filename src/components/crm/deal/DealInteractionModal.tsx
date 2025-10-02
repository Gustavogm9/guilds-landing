import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { CRMDeal, useCRM } from '@/hooks/useCRM';
import { toast } from 'sonner';

const interactionSchema = z.object({
  interaction_type: z.string().min(1, 'Tipo de interação é obrigatório'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  description: z.string().optional(),
  outcome: z.string().optional(),
  next_steps: z.string().optional(),
});

type InteractionFormData = z.infer<typeof interactionSchema>;

interface DealInteractionModalProps {
  deal: CRMDeal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: string;
}

export function DealInteractionModal({ 
  deal, 
  open, 
  onOpenChange,
  defaultType 
}: DealInteractionModalProps) {
  const { createInteraction } = useCRM();

  const form = useForm<InteractionFormData>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      interaction_type: defaultType || 'note',
      subject: '',
      description: '',
      outcome: '',
      next_steps: '',
    }
  });

  React.useEffect(() => {
    if (defaultType) {
      form.setValue('interaction_type', defaultType);
    }
  }, [defaultType, form]);

  const onSubmit = async (data: InteractionFormData) => {
    if (!deal?.contact?.id) {
      toast.error('Deal não possui contato associado');
      return;
    }

    try {
      await createInteraction({
        contact_id: deal.contact.id,
        interaction_type: data.interaction_type as any,
        interaction_date: new Date().toISOString(),
        subject: data.subject,
        description: data.description,
        outcome: data.outcome,
        next_steps: data.next_steps,
      });
      
      toast.success('Interação registrada com sucesso!');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao criar interação:', error);
      toast.error('Erro ao registrar interação');
    }
  };

  if (!deal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Interação - {deal.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="interaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Interação *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Ligação</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="note">Nota</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assunto *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Ligação de follow-up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalhes da interação..."
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
              name="outcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
                  <FormControl>
                    <Input placeholder="Resultado da interação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximos Passos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="O que fazer em seguida..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar Interação
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
