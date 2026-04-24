import { useState, useEffect } from 'react';
import type { DashboardData } from '@/components/raiox/dashboard/mockData';
import { MOCK_DASHBOARD_DATA } from '@/components/raiox/dashboard/mockData';
import { supabaseRaiox } from '@/lib/supabase-raiox';
import { useDiagnostic } from './useDiagnostic';

export function useDashboardData() {
  const { diagnostic } = useDiagnostic();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!diagnostic?.id || diagnostic.status !== 'completed') {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch scores
        const { data: scores, error: scoresError } = await supabaseRaiox
          .from('diagnostic_scores')
          .select('*')
          .eq('diagnostic_id', diagnostic.id)
          .single();

        if (scoresError) throw scoresError;

        // Fetch narratives
        const { data: narratives, error: narrativesError } = await supabaseRaiox
          .from('diagnostic_narratives')
          .select('section_id, content')
          .eq('diagnostic_id', diagnostic.id);

        if (narrativesError) throw narrativesError;

        if (!scores || !narratives || narratives.length === 0) {
          throw new Error('Dados incompletos');
        }

        // Map narratives to object
        const narrativesMap: Record<string, any> = {};
        narratives.forEach(n => {
          narrativesMap[n.section_id] = n.content;
        });

        // Construct DashboardData
        const dashboardData: DashboardData = {
          companyName: narrativesMap.empresa?.name || 'Sua Empresa',
          financialLoss: scores.annual_loss_estimate || 0,
          fitScore: {
            total: scores.fit_score || 0,
            factors: []
          },
          maturity: {
            score: scores.overall_score || 0,
            level: narrativesMap.maturidade?.headline || 'Nível Analisado',
            description: narrativesMap.empresa?.synopsis || 'Análise baseada nas respostas.',
            dimensions: {
              processos: scores.processos_score || 0,
              tecnologia: scores.sistemas_score || 0,
              dados: scores.dados_score || 0,
              pessoas: scores.pessoas_score || 0
            }
          },
          market: {
            icpFit: 0,
            positioning: narrativesMap.mercado?.positioning || '',
            competitorIndex: narrativesMap.comunicacao?.score || 0
          },
          phase: {
            id: 'phase_1',
            name: 'Estruturação',
            description: 'Foco em estabilizar processos.',
            color: '#3B82F6',
            metrics: narrativesMap.kpis || []
          },
          roadmap: narrativesMap.plano?.actions || [],
          // Keep some mock defaults if the AI didn't generate them perfectly
          bottlenecks: narrativesMap.maturidade?.gaps || MOCK_DASHBOARD_DATA.bottlenecks,
          efficiency: MOCK_DASHBOARD_DATA.efficiency
        };

        setData(dashboardData);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Ocorreu um erro ao carregar seu dashboard.');
        // Fallback to mock data during initial tests if real data fails
        // setData(MOCK_DASHBOARD_DATA);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [diagnostic?.id, diagnostic?.status]);

  return { data, loading, error, diagnostic };
}
