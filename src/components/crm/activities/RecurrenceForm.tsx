import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const WEEKDAYS = [
  { value: 1, label: 'Seg' },
  { value: 2, label: 'Ter' },
  { value: 3, label: 'Qua' },
  { value: 4, label: 'Qui' },
  { value: 5, label: 'Sex' },
  { value: 6, label: 'Sáb' },
  { value: 0, label: 'Dom' },
];

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

interface RecurrenceFormProps {
  value: RecurrenceFormData;
  onChange: (value: RecurrenceFormData) => void;
}

export function RecurrenceForm({ value, onChange }: RecurrenceFormProps) {
  const updateField = (field: keyof RecurrenceFormData, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const toggleWeekday = (day: number) => {
    const current = value.byWeekday || [];
    if (current.includes(day)) {
      updateField('byWeekday', current.filter(d => d !== day));
    } else {
      updateField('byWeekday', [...current, day].sort());
    }
  };

  const getPreviewDates = () => {
    if (!value.isRecurring) return [];
    
    const dates: string[] = [];
    const start = new Date();
    const frequencyMap: Record<string, number> = {
      daily: 1,
      weekly: 7,
      biweekly: 14,
      monthly: 30,
      quarterly: 90,
      yearly: 365,
    };

    const increment = (frequencyMap[value.frequency] || 7) * value.interval;
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + (increment * i));
      dates.push(format(date, 'dd/MM/yyyy', { locale: ptBR }));
    }

    return dates;
  };

  if (!value.isRecurring) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="recurring">Atividade Recorrente</Label>
          <Switch
            id="recurring"
            checked={value.isRecurring}
            onCheckedChange={(checked) => updateField('isRecurring', checked)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Ative para criar uma atividade que se repete automaticamente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="recurring">Atividade Recorrente</Label>
        <Switch
          id="recurring"
          checked={value.isRecurring}
          onCheckedChange={(checked) => updateField('isRecurring', checked)}
        />
      </div>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simples</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4">
          {/* Frequência Simples */}
          <div className="space-y-2">
            <Label>Frequência</Label>
            <Select
              value={value.frequency}
              onValueChange={(freq) => updateField('frequency', freq)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                <SelectItem value="monthly">Mensalmente</SelectItem>
                <SelectItem value="quarterly">Trimestralmente</SelectItem>
                <SelectItem value="yearly">Anualmente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Intervalo */}
          <div className="space-y-2">
            <Label>Repetir a cada</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                value={value.interval}
                onChange={(e) => updateField('interval', parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">
                {value.frequency === 'daily' && 'dia(s)'}
                {value.frequency === 'weekly' && 'semana(s)'}
                {value.frequency === 'biweekly' && 'quinzena(s)'}
                {value.frequency === 'monthly' && 'mês(es)'}
                {value.frequency === 'quarterly' && 'trimestre(s)'}
                {value.frequency === 'yearly' && 'ano(s)'}
              </span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {/* Dias da Semana */}
          {(value.frequency === 'weekly' || value.frequency === 'biweekly') && (
            <div className="space-y-2">
              <Label>Dias da Semana</Label>
              <div className="flex gap-2">
                {WEEKDAYS.map(({ value: day, label }) => (
                  <Button
                    key={day}
                    type="button"
                    variant={value.byWeekday?.includes(day) ? 'default' : 'outline'}
                    size="sm"
                    className="w-12"
                    onClick={() => toggleWeekday(day)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Dia do Mês */}
          {value.frequency === 'monthly' && (
            <div className="space-y-2">
              <Label>Dia do Mês</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={value.byMonthDay?.[0] || ''}
                onChange={(e) => {
                  const day = parseInt(e.target.value);
                  if (day >= 1 && day <= 31) {
                    updateField('byMonthDay', [day]);
                  }
                }}
                placeholder="Dia (1-31)"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Término da Recorrência */}
      <div className="space-y-3">
        <Label>Término</Label>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="never"
              checked={value.endType === 'never'}
              onChange={() => updateField('endType', 'never')}
              className="h-4 w-4"
            />
            <Label htmlFor="never" className="font-normal cursor-pointer">
              Nunca
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="endDate"
              checked={value.endType === 'date'}
              onChange={() => updateField('endType', 'date')}
              className="h-4 w-4"
            />
            <Label htmlFor="endDate" className="font-normal cursor-pointer">
              Em
            </Label>
            {value.endType === 'date' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !value.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value.endDate ? (
                      format(value.endDate, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      'Selecionar'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value.endDate}
                    onSelect={(date) => updateField('endDate', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="count"
              checked={value.endType === 'count'}
              onChange={() => updateField('endType', 'count')}
              className="h-4 w-4"
            />
            <Label htmlFor="count" className="font-normal cursor-pointer">
              Após
            </Label>
            {value.endType === 'count' && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={value.maxOccurrences || ''}
                  onChange={(e) => updateField('maxOccurrences', parseInt(e.target.value) || undefined)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">ocorrências</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <Label>Próximas Ocorrências (preview)</Label>
        <div className="flex flex-wrap gap-2">
          {getPreviewDates().map((date, i) => (
            <Badge key={i} variant="secondary">
              {date}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
