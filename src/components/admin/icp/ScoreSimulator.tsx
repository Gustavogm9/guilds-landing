import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScoreSimulatorProps {
  criteria: any[];
}

export function ScoreSimulator({ criteria }: ScoreSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const simulateScores = async () => {
    setIsSimulating(true);
    try {
      // Buscar sample de 100 contatos
      const { data: contacts, error } = await supabase
        .from('crm_contacts')
        .select('id, name, company, job_title, company_size, industry, budget_range, decision_timeline, icp_score')
        .eq('is_active', true)
        .limit(100);

      if (error) throw error;

      if (!contacts || contacts.length === 0) {
        toast.error('Nenhum contato encontrado para simulação');
        return;
      }

      // Simular scores para cada contato
      const simulatedScores = contacts.map(contact => {
        let score = 0;
        const matches: string[] = [];

        criteria.forEach(criterion => {
          if (!criterion.is_active) return;

          const field = criterion.criterion_field;
          const contactValue = contact[field as keyof typeof contact];
          const targetValues = criterion.target_values || [];

          let matched = false;
          if (Array.isArray(contactValue)) {
            matched = contactValue.some(val => targetValues.includes(val));
          } else if (contactValue !== null && contactValue !== undefined) {
            matched = targetValues.includes(contactValue);
          }

          if (matched) {
            score += criterion.weight || 0;
            matches.push(criterion.criterion_name);
          }
        });

        return {
          contact_id: contact.id,
          contact_name: contact.name,
          contact_company: contact.company,
          simulated_score: Math.min(100, Math.round(score)),
          current_score: contact.icp_score || 0,
          matched_criteria: matches
        };
      });

      // Calcular distribuição
      const distribution = {
        '0-20%': simulatedScores.filter(s => s.simulated_score >= 0 && s.simulated_score < 20).length,
        '20-40%': simulatedScores.filter(s => s.simulated_score >= 20 && s.simulated_score < 40).length,
        '40-60%': simulatedScores.filter(s => s.simulated_score >= 40 && s.simulated_score < 60).length,
        '60-80%': simulatedScores.filter(s => s.simulated_score >= 60 && s.simulated_score < 80).length,
        '80-100%': simulatedScores.filter(s => s.simulated_score >= 80 && s.simulated_score <= 100).length,
      };

      const avgScore = Math.round(
        simulatedScores.reduce((sum, s) => sum + s.simulated_score, 0) / simulatedScores.length
      );

      const highFitCount = simulatedScores.filter(s => s.simulated_score >= 80).length;
      const mediumFitCount = simulatedScores.filter(s => s.simulated_score >= 60 && s.simulated_score < 80).length;

      setResults({
        total_contacts: contacts.length,
        avg_score: avgScore,
        high_fit_count: highFitCount,
        medium_fit_count: mediumFitCount,
        distribution,
        top_contacts: simulatedScores
          .sort((a, b) => b.simulated_score - a.simulated_score)
          .slice(0, 10)
      });

      toast.success(`Simulação concluída para ${contacts.length} contatos`);
    } catch (error) {
      console.error('Erro na simulação:', error);
      toast.error('Erro ao simular scores');
    } finally {
      setIsSimulating(false);
    }
  };

  const chartData = results ? Object.entries(results.distribution).map(([range, count]) => ({
    range,
    count,
    fill: range === '80-100%' ? 'hsl(var(--primary))' :
          range === '60-80%' ? 'hsl(var(--chart-2))' :
          range === '40-60%' ? 'hsl(var(--chart-3))' :
          range === '20-40%' ? 'hsl(var(--chart-4))' :
          'hsl(var(--muted))'
  })) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Simulador de Scores</h3>
          <p className="text-sm text-muted-foreground">
            Teste como os critérios atuais afetariam os scores dos contatos
          </p>
        </div>
        <Button onClick={simulateScores} disabled={isSimulating || criteria.length === 0}>
          <Sparkles className="h-4 w-4 mr-2" />
          {isSimulating ? 'Simulando...' : 'Simular Scores'}
        </Button>
      </div>

      {results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Analisado</span>
                </div>
                <p className="text-2xl font-bold mt-2">{results.total_contacts}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Score Médio</span>
                </div>
                <p className="text-2xl font-bold mt-2">{results.avg_score}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <span className="text-sm text-muted-foreground">High ICP Fit</span>
                <p className="text-2xl font-bold mt-2 text-primary">
                  {results.high_fit_count}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({Math.round((results.high_fit_count / results.total_contacts) * 100)}%)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <span className="text-sm text-muted-foreground">Medium ICP Fit</span>
                <p className="text-2xl font-bold mt-2 text-chart-2">
                  {results.medium_fit_count}
                </p>
                <p className="text-xs text-muted-foreground">
                  ({Math.round((results.medium_fit_count / results.total_contacts) * 100)}%)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Contatos (Score Simulado)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.top_contacts.map((contact: any, idx: number) => (
                  <div
                    key={contact.contact_id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        #{idx + 1} {contact.contact_name}
                      </p>
                      {contact.contact_company && (
                        <p className="text-sm text-muted-foreground">{contact.contact_company}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.matched_criteria.slice(0, 3).map((criterion: string) => (
                          <Badge key={criterion} variant="secondary" className="text-xs">
                            {criterion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {contact.simulated_score}%
                      </div>
                      {contact.current_score > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Atual: {contact.current_score}%
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
