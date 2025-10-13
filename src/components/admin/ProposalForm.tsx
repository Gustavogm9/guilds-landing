import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useProposals } from "@/hooks/useProposals";
import { useCRM } from "@/hooks/useCRM";
import { ArrowLeft } from "lucide-react";

const proposalSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  contact_id: z.string().uuid("Selecione um cliente"),
  deal_id: z.string().uuid("Selecione um deal").optional(),
  template_id: z.string().uuid("Selecione um template"),
  valid_until: z.string().refine(val => new Date(val) > new Date(), "Data deve ser futura"),
  flags: z.object({
    partnership: z.boolean().default(false),
    whitelabel: z.boolean().default(false),
    maintenanceEnabled: z.boolean().default(true),
  }),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

export const ProposalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useProposal, templates, createProposal, updateProposal } = useProposals();
  const { contacts } = useCRM();
  
  const { data: proposal, isLoading } = useProposal(id || '');

  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      title: '',
      contact_id: '',
      deal_id: '',
      template_id: '',
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      flags: {
        partnership: false,
        whitelabel: false,
        maintenanceEnabled: true,
      },
    },
  });

  useEffect(() => {
    if (proposal) {
      form.reset({
        title: proposal.title,
        contact_id: proposal.contact_id,
        deal_id: proposal.deal_id || '',
        template_id: proposal.template_id,
        valid_until: new Date(proposal.valid_until).toISOString().split('T')[0],
        flags: proposal.flags as any,
      });
    }
  }, [proposal]);

  const onSubmit = async (data: ProposalFormData) => {
    try {
      if (id) {
        await updateProposal.mutateAsync({
          id,
          ...data,
        });
        toast({
          title: "Proposta atualizada",
          description: "A proposta foi atualizada com sucesso.",
        });
      } else {
        const newProposal = await createProposal.mutateAsync(data);
        toast({
          title: "Proposta criada",
          description: "A proposta foi criada com sucesso.",
        });
        navigate(`/admin/propostas/${newProposal.id}/versoes/1`);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/propostas')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{id ? 'Editar Proposta' : 'Nova Proposta'}</h1>
          <p className="text-muted-foreground">
            {id ? 'Atualize as informações da proposta' : 'Crie uma nova proposta comercial'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Proposta</FormLabel>
                    <FormControl>
                      <Input placeholder="Proposta: Sistema de Gestão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {contacts?.map((contact: any) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} - {contact.company || contact.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deal_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal ID (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID do deal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="template_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates?.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} {template.is_default && '(Padrão)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Válida Até</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="flags.maintenanceEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>Habilitar Manutenção</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Incluir planos de manutenção na proposta
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flags.partnership"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>Modo Parceria</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Ativar cálculos de RevShare
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flags.whitelabel"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <FormLabel>Whitelabel</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Remover branding Guilds
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/propostas')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createProposal.isPending || updateProposal.isPending}>
              {id ? 'Atualizar' : 'Criar'} Proposta
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
