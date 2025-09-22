import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useFinancial } from '@/hooks/useFinancial';

const accountSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  account_type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense'], {
    required_error: 'Tipo da conta é obrigatório'
  }),
  parent_id: z.string().optional(),
  level: z.string().optional(),
  is_active: z.boolean()
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  account?: any;
  onSuccess: () => void;
}

export function AccountForm({ isOpen, onClose, account, onSuccess }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { chartOfAccounts } = useFinancial();

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: account?.code || '',
      name: account?.name || '',
      account_type: account?.account_type || 'expense',
      parent_id: account?.parent_id || '',
      level: account?.level?.toString() || '1',
      is_active: account?.is_active !== false
    }
  });

  const handleSubmit = async (data: AccountFormData) => {
    setLoading(true);
    try {
      const accountData = {
        code: data.code,
        name: data.name,
        account_type: data.account_type,
        parent_id: data.parent_id || null,
        level: parseInt(data.level || '1'),
        is_active: data.is_active
      };

      if (account?.id) {
        const { error } = await supabase
          .from('chart_of_accounts')
          .update(accountData)
          .eq('id', account.id);
        if (error) throw error;
        toast({ title: 'Conta atualizada com sucesso!' });
      } else {
        const { error } = await supabase
          .from('chart_of_accounts')
          .insert([accountData]);
        if (error) throw error;
        toast({ title: 'Conta criada com sucesso!' });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const parentAccounts = chartOfAccounts?.filter(acc => 
    acc.account_type === form.watch('account_type') && 
    acc.id !== account?.id &&
    acc.level < 3
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                {...form.register('code')}
                placeholder="1.1.01"
              />
              {form.formState.errors.code && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.code.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="level">Nível</Label>
              <Select
                value={form.watch('level')}
                onValueChange={(value) => form.setValue('level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Grupo</SelectItem>
                  <SelectItem value="2">2 - Subgrupo</SelectItem>
                  <SelectItem value="3">3 - Conta</SelectItem>
                  <SelectItem value="4">4 - Subconta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome da Conta *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Nome da conta"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="account_type">Tipo da Conta *</Label>
            <Select
              value={form.watch('account_type')}
              onValueChange={(value: any) => form.setValue('account_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asset">Ativo</SelectItem>
                <SelectItem value="liability">Passivo</SelectItem>
                <SelectItem value="equity">Patrimônio Líquido</SelectItem>
                <SelectItem value="revenue">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.account_type && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.account_type.message}
              </p>
            )}
          </div>

          {parseInt(form.watch('level') || '1') > 1 && (
            <div>
              <Label htmlFor="parent_id">Conta Pai</Label>
              <Select
                value={form.watch('parent_id')}
                onValueChange={(value) => form.setValue('parent_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a conta pai" />
                </SelectTrigger>
                <SelectContent>
                  {parentAccounts?.map(account => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.code} - {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Conta Ativa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : account ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}