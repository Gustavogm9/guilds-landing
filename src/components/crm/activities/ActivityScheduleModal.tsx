import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useCRM } from '@/hooks/useCRM';
import { useToast } from '@/hooks/use-toast';
import { RecurrenceForm } from './RecurrenceForm';

interface ActivityScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealId?: string;
  contactId?: string;
  activity?: any;
}

interface RecurrenceFormData {
  isRecurring: boolean;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  interval: number;
  byWeekday: number[];
  byMonthDay: number[];
  endType: 'never' | 'date' | 'count';
  endDate?: Date;
  maxOccurrences?: number;
}

const ACTIVITY_TYPES = [
  { value: 'call', label: '📞 Ligação' },
  { value: 'meeting', label: '🤝 Reunião' },
  { value: 'email', label: '📧 E-mail' },
  { value: 'whatsapp', label: '💬 WhatsApp' },
  { value: 'task', label: '✅ Tarefa' },
  { value: 'follow_up', label: '🔄 Follow-up' },
  { value: 'proposal', label: '📄 Proposta' },
  { value: 'demo', label: '🎯 Demonstração' },
  { value: 'note', label: '📝 Nota' },
];

export function ActivityScheduleModal({ 
  open, 
  onOpenChange, 
  dealId, 
  contactId,
  activity 
}: ActivityScheduleModalProps) {
  const { 
    createActivity, 
    updateActivity, 
    isCreatingActivity, 
    isUpdatingActivity,
    createRecurringActivity,
    isCreatingRecurringActivity 
  } = useCRM();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: activity?.type || 'call',
    title: activity?.title || '',
    description: activity?.description || '',
    due_date: activity?.due_date ? new Date(activity.due_date) : undefined,
    due_time: activity?.due_date ? format(new Date(activity.due_date), 'HH:mm') : '09:00',
  });

  const [recurrenceData, setRecurrenceData] = useState<RecurrenceFormData>({
    isRecurring: false,
    frequency: 'weekly',
    interval: 1,
    byWeekday: [],
    byMonthDay: [],
    endType: 'never',
    endDate: undefined,
    maxOccurrences: undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para a atividade",
        variant: "destructive",
      });
      return;
    }

    if (!formData.due_date && !recurrenceData.isRecurring) {
      toast({
        title: "Data obrigatória",
        description: "Por favor, selecione uma data para a atividade",
        variant: "destructive",
      });
      return;
    }

    // Handle recurring activity
    if (recurrenceData.isRecurring) {
      const recurrencePayload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        frequency: recurrenceData.frequency,
        interval: recurrenceData.interval,
        by_weekday: recurrenceData.byWeekday.length > 0 ? recurrenceData.byWeekday : null,
        by_month_day: recurrenceData.byMonthDay.length > 0 ? recurrenceData.byMonthDay : null,
        default_time: formData.due_time,
        start_date: formData.due_date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        end_date: recurrenceData.endType === 'date' && recurrenceData.endDate
          ? recurrenceData.endDate.toISOString().split('T')[0]
          : null,
        max_occurrences: recurrenceData.endType === 'count' ? recurrenceData.maxOccurrences : null,
        deal_id: dealId || null,
        contact_id: contactId || null,
      };

      createRecurringActivity(recurrencePayload);
      handleClose();
      return;
    }

    // Handle single activity
    const [hours, minutes] = formData.due_time.split(':');
    const dueDateTime = new Date(formData.due_date!);
    dueDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const activityData = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      due_date: dueDateTime.toISOString(),
      completed: false,
      deal_id: dealId || null,
      contact_id: contactId || null,
    };

    if (activity?.id) {
      updateActivity({ ...activityData, id: activity.id });
    } else {
      createActivity(activityData);
    }

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: 'call',
      title: '',
      description: '',
      due_date: undefined,
      due_time: '09:00',
    });
    setRecurrenceData({
      isRecurring: false,
      frequency: 'weekly',
      interval: 1,
      byWeekday: [],
      byMonthDay: [],
      endType: 'never',
      endDate: undefined,
      maxOccurrences: undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Editar Atividade' : 'Agendar Nova Atividade'}
          </DialogTitle>
          <DialogDescription>
            {activity ? 'Atualize as informações da atividade' : 'Crie uma nova atividade ou lembrete'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Atividade */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Atividade</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Ex: Ligar para follow-up da proposta"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Adicione detalhes sobre a atividade..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data {!recurrenceData.isRecurring && '*'}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? (
                      format(formData.due_date, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  className="pl-10"
                  value={formData.due_time}
                  onChange={(e) => setFormData({ ...formData, due_time: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Recurrence Configuration */}
          <RecurrenceForm value={recurrenceData} onChange={setRecurrenceData} />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isCreatingActivity || isUpdatingActivity || isCreatingRecurringActivity}
            >
              {(isCreatingActivity || isUpdatingActivity || isCreatingRecurringActivity) 
                ? 'Salvando...' 
                : (activity ? 'Atualizar' : (recurrenceData.isRecurring ? 'Criar Recorrência' : 'Agendar'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
