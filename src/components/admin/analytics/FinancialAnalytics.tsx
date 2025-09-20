import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  Target,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import { useFinancialAnalytics } from '@/hooks/useFinancialAnalytics';

export const FinancialAnalytics = () => {
  const { 
    predictions, 
    anomalies, 
    recommendations, 
    trends,
    generatePredictions,
    detectAnomalies,
    getRecommendations,
    isGeneratingPredictions,
    isDetectingAnomalies,
    isGeneratingRecommendations
  } = useFinancialAnalytics();

  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Análise Financeira com IA</h2>
          <p className="text-muted-foreground">
            Insights inteligentes e análise preditiva para suas finanças
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => generatePredictions(selectedPeriod)}
            disabled={isGeneratingPredictions}
          >
            <Brain className="w-4 h-4 mr-2" />
            Gerar Previsões
          </Button>
          <Button 
            variant="outline"
            onClick={() => detectAnomalies(selectedPeriod)}
            disabled={isDetectingAnomalies}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Detectar Anomalias
          </Button>
        </div>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fluxo de Caixa (30 dias)
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  R$ 45.230,00
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-success">+12.5%</span> vs período anterior
                </p>
                <Progress value={75} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receitas Previstas
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 78.540,00</div>
                <p className="text-xs text-muted-foreground">
                  Confiança: <Badge variant="secondary">87%</Badge>
                </p>
                <Progress value={87} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Despesas Esperadas
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  R$ 33.310,00
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-destructive">+5.2%</span> vs período anterior
                </p>
                <Progress value={52} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {predictions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Análise Preditiva Detalhada
                </CardTitle>
                <CardDescription>
                  Baseada em dados históricos e tendências do mercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictions.map((prediction, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold">{prediction.category}</h4>
                      <p className="text-sm text-muted-foreground">
                        {prediction.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={prediction.confidence > 80 ? "default" : "secondary"}
                        >
                          {prediction.confidence}% confiança
                        </Badge>
                        <Badge variant="outline">
                          {prediction.impact}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Anomalias Detectadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Despesa Atípica:</strong> Gasto 340% acima da média em "Marketing Digital" detectado em 15/01
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Padrão Incomum:</strong> Receitas 60% abaixo do esperado nos últimos 3 dias
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tendência:</strong> Aumento gradual de 25% nas despesas operacionais (últimos 7 dias)
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score de Saúde Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-warning">78</div>
                  <Progress value={78} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Boa saúde financeira com alguns pontos de atenção
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Liquidez</div>
                      <Badge variant="default">Excelente</Badge>
                    </div>
                    <div>
                      <div className="font-semibold">Rentabilidade</div>
                      <Badge variant="secondary">Boa</Badge>
                    </div>
                    <div>
                      <div className="font-semibold">Eficiência</div>
                      <Badge variant="secondary">Boa</Badge>
                    </div>
                    <div>
                      <div className="font-semibold">Risco</div>
                      <Badge variant="destructive">Médio</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Otimização de Custos",
                icon: <Target className="w-5 h-5" />,
                priority: "Alta",
                impact: "R$ 8.500/mês",
                actions: [
                  "Renegociar contrato de software (economia estimada: R$ 3.200/mês)",
                  "Consolidar fornecedores de marketing (economia: R$ 2.800/mês)",
                  "Automatizar processo de cobrança (economia: R$ 2.500/mês)"
                ]
              },
              {
                title: "Melhoria de Fluxo de Caixa",
                icon: <Zap className="w-5 h-5" />,
                priority: "Média",
                impact: "R$ 15.200/mês",
                actions: [
                  "Implementar desconto para pagamento à vista (aumento: R$ 5.400/mês)",
                  "Reduzir prazo de cobrança de 30 para 15 dias",
                  "Diversificar canais de receita (potencial: R$ 9.800/mês)"
                ]
              },
              {
                title: "Gestão de Risco",
                icon: <AlertTriangle className="w-5 h-5" />,
                priority: "Alta",
                impact: "Proteção",
                actions: [
                  "Criar reserva de emergência (6 meses de despesas)",
                  "Diversificar base de clientes (reduzir dependência)",
                  "Implementar seguro contra inadimplência"
                ]
              }
            ].map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {rec.icon}
                    {rec.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge 
                      variant={rec.priority === "Alta" ? "destructive" : "secondary"}
                    >
                      Prioridade {rec.priority}
                    </Badge>
                    <Badge variant="outline">
                      Impacto: {rec.impact}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rec.actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Implementar Recomendação
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Tendências Positivas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-success pl-3">
                  <p className="font-semibold">Receita Recorrente</p>
                  <p className="text-sm text-muted-foreground">
                    +35% nos últimos 3 meses
                  </p>
                </div>
                <div className="border-l-4 border-success pl-3">
                  <p className="font-semibold">Margem de Lucro</p>
                  <p className="text-sm text-muted-foreground">
                    +12% comparado ao trimestre anterior
                  </p>
                </div>
                <div className="border-l-4 border-success pl-3">
                  <p className="font-semibold">Eficiência Operacional</p>
                  <p className="text-sm text-muted-foreground">
                    Melhoria de 18% no índice geral
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-warning" />
                  Pontos de Atenção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-warning pl-3">
                  <p className="font-semibold">Custos de Aquisição</p>
                  <p className="text-sm text-muted-foreground">
                    +22% nos últimos 2 meses
                  </p>
                </div>
                <div className="border-l-4 border-warning pl-3">
                  <p className="font-semibold">Prazo de Pagamento</p>
                  <p className="text-sm text-muted-foreground">
                    Aumento médio de 8 dias
                  </p>
                </div>
                <div className="border-l-4 border-warning pl-3">
                  <p className="font-semibold">Churn Rate</p>
                  <p className="text-sm text-muted-foreground">
                    Leve aumento de 2.3%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Oportunidades
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-primary pl-3">
                  <p className="font-semibold">Novos Mercados</p>
                  <p className="text-sm text-muted-foreground">
                    Potencial de +40% receita
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-3">
                  <p className="font-semibold">Upsell/Cross-sell</p>
                  <p className="text-sm text-muted-foreground">
                    23% dos clientes qualificados
                  </p>
                </div>
                <div className="border-l-4 border-primary pl-3">
                  <p className="font-semibold">Automação</p>
                  <p className="text-sm text-muted-foreground">
                    Economia estimada: R$ 12k/mês
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};