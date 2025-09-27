import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  PieChart,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { useMultiProduct, ProductMetrics } from '@/contexts/MultiProductContext';
import { ProductFilter } from '@/components/admin/filters/ProductFilter';

interface ProductMetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}

function ProductMetricsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  isLoading 
}: ProductMetricsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" style={{ color }}>
          {value}
        </div>
        {change && (
          <Badge variant="secondary" className="text-xs mt-1">
            {change}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

export function MultiProductDashboard() {
  const { activeProduct, products, getMetricsByProduct } = useMultiProduct();
  const [metrics, setMetrics] = useState<Record<string, ProductMetrics>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoading(true);
      try {
        if (activeProduct === 'all') {
          // Load metrics for all products
          const allMetrics: Record<string, ProductMetrics> = {};
          const productSlugs = ['guilds', 'doavya', 'all'] as const;
          
          const metricsPromises = productSlugs.map(async (slug) => {
            const productMetrics = await getMetricsByProduct(slug);
            allMetrics[slug] = productMetrics;
          });
          
          await Promise.all(metricsPromises);
          setMetrics(allMetrics);
        } else {
          // Load metrics for active product only
          const productMetrics = await getMetricsByProduct(activeProduct);
          setMetrics({ [activeProduct]: productMetrics });
        }
      } catch (error) {
        console.error('Error loading metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [activeProduct, getMetricsByProduct]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getProductColor = (productSlug: string) => {
    if (productSlug === 'all') return 'hsl(var(--primary))';
    const product = products.find(p => p.slug === productSlug);
    return product?.color || 'hsl(var(--primary))';
  };

  const getProductName = (productSlug: string) => {
    if (productSlug === 'all') return 'Consolidado';
    const product = products.find(p => p.slug === productSlug);
    return product?.name || productSlug;
  };

  if (activeProduct === 'all') {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <ProductFilter compact />

        {/* Consolidated View */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="comparison">Comparativo</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Consolidated Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ProductMetricsCard
                title="Total de Leads"
                value={metrics.all?.totalLeads || 0}
                icon={Users}
                color="hsl(var(--primary))"
                isLoading={isLoading}
              />
              <ProductMetricsCard
                title="Taxa de Conversão"
                value={formatPercentage(metrics.all?.conversionRate || 0)}
                icon={Target}
                color="hsl(var(--accent))"
                isLoading={isLoading}
              />
              <ProductMetricsCard
                title="Negócios Ativos"
                value={metrics.all?.activeDeals || 0}
                icon={Activity}
                color="hsl(142, 76%, 36%)"
                isLoading={isLoading}
              />
              <ProductMetricsCard
                title="Valor Total"
                value={formatCurrency(metrics.all?.totalValue || 0)}
                icon={DollarSign}
                color="hsl(38, 92%, 50%)"
                isLoading={isLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            {/* Product Comparison */}
            <div className="grid gap-6 md:grid-cols-2">
              {products.map(product => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: product.color }}
                      />
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Leads</p>
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {isLoading ? <Skeleton className="h-8 w-12 inline-block" /> : (metrics[product.slug]?.totalLeads || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversão</p>
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {isLoading ? <Skeleton className="h-8 w-12 inline-block" /> : formatPercentage(metrics[product.slug]?.conversionRate || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Negócios</p>
                        <p className="text-2xl font-bold" style={{ color: product.color }}>
                          {isLoading ? <Skeleton className="h-8 w-12 inline-block" /> : (metrics[product.slug]?.activeDeals || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor</p>
                        <p className="text-lg font-bold" style={{ color: product.color }}>
                          {isLoading ? <Skeleton className="h-6 w-16 inline-block" /> : formatCurrency(metrics[product.slug]?.totalValue || 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {/* Performance Analysis */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Performance por Produto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.map(product => {
                      const productMetrics = metrics[product.slug];
                      const healthScore = productMetrics?.pipelineHealth || 0;
                      return (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: product.color }}
                            />
                            <span className="text-sm">{product.name}</span>
                          </div>
                          <Badge 
                            variant={healthScore > 70 ? 'default' : healthScore > 40 ? 'secondary' : 'destructive'}
                          >
                            {healthScore}%
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Ticket Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.map(product => {
                      const productMetrics = metrics[product.slug];
                      const avgDealSize = productMetrics?.avgDealSize || 0;
                      return (
                        <div key={product.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: product.color }}
                            />
                            <span className="text-sm">{product.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(avgDealSize)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Oportunidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guilds growth potential</span>
                      <Badge variant="secondary">Alto</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doavya expansion</span>
                      <Badge variant="secondary">Médio</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cross-selling opportunity</span>
                      <Badge variant="secondary">Alto</Badge>
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

  // Single product view
  const currentMetrics = metrics[activeProduct] || {
    totalLeads: 0,
    conversionRate: 0,
    activeDeals: 0,
    totalValue: 0,
    avgDealSize: 0,
    pipelineHealth: 0
  };

  const productColor = getProductColor(activeProduct);
  const productName = getProductName(activeProduct);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ProductFilter compact />

      {/* Single Product Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: productColor }}
          />
          <h2 className="text-2xl font-bold">{productName}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <ProductMetricsCard
            title="Total de Leads"
            value={currentMetrics.totalLeads}
            icon={Users}
            color={productColor}
            isLoading={isLoading}
          />
          <ProductMetricsCard
            title="Taxa de Conversão"
            value={formatPercentage(currentMetrics.conversionRate)}
            icon={Target}
            color={productColor}
            isLoading={isLoading}
          />
          <ProductMetricsCard
            title="Negócios Ativos"
            value={currentMetrics.activeDeals}
            icon={Activity}
            color={productColor}
            isLoading={isLoading}
          />
          <ProductMetricsCard
            title="Valor Total"
            value={formatCurrency(currentMetrics.totalValue)}
            icon={DollarSign}
            color={productColor}
            isLoading={isLoading}
          />
        </div>

        {/* Product-specific insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights - {productName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pipeline Health</span>
                    <Badge variant={currentMetrics.pipelineHealth > 70 ? 'default' : 'secondary'}>
                      {currentMetrics.pipelineHealth}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ticket Médio</span>
                    <span className="font-medium">{formatCurrency(currentMetrics.avgDealSize)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Recomendações</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {activeProduct === 'guilds' && (
                    <>
                      <p>• Otimizar processo de qualificação</p>
                      <p>• Expandir canais de captação</p>
                    </>
                  )}
                  {activeProduct === 'doavya' && (
                    <>
                      <p>• Fortalecer relacionamento com parceiro</p>
                      <p>• Criar fluxos específicos</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}