import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFinancial } from '@/hooks/useFinancial';
import { useCRM } from '@/hooks/useCRM';

const receivableSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  due_date: z.date({ required_error: 'Data de vencimento é obrigatória' }),
  contact_id: z.string().optional(),
  project_id: z.string().optional(),
  deal_id: z.string().optional(),
  account_id: z.string().optional(),
  invoice_number: z.string().optional(),
  installment_number: z.string().optional(),
  total_installments: z.string().optional(),
  notes: z.string().optional()
});

type ReceivableFormData = z.infer<typeof receivableSchema>;

interface ReceivableFormProps {
  isOpen: boolean;
  onClose: () => void;
  receivable?: any;
  onSuccess: () => void;
}

export function ReceivableForm({ isOpen, onClose, receivable, onSuccess }: ReceivableFormProps) {
  const { toast } = useToast();
  const { 
    chartOfAccounts, 
    createReceivable,
    isCreatingReceivable 
  } = useFinancial();
  const { contacts } = useCRM();

  const form = useForm<ReceivableFormData>({
    resolver: zodResolver(receivableSchema),
    defaultValues: {
      description: receivable?.description || '',
      amount: receivable?.amount?.toString() || '',
      due_date: receivable?.due_date ? new Date(receivable.due_date) : undefined,
      contact_id: receivable?.contact_id || '',
      project_id: receivable?.project_id || '',
      deal_id: receivable?.deal_id || '',
      account_id: receivable?.account_id || '',
      invoice_number: receivable?.invoice_number || '',
      installment_number: receivable?.installment_number?.toString() || '1',
      total_installments: receivable?.total_installments?.toString() || '1',
      notes: receivable?.notes || ''
    }
  });

  const handleSubmit = async (data: ReceivableFormData) => {
    try {
      await createReceivable({
        description: data.description,
        amount: parseFloat(data.amount.replace(/[^\d,-]/g, '').replace(',', '.')),
        due_date: data.due_date.toISOString().split('T')[0],
        contact_id: data.contact_id || null,
        project_id: data.project_id || null,
        deal_id: data.deal_id || null,
        account_id: data.account_id || null,
        invoice_number: data.invoice_number || null,
        installment_number: data.installment_number ? parseInt(data.installment_number) : 1,
        total_installments: data.total_installments ? parseInt(data.total_installments) : 1,
        notes: data.notes || null,
        status: 'pending'
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const revenueAccounts = chartOfAccounts?.filter(acc => acc.account_type === 'revenue');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{receivable ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Descrição da receita"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Valor *</Label>
              <Input
                id="amount"
                {...form.register('amount')}
                placeholder="R$ 0,00"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Label>Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('due_date') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('due_date') ? (
                      format(form.watch('due_date'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('due_date')}
                    onSelect={(date) => form.setValue('due_date', date!)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.due_date && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.due_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_id">Cliente</Label>
              <Select
                value={form.watch('contact_id')}
                onValueChange={(value) => form.setValue('contact_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {contacts?.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} - {contact.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account_id">Conta Contábil</Label>
              <Select
                value={form.watch('account_id')}
                onValueChange={(value) => form.setValue('account_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {revenueAccounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoice_number">Número da NF</Label>
              <Input
                id="invoice_number"
                {...form.register('invoice_number')}
                placeholder="NF-123456"
              />
            </div>

            <div>
              <Label htmlFor="installment_number">Parcela</Label>
              <Input
                id="installment_number"
                type="number"
                min="1"
                {...form.register('installment_number')}
                placeholder="1"
              />
            </div>

            <div>
              <Label htmlFor="total_installments">Total Parcelas</Label>
              <Input
                id="total_installments"
                type="number"
                min="1"
                {...form.register('total_installments')}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingReceivable} className="flex-1">
              {isCreatingReceivable ? 'Salvando...' : receivable ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}