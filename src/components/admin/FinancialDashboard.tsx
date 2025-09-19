import { useState } from 'react';
import { useFinancial } from '@/hooks/useFinancial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Plus,
  FileText,
  Download,
  PieChart
} from 'lucide-react';
import { FinancialKPIs } from './dashboard/FinancialKPIs';
import { FinancialCharts } from './dashboard/FinancialCharts';
import { FinancialAlerts } from './dashboard/FinancialAlerts';
import { FinancialFilters } from './dashboard/FinancialFilters';
import { FinancialAutomation } from './automation/FinancialAutomation';
import { FinancialReports } from './reports/FinancialReports';
import { AccountForm } from './forms/AccountForm';
import { SupplierForm } from './forms/SupplierForm';
import { PayableForm } from './forms/PayableForm';
import { ReceivableForm } from './forms/ReceivableForm';

export default function FinancialDashboard() {
  const {
    chartOfAccounts,
    costCenters,
    suppliers,
    accountsPayable,
    accountsReceivable,
    transactions,
    metrics,
    isLoading,
    createPayable,
    createReceivable,
    createSupplier,
    createTransaction,
    isCreatingPayable,
    isCreatingReceivable,
    isCreatingSupplier,
    isCreatingTransaction,
  } = useFinancial();

  const [filters, setFilters] = useState({
    dateRange: { from: null, to: null },
    status: 'all',
    type: 'all',
    amountRange: { min: '', max: '' },
    search: '',
  });

  const handleExportData = () => {
    // Implementar exportação de dados
    console.log('Exportando dados financeiros...');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      paid: 'default',
      overdue: 'destructive',
      cancelled: 'outline'
    } as const;
    
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      overdue: 'Vencido',
      cancelled: 'Cancelado'
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com ações rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-muted-foreground">
            Dashboard avançado com KPIs em tempo real e análise preditiva
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* KPIs em tempo real */}
      <FinancialKPIs />

      {/* Alertas e notificações */}
      <FinancialAlerts />

      {/* Filtros avançados */}
      <FinancialFilters 
        onFiltersChange={setFilters}
        onExportData={handleExportData}
      />

      {/* Gráficos e análises */}
      <FinancialCharts />

      {/* Tabelas com dados detalhados */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="receivables">Receber</TabsTrigger>
          <TabsTrigger value="payables">Pagar</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="centers">Centros</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FinancialCharts />
            <FinancialAlerts />
          </div>
        </TabsContent>

        <TabsContent value="receivables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contas a Receber</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {accountsReceivable.length} conta(s) no total
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Cobrança
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountsReceivable.slice(0, 10).map((receivable) => (
                  <div key={receivable.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{receivable.description}</div>
                      <div className="text-sm text-muted-foreground">
                        Vencimento: {new Date(receivable.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(receivable.amount)}
                        </div>
                      </div>
                      {getStatusBadge(receivable.status)}
                    </div>
                  </div>
                ))}
                {accountsReceivable.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta a receber encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contas a Pagar</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {accountsPayable.length} conta(s) no total
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accountsPayable.slice(0, 10).map((payable) => (
                  <div key={payable.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{payable.description}</div>
                      <div className="text-sm text-muted-foreground">
                        Vencimento: {new Date(payable.due_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(payable.amount)}
                        </div>
                      </div>
                      {getStatusBadge(payable.status)}
                    </div>
                  </div>
                ))}
                {accountsPayable.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta a pagar encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transações</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {transactions.length} transação(ões) no total
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-right font-medium ${
                        transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'credit' ? '+' : '-'}
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(Math.abs(transaction.amount))}
                      </div>
                      <Badge variant={transaction.transaction_type === 'credit' ? 'default' : 'secondary'}>
                        {transaction.transaction_type === 'credit' ? 'Crédito' : 'Débito'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma transação encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fornecedores</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {suppliers.length} fornecedor(es) cadastrado(s)
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Fornecedor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suppliers.slice(0, 10).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {supplier.email || 'Email não informado'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                        {supplier.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {suppliers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum fornecedor encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Plano de Contas</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {chartOfAccounts.length} conta(s) no plano
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Conta
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartOfAccounts.slice(0, 10).map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{account.code} - {account.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Tipo: {account.account_type}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={account.is_active ? 'default' : 'secondary'}>
                        {account.is_active ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {chartOfAccounts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma conta encontrada
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="centers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Centros de Custo</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {costCenters.length} centro(s) de custo
                  </p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Centro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costCenters.slice(0, 10).map((center) => (
                  <div key={center.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{center.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Centro de custo
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={center.is_active ? 'default' : 'secondary'}>
                        {center.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                ))}
                {costCenters.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum centro de custo encontrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <FinancialAutomation />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}