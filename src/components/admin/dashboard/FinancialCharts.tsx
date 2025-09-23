import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine,
} from 'recharts';
import { useFinancial } from '@/hooks/useFinancial';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export function FinancialCharts() {
  const { accountsReceivable, accountsPayable, transactions, isLoading } = useFinancial();

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico de fluxo de caixa com projeções
  const cashFlowData = () => {
    const monthlyData = new Map();
    const today = new Date();
    
    // Processar receitas
    accountsReceivable.forEach(item => {
      const date = new Date(item.due_date);
      const month = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      const isProjected = date > today;
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { 
          month, 
          receitas: 0, 
          despesas: 0, 
          receitasProjetadas: 0, 
          despesasProjetadas: 0,
          saldoAcumulado: 0
        });
      }
      
      if (isProjected) {
        monthlyData.get(month).receitasProjetadas += item.amount;
      } else {
        monthlyData.get(month).receitas += item.amount;
      }
    });

    // Processar despesas
    accountsPayable.forEach(item => {
      const date = new Date(item.due_date);
      const month = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      const isProjected = date > today;
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { 
          month, 
          receitas: 0, 
          despesas: 0, 
          receitasProjetadas: 0, 
          despesasProjetadas: 0,
          saldoAcumulado: 0
        });
      }
      
      if (isProjected) {
        monthlyData.get(month).despesasProjetadas += item.amount;
      } else {
        monthlyData.get(month).despesas += item.amount;
      }
    });

    // Calcular saldo acumulado
    let acumulado = 0;
    const sortedData = Array.from(monthlyData.values()).sort((a, b) => {
      const dateA = new Date(`${a.month} 01`);
      const dateB = new Date(`${b.month} 01`);
      return dateA.getTime() - dateB.getTime();
    });

    sortedData.forEach(item => {
      const saldoMes = (item.receitas + item.receitasProjetadas) - (item.despesas + item.despesasProjetadas);
      acumulado += saldoMes;
      item.saldoAcumulado = acumulado;
    });

    return sortedData.slice(0, 8);
  };

  // Dados para gráfico de status
  const statusData = [
    {
      name: 'Receber',
      value: accountsReceivable.filter(item => item.status === 'pending').length,
      color: '#10b981',
    },
    {
      name: 'Pagar',
      value: accountsPayable.filter(item => item.status === 'pending').length,
      color: '#f59e0b',
    },
    {
      name: 'Vencidas',
      value: [...accountsReceivable, ...accountsPayable].filter(
        item => item.status === 'overdue'
      ).length,
      color: '#ef4444',
    },
  ];

  // Dados para gráfico de categorias
  const categoryData = () => {
    const categories = new Map();
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Outros';
      if (!categories.has(category)) {
        categories.set(category, { category, receitas: 0, despesas: 0 });
      }
      
      if (transaction.transaction_type === 'credit') {
        categories.get(category).receitas += transaction.amount;
      } else {
        categories.get(category).despesas += Math.abs(transaction.amount);
      }
    });

    return Array.from(categories.values()).slice(0, 8);
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))', 'hsl(var(--destructive))', 'hsl(var(--warning))'];

  // Análise de aging (vencimentos)
  const agingData = () => {
    const ranges = [
      { name: 'Em dia', receivable: 0, payable: 0, color: 'hsl(var(--primary))' },
      { name: '1-30 dias', receivable: 0, payable: 0, color: 'hsl(var(--warning))' },
      { name: '31-60 dias', receivable: 0, payable: 0, color: 'hsl(var(--destructive))' },
      { name: '60+ dias', receivable: 0, payable: 0, color: 'hsl(var(--muted))' }
    ];

    const today = new Date();
    
    [...accountsReceivable, ...accountsPayable].forEach(item => {
      const dueDate = new Date(item.due_date);
      const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let rangeIndex = 0;
      if (daysDiff <= 0) rangeIndex = 0;
      else if (daysDiff <= 30) rangeIndex = 1;
      else if (daysDiff <= 60) rangeIndex = 2;
      else rangeIndex = 3;

      // Check if it's from receivables by looking for installment properties
      const isReceivable = 'installment_number' in item && 'total_installments' in item;
      
      if (isReceivable) {
        ranges[rangeIndex].receivable += item.amount;
      } else {
        ranges[rangeIndex].payable += item.amount;
      }
    });

    return ranges;
  };

  // Análise de performance financeira
  const performanceData = () => {
    const currentMonth = new Date().getMonth();
    const lastMonthReceivable = accountsReceivable.filter(item => 
      new Date(item.due_date).getMonth() === currentMonth - 1
    ).reduce((sum, item) => sum + item.amount, 0);
    
    const currentMonthReceivable = accountsReceivable.filter(item => 
      new Date(item.due_date).getMonth() === currentMonth
    ).reduce((sum, item) => sum + item.amount, 0);

    const growthRate = lastMonthReceivable > 0 
      ? ((currentMonthReceivable - lastMonthReceivable) / lastMonthReceivable) * 100 
      : 0;

    return {
      currentMonth: currentMonthReceivable,
      lastMonth: lastMonthReceivable,
      growthRate,
      trend: growthRate >= 0 ? 'up' : 'down'
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Badge variant={performanceData().trend === 'up' ? 'default' : 'destructive'}>
              {performanceData().trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {performanceData().growthRate.toFixed(1)}% vs mês anterior
            </Badge>
            {agingData().some(range => range.name !== 'Em dia' && (range.receivable > 0 || range.payable > 0)) && (
              <Badge variant="outline" className="text-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Itens vencidos
              </Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="cashflow" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="aging">Aging</TabsTrigger>
            <TabsTrigger value="forecast">Projeção</TabsTrigger>
          </TabsList>

          <TabsContent value="cashflow" className="space-y-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashFlowData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)
                    }
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  
                  <Bar dataKey="receitas" fill="hsl(var(--primary))" fillOpacity={0.8} name="Receitas Realizadas" />
                  <Bar dataKey="receitasProjetadas" fill="hsl(var(--primary))" fillOpacity={0.4} name="Receitas Projetadas" />
                  <Bar dataKey="despesas" fill="hsl(var(--destructive))" fillOpacity={0.8} name="Despesas Realizadas" />
                  <Bar dataKey="despesasProjetadas" fill="hsl(var(--destructive))" fillOpacity={0.4} name="Despesas Projetadas" />
                  
                  <Line 
                    type="monotone" 
                    dataKey="saldoAcumulado" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    name="Saldo Acumulado"
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)
                    }
                  />
                  <Bar dataKey="receitas" fill="#10b981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="aging" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData()} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)
                    }
                  />
                  <Bar dataKey="receivable" fill="hsl(var(--primary))" name="A Receber" />
                  <Bar dataKey="payable" fill="hsl(var(--destructive))" name="A Pagar" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashFlowData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)
                    }
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="saldoAcumulado"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    name="Projeção de Saldo"
                    dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="saldoAcumulado"
                    fill="hsl(var(--accent))"
                    fillOpacity={0.2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}