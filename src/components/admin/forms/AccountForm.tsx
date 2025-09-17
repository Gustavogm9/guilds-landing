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

const accountSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  account_type: z.enum(['asset', 'liability', 'equity', 'revenue', 'expense']),
  parent_id: z.string().optional(),
  level: z.number().min(1).max(5),
  is_active: z.boolean()
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  account?: any;
  accounts: any[];
  onSuccess: () => void;
}

export function AccountForm({ isOpen, onClose, account, accounts, onSuccess }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      code: account?.code || '',
      name: account?.name || '',
      account_type: account?.account_type || 'asset',
      parent_id: account?.parent_id || '',
      level: account?.level || 1,
      is_active: account?.is_active !== false
    }
  });

  const handleSubmit = async (data: AccountFormData) => {
    setLoading(true);
    try {
      if (account?.id) {
        const { error } = await supabase
          .from('chart_of_accounts')
          .update(data)
          .eq('id', account.id);
        if (error) throw error;
        toast({ title: 'Conta atualizada com sucesso!' });
      } else {
        const { error } = await supabase
          .from('chart_of_accounts')
          .insert([data]);
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

  const parentAccounts = accounts?.filter(acc => 
    acc.level < (form.watch('level') || 1) && acc.account_type === form.watch('account_type')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{account ? 'Editar Conta' : 'Nova Conta'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                {...form.register('code')}
                placeholder="ex: 1.1.01"
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
                value={form.watch('level')?.toString()}
                onValueChange={(value) => form.setValue('level', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Nível {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome da Conta</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="ex: Caixa e Equivalentes"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="account_type">Tipo da Conta</Label>
            <Select
              value={form.watch('account_type')}
              onValueChange={(value) => form.setValue('account_type', value as any)}
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
          </div>

          {parentAccounts && parentAccounts.length > 0 && (
            <div>
              <Label htmlFor="parent_id">Conta Pai (Opcional)</Label>
              <Select
                value={form.watch('parent_id') || ''}
                onValueChange={(value) => form.setValue('parent_id', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta pai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {parentAccounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.code} - {acc.name}
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