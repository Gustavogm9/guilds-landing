import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancial } from '@/hooks/useFinancial';
import { FinancialKPIs } from './dashboard/FinancialKPIs';
import { FinancialCharts } from './dashboard/FinancialCharts';
import { FinancialAlerts } from './dashboard/FinancialAlerts';
import { FinancialAutomation } from './automation/FinancialAutomation';
import { FinancialAnalytics } from './analytics/FinancialAnalytics';
import { ComplianceCenter } from './compliance/ComplianceCenter';
import { FinancialReports } from './reports/FinancialReports';
import FinancialErrorBoundary from '@/components/error/FinancialErrorBoundary';
import { FinancialLoadingFallback } from '@/components/financial/FinancialLoadingFallback';
import { 
  FileText, 
  Download, 
  Plus,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

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
    dateRange: 'last_30_days',
    status: 'all',
    category: 'all',
  });

  const handleExportData = () => {
    console.log('Exportando dados financeiros...');
  };

  // Show loading fallback if data is loading
  if (isLoading) {
    return (
      <FinancialErrorBoundary componentName="FinancialDashboard">
        <FinancialLoadingFallback type="dashboard" />
      </FinancialErrorBoundary>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
      'pending': 'secondary',
      'paid': 'default',
      'overdue': 'destructive',
      'cancelled': 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <FinancialErrorBoundary componentName="FinancialDashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Financeiro</h1>
            <p className="text-muted-foreground">
              Visão geral completa das finanças da empresa
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportData} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Relatórios
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <FinancialKPIs />

        {/* Alerts */}
        <FinancialAlerts />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="receivables">A Receber</TabsTrigger>
            <TabsTrigger value="payables">A Pagar</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="accounts">Contas</TabsTrigger>
            <TabsTrigger value="centers">Centros</TabsTrigger>
            <TabsTrigger value="automation">Automação</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FinancialCharts />
            </div>
          </TabsContent>

          <TabsContent value="receivables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Contas a Receber
                </CardTitle>
                <CardDescription>
                  Total de {accountsReceivable.length} contas a receber
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountsReceivable.slice(0, 10).map((receivable) => (
                    <div key={receivable.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{receivable.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {new Date(receivable.due_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {receivable.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        {getStatusBadge(receivable.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-danger" />
                  Contas a Pagar
                </CardTitle>
                <CardDescription>
                  Total de {accountsPayable.length} contas a pagar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accountsPayable.slice(0, 10).map((payable) => (
                    <div key={payable.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{payable.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {new Date(payable.due_date).toLocaleDateString('pt-BR')}
                        </p>
                        {payable.supplier && (
                          <p className="text-xs text-muted-foreground">
                            Fornecedor: {payable.supplier.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {payable.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        {getStatusBadge(payable.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transações Financeiras</CardTitle>
                <CardDescription>
                  Histórico de {transactions.length} transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                        </p>
                        {transaction.category && (
                          <p className="text-xs text-muted-foreground">
                            Categoria: {transaction.category}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.transaction_type === 'credit' ? 'text-success' : 'text-danger'
                        }`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}
                          {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {transaction.transaction_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fornecedores</CardTitle>
                <CardDescription>
                  Gestão de {suppliers.length} fornecedores ativos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.slice(0, 10).map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        {supplier.email && (
                          <p className="text-sm text-muted-foreground">{supplier.email}</p>
                        )}
                        {supplier.phone && (
                          <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Prazo: {supplier.payment_terms} dias
                        </p>
                        <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                          {supplier.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Plano de Contas</CardTitle>
                <CardDescription>
                  {chartOfAccounts.length} contas ativas no plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartOfAccounts.slice(0, 10).map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{account.code} - {account.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          Tipo: {account.account_type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Nível: {account.level}
                        </p>
                        <Badge variant={account.is_active ? 'default' : 'secondary'}>
                          {account.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="centers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Centros de Custo</CardTitle>
                <CardDescription>
                  {costCenters.length} centros de custo configurados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costCenters.slice(0, 10).map((center) => (
                    <div key={center.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{center.code} - {center.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Departamento: {center.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={center.is_active ? 'default' : 'secondary'}>
                          {center.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <FinancialAutomation />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <FinancialAnalytics />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <ComplianceCenter />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <FinancialReports />
          </TabsContent>
        </Tabs>
      </div>
    </FinancialErrorBoundary>
  );
}