import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCRM, CRMStage, CRMDeal } from '@/hooks/useCRM';

const dealSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  stage_id: z.string().min(1, 'Estágio é obrigatório'),
  contact_id: z.string().optional(),
  value: z.string().optional(),
  probability: z.string().optional(),
  expected_close_date: z.date().optional(),
  source: z.string().optional(),
  business_unit: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface DealFormProps {
  pipelineId: string;
  stages: CRMStage[];
  deal?: CRMDeal;
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
}

export function DealForm({ pipelineId, stages, deal, mode = 'create', onSuccess }: DealFormProps) {
  const { createDeal, isCreatingDeal, updateDeal, isUpdatingDeal, contacts } = useCRM();

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      description: '',
      stage_id: stages[0]?.id || '',
      contact_id: '',
      value: '',
      probability: '50',
      source: '',
      business_unit: '',
    }
  });

  // Populate form when editing
  React.useEffect(() => {
    if (deal && mode === 'edit') {
      form.reset({
        title: deal.title,
        description: deal.description || '',
        stage_id: deal.stage_id,
        contact_id: deal.contact_id || '',
        value: deal.value?.toString() || '',
        probability: deal.probability?.toString() || '50',
        expected_close_date: deal.expected_close_date ? new Date(deal.expected_close_date) : undefined,
        source: deal.source || '',
        business_unit: deal.business_unit || '',
      });
    }
  }, [deal, mode, form]);

  const onSubmit = (data: DealFormData) => {
    const dealData = {
      pipeline_id: pipelineId,
      title: data.title,
      description: data.description || undefined,
      stage_id: data.stage_id,
      contact_id: data.contact_id || undefined,
      value: data.value ? parseFloat(data.value) : undefined,
      currency: 'BRL' as const,
      probability: data.probability ? parseInt(data.probability) : 0,
      expected_close_date: data.expected_close_date?.toISOString().split('T')[0] || undefined,
      source: data.source || undefined,
      business_unit: data.business_unit as 'guilds' | 'guilds_lab' | 'guilds_craft' | 'doavya' | 'outros' | undefined,
      tags: deal?.tags || [],
      custom_fields: deal?.custom_fields || {},
      is_active: true,
    };

    if (mode === 'edit' && deal) {
      updateDeal({ id: deal.id, ...dealData });
    } else {
      createDeal(dealData);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Título da Oportunidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Projeto de automação para empresa X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva os detalhes da oportunidade..."
                    className="min-h-[80px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stage */}
          <FormField
            control={form.control}
            name="stage_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estágio *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact */}
          <FormField
            control={form.control}
            name="contact_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contato</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um contato" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contacts?.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          {contact.email && (
                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Value */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Probability */}
          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="50" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Expected Close Date */}
          <FormField
            control={form.control}
            name="expected_close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Prevista de Fechamento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source */}
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origem</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="referral">Indicação</SelectItem>
                    <SelectItem value="networking">Rede de Networking</SelectItem>
                    <SelectItem value="social_media">Redes Sociais</SelectItem>
                    <SelectItem value="cold_call">Cold Call</SelectItem>
                    <SelectItem value="email_marketing">Email Marketing</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Unit */}
          <FormField
            control={form.control}
            name="business_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Qual Negócio</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o negócio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="guilds">Guilds (Software/Apps/Automação/IA)</SelectItem>
                    <SelectItem value="guilds_lab">Guilds Lab (Workshops e Treinamento)</SelectItem>
                    <SelectItem value="guilds_craft">Guilds Craft (P&D e Parcerias)</SelectItem>
                    <SelectItem value="doavya">Doavya</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreatingDeal || isUpdatingDeal}>
            {mode === 'edit' 
              ? (isUpdatingDeal ? 'Salvando...' : 'Salvar Alterações')
              : (isCreatingDeal ? 'Criando...' : 'Criar Oportunidade')
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}