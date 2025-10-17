import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb } from 'lucide-react';
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
  FormDescription,
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StageForm({ pipelineId, open, onOpenChange }: StageFormProps) {
  const { createStage, isCreatingStage, fetchStagesByPipeline } = useCRM();
  const [existingStages, setExistingStages] = useState<any[]>([]);
  const [loadingStages, setLoadingStages] = useState(false);

  // Load existing stages when dialog opens
  useEffect(() => {
    if (open && pipelineId) {
      setLoadingStages(true);
      fetchStagesByPipeline(pipelineId)
        .then(stages => {
          setExistingStages(stages || []);
          // Set suggested order based on existing stages
          const suggestedOrder = (stages?.length || 0) + 1;
          form.setValue('display_order', suggestedOrder.toString());
        })
        .catch(error => {
          console.error('Error loading stages:', error);
          setExistingStages([]);
        })
        .finally(() => setLoadingStages(false));
    }
  }, [open, pipelineId]);

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
    // Check for duplicate stage name
    const isDuplicate = existingStages.some(
      stage => stage.name.toLowerCase() === data.name.toLowerCase()
    );
    
    if (isDuplicate) {
      form.setError('name', {
        type: 'manual',
        message: 'Já existe um estágio com este nome neste pipeline',
      });
      return;
    }

    createStage({
      pipeline_id: pipelineId,
      name: data.name,
      description: data.description || undefined,
      color: data.color,
      display_order: parseInt(data.display_order || '1'),
      auto_actions: [],
      is_active: true,
    });
    form.reset();
    onOpenChange(false);
  };

  const colorOptions = [
    { value: 'hsl(240, 85%, 55%)', label: 'Azul', color: '#3b82f6' },
    { value: 'hsl(120, 85%, 45%)', label: 'Verde', color: '#22c55e' },
    { value: 'hsl(0, 85%, 55%)', label: 'Vermelho', color: '#ef4444' },
    { value: 'hsl(45, 85%, 55%)', label: 'Amarelo', color: '#f59e0b' },
    { value: 'hsl(280, 85%, 55%)', label: 'Roxo', color: '#a855f7' },
    { value: 'hsl(165, 85%, 45%)', label: 'Turquesa', color: '#06b6d4' },
  ];

  const lastStage = existingStages[existingStages.length - 1];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Estágio</DialogTitle>
          <DialogDescription>
            Adicione um novo estágio ao pipeline selecionado
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Existing Stages Preview */}
            {loadingStages ? (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Carregando estágios...</p>
              </div>
            ) : existingStages.length > 0 ? (
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  📋 Estágios atuais ({existingStages.length})
                </h4>
                <div className="space-y-2">
                  {existingStages.map((stage) => (
                    <div key={stage.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline" className="w-8 justify-center">
                        {stage.display_order}
                      </Badge>
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: stage.color }}
                      />
                      <span className="text-foreground">{stage.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Este pipeline ainda não possui estágios. Crie o primeiro!
                </p>
              </div>
            )}

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
                    <FormDescription className="text-xs">
                      Sugerido: {existingStages.length + 1}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Helpful hint */}
            {lastStage && (
              <div className="flex items-start gap-2 p-3 bg-accent/50 rounded-lg border border-accent">
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent-foreground" />
                <p className="text-xs text-accent-foreground">
                  <strong>Dica:</strong> Este estágio será adicionado após <strong>"{lastStage.name}"</strong>
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreatingStage}>
                {isCreatingStage ? 'Criando...' : 'Criar Estágio'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
