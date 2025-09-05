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

const stageSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  color: z.string().min(1, 'Cor é obrigatória'),
  display_order: z.string().optional(),
});

type StageFormData = z.infer<typeof stageSchema>;

interface StageFormProps {
  pipelineId: string;
  onSuccess?: () => void;
}

export function StageForm({ pipelineId, onSuccess }: StageFormProps) {
  const { createStage, isCreatingStage } = useCRM();

  const form = useForm<StageFormData>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: '',
      description: '',
      color: 'hsl(240, 85%, 55%)',
      display_order: '1',
    }
  });

  const onSubmit = (data: StageFormData) => {
    createStage({
      pipeline_id: pipelineId,
      name: data.name,
      description: data.description || undefined,
      color: data.color,
      display_order: parseInt(data.display_order || '1'),
      auto_actions: [],
      is_active: true,
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
              <FormLabel>Nome do Estágio *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Lead, Proposta, Negociação" {...field} />
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
                  placeholder="Descreva quando uma oportunidade deve estar neste estágio..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ordem</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isCreatingStage}>
            {isCreatingStage ? 'Criando...' : 'Criar Estágio'}
          </Button>
        </div>
      </form>
    </Form>
  );
}