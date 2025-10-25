import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  FormMessage 
} from '@/components/ui/form';
import { useCRM } from '@/hooks/useCRM';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const contactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  company_size: z.string().optional(),
  industry: z.string().optional(),
  budget_range: z.string().optional(),
  decision_timeline: z.string().optional(),
  source: z.string().optional(),
  business_unit: z.string().optional(),
  referred_by: z.string().optional(),
  networking_source: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactForm({ open, onOpenChange }: ContactFormProps) {
  const { fetchPipelineByName, fetchFirstStageOfPipeline } = useCRM();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      job_title: '',
      company_size: '',
      industry: '',
      budget_range: '',
      decision_timeline: '',
      source: '',
      business_unit: '',
      referred_by: '',
      networking_source: '',
    }
  });

  const watchSource = form.watch('source');

  const onSubmit = async (data: ContactFormData) => {
    try {
      // 1. Criar o contato
      const { data: contactData, error: contactError } = await supabase
        .from('crm_contacts')
        .insert([{
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          company: data.company || undefined,
          job_title: data.job_title || undefined,
          company_size: data.company_size || undefined,
          industry: data.industry || undefined,
          budget_range: data.budget_range || undefined,
          decision_timeline: data.decision_timeline || undefined,
          source: data.source || undefined,
          tags: [],
          custom_fields: {
            business_unit: data.business_unit || undefined,
            referred_by: data.source === 'referral' ? data.referred_by : undefined,
            networking_source: data.source === 'networking' ? data.networking_source : undefined,
          },
          is_active: true,
        }])
        .select()
        .single();

      if (contactError) throw contactError;

      // 2. Determinar pipeline baseado na origem
      const pipelineMap: Record<string, string> = {
        'referral': 'Contato Direto',
        'networking': 'Contato Direto',
        'website': 'Inbound Marketing',
        'social_media': 'Inbound Marketing',
        'email_marketing': 'Inbound Marketing',
      };

      const pipelineName = pipelineMap[data.source || ''] || 'Pipeline de Vendas';

      // 3. Buscar pipeline
      const pipeline = await fetchPipelineByName(pipelineName);
      
      if (!pipeline) {
        // Fallback: buscar primeiro pipeline ativo
        const { data: fallbackPipeline } = await supabase
          .from('crm_pipelines')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(1)
          .single();
        
        if (fallbackPipeline) {
          const firstStage = await fetchFirstStageOfPipeline(fallbackPipeline.id);
          if (firstStage) {
            await createDealFromContact(contactData, fallbackPipeline.id, firstStage.id, data.source);
          }
        }
      } else {
        // 4. Buscar primeiro estágio
        const firstStage = await fetchFirstStageOfPipeline(pipeline.id);
        
        if (firstStage) {
          await createDealFromContact(contactData, pipeline.id, firstStage.id, data.source);
        }
      }

      toast({
        title: "Sucesso!",
        description: "Contato e oportunidade criados automaticamente",
      });

      form.reset();
      onOpenChange(false);
      
      // Invalidar queries para atualizar listas
      queryClient.invalidateQueries({ queryKey: ['crm-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
    } catch (error: any) {
      toast({
        title: "Erro ao criar contato",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createDealFromContact = async (
    contact: any, 
    pipelineId: string, 
    stageId: string, 
    source?: string
  ) => {
    await supabase
      .from('crm_deals')
      .insert([{
        pipeline_id: pipelineId,
        stage_id: stageId,
        contact_id: contact.id,
        title: `Oportunidade - ${contact.name}`,
        description: `Lead capturado via ${source || 'Contato Direto'}`,
        source: source,
        tags: [contact.custom_fields?.business_unit, source].filter(Boolean),
        currency: 'BRL',
        probability: 0,
        custom_fields: {},
        is_active: true,
      }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Contato</DialogTitle>
          <DialogDescription>
            Adicione um novo contato ao sistema CRM
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contato@empresa.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(11) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Como conheceu a empresa?" />
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

            {watchSource === 'referral' && (
              <FormField
                control={form.control}
                name="referred_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quem Indicou</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome de quem indicou" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchSource === 'networking' && (
              <FormField
                control={form.control}
                name="networking_source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual Rede</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da rede de networking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ICP Fields Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                Dados de Qualificação (ICP)
                <Badge variant="outline" className="text-xs">Opcional</Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="job_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Diretor de TI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamanho da Empresa</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o porte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 funcionários</SelectItem>
                          <SelectItem value="11-50">11-50 funcionários</SelectItem>
                          <SelectItem value="51-200">51-200 funcionários</SelectItem>
                          <SelectItem value="201-500">201-500 funcionários</SelectItem>
                          <SelectItem value="500+">500+ funcionários</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indústria</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a indústria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Financeiro">Financeiro</SelectItem>
                          <SelectItem value="E-commerce">E-commerce</SelectItem>
                          <SelectItem value="Indústria">Indústria</SelectItem>
                          <SelectItem value="Serviços">Serviços</SelectItem>
                          <SelectItem value="Varejo">Varejo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orçamento Estimado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a faixa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Até R$ 10k">Até R$ 10k</SelectItem>
                          <SelectItem value="R$ 10k - R$ 30k">R$ 10k - R$ 30k</SelectItem>
                          <SelectItem value="R$ 30k - R$ 50k">R$ 30k - R$ 50k</SelectItem>
                          <SelectItem value="R$ 50k - R$ 100k">R$ 50k - R$ 100k</SelectItem>
                          <SelectItem value="R$ 100k+">R$ 100k+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="decision_timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeline de Decisão</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o prazo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Imediato">Imediato</SelectItem>
                          <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                          <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                          <SelectItem value="6-12 meses">6-12 meses</SelectItem>
                          <SelectItem value="12+ meses">12+ meses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Criando...' : 'Criar Contato'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}