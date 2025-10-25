import { useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ICPHealthPanelProps {
  activeCriteriaCount: number;
  totalWeight: number;
  missingFields?: string[];
  incompleteContactsPercent?: number;
  onAutoFix?: (fixes: any[]) => void;
}

export function ICPHealthPanel({
  activeCriteriaCount,
  totalWeight,
  missingFields = [],
  incompleteContactsPercent = 0,
  onAutoFix
}: ICPHealthPanelProps) {
  const [showFixDialog, setShowFixDialog] = useState(false);
  const issues: { type: 'error' | 'warning' | 'info'; message: string }[] = [];

  // Check criteria count
  if (activeCriteriaCount === 0) {
    issues.push({
      type: 'error',
      message: 'Nenhum critério de ICP ativo. Configure ao menos 3 critérios para começar.'
    });
  } else if (activeCriteriaCount < 3) {
    issues.push({
      type: 'warning',
      message: `Apenas ${activeCriteriaCount} critério(s) ativo(s). Recomendamos pelo menos 3-5 critérios.`
    });
  }

  // Check weight balance
  if (totalWeight !== 100 && activeCriteriaCount > 0) {
    issues.push({
      type: 'warning',
      message: `Peso total: ${totalWeight}%. Recomendamos ajustar para 100% para melhor precisão.`
    });
  }

  // Check missing fields
  if (missingFields.length > 0) {
    issues.push({
      type: 'warning',
      message: `${missingFields.length} campo(s) não estão no formulário de contato: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}`
    });
  }

  // Check incomplete contacts
  if (incompleteContactsPercent > 50) {
    issues.push({
      type: 'info',
      message: `${incompleteContactsPercent}% dos contatos têm dados de ICP incompletos. Considere uma campanha de enriquecimento.`
    });
  }

  const healthScore = calculateHealthScore({
    activeCriteriaCount,
    totalWeight,
    missingFieldsCount: missingFields.length,
    incompleteContactsPercent
  });

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Crítico";
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Saúde do Sistema ICP
          </CardTitle>
          <CardDescription>
            Status atual da configuração e qualidade dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Health Score */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Score de Saúde</div>
              <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getHealthLabel(healthScore)}
              </div>
            </div>
            <div className="w-32">
              <Progress value={healthScore} className="h-2" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                {activeCriteriaCount > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm font-medium">Critérios Ativos</span>
              </div>
              <div className="text-2xl font-bold">{activeCriteriaCount}</div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                {totalWeight === 100 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium">Peso Total</span>
              </div>
              <div className="text-2xl font-bold">{totalWeight}%</div>
            </div>
          </div>

          {/* Issues List */}
          {issues.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Pontos de Atenção:</div>
              {issues.map((issue, index) => (
                <Alert key={index} variant={issue.type === 'error' ? 'destructive' : 'default'}>
                  <div className="flex items-start gap-2">
                    {issue.type === 'error' && <AlertCircle className="h-4 w-4 mt-0.5" />}
                    {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 mt-0.5" />}
                    {issue.type === 'info' && <Info className="h-4 w-4 mt-0.5" />}
                    <AlertDescription className="text-xs">{issue.message}</AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* Success State */}
          {issues.length === 0 && activeCriteriaCount > 0 && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                Sistema ICP configurado corretamente! Todos os critérios estão balanceados e prontos para uso.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          {issues.length > 0 && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowFixDialog(true)}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Corrigir Problemas
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Fix Problems Dialog */}
      <Dialog open={showFixDialog} onOpenChange={setShowFixDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Sugestões de Correção</DialogTitle>
            <DialogDescription>
              Revise e aplique as correções sugeridas abaixo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {/* Weight Adjustment */}
            {totalWeight !== 100 && activeCriteriaCount > 0 && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <div className="font-medium">Ajustar Peso Total</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  O peso total está em {totalWeight}%. Podemos ajustar proporcionalmente para 100%.
                </p>
                <div className="text-xs text-muted-foreground">
                  Isso distribuirá o peso de forma proporcional entre todos os critérios ativos.
                </div>
              </div>
            )}

            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  <div className="font-medium">Campos Ausentes no Formulário</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Os seguintes campos usados nos critérios não estão no formulário de contato:
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {missingFields.map(field => (
                    <Badge key={field} variant="outline">{field}</Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Estes campos precisarão ser preenchidos manualmente ou via enriquecimento automático.
                </div>
              </div>
            )}

            {/* Incomplete Contacts */}
            {incompleteContactsPercent > 50 && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <div className="font-medium">Dados Incompletos</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {incompleteContactsPercent}% dos contatos têm dados de ICP incompletos ou score baixo.
                </p>
                <div className="text-xs text-muted-foreground">
                  Recomendamos executar uma campanha de enriquecimento de dados ou revisar os critérios.
                </div>
              </div>
            )}

            {/* No Active Criteria */}
            {activeCriteriaCount === 0 && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <div className="font-medium">Nenhum Critério Ativo</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Você precisa criar e ativar pelo menos 3 critérios de ICP para começar.
                </p>
                <div className="text-xs text-muted-foreground">
                  Use a aba "Templates" para começar rapidamente com critérios pré-configurados.
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFixDialog(false)}>
              Fechar
            </Button>
            {(totalWeight !== 100 || activeCriteriaCount === 0) && onAutoFix && (
              <Button onClick={() => {
                onAutoFix([{ type: 'rebalance_weights' }]);
                setShowFixDialog(false);
              }}>
                Aplicar Correções
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function calculateHealthScore({
  activeCriteriaCount,
  totalWeight,
  missingFieldsCount,
  incompleteContactsPercent
}: {
  activeCriteriaCount: number;
  totalWeight: number;
  missingFieldsCount: number;
  incompleteContactsPercent: number;
}): number {
  let score = 0;

  // Criteria count (30 points)
  if (activeCriteriaCount >= 5) score += 30;
  else if (activeCriteriaCount >= 3) score += 20;
  else if (activeCriteriaCount > 0) score += 10;

  // Weight balance (30 points)
  const weightDiff = Math.abs(100 - totalWeight);
  if (weightDiff === 0) score += 30;
  else if (weightDiff <= 10) score += 20;
  else if (weightDiff <= 20) score += 10;

  // Missing fields (20 points)
  if (missingFieldsCount === 0) score += 20;
  else if (missingFieldsCount <= 2) score += 10;

  // Data quality (20 points)
  if (incompleteContactsPercent <= 20) score += 20;
  else if (incompleteContactsPercent <= 50) score += 10;

  return Math.min(100, Math.max(0, score));
}