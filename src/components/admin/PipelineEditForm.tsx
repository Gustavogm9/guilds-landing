import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCRM } from '@/hooks/useCRM';

const pipelineSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['sales', 'support', 'projects']),
  color: z.string().min(1, 'Cor é obrigatória'),
  is_active: z.boolean().default(true),
});

type PipelineFormData = z.infer<typeof pipelineSchema>;

interface PipelineEditFormProps {
  pipeline: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PipelineEditForm({ pipeline, open, onOpenChange }: PipelineEditFormProps) {
  const { updatePipeline, isUpdatingPipeline } = useCRM();

  const form = useForm<PipelineFormData>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: pipeline?.name || '',
      description: pipeline?.description || '',
      type: pipeline?.type || 'sales',
      color: pipeline?.color || 'hsl(var(--primary))',
      is_active: pipeline?.is_active ?? true,
    },
  });

  // Reset form when pipeline changes
  useEffect(() => {
    if (pipeline) {
      form.reset({
        name: pipeline.name,
        description: pipeline.description || '',
        type: pipeline.type,
        color: pipeline.color,
        is_active: pipeline.is_active,
      });
    }
  }, [pipeline, form]);

  const onSubmit = (data: PipelineFormData) => {
    updatePipeline({ pipelineId: pipeline.id, updates: data });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Pipeline</DialogTitle>
          <DialogDescription>
            Atualize as informações do pipeline
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Pipeline *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pipeline de Vendas" {...field} />
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
                      placeholder="Descreva o propósito deste pipeline"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="support">Suporte</SelectItem>
                      <SelectItem value="projects">Projetos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="hsl(240, 85%, 55%)">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[hsl(240,85%,55%)]" />
                          Azul
                        </div>
                      </SelectItem>
                      <SelectItem value="hsl(165, 85%, 45%)">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[hsl(165,85%,45%)]" />
                          Verde
                        </div>
                      </SelectItem>
                      <SelectItem value="hsl(346, 87%, 43%)">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[hsl(346,87%,43%)]" />
                          Vermelho
                        </div>
                      </SelectItem>
                      <SelectItem value="hsl(38, 92%, 50%)">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[hsl(38,92%,50%)]" />
                          Laranja
                        </div>
                      </SelectItem>
                      <SelectItem value="hsl(280, 85%, 55%)">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-[hsl(280,85%,55%)]" />
                          Roxo
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Pipeline Ativo</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Pipelines inativos não aparecem no Kanban
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isUpdatingPipeline}>
                {isUpdatingPipeline ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
