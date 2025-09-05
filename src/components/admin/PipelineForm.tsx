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
import { useCRM } from '@/hooks/useCRM';

const pipelineSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  type: z.enum(['sales', 'support', 'projects']),
  color: z.string().min(1, 'Cor é obrigatória'),
});

type PipelineFormData = z.infer<typeof pipelineSchema>;

interface PipelineFormProps {
  onSuccess?: () => void;
}

export function PipelineForm({ onSuccess }: PipelineFormProps) {
  const { createPipeline, isCreatingPipeline } = useCRM();

  const form = useForm<PipelineFormData>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'sales',
      color: 'hsl(240, 85%, 55%)',
    }
  });

  const onSubmit = (data: PipelineFormData) => {
    createPipeline({
      name: data.name,
      description: data.description,
      type: data.type,
      color: data.color,
      is_active: true,
      display_order: 0,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const colorOptions = [
    { value: 'hsl(240, 85%, 55%)', label: 'Azul', color: '#3b82f6' },
    { value: 'hsl(120, 85%, 45%)', label: 'Verde', color: '#22c55e' },
    { value: 'hsl(0, 85%, 55%)', label: 'Vermelho', color: '#ef4444' },
    { value: 'hsl(45, 85%, 55%)', label: 'Amarelo', color: '#f59e0b' },
    { value: 'hsl(280, 85%, 55%)', label: 'Roxo', color: '#a855f7' },
    { value: 'hsl(165, 85%, 45%)', label: 'Turquesa', color: '#06b6d4' },
  ];

  return (
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
                  placeholder="Descreva o propósito deste pipeline..."
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
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: option.color }}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreatingPipeline}>
            {isCreatingPipeline ? 'Criando...' : 'Criar Pipeline'}
          </Button>
        </div>
      </form>
    </Form>
  );
}