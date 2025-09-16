import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFinancial } from '@/hooks/useFinancial';
import { formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  Calendar,
  PlusCircle,
  Download,
  BarChart3
} from 'lucide-react';

export function FinancialDashboard() {
  const { 
    accountsPayable, 
    accountsReceivable, 
    transactions, 
    metrics, 
    isLoading 
  } = useFinancial();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
            <Button disabled>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-24 mb-1"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'default',
      paid: 'default',
      overdue: 'destructive',
      cancelled: 'secondary'
    } as const;
    
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      overdue: 'Vencido',
      cancelled: 'Cancelado'
    };
    
    return (
      <Badge 
        variant={variants[status as keyof typeof variants] || 'default'}
        className={status === 'paid' ? 'bg-primary text-primary-foreground' : ''}
      >
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão Financeira</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(metrics.totalReceivable)}
            </div>
            <p className="text-xs text-muted-foreground">
              {accountsReceivable.filter(r => r.status === 'pending').length} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(metrics.totalPayable)}
            </div>
            <p className="text-xs text-muted-foreground">
              {accountsPayable.filter(p => p.status === 'pending').length} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.cashFlow >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(metrics.cashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projeção líquida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(metrics.overdueReceivable + metrics.overduePayable)}
            </div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="receivables" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="receivables">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payables">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="receivables" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contas a Receber</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gerencie suas receitas e cobranças
                  </p>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                        {receivable.contact?.name || 'Cliente não especificado'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(receivable.amount)}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(receivable.due_date).toLocaleDateString('pt-BR')}
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
                    Gerencie suas despesas e fornecedores
                  </p>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                        {payable.supplier?.name || 'Fornecedor não especificado'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(payable.amount)}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payable.due_date).toLocaleDateString('pt-BR')}
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
                  <CardTitle>Transações Financeiras</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Histórico completo de movimentações
                  </p>
                </div>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                        {transaction.account?.name || 'Conta não especificada'}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-medium ${transaction.transaction_type === 'credit' ? 'text-primary' : 'text-destructive'}`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                        </div>
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

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">DRE</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Demonstração do Resultado do Exercício
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Fluxo de Caixa</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Análise detalhada do fluxo de caixa
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Balanço Patrimonial</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Posição patrimonial da empresa
                </p>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}