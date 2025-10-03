import React from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCRMAuditLog } from '@/hooks/useCRMAuditLog';
import { Loader2 } from 'lucide-react';

const addEventSchema = z.object({
  entity_type: z.enum(['deal', 'contact', 'interaction']),
  entity_id: z.string().uuid({ message: 'ID da entidade inválido' }),
  action_type: z.enum(['created', 'updated', 'stage_changed', 'deleted']),
  event_timestamp: z.string().min(1, 'Data e hora são obrigatórios'),
  change_description: z.string().min(1, 'Descrição é obrigatória').max(500),
  field_name: z.string().optional(),
  old_value: z.string().optional(),
  new_value: z.string().optional(),
  metadata: z.string().optional(),
});

type AddEventFormData = z.infer<typeof addEventSchema>;

interface AddManualEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEntityType?: 'deal' | 'contact' | 'interaction';
  defaultEntityId?: string;
}

export function AddManualEventModal({ 
  open, 
  onOpenChange,
  defaultEntityType,
  defaultEntityId,
}: AddManualEventModalProps) {
  const { createManualAuditLog } = useCRMAuditLog();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AddEventFormData>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      entity_type: defaultEntityType || 'deal',
      entity_id: defaultEntityId || '',
      action_type: 'updated',
      event_timestamp: new Date().toISOString().slice(0, 16),
    },
  });

  const entityType = watch('entity_type');

  React.useEffect(() => {
    if (defaultEntityType) setValue('entity_type', defaultEntityType);
    if (defaultEntityId) setValue('entity_id', defaultEntityId);
  }, [defaultEntityType, defaultEntityId, setValue]);

  const onSubmit = async (data: AddEventFormData) => {
    try {
      let metadata: Record<string, any> = {};
      if (data.metadata) {
        try {
          metadata = JSON.parse(data.metadata);
        } catch (e) {
          // If JSON parsing fails, store as string
          metadata = { raw: data.metadata };
        }
      }

      await createManualAuditLog.mutateAsync({
        entity_type: data.entity_type,
        entity_id: data.entity_id,
        action_type: data.action_type,
        event_timestamp: new Date(data.event_timestamp).toISOString(),
        change_description: data.change_description,
        field_name: data.field_name,
        old_value: data.old_value,
        new_value: data.new_value,
        metadata,
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Evento Histórico Manual</DialogTitle>
          <DialogDescription>
            Registre eventos retroativos ou informações históricas importantes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entity_type">Tipo de Entidade *</Label>
              <Select
                value={entityType}
                onValueChange={(value) => setValue('entity_type', value as any)}
              >
                <SelectTrigger id="entity_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deal">Deal</SelectItem>
                  <SelectItem value="contact">Contato</SelectItem>
                  <SelectItem value="interaction">Interação</SelectItem>
                </SelectContent>
              </Select>
              {errors.entity_type && (
                <p className="text-sm text-destructive">{errors.entity_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity_id">ID da Entidade *</Label>
              <Input
                id="entity_id"
                placeholder="UUID da entidade"
                {...register('entity_id')}
              />
              {errors.entity_id && (
                <p className="text-sm text-destructive">{errors.entity_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action_type">Tipo de Ação *</Label>
              <Select
                onValueChange={(value) => setValue('action_type', value as any)}
                defaultValue="updated"
              >
                <SelectTrigger id="action_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Criado</SelectItem>
                  <SelectItem value="updated">Atualizado</SelectItem>
                  <SelectItem value="stage_changed">Mudança de Stage</SelectItem>
                  <SelectItem value="deleted">Deletado</SelectItem>
                </SelectContent>
              </Select>
              {errors.action_type && (
                <p className="text-sm text-destructive">{errors.action_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_timestamp">Data e Hora do Evento *</Label>
              <Input
                id="event_timestamp"
                type="datetime-local"
                {...register('event_timestamp')}
              />
              {errors.event_timestamp && (
                <p className="text-sm text-destructive">{errors.event_timestamp.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="change_description">Descrição do Evento *</Label>
            <Textarea
              id="change_description"
              placeholder="Descreva o que aconteceu neste evento..."
              rows={3}
              {...register('change_description')}
            />
            {errors.change_description && (
              <p className="text-sm text-destructive">{errors.change_description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_name">Campo Alterado (opcional)</Label>
            <Input
              id="field_name"
              placeholder="Ex: status, valor, stage_id"
              {...register('field_name')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="old_value">Valor Anterior (opcional)</Label>
              <Input
                id="old_value"
                placeholder="Valor antes da alteração"
                {...register('old_value')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new_value">Novo Valor (opcional)</Label>
              <Input
                id="new_value"
                placeholder="Valor após a alteração"
                {...register('new_value')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metadata">Metadados Técnicos (opcional, JSON)</Label>
            <Textarea
              id="metadata"
              placeholder='{"additional": "info", "key": "value"}'
              rows={3}
              {...register('metadata')}
            />
            <p className="text-xs text-muted-foreground">
              Informações adicionais em formato JSON
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Evento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
