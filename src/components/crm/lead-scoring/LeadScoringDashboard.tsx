import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity, 
  Users, 
  Zap,
  Brain,
  Tag
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface LeadScore {
  contact_id: string;
  contact_name: string;
  lead_score: number;
  icp_score: number;
  engagement_score: number;
  score_tier: string;
  tags: string[];
  lifecycle_stage: string;
}

interface ScoreDistribution {
  tier: string;
  count: number;
  percentage: number;
}

export const LeadScoringDashboard: React.FC = () => {
  const [topLeads, setTopLeads] = useState<LeadScore[]>([]);
  const [distribution, setDistribution] = useState<ScoreDistribution[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    hotLeads: 0,
    avgScore: 0,
    avgICP: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadScoringData();
  }, []);

  const loadScoringData = async () => {
    try {
      setLoading(true);

      // Buscar top leads por score
      const { data: leads, error: leadsError } = await supabase
        .from('crm_contacts')
        .select('id, name, lead_score, icp_score, engagement_score, tags, lifecycle_stage')
        .not('lead_score', 'is', null)
        .order('lead_score', { ascending: false })
        .limit(10);

      if (leadsError) throw leadsError;

      // Processar dados dos leads
      const processedLeads: LeadScore[] = (leads || []).map(lead => ({
        contact_id: lead.id,
        contact_name: lead.name,
        lead_score: lead.lead_score || 0,
        icp_score: lead.icp_score || 0,
        engagement_score: lead.engagement_score || 0,
        score_tier: getScoreTier(lead.lead_score || 0),
        tags: lead.tags || [],
        lifecycle_stage: lead.lifecycle_stage || 'lead'
      }));

      setTopLeads(processedLeads);

      // Calcular distribuição de scores
      const { data: allLeads } = await supabase
        .from('crm_contacts')
        .select('lead_score')
        .not('lead_score', 'is', null);

      if (allLeads) {
        const tiers = ['hot', 'warm', 'cool', 'cold'];
        const dist: ScoreDistribution[] = tiers.map(tier => {
          const count = allLeads.filter(l => getScoreTier(l.lead_score || 0) === tier).length;
          return {
            tier,
            count,
            percentage: (count / allLeads.length) * 100
          };
        });
        setDistribution(dist);

        // Calcular estatísticas
        const avgScore = allLeads.reduce((sum, l) => sum + (l.lead_score || 0), 0) / allLeads.length;
        const hotCount = allLeads.filter(l => (l.lead_score || 0) >= 80).length;

        setStats({
          totalLeads: allLeads.length,
          hotLeads: hotCount,
          avgScore: Math.round(avgScore),
          avgICP: Math.round(
            processedLeads.reduce((sum, l) => sum + l.icp_score, 0) / processedLeads.length
          )
        });
      }

    } catch (error) {
      console.error('Erro ao carregar dados de scoring:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados de scoring',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreTier = (score: number): string => {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    if (score >= 30) return 'cool';
    return 'cold';
  };

  const getTierColor = (tier: string): string => {
    const colors: Record<string, string> = {
      hot: 'bg-red-500',
      warm: 'bg-orange-500',
      cool: 'bg-blue-500',
      cold: 'bg-gray-400'
    };
    return colors[tier] || colors.cold;
  };

  const getTierBadgeVariant = (tier: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (tier === 'hot') return 'destructive';
    if (tier === 'warm') return 'default';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.hotLeads}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.hotLeads / stats.totalLeads) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ICP Médio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgICP}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top-leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top-leads">
            <Zap className="h-4 w-4 mr-2" />
            Top Leads
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <Activity className="h-4 w-4 mr-2" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="segments">
            <Brain className="h-4 w-4 mr-2" />
            Segmentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="top-leads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Leads Qualificados</CardTitle>
              <CardDescription>
                Leads com maior score de qualificação e fit com ICP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLeads.map((lead, index) => (
                  <div
                    key={lead.contact_id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{lead.contact_name}</h4>
                          <Badge variant={getTierBadgeVariant(lead.score_tier)}>
                            {lead.score_tier}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {lead.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {lead.lead_score}
                        </div>
                        <div className="text-xs text-muted-foreground">Lead Score</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">
                          {lead.icp_score}%
                        </div>
                        <div className="text-xs text-muted-foreground">ICP Fit</div>
                      </div>

                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {lead.engagement_score}
                        </div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Temperatura</CardTitle>
              <CardDescription>
                Visualização da distribuição de leads por nível de qualificação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {distribution.map(item => (
                  <div key={item.tier} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getTierColor(item.tier)}`} />
                        <span className="font-medium capitalize">{item.tier}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.count} leads ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segmentos Automáticos</CardTitle>
              <CardDescription>
                Tags e segmentos gerados automaticamente por IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sistema de segmentação automática em desenvolvimento.
                  Tags serão geradas baseadas em comportamento, perfil e interações.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">high_icp_fit</Badge>
                  <Badge variant="secondary">decision_maker</Badge>
                  <Badge variant="secondary">highly_engaged</Badge>
                  <Badge variant="secondary">recent_activity</Badge>
                  <Badge variant="secondary">interest_software</Badge>
                  <Badge variant="secondary">enterprise</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
