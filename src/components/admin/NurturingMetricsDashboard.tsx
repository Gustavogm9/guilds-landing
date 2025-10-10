import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, TrendingUp, Mail, MousePointer, CheckCircle, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface SequenceMetrics {
  sequence_id: string;
  sequence_name: string;
  total_enrollments: number;
  active_enrollments: number;
  completed_enrollments: number;
  failed_enrollments: number;
  completion_rate: number;
  total_email_opens: number;
  total_email_clicks: number;
  avg_opens_per_enrollment: number;
  click_through_rate: number;
  total_conversions: number;
  conversion_rate: number;
  total_conversion_value: number;
  last_activity: string;
}

export const NurturingMetricsDashboard = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["nurturing-metrics"],
    queryFn: async () => {
      // Refresh materialized view first
      await supabase.rpc("refresh_nurturing_metrics");
      
      const { data, error } = await supabase
        .from("nurturing_sequence_metrics")
        .select("*")
        .order("total_enrollments", { ascending: false });

      if (error) throw error;
      return data as SequenceMetrics[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const totalMetrics = metrics?.reduce(
    (acc, m) => ({
      enrollments: acc.enrollments + m.total_enrollments,
      opens: acc.opens + m.total_email_opens,
      clicks: acc.clicks + m.total_email_clicks,
      conversions: acc.conversions + m.total_conversions,
      revenue: acc.revenue + (m.total_conversion_value || 0),
    }),
    { enrollments: 0, opens: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Métricas de Nurturing</h2>
        <Badge variant="outline">
          Última atualização: {new Date().toLocaleTimeString("pt-BR")}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics?.enrollments || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Abertos</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics?.opens || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics?.clicks || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics?.conversions || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalMetrics?.revenue || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics per Sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Performance por Sequência</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="engagement">Engajamento</TabsTrigger>
              <TabsTrigger value="conversion">Conversão</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Sequência</th>
                      <th className="p-3 text-right">Enrollments</th>
                      <th className="p-3 text-right">Ativos</th>
                      <th className="p-3 text-right">Completos</th>
                      <th className="p-3 text-right">Taxa Conclusão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.map((m) => (
                      <tr key={m.sequence_id} className="border-b">
                        <td className="p-3 font-medium">{m.sequence_name}</td>
                        <td className="p-3 text-right">{m.total_enrollments}</td>
                        <td className="p-3 text-right">{m.active_enrollments}</td>
                        <td className="p-3 text-right">{m.completed_enrollments}</td>
                        <td className="p-3 text-right">
                          <Badge variant={m.completion_rate > 50 ? "default" : "secondary"}>
                            {m.completion_rate?.toFixed(1) || 0}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Sequência</th>
                      <th className="p-3 text-right">Emails Abertos</th>
                      <th className="p-3 text-right">Clicks</th>
                      <th className="p-3 text-right">Média Aberturas</th>
                      <th className="p-3 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.map((m) => (
                      <tr key={m.sequence_id} className="border-b">
                        <td className="p-3 font-medium">{m.sequence_name}</td>
                        <td className="p-3 text-right">{m.total_email_opens || 0}</td>
                        <td className="p-3 text-right">{m.total_email_clicks || 0}</td>
                        <td className="p-3 text-right">
                          {m.avg_opens_per_enrollment?.toFixed(1) || 0}
                        </td>
                        <td className="p-3 text-right">
                          <Badge variant={m.click_through_rate > 10 ? "default" : "secondary"}>
                            {m.click_through_rate?.toFixed(1) || 0}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="conversion" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left">Sequência</th>
                      <th className="p-3 text-right">Conversões</th>
                      <th className="p-3 text-right">Taxa Conversão</th>
                      <th className="p-3 text-right">Revenue Total</th>
                      <th className="p-3 text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.map((m) => (
                      <tr key={m.sequence_id} className="border-b">
                        <td className="p-3 font-medium">{m.sequence_name}</td>
                        <td className="p-3 text-right">{m.total_conversions || 0}</td>
                        <td className="p-3 text-right">
                          <Badge variant={m.conversion_rate > 5 ? "default" : "secondary"}>
                            {m.conversion_rate?.toFixed(1) || 0}%
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(m.total_conversion_value || 0)}
                        </td>
                        <td className="p-3 text-right">
                          {/* Calculate ROI based on estimated cost */}
                          <Badge>
                            {(
                              ((m.total_conversion_value || 0) /
                                (m.total_enrollments * 10)) *
                              100
                            ).toFixed(0)}
                            %
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
