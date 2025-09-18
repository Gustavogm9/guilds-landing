import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'recharts';
import { useFinancial } from '@/hooks/useFinancial';

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

  // Preparar dados para o gráfico de fluxo de caixa
  const cashFlowData = () => {
    const monthlyData = new Map();
    
    // Processar receitas
    accountsReceivable.forEach(item => {
      const month = new Date(item.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { month, receitas: 0, despesas: 0 });
      }
      monthlyData.get(month).receitas += item.amount;
    });

    // Processar despesas
    accountsPayable.forEach(item => {
      const month = new Date(item.due_date).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { month, receitas: 0, despesas: 0 });
      }
      monthlyData.get(month).despesas += item.amount;
    });

    return Array.from(monthlyData.values()).slice(0, 6);
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Financeira</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cashflow" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
          </TabsList>

          <TabsContent value="cashflow" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData()}>
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
                  <Area
                    type="monotone"
                    dataKey="receitas"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Receitas"
                  />
                  <Area
                    type="monotone"
                    dataKey="despesas"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.6}
                    name="Despesas"
                  />
                </AreaChart>
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

          <TabsContent value="trends" className="space-y-4">
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
                  <Line
                    type="monotone"
                    dataKey="receitas"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Receitas"
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Despesas"
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