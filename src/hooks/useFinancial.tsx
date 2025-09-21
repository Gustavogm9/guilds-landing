import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useErrorHandler } from './useErrorHandler';

// Types
export interface ChartOfAccount {
  id: string;
  code: string;
  name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parent_id?: string;
  level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: any;
  payment_terms: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountPayable {
  id: string;
  supplier_id?: string;
  project_id?: string;
  cost_center_id?: string;
  account_id?: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
  cost_center?: CostCenter;
  account?: ChartOfAccount;
}

export interface AccountReceivable {
  id: string;
  contact_id?: string;
  project_id?: string;
  deal_id?: string;
  account_id?: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  invoice_number?: string;
  installment_number: number;
  total_installments: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  contact?: any;
  account?: ChartOfAccount;
}

export interface FinancialTransaction {
  id: string;
  account_id?: string;
  cost_center_id?: string;
  project_id?: string;
  transaction_type: 'debit' | 'credit';
  amount: number;
  description: string;
  reference_id?: string;
  reference_type?: string;
  transaction_date: string;
  category?: string;
  tags?: string[];
  created_by?: string;
  created_at: string;
  account?: ChartOfAccount;
  cost_center?: CostCenter;
}

export function useFinancial() {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  // Fetch chart of accounts
  const { data: chartOfAccounts = [], isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ['chart-of-accounts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('chart_of_accounts')
          .select('*')
          .eq('is_active', true)
          .order('code');
        
        if (error) throw error;
        return data as ChartOfAccount[];
      } catch (error) {
        handleError(error as Error, 'useFinancial.chartOfAccounts');
        throw error;
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch cost centers
  const { data: costCenters = [], isLoading: centersLoading, error: centersError } = useQuery({
    queryKey: ['cost-centers'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cost_centers')
          .select('*')
          .eq('is_active', true)
          .order('code');
        
        if (error) throw error;
        return data as CostCenter[];
      } catch (error) {
        handleError(error as Error, 'useFinancial.costCenters');
        throw error;
      }
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch suppliers
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Supplier[];
    },
  });

  // Fetch accounts payable
  const { data: accountsPayable = [], isLoading: payableLoading } = useQuery({
    queryKey: ['accounts-payable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts_payable')
        .select(`
          *,
          supplier:suppliers(*),
          cost_center:cost_centers(*),
          account:chart_of_accounts(*)
        `)
        .order('due_date');
      
      if (error) throw error;
      return data as AccountPayable[];
    },
  });

  // Fetch accounts receivable
  const { data: accountsReceivable = [], isLoading: receivableLoading } = useQuery({
    queryKey: ['accounts-receivable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts_receivable')
        .select(`
          *,
          contact:crm_contacts(*),
          account:chart_of_accounts(*)
        `)
        .order('due_date');
      
      if (error) throw error;
      return data as AccountReceivable[];
    },
  });

  // Fetch financial transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          account:chart_of_accounts(*),
          cost_center:cost_centers(*)
        `)
        .order('transaction_date', { ascending: false });
      
      if (error) throw error;
      return data as FinancialTransaction[];
    },
  });

  // Create account payable
  const createPayableMutation = useMutation({
    mutationFn: async (payable: Omit<AccountPayable, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('accounts_payable')
        .insert(payable)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-payable'] });
      toast.success('Conta a pagar criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar conta a pagar');
      console.error('Error creating payable:', error);
    },
  });

  // Create account receivable
  const createReceivableMutation = useMutation({
    mutationFn: async (receivable: Omit<AccountReceivable, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('accounts_receivable')
        .insert(receivable)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts-receivable'] });
      toast.success('Conta a receber criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar conta a receber');
      console.error('Error creating receivable:', error);
    },
  });

  // Create supplier
  const createSupplierMutation = useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar fornecedor');
      console.error('Error creating supplier:', error);
    },
  });

  // Create financial transaction
  const createTransactionMutation = useMutation({
    mutationFn: async (transaction: Omit<FinancialTransaction, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar transação');
      console.error('Error creating transaction:', error);
    },
  });

  // Update payment status
  const updatePaymentMutation = useMutation({
    mutationFn: async ({ 
      id, 
      type, 
      status, 
      payment_date, 
      payment_method 
    }: { 
      id: string; 
      type: 'payable' | 'receivable'; 
      status: string; 
      payment_date?: string; 
      payment_method?: string; 
    }) => {
      const table = type === 'payable' ? 'accounts_payable' : 'accounts_receivable';
      const { data, error } = await supabase
        .from(table)
        .update({ status, payment_date, payment_method })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      const queryKey = variables.type === 'payable' ? ['accounts-payable'] : ['accounts-receivable'];
      queryClient.invalidateQueries({ queryKey });
      toast.success('Status de pagamento atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar pagamento');
      console.error('Error updating payment:', error);
    },
  });

  // Calculate financial metrics
  const calculateMetrics = () => {
    const totalReceivable = accountsReceivable
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPayable = accountsPayable
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const cashFlow = totalReceivable - totalPayable;

    const overdueReceivable = accountsReceivable
      .filter(r => r.status === 'pending' && new Date(r.due_date) < new Date())
      .reduce((sum, r) => sum + r.amount, 0);

    const overduePayable = accountsPayable
      .filter(p => p.status === 'pending' && new Date(p.due_date) < new Date())
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      totalReceivable,
      totalPayable,
      cashFlow,
      overdueReceivable,
      overduePayable
    };
  };

  return {
    // Data
    chartOfAccounts,
    costCenters,
    suppliers,
    accountsPayable,
    accountsReceivable,
    transactions,
    
    // Loading states
    isLoading: chartLoading || centersLoading || suppliersLoading || payableLoading || receivableLoading || transactionsLoading,
    
    // Mutations
    createPayable: createPayableMutation.mutate,
    createReceivable: createReceivableMutation.mutate,
    createSupplier: createSupplierMutation.mutate,
    createTransaction: createTransactionMutation.mutate,
    updatePayment: updatePaymentMutation.mutate,
    
    // Loading states for mutations
    isCreatingPayable: createPayableMutation.isPending,
    isCreatingReceivable: createReceivableMutation.isPending,
    isCreatingSupplier: createSupplierMutation.isPending,
    isCreatingTransaction: createTransactionMutation.isPending,
    isUpdatingPayment: updatePaymentMutation.isPending,
    
    // Metrics
    metrics: calculateMetrics(),
  };
}