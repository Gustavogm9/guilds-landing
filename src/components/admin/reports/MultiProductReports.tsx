import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
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
  ComposedChart
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Calendar,
  FileText,
  Share,
  Filter
} from 'lucide-react';
import { useMultiProduct } from '@/contexts/MultiProductContext';
import { ProductFilter } from '@/components/admin/filters/ProductFilter';

interface ReportData {
  period: string;
  guilds_leads: number;
  guilds_deals: number;
  guilds_revenue: number;
  doavya_leads: number;
  doavya_deals: number;
  doavya_revenue: number;
  total_leads: number;
  total_deals: number;
  total_revenue: number;
  conversion_rate: number;
}

interface ProductComparisonData {
  product: string;
  leads: number;
  deals: number;
  revenue: number;
  conversion_rate: number;
  color: string;
}

const mockReportData: ReportData[] = [
  {
    period: 'Jan 2024',
    guilds_leads: 45,
    guilds_deals: 12,
    guilds_revenue: 85000,
    doavya_leads: 23,
    doavya_deals: 8,
    doavya_revenue: 45000,
    total_leads: 68,
    total_deals: 20,
    total_revenue: 130000,
    conversion_rate: 29.4
  },
  {
    period: 'Fev 2024',
    guilds_leads: 52,
    guilds_deals: 15,
    guilds_revenue: 95000,
    doavya_leads: 18,
    doavya_deals: 6,
    doavya_revenue: 35000,
    total_leads: 70,
    total_deals: 21,
    total_revenue: 130000,
    conversion_rate: 30.0
  },
  {
    period: 'Mar 2024',
    guilds_leads: 38,
    guilds_deals: 18,
    guilds_revenue: 125000,
    doavya_leads: 31,
    doavya_deals: 12,
    doavya_revenue: 65000,
    total_leads: 69,
    total_deals: 30,
    total_revenue: 190000,
    conversion_rate: 43.5
  },
  {
    period: 'Abr 2024',
    guilds_leads: 61,
    guilds_deals: 22,
    guilds_revenue: 145000,
    doavya_leads: 29,
    doavya_deals: 11,
    doavya_revenue: 58000,
    total_leads: 90,
    total_deals: 33,
    total_revenue: 203000,
    conversion_rate: 36.7
  }
];

export function MultiProductReports() {
  const { products, activeProduct } = useMultiProduct();
  const [reportPeriod, setReportPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState('last6months');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Prepare comparison data
  const comparisonData: ProductComparisonData[] = [
    {
      product: 'Guilds',
      leads: mockReportData.reduce((sum, item) => sum + item.guilds_leads, 0),
      deals: mockReportData.reduce((sum, item) => sum + item.guilds_deals, 0),
      revenue: mockReportData.reduce((sum, item) => sum + item.guilds_revenue, 0),
      conversion_rate: 32.5,
      color: '#6366f1'
    },
    {
      product: 'Doavya',
      leads: mockReportData.reduce((sum, item) => sum + item.doavya_leads, 0),
      deals: mockReportData.reduce((sum, item) => sum + item.doavya_deals, 0),
      revenue: mockReportData.reduce((sum, item) => sum + item.doavya_revenue, 0),
      conversion_rate: 36.6,
      color: '#8b5cf6'
    }
  ];

  const exportReport = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(mockReportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `guilds-multiproduct-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios Multi-Produto</h2>
          <p className="text-muted-foreground">
            Análise comparativa e insights estratégicos por linha de produto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportReport} className="gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2">
            <Share className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <ProductFilter compact />
        <Select value={reportPeriod} onValueChange={setReportPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Diário</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="quarterly">Trimestral</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30days">30 dias</SelectItem>
            <SelectItem value="last3months">3 meses</SelectItem>
            <SelectItem value="last6months">6 meses</SelectItem>
            <SelectItem value="lastyear">1 ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Leads
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {comparisonData.reduce((sum, item) => sum + item.leads, 0)}
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  +18% vs período anterior
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Negócios
                  </CardTitle>
                  <Target className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {comparisonData.reduce((sum, item) => sum + item.deals, 0)}
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  +25% vs período anterior
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(comparisonData.reduce((sum, item) => sum + item.revenue, 0))}
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  +32% vs período anterior
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa Conversão
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {((comparisonData.reduce((sum, item) => sum + item.conversion_rate, 0)) / comparisonData.length).toFixed(1)}%
                </div>
                <Badge variant="secondary" className="text-xs mt-1">
                  +5.2pp vs período anterior
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockReportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(value)}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="guilds_revenue" 
                      stackId="1"
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.6}
                      name="Guilds"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="doavya_revenue" 
                      stackId="1"
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      name="Doavya"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.map(product => (
                    <div key={product.product} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: product.color }}
                          />
                          <span className="font-medium">{product.product}</span>
                        </div>
                        <Badge variant="outline">
                          {product.conversion_rate}% conversão
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Leads</p>
                          <p className="font-medium">{product.leads}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Negócios</p>
                          <p className="font-medium">{product.deals}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Receita</p>
                          <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Funil de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="product" />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#e2e8f0" name="Leads" />
                      <Bar dataKey="deals" fill="#6366f1" name="Negócios" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas Detalhadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Produto</th>
                      <th className="text-right p-2">Leads</th>
                      <th className="text-right p-2">Negócios</th>
                      <th className="text-right p-2">Taxa Conversão</th>
                      <th className="text-right p-2">Ticket Médio</th>
                      <th className="text-right p-2">Receita Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map(product => (
                      <tr key={product.product} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: product.color }}
                            />
                            {product.product}
                          </div>
                        </td>
                        <td className="text-right p-2 font-medium">{product.leads}</td>
                        <td className="text-right p-2 font-medium">{product.deals}</td>
                        <td className="text-right p-2">
                          <Badge variant="outline">
                            {product.conversion_rate}%
                          </Badge>
                        </td>
                        <td className="text-right p-2 font-medium">
                          {formatCurrency(product.revenue / product.deals)}
                        </td>
                        <td className="text-right p-2 font-medium">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b bg-muted/50 font-medium">
                      <td className="p-2">Total</td>
                      <td className="text-right p-2">
                        {comparisonData.reduce((sum, item) => sum + item.leads, 0)}
                      </td>
                      <td className="text-right p-2">
                        {comparisonData.reduce((sum, item) => sum + item.deals, 0)}
                      </td>
                      <td className="text-right p-2">
                        <Badge>
                          {(comparisonData.reduce((sum, item) => sum + item.conversion_rate, 0) / comparisonData.length).toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="text-right p-2">
                        {formatCurrency(
                          comparisonData.reduce((sum, item) => sum + item.revenue, 0) / 
                          comparisonData.reduce((sum, item) => sum + item.deals, 0)
                        )}
                      </td>
                      <td className="text-right p-2">
                        {formatCurrency(comparisonData.reduce((sum, item) => sum + item.revenue, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={comparisonData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ product, value }) => `${product}: ${formatCurrency(value)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Lead Sources Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="product" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leads" name="Leads">
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side by Side Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação Lado a Lado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {comparisonData.map(product => (
                  <div key={product.product} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: product.color }}
                      />
                      <h3 className="text-lg font-semibold">{product.product}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {product.leads}
                        </p>
                        <p className="text-sm text-muted-foreground">Leads</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {product.deals}
                        </p>
                        <p className="text-sm text-muted-foreground">Negócios</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {product.conversion_rate}%
                        </p>
                        <p className="text-sm text-muted-foreground">Conversão</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold" style={{ color: product.color }}>
                          {formatCurrency(product.revenue)}
                        </p>
                        <p className="text-sm text-muted-foreground">Receita</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Conversion Rate Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência da Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockReportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Taxa de Conversão']}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="conversion_rate" 
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Analysis */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Crescimento de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Guilds</span>
                    <Badge variant="secondary">+18%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Doavya</span>
                    <Badge variant="secondary">+34%</Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Total</span>
                    <Badge>+24%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Crescimento de Receita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Guilds</span>
                    <Badge variant="secondary">+28%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Doavya</span>
                    <Badge variant="secondary">+42%</Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Total</span>
                    <Badge>+32%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Projeções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Próximo mês</span>
                    <Badge variant="outline">+15%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Próximo trimestre</span>
                    <Badge variant="outline">+45%</Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Meta anual</span>
                    <Badge>2.5M</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}