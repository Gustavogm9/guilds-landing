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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useFinancial } from '@/hooks/useFinancial';

const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  document: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  category: z.string().optional(),
  payment_terms: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean()
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any;
  onSuccess: () => void;
}

export function SupplierForm({ isOpen, onClose, supplier, onSuccess }: SupplierFormProps) {
  const { toast } = useToast();
  const { createSupplier, isCreatingSupplier } = useFinancial();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      document: supplier?.document || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
      category: supplier?.category || '',
      payment_terms: supplier?.payment_terms || '',
      notes: supplier?.notes || '',
      is_active: supplier?.is_active !== false
    }
  });

  const handleSubmit = async (data: SupplierFormData) => {
    try {
      await createSupplier({
        name: data.name,
        document: data.document || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address ? { full_address: data.address } : null,
        payment_terms: data.payment_terms ? parseInt(data.payment_terms) : 30,
        is_active: data.is_active
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
          <DialogTitle>{supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome / Razão Social *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Nome do fornecedor"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="document">CNPJ / CPF</Label>
              <Input
                id="document"
                {...form.register('document')}
                placeholder="00.000.000/0000-00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="contato@fornecedor.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Textarea
              id="address"
              {...form.register('address')}
              placeholder="Endereço completo"
              rows={2}
            />
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
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="materiais">Materiais</SelectItem>
                  <SelectItem value="equipamentos">Equipamentos</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="consultoria">Consultoria</SelectItem>
                  <SelectItem value="terceirizados">Terceirizados</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_terms">Prazo de Pagamento</Label>
              <Select
                value={form.watch('payment_terms') || ''}
                onValueChange={(value) => form.setValue('payment_terms', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prazo padrão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a_vista">À Vista</SelectItem>
                  <SelectItem value="7_dias">7 dias</SelectItem>
                  <SelectItem value="15_dias">15 dias</SelectItem>
                  <SelectItem value="30_dias">30 dias</SelectItem>
                  <SelectItem value="45_dias">45 dias</SelectItem>
                  <SelectItem value="60_dias">60 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Informações adicionais sobre o fornecedor"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch('is_active')}
              onCheckedChange={(checked) => form.setValue('is_active', checked)}
            />
            <Label htmlFor="is_active">Fornecedor Ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingSupplier} className="flex-1">
              {isCreatingSupplier ? 'Salvando...' : supplier ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}