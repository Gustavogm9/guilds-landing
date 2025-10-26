import { RefreshCw, TrendingUp, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadScoringRulesManager } from "./LeadScoringRulesManager";
import { ICPCriteriaManager } from "./ICPCriteriaManager";
import { LeadScoringDashboard } from "../crm/lead-scoring/LeadScoringDashboard";
import { ICPHealthPanel } from "./icp/ICPHealthPanel";
import { useLeadScoring } from "@/hooks/useLeadScoring";
import { getMissingFieldsFromCriteria } from "@/lib/icpValidation";
import { toast } from "sonner";

export function LeadScoringAdmin() {
  const { 
    rules, 
    icpCriteria, 
    icpHealthData, 
    healthLoading, 
    recalculateScores, 
    isRecalculating,
    updateCriteria
  } = useLeadScoring();

  const activeRulesCount = rules?.filter(r => r.is_active).length || 0;
  const activeCriteriaCount = icpCriteria?.filter(c => c.is_active).length || 0;
  const totalWeight = icpCriteria?.reduce((sum, c) => c.is_active ? sum + c.weight : sum, 0) || 0;
  const missingFields = getMissingFieldsFromCriteria(icpCriteria || []);

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Scoring & ICP</h1>
          <p className="text-muted-foreground mt-1">
            Configure as regras de pontuação e defina seu perfil de cliente ideal
          </p>
        </div>
        <Button 
          onClick={() => recalculateScores()} 
          disabled={isRecalculating}
          size="lg"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
          {isRecalculating ? "Recalculando..." : "Recalcular Todos os Scores"}
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRulesCount}</div>
            <p className="text-xs text-muted-foreground">
              {rules?.length || 0} regras no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critérios de ICP</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCriteriaCount}</div>
            <p className="text-xs text-muted-foreground">
              {icpCriteria?.length || 0} critérios configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Total ICP</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWeight}%</div>
            <p className="text-xs text-muted-foreground">
              {totalWeight === 100 ? "✓ Balanceado" : totalWeight > 100 ? "⚠️ Acima de 100%" : "⚠️ Abaixo de 100%"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="rules">Regras de Scoring</TabsTrigger>
          <TabsTrigger value="icp">Critérios de ICP</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <LeadScoringDashboard />
            </div>
            <div>
              <ICPHealthPanel
                activeCriteriaCount={activeCriteriaCount}
                totalWeight={totalWeight}
                missingFields={missingFields}
                incompleteContactsPercent={icpHealthData?.incompleteContactsPercent}
                allCriteria={icpCriteria || []}
                onAutoFix={async (fixes) => {
                  // Apply automatic fixes
                  for (const fix of fixes) {
                    if (fix.type === 'update_weight') {
                      await updateCriteria({ 
                        id: fix.criterionId, 
                        updates: { weight: fix.newWeight } 
                      });
                    }
                  }
                  
                  // Re-validate total weight after all fixes
                  const updatedCriteria = icpCriteria?.filter(c => c.is_active) || [];
                  const finalTotal = updatedCriteria.reduce((sum, c) => sum + (c.weight || 0), 0);
                  
                  if (Math.abs(finalTotal - 100) > 0.01 && updatedCriteria.length > 0) {
                    // Adjust first criterion to compensate for rounding
                    const adjustment = 100 - finalTotal;
                    await updateCriteria({
                      id: updatedCriteria[0].id,
                      updates: { weight: updatedCriteria[0].weight + adjustment }
                    });
                  }
                  
                  toast.success('Pesos ajustados automaticamente para 100%');
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <LeadScoringRulesManager />
        </TabsContent>

        <TabsContent value="icp" className="space-y-4">
          <ICPCriteriaManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
