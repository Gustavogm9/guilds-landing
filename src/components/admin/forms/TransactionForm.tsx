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

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório'),
  transaction_date: z.date({ required_error: 'Data é obrigatória' }),
  transaction_type: z.enum(['debit', 'credit'], { required_error: 'Tipo é obrigatório' }),
  account_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  project_id: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional()
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: any;
  onSuccess: () => void;
}

export function TransactionForm({ isOpen, onClose, transaction, onSuccess }: TransactionFormProps) {
  const { toast } = useToast();
  const { 
    chartOfAccounts, 
    costCenters,
    createTransaction,
    isCreatingTransaction 
  } = useFinancial();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: transaction?.description || '',
      amount: transaction?.amount?.toString() || '',
      transaction_date: transaction?.transaction_date ? new Date(transaction.transaction_date) : new Date(),
      transaction_type: transaction?.transaction_type || 'debit',
      account_id: transaction?.account_id || '',
      cost_center_id: transaction?.cost_center_id || '',
      project_id: transaction?.project_id || '',
      category: transaction?.category || '',
      tags: transaction?.tags?.join(', ') || ''
    }
  });

  const handleSubmit = async (data: TransactionFormData) => {
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      await createTransaction({
        description: data.description,
        amount: parseFloat(data.amount.replace(/[^\d,-]/g, '').replace(',', '.')),
        transaction_date: data.transaction_date.toISOString().split('T')[0],
        transaction_type: data.transaction_type,
        account_id: data.account_id || null,
        cost_center_id: data.cost_center_id || null,
        project_id: data.project_id || null,
        category: data.category || null,
        tags: tags.length > 0 ? tags : null
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              {...form.register('description')}
              placeholder="Descrição da transação"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <Label htmlFor="transaction_type">Tipo *</Label>
              <Select
                value={form.watch('transaction_type')}
                onValueChange={(value: 'debit' | 'credit') => form.setValue('transaction_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Débito (Saída)</SelectItem>
                  <SelectItem value="credit">Crédito (Entrada)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.transaction_type && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.transaction_type.message}
                </p>
              )}
            </div>

            <div>
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch('transaction_date') && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch('transaction_date') ? (
                      format(form.watch('transaction_date'), "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('transaction_date')}
                    onSelect={(date) => form.setValue('transaction_date', date!)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {form.formState.errors.transaction_date && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.transaction_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                  {chartOfAccounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={form.watch('category') || ''}
                onValueChange={(value) => form.setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receitas">Receitas</SelectItem>
                  <SelectItem value="despesas_operacionais">Despesas Operacionais</SelectItem>
                  <SelectItem value="investimentos">Investimentos</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="impostos">Impostos</SelectItem>
                  <SelectItem value="folha_pagamento">Folha de Pagamento</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...form.register('tags')}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingTransaction} className="flex-1">
              {isCreatingTransaction ? 'Salvando...' : transaction ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}