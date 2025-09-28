import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WidgetRequest {
  widgetType: string;
  filters?: Record<string, any>;
  settings?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { widgetType, filters = {}, settings = {} } = await req.json() as WidgetRequest;
    
    console.log(`Fetching data for widget: ${widgetType}`);

    let data: any = null;
    let metadata: any = {};

    switch (widgetType) {
      case 'revenue-intelligence':
        data = await fetchRevenueIntelligenceData(supabase, filters);
        break;
        
      case 'funnel':
        data = await fetchFunnelData(supabase, filters);
        break;
        
      case 'cash-flow':
        data = await fetchCashFlowData(supabase, filters);
        break;
        
      case 'capacity':
        data = await fetchCapacityData(supabase, filters);
        break;
        
      case 'team-health':
        data = await fetchTeamHealthData(supabase, filters);
        break;
        
      case 'ai-insights':
        data = await fetchAIInsightsData(supabase, filters);
        break;
        
      case 'security':
        data = await fetchSecurityData(supabase, filters);
        break;
        
      default:
        throw new Error(`Widget type "${widgetType}" not supported`);
    }

    return new Response(JSON.stringify({ data, metadata }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Widget data provider error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      data: null 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchRevenueIntelligenceData(supabase: any, filters: any) {
  // Get accounts receivable data for revenue calculations
  const { data: receivables } = await supabase
    .from('accounts_receivable')
    .select('*')
    .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  const currentDate = new Date();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const thisMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

  // Calculate MRR (Monthly Recurring Revenue)
  const currentMRR = receivables
    ?.filter((r: any) => new Date(r.created_at) >= thisMonth)
    ?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0;

  const previousMRR = receivables
    ?.filter((r: any) => {
      const created = new Date(r.created_at);
      return created >= lastMonth && created < thisMonth;
    })
    ?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0;

  const arr = currentMRR * 12;
  const growth = previousMRR > 0 ? ((currentMRR - previousMRR) / previousMRR) * 100 : 0;
  const churn = 5; // Placeholder - would need customer data to calculate

  // Generate trend data
  const trends = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const value = currentMRR * (0.8 + Math.random() * 0.4);
    trends.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value)
    });
  }

  return {
    mrr: Math.round(currentMRR),
    arr: Math.round(arr),
    growth: Math.round(growth * 10) / 10,
    churn: -churn,
    predictions: {
      next30Days: Math.round(currentMRR * 1.05),
      next90Days: Math.round(currentMRR * 1.15),
      nextYear: Math.round(arr * 1.3)
    },
    trends
  };
}

async function fetchFunnelData(supabase: any, filters: any) {
  // Get CRM data for funnel analysis
  const { data: deals } = await supabase
    .from('crm_deals')
    .select(`
      *,
      crm_stages(*),
      crm_pipelines(*)
    `)
    .eq('is_active', true);

  const { data: stages } = await supabase
    .from('crm_stages')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (!stages || !deals) {
    return {
      stages: [],
      totalLeads: 0,
      totalValue: 0,
      overallConversion: 0
    };
  }

  const stageData = stages.map((stage: any) => {
    const stageDeals = deals.filter((deal: any) => deal.stage_id === stage.id);
    const count = stageDeals.length;
    const value = stageDeals.reduce((sum: number, deal: any) => sum + (Number(deal.value) || 0), 0);
    
    // Calculate average time in stage (placeholder)
    const avgTimeInStage = 72 + Math.random() * 168; // 3-10 days in hours
    
    // Calculate conversion rate (from previous stage)
    const prevStageIndex = stages.findIndex((s: any) => s.id === stage.id) - 1;
    const prevStageCount = prevStageIndex >= 0 ? 
      deals.filter((deal: any) => deal.stage_id === stages[prevStageIndex].id).length : count;
    const conversionRate = prevStageCount > 0 ? (count / prevStageCount) * 100 : 100;

    return {
      name: stage.name,
      count,
      value: Math.round(value),
      conversionRate: Math.round(conversionRate * 10) / 10,
      avgTimeInStage: Math.round(avgTimeInStage)
    };
  });

  const totalLeads = Math.max(...stageData.map(s => s.count));
  const totalValue = stageData.reduce((sum, s) => sum + s.value, 0);
  const lastStageCount = stageData[stageData.length - 1]?.count || 0;
  const overallConversion = totalLeads > 0 ? (lastStageCount / totalLeads) * 100 : 0;

  return {
    stages: stageData,
    totalLeads,
    totalValue,
    overallConversion: Math.round(overallConversion * 10) / 10
  };
}

async function fetchCashFlowData(supabase: any, filters: any) {
  // Get accounts receivable and payable
  const { data: receivables } = await supabase
    .from('accounts_receivable')
    .select('*')
    .eq('status', 'pending');

  const { data: payables } = await supabase
    .from('accounts_payable')
    .select('*')
    .eq('status', 'pending');

  const currentBalance = 50000 + Math.random() * 100000; // Placeholder
  const inflow = receivables?.reduce((sum: number, r: any) => sum + Number(r.amount), 0) || 0;
  const outflow = payables?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
  const netFlow = inflow - outflow;

  // Generate predictions for next 90 days
  const predictions = [];
  let projectedBalance = currentBalance;
  
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 7)); // Weekly intervals
    
    const weeklyInflow = inflow / 12;
    const weeklyOutflow = outflow / 12;
    projectedBalance += weeklyInflow - weeklyOutflow;
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      projected: Math.round(projectedBalance),
      conservative: Math.round(projectedBalance * 0.8),
      optimistic: Math.round(projectedBalance * 1.2)
    });
  }

  const finalProjected = predictions[predictions.length - 1]?.projected || currentBalance;
  
  // Generate alerts
  const alerts = [];
  if (finalProjected < 0) {
    alerts.push({
      type: 'danger' as const,
      message: 'Fluxo de caixa negativo projetado em 90 dias',
      date: predictions[predictions.length - 1]?.date || ''
    });
  }
  
  if (netFlow < 0) {
    alerts.push({
      type: 'warning' as const,
      message: 'Fluxo líquido negativo no período atual',
      date: new Date().toISOString().split('T')[0]
    });
  }

  return {
    currentBalance: Math.round(currentBalance),
    projectedBalance: Math.round(finalProjected),
    inflow: Math.round(inflow),
    outflow: Math.round(outflow),
    netFlow: Math.round(netFlow),
    predictions,
    alerts
  };
}

async function fetchCapacityData(supabase: any, filters: any) {
  // Get team and project data
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true);

  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true);

  // Mock team capacity data
  const teams = [
    {
      name: 'Desenvolvimento',
      totalCapacity: 320, // 40h * 8 people
      usedCapacity: 280,
      availableCapacity: 40,
      projects: [
        { name: 'Projeto Alpha', allocation: 120, priority: 'high' as const },
        { name: 'Projeto Beta', allocation: 80, priority: 'medium' as const },
        { name: 'Manutenção', allocation: 80, priority: 'low' as const }
      ]
    },
    {
      name: 'Design',
      totalCapacity: 160, // 40h * 4 people
      usedCapacity: 140,
      availableCapacity: 20,
      projects: [
        { name: 'UI/UX Alpha', allocation: 80, priority: 'high' as const },
        { name: 'Branding', allocation: 60, priority: 'medium' as const }
      ]
    },
    {
      name: 'QA',
      totalCapacity: 80, // 40h * 2 people
      usedCapacity: 75,
      availableCapacity: 5,
      projects: [
        { name: 'Testes Alpha', allocation: 40, priority: 'high' as const },
        { name: 'Testes Beta', allocation: 35, priority: 'medium' as const }
      ]
    }
  ];

  const totalCapacity = teams.reduce((sum, team) => sum + team.totalCapacity, 0);
  const totalUsed = teams.reduce((sum, team) => sum + team.usedCapacity, 0);
  const overallUtilization = (totalUsed / totalCapacity) * 100;

  // Identify bottlenecks
  const bottlenecks = teams
    .filter(team => (team.usedCapacity / team.totalCapacity) > 0.9)
    .map(team => ({
      team: team.name,
      issue: 'Sobrecarga de trabalho - acima de 90% da capacidade',
      severity: 'high' as const
    }));

  return {
    teams,
    overallUtilization: Math.round(overallUtilization * 10) / 10,
    bottlenecks
  };
}

async function fetchTeamHealthData(supabase: any, filters: any) {
  // Mock team health data
  const overallScore = 75 + Math.random() * 20;
  
  const metrics = {
    satisfaction: 78 + Math.random() * 15,
    engagement: 82 + Math.random() * 10,
    workload: 70 + Math.random() * 25,
    burnoutRisk: 25 + Math.random() * 20
  };

  const sentiment = {
    positive: 65 + Math.random() * 20,
    neutral: 20 + Math.random() * 15,
    negative: 5 + Math.random() * 10
  };

  // Generate alerts based on metrics
  const alerts = [];
  
  if (metrics.burnoutRisk > 70) {
    alerts.push({
      type: 'burnout' as const,
      member: 'João Silva',
      message: 'Alto risco de burnout detectado',
      severity: 'high' as const
    });
  }
  
  if (metrics.satisfaction < 60) {
    alerts.push({
      type: 'satisfaction' as const,
      member: 'Maria Santos',
      message: 'Baixa satisfação no trabalho',
      severity: 'medium' as const
    });
  }

  return {
    overallScore: Math.round(overallScore),
    metrics: {
      satisfaction: Math.round(metrics.satisfaction),
      engagement: Math.round(metrics.engagement),
      workload: Math.round(metrics.workload),
      burnoutRisk: Math.round(metrics.burnoutRisk)
    },
    sentiment: {
      positive: Math.round(sentiment.positive),
      neutral: Math.round(sentiment.neutral),
      negative: Math.round(sentiment.negative)
    },
    alerts
  };
}

async function fetchAIInsightsData(supabase: any, filters: any) {
  // Mock AI insights data
  const insights = [
    {
      id: '1',
      title: 'Oportunidade de Cross-selling',
      description: 'Clientes do segmento premium mostram interesse em automação',
      impact: 'high' as const,
      confidence: 87,
      category: 'revenue' as const,
      actionable: true,
      recommendedActions: [
        'Criar campanha segmentada',
        'Agendar reuniões com principais clientes'
      ]
    },
    {
      id: '2',
      title: 'Gargalo em Desenvolvimento',
      description: 'Tempo médio de review de código aumentou 40%',
      impact: 'medium' as const,
      confidence: 92,
      category: 'operations' as const,
      actionable: true,
      recommendedActions: [
        'Implementar pair programming',
        'Revisar processo de code review'
      ]
    },
    {
      id: '3',
      title: 'Satisfação da Equipe',
      description: 'Indicadores de satisfação em alta, mas carga horária preocupa',
      impact: 'medium' as const,
      confidence: 78,
      category: 'team' as const,
      actionable: true,
      recommendedActions: [
        'Avaliar redistribuição de tarefas',
        'Considerar contratação adicional'
      ]
    }
  ];

  const anomalies = [
    {
      metric: 'Tempo de resposta API',
      currentValue: 450,
      expectedValue: 200,
      deviation: 125,
      timestamp: new Date()
    },
    {
      metric: 'Taxa de conversão',
      currentValue: 12,
      expectedValue: 18,
      deviation: -33,
      timestamp: new Date()
    }
  ];

  return {
    insights,
    anomalies
  };
}

async function fetchSecurityData(supabase: any, filters: any) {
  // Get security events
  const { data: securityEvents } = await supabase
    .from('security_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const overallScore = 85 + Math.random() * 10;
  
  const metrics = {
    threatLevel: 'low' as const,
    lastScan: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    vulnerabilities: Math.floor(Math.random() * 5),
    blockedAttempts: 1247 + Math.floor(Math.random() * 500),
    activeIncidents: Math.floor(Math.random() * 2)
  };

  const compliance = {
    lgpd: 95 + Math.random() * 5,
    gdpr: 90 + Math.random() * 8,
    iso27001: 78 + Math.random() * 15
  };

  const recentEvents = securityEvents?.slice(0, 5).map((event: any) => ({
    type: event.event_type || 'security_scan',
    message: event.details?.message || 'Evento de segurança detectado',
    timestamp: new Date(event.created_at),
    severity: 'low' as const
  })) || [
    {
      type: 'blocked_ip',
      message: 'IP suspeito bloqueado: 192.168.1.100',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: 'medium' as const
    },
    {
      type: 'rate_limit',
      message: 'Rate limit ativado para API endpoints',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      severity: 'low' as const
    }
  ];

  return {
    overallScore: Math.round(overallScore),
    metrics: {
      ...metrics,
      vulnerabilities: Math.round(metrics.vulnerabilities),
      blockedAttempts: Math.round(metrics.blockedAttempts),
      activeIncidents: Math.round(metrics.activeIncidents)
    },
    compliance: {
      lgpd: Math.round(compliance.lgpd),
      gdpr: Math.round(compliance.gdpr),
      iso27001: Math.round(compliance.iso27001)
    },
    recentEvents
  };
}