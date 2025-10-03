import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CRMAuditLog, useCRMAuditLog } from '@/hooks/useCRMAuditLog';

const editEventSchema = z.object({
  event_timestamp: z.string().min(1, 'Data e hora são obrigatórias'),
  change_description: z.string().min(3, 'Descrição deve ter pelo menos 3 caracteres'),
});

type EditEventFormData = z.infer<typeof editEventSchema>;

interface EditHistoricalEventModalProps {
  log: CRMAuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditHistoricalEventModal: React.FC<EditHistoricalEventModalProps> = ({
  log,
  open,
  onOpenChange,
}) => {
  const { updateManualAuditLog } = useCRMAuditLog();

  const form = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
    values: log ? {
      event_timestamp: format(new Date(log.event_timestamp), "yyyy-MM-dd'T'HH:mm"),
      change_description: log.change_description || '',
    } : undefined,
  });

  const onSubmit = (data: EditEventFormData) => {
    if (!log) return;

    updateManualAuditLog.mutate(
      {
        id: log.id,
        event_timestamp: new Date(data.event_timestamp).toISOString(),
        change_description: data.change_description,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Evento Histórico</DialogTitle>
          <DialogDescription>
            Edite a data/hora e descrição deste evento manual. Esta ação é útil para registrar eventos passados corretamente.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="event_timestamp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e Hora do Evento</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormDescription>
                    Quando este evento realmente aconteceu
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="change_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      placeholder="Descreva o que aconteceu..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateManualAuditLog.isPending}>
                {updateManualAuditLog.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
