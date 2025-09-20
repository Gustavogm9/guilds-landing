import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Prediction {
  category: string;
  description: string;
  confidence: number;
  impact: string;
  timeframe: string;
}

interface Anomaly {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  affected_area: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimated_impact: string;
  implementation_difficulty: string;
  category: string;
}

interface Trend {
  name: string;
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  timeframe: string;
  significance: 'low' | 'medium' | 'high';
}

export const useFinancialAnalytics = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);

  // Gerar previsões usando IA
  const generatePredictions = useMutation({
    mutationFn: async (period: string) => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'predictions',
          period,
          data_sources: ['transactions', 'receivables', 'payables']
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setPredictions(data.predictions || []);
      toast.success('Previsões geradas com sucesso!');
    },
    onError: (error) => {
      toast.error(`Erro ao gerar previsões: ${error.message}`);
    },
  });

  // Detectar anomalias
  const detectAnomalies = useMutation({
    mutationFn: async (period: string) => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'anomaly_detection',
          period,
          sensitivity: 'medium'
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setAnomalies(data.anomalies || []);
      toast.success('Análise de anomalias concluída!');
    },
    onError: (error) => {
      toast.error(`Erro na detecção de anomalias: ${error.message}`);
    },
  });

  // Gerar recomendações
  const getRecommendations = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'recommendations',
          context: 'complete_financial_analysis'
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setRecommendations(data.recommendations || []);
      toast.success('Recomendações geradas!');
    },
    onError: (error) => {
      toast.error(`Erro ao gerar recomendações: ${error.message}`);
    },
  });

  // Análise de tendências
  const analyzeTrends = useMutation({
    mutationFn: async (timeframe: string) => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'trend_analysis',
          timeframe,
          metrics: ['revenue', 'expenses', 'cash_flow', 'profitability']
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setTrends(data.trends || []);
      toast.success('Análise de tendências concluída!');
    },
    onError: (error) => {
      toast.error(`Erro na análise de tendências: ${error.message}`);
    },
  });

  // Buscar histórico de análises (mock data por enquanto)
  const analysisHistory = [
    { id: '1', analysis_type: 'predictions', created_at: new Date().toISOString() },
    { id: '2', analysis_type: 'anomalies', created_at: new Date().toISOString() }
  ];

  // Score de saúde financeira
  const calculateHealthScore = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'health_score',
          metrics: ['liquidity', 'profitability', 'efficiency', 'risk']
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Score de saúde: ${data.overall_score}/100`);
    },
    onError: (error) => {
      toast.error(`Erro no cálculo do score: ${error.message}`);
    },
  });

  // Análise comparativa (benchmarking)
  const runBenchmarkAnalysis = useMutation({
    mutationFn: async (industry: string) => {
      const { data, error } = await supabase.functions.invoke('financial-ai-analysis', {
        body: {
          analysis_type: 'benchmark',
          industry,
          metrics: ['revenue_growth', 'profit_margin', 'operational_efficiency']
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success('Análise comparativa concluída!');
    },
    onError: (error) => {
      toast.error(`Erro na análise comparativa: ${error.message}`);
    },
  });

  return {
    // Data
    predictions,
    anomalies,
    recommendations,
    trends,
    analysisHistory,
    
    // Actions
    generatePredictions: generatePredictions.mutate,
    detectAnomalies: detectAnomalies.mutate,
    getRecommendations: getRecommendations.mutate,
    analyzeTrends: analyzeTrends.mutate,
    calculateHealthScore: calculateHealthScore.mutate,
    runBenchmarkAnalysis: runBenchmarkAnalysis.mutate,
    
    // Loading states
    isGeneratingPredictions: generatePredictions.isPending,
    isDetectingAnomalies: detectAnomalies.isPending,
    isGeneratingRecommendations: getRecommendations.isPending,
    isAnalyzingTrends: analyzeTrends.isPending,
    isCalculatingHealthScore: calculateHealthScore.isPending,
    isRunningBenchmark: runBenchmarkAnalysis.isPending,
    
    // Utils
    setPredictions,
    setAnomalies,
    setRecommendations,
    setTrends
  };
};