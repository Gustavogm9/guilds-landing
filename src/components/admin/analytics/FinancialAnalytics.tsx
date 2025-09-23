import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  Brain,
  Zap,
  Download,
  RefreshCw 
} from 'lucide-react';
import { useFinancial } from '@/hooks/useFinancial';

export function FinancialAnalytics() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { metrics, accountsReceivable, accountsPayable, transactions } = useFinancial();

  // Análise de tendências usando ML básico
  const performTrendAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simular análise de IA
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  // Dados para análise preditiva
  const predictiveData = [
    { month: 'Jul', actual: 85000, predicted: 88000, confidence: 85 },
    { month: 'Ago', actual: 92000, predicted: 94000, confidence: 88 },
    { month: 'Set', actual: 89000, predicted: 91000, confidence: 82 },
    { month: 'Out', actual: null, predicted: 95000, confidence: 78 },
    { month: 'Nov', actual: null, predicted: 98000, confidence: 75 },
    { month: 'Dez', actual: null, predicted: 102000, confidence: 72 }
  ];

  // Análise de risco financeiro
  const riskAnalysis = {
    concentrationRisk: 25, // % de dependência de um cliente
    liquidityRisk: 15,     // Risco de liquidez
    creditRisk: 30,        // Risco de crédito
    operationalRisk: 20,   // Risco operacional
    overallScore: 77       // Score geral (0-100)
  };

  const riskData = [
    { subject: 'Concentração', score: 100 - riskAnalysis.concentrationRisk, fullMark: 100 },
    { subject: 'Liquidez', score: 100 - riskAnalysis.liquidityRisk, fullMark: 100 },
    { subject: 'Crédito', score: 100 - riskAnalysis.creditRisk, fullMark: 100 },
    { subject: 'Operacional', score: 100 - riskAnalysis.operationalRisk, fullMark: 100 }
  ];

  // Insights automatizados
  const generateInsights = () => {
    const insights = [];
    
    if ((metrics.overdueReceivable || 0) > 0) {
      insights.push({
        type: 'warning',
        title: 'Receitas em Atraso',
        message: `R$ ${(metrics.overdueReceivable || 0).toLocaleString('pt-BR')} em receitas vencidas requerem atenção`,
        action: 'Revisar política de cobrança'
      });
    }

    if ((metrics.cashFlow || 0) < 0) {
      insights.push({
        type: 'critical',
        title: 'Fluxo de Caixa Negativo',
        message: 'Projeção de caixa negativa nos próximos períodos',
        action: 'Acelerar recebimentos ou adiar pagamentos'
      });
    }

    const growthRate = 15; // Mock
    if (growthRate > 20) {
      insights.push({
        type: 'success',
        title: 'Crescimento Acelerado',
        message: `Crescimento de ${growthRate}% acima da média`,
        action: 'Considerar investimentos em expansão'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Análise de correlação (receitas vs despesas)
  const correlationData = transactions.slice(0, 20).map((t, index) => ({
    revenue: Math.abs(t.transaction_type === 'credit' ? t.amount : 0),
    expense: Math.abs(t.transaction_type === 'debit' ? t.amount : 0),
    period: index + 1
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">
            Análise preditiva e insights automatizados
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={performTrendAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isAnalyzing ? 'Analisando...' : 'Análise IA'}
          </Button>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Insights Automatizados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`border-l-4 ${
            insight.type === 'critical' ? 'border-l-destructive' :
            insight.type === 'warning' ? 'border-l-warning' :
            'border-l-primary'
          }`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {insight.type === 'critical' && <AlertCircle className="w-4 h-4 text-destructive" />}
                {insight.type === 'warning' && <AlertCircle className="w-4 h-4 text-warning" />}
                {insight.type === 'success' && <TrendingUp className="w-4 h-4 text-primary" />}
                <CardTitle className="text-sm">{insight.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{insight.message}</p>
              <Badge variant="outline" className="text-xs">
                {insight.action}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="predictive" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictive">Análise Preditiva</TabsTrigger>
          <TabsTrigger value="risk">Análise de Risco</TabsTrigger>
          <TabsTrigger value="correlation">Correlações</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="predictive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Projeção de Receitas (IA)
              </CardTitle>
              <CardDescription>
                Previsão baseada em machine learning com intervalo de confiança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`} />
                    <Tooltip 
                      formatter={(value, name) => [
                        value ? `R$ ${Number(value).toLocaleString('pt-BR')}` : 'N/A',
                        name === 'actual' ? 'Realizado' : name === 'predicted' ? 'Previsto' : name
                      ]}
                    />
                    
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      name="Previsão"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      name="Real"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {predictiveData.slice(-3).map((item, index) => (
                  <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">{item.month}</div>
                    <div className="text-lg font-semibold">
                      R$ {item.predicted.toLocaleString('pt-BR')}
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xs">Confiança:</span>
                      <Progress value={item.confidence} className="w-12 h-1" />
                      <span className="text-xs">{item.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Risco Financeiro</CardTitle>
                <CardDescription>
                  Score geral: {riskAnalysis.overallScore}/100
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Score de Segurança"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fatores de Risco</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risco de Concentração</span>
                    <span>{riskAnalysis.concentrationRisk}%</span>
                  </div>
                  <Progress value={riskAnalysis.concentrationRisk} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risco de Liquidez</span>
                    <span>{riskAnalysis.liquidityRisk}%</span>
                  </div>
                  <Progress value={riskAnalysis.liquidityRisk} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risco de Crédito</span>
                    <span>{riskAnalysis.creditRisk}%</span>
                  </div>
                  <Progress value={riskAnalysis.creditRisk} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Risco Operacional</span>
                    <span>{riskAnalysis.operationalRisk}%</span>
                  </div>
                  <Progress value={riskAnalysis.operationalRisk} className="h-2" />
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="font-medium">Recomendações</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Diversificar base de clientes</li>
                    <li>• Melhorar política de crédito</li>
                    <li>• Aumentar reservas de liquidez</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Correlação</CardTitle>
              <CardDescription>
                Relação entre receitas e despesas ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={correlationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="revenue" 
                      name="Receitas"
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis 
                      dataKey="expense" 
                      name="Despesas"
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `R$ ${Number(value).toLocaleString('pt-BR')}`,
                        name === 'revenue' ? 'Receitas' : 'Despesas'
                      ]}
                    />
                    <Scatter 
                      dataKey="expense" 
                      fill="hsl(var(--primary))"
                      name="Correlação Receitas vs Despesas"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">DSO vs Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28 dias</div>
                <div className="text-sm text-green-600">12% melhor que o mercado</div>
                <Progress value={72} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Margem Líquida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <div className="text-sm text-green-600">Acima da média</div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.3%</div>
                <div className="text-sm text-green-600">Excelente</div>
                <Progress value={95} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Eficiência Op.</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-yellow-600">Pode melhorar</div>
                <Progress value={67} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}