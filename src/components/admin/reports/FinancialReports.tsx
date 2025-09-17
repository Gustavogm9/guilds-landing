import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, formatCurrency } from '@/lib/utils';
import { useFinancial } from '@/hooks/useFinancial';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart as RechartsPieChart,
  Pie, 
  Cell 
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

export function FinancialReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  
  const { 
    accountsReceivable, 
    accountsPayable, 
    transactions,
    chartOfAccounts,
    metrics 
  } = useFinancial();

  // Mock data for charts - in production, this would come from actual financial data
  const cashFlowData = [
    { month: 'Jan', receitas: 45000, despesas: 32000, saldo: 13000 },
    { month: 'Fev', receitas: 52000, despesas: 38000, saldo: 14000 },
    { month: 'Mar', receitas: 48000, despesas: 35000, saldo: 13000 },
    { month: 'Abr', receitas: 61000, despesas: 42000, saldo: 19000 },
    { month: 'Mai', receitas: 58000, despesas: 40000, saldo: 18000 },
    { month: 'Jun', receitas: 65000, despesas: 45000, saldo: 20000 }
  ];

  const expensesByCategory = [
    { name: 'Pessoal', value: 45000, color: COLORS[0] },
    { name: 'Infraestrutura', value: 15000, color: COLORS[1] },
    { name: 'Marketing', value: 8000, color: COLORS[2] },
    { name: 'Operacional', value: 12000, color: COLORS[3] }
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const now = new Date();
    
    switch (period) {
      case 'current_month':
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case 'last_month':
        const lastMonth = subMonths(now, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        setStartDate(quarterStart);
        setEndDate(new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0));
        break;
      case 'year':
        setStartDate(new Date(now.getFullYear(), 0, 1));
        setEndDate(new Date(now.getFullYear(), 11, 31));
        break;
    }
  };

  const handleExportReport = (reportType: string) => {
    // Implement export functionality
    console.log(`Exporting ${reportType} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Financeiros</h2>
          <p className="text-muted-foreground">
            Análises detalhadas da situação financeira
          </p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Mês Atual</SelectItem>
              <SelectItem value="last_month">Mês Anterior</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          {selectedPeriod === 'custom' && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(startDate, 'dd/MM', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(endDate, 'dd/MM', { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics?.totalReceivable || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total em aberto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics?.totalPayable || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total em aberto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (metrics?.cashFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(metrics?.cashFlow || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Projeção líquida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <PieChart className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency((metrics?.overdueReceivable || 0) + (metrics?.overduePayable || 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Total vencido
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cash_flow" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cash_flow">Fluxo de Caixa</TabsTrigger>
          <TabsTrigger value="dre">DRE</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="aging">Aging</TabsTrigger>
        </TabsList>

        <TabsContent value="cash_flow" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Fluxo de Caixa Mensal</CardTitle>
                <CardDescription>
                  Evolução das receitas, despesas e saldo
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('cash_flow')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), '']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Receitas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Despesas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saldo" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Saldo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dre" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Demonstrativo de Resultado (DRE)</CardTitle>
                <CardDescription>
                  Resultado do exercício por período
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('dre')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">Conta</div>
                  <div className="text-sm font-medium text-right">Período Atual</div>
                  <div className="text-sm font-medium text-right">Período Anterior</div>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 p-2">
                    <div className="font-semibold text-green-600">RECEITAS</div>
                    <div className="text-right font-semibold text-green-600">
                      {formatCurrency(245000)}
                    </div>
                    <div className="text-right text-muted-foreground">
                      {formatCurrency(220000)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-2 pl-6">
                    <div>Vendas de Software</div>
                    <div className="text-right">{formatCurrency(180000)}</div>
                    <div className="text-right text-muted-foreground">{formatCurrency(160000)}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-2 pl-6">
                    <div>Consultoria</div>
                    <div className="text-right">{formatCurrency(65000)}</div>
                    <div className="text-right text-muted-foreground">{formatCurrency(60000)}</div>
                  </div>

                  <div className="border-t pt-2">
                    <div className="grid grid-cols-3 gap-4 p-2">
                      <div className="font-semibold text-red-600">DESPESAS</div>
                      <div className="text-right font-semibold text-red-600">
                        ({formatCurrency(180000)})
                      </div>
                      <div className="text-right text-muted-foreground">
                        ({formatCurrency(165000)})
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-2 pl-6">
                      <div>Pessoal</div>
                      <div className="text-right">({formatCurrency(120000)})</div>
                      <div className="text-right text-muted-foreground">({formatCurrency(110000)})</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-2 pl-6">
                      <div>Infraestrutura</div>
                      <div className="text-right">({formatCurrency(35000)})</div>
                      <div className="text-right text-muted-foreground">({formatCurrency(32000)})</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 p-2 pl-6">
                      <div>Marketing</div>
                      <div className="text-right">({formatCurrency(25000)})</div>
                      <div className="text-right text-muted-foreground">({formatCurrency(23000)})</div>
                    </div>
                  </div>

                  <div className="border-t-2 pt-2">
                    <div className="grid grid-cols-3 gap-4 p-2">
                      <div className="font-bold">RESULTADO LÍQUIDO</div>
                      <div className="text-right font-bold text-primary">
                        {formatCurrency(65000)}
                      </div>
                      <div className="text-right text-muted-foreground font-semibold">
                        {formatCurrency(55000)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Análise de Despesas</CardTitle>
                <CardDescription>
                  Distribuição por categoria
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExportReport('expenses')}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie 
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  {expensesByCategory.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(category.value)}</div>
                        <div className="text-sm text-muted-foreground">
                          {((category.value / expensesByCategory.reduce((acc, cat) => acc + cat.value, 0)) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Aging - Contas a Receber</CardTitle>
                <CardDescription>
                  Análise por tempo de vencimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { period: 'A vencer (0-30 dias)', amount: 85000, color: 'text-green-600' },
                    { period: 'Vencido (31-60 dias)', amount: 15000, color: 'text-yellow-600' },
                    { period: 'Vencido (61-90 dias)', amount: 8000, color: 'text-orange-600' },
                    { period: 'Vencido (>90 dias)', amount: 3000, color: 'text-red-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <span>{item.period}</span>
                      <span className={`font-semibold ${item.color}`}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aging - Contas a Pagar</CardTitle>
                <CardDescription>
                  Análise por tempo de vencimento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { period: 'A vencer (0-30 dias)', amount: 45000, color: 'text-green-600' },
                    { period: 'Vencido (31-60 dias)', amount: 8000, color: 'text-yellow-600' },
                    { period: 'Vencido (61-90 dias)', amount: 2000, color: 'text-orange-600' },
                    { period: 'Vencido (>90 dias)', amount: 1000, color: 'text-red-600' }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <span>{item.period}</span>
                      <span className={`font-semibold ${item.color}`}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}