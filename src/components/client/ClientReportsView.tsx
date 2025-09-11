import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientReportsViewProps {
  projectId: string;
}

export const ClientReportsView = ({ projectId }: ClientReportsViewProps) => {
  const { data: reports, isLoading } = useQuery({
    queryKey: ['client_project_reports', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_reports')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_active', true)
        .order('generated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getReportTypeText = (type: string) => {
    const types = {
      weekly: 'Relatório Semanal',
      monthly: 'Relatório Mensal',
      milestone: 'Relatório de Marco',
      sprint: 'Relatório de Sprint',
      final: 'Relatório Final',
    };
    return types[type as keyof typeof types] || type;
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'weekly':
      case 'monthly':
        return <Calendar className="h-4 w-4" />;
      case 'milestone':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Relatórios do Projeto
          </CardTitle>
          <CardDescription>
            Acesse relatórios de progresso e métricas do seu projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getReportTypeIcon(report.report_type)}
                          <h3 className="font-semibold">{report.title}</h3>
                          <Badge variant="outline">
                            {getReportTypeText(report.report_type)}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>
                            Gerado em: {new Date(report.generated_at).toLocaleDateString('pt-BR')}
                          </p>
                          
                          {report.period_start && report.period_end && (
                            <p>
                              Período: {new Date(report.period_start).toLocaleDateString('pt-BR')} até{' '}
                              {new Date(report.period_end).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          
                          {report.sent_to_client && report.sent_at && (
                            <p>
                              Enviado por email em: {new Date(report.sent_at).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>

                        {/* Métricas do Relatório */}
                        {report.metrics && Object.keys(report.metrics).length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Métricas:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {Object.entries(report.metrics as Record<string, any>).map(([key, value]) => (
                                <div key={key} className="text-center p-2 bg-muted/50 rounded">
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {key.replace('_', ' ')}
                                  </p>
                                  <p className="font-semibold">
                                    {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>

                    {/* Conteúdo do Relatório (resumo) */}
                    {report.content && (
                      <div className="mt-4 p-4 bg-muted/30 rounded border">
                        <p className="text-sm font-medium mb-2">Resumo:</p>
                        <div className="text-sm text-muted-foreground">
                          {typeof report.content === 'string' 
                            ? report.content.slice(0, 200) + '...'
                            : 'Conteúdo do relatório disponível para download'
                          }
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum relatório disponível ainda</p>
              <p className="text-sm mt-1">
                Os relatórios aparecerão aqui conforme o projeto progride
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};