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

const payableSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  due_date: z.date({ required_error: 'Data de vencimento é obrigatória' }),
  supplier_id: z.string().optional(),
  account_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  project_id: z.string().optional(),
  invoice_number: z.string().optional(),
  notes: z.string().optional()
});

type PayableFormData = z.infer<typeof payableSchema>;

interface PayableFormProps {
  isOpen: boolean;
  onClose: () => void;
  payable?: any;
  onSuccess: () => void;
}

export function PayableForm({ isOpen, onClose, payable, onSuccess }: PayableFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { 
    suppliers, 
    chartOfAccounts, 
    costCenters,
    createPayable,
    isCreatingPayable 
  } = useFinancial();

  const form = useForm<PayableFormData>({
    resolver: zodResolver(payableSchema),
    defaultValues: {
      description: payable?.description || '',
      amount: payable?.amount?.toString() || '',
      due_date: payable?.due_date ? new Date(payable.due_date) : undefined,
      supplier_id: payable?.supplier_id || '',
      account_id: payable?.account_id || '',
      cost_center_id: payable?.cost_center_id || '',
      project_id: payable?.project_id || '',
      invoice_number: payable?.invoice_number || '',
      notes: payable?.notes || ''
    }
  });

  const handleSubmit = async (data: PayableFormData) => {
    try {
      await createPayable({
        description: data.description,
        amount: parseFloat(data.amount.replace(/[^\d,-]/g, '').replace(',', '.')),
        due_date: data.due_date,
        supplier_id: data.supplier_id || null,
        account_id: data.account_id || null,
        cost_center_id: data.cost_center_id || null,
        project_id: data.project_id || null,
        invoice_number: data.invoice_number || null,
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

  const expenseAccounts = chartOfAccounts?.filter(acc => acc.account_type === 'expense');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payable ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Descrição da despesa"
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
              <Label htmlFor="supplier_id">Fornecedor</Label>
              <Select
                value={form.watch('supplier_id')}
                onValueChange={(value) => form.setValue('supplier_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
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
                  {expenseAccounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost_center_id">Centro de Custo</Label>
              <Select
                value={form.watch('cost_center_id')}
                onValueChange={(value) => form.setValue('cost_center_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um centro de custo" />
                </SelectTrigger>
                <SelectContent>
                  {costCenters?.map(center => (
                    <SelectItem key={center.id} value={center.id}>
                      {center.code} - {center.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="invoice_number">Número da Nota</Label>
              <Input
                id="invoice_number"
                {...form.register('invoice_number')}
                placeholder="NF-123456"
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
            <Button type="submit" disabled={isCreatingPayable} className="flex-1">
              {isCreatingPayable ? 'Salvando...' : payable ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}