import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useFeedback } from '@/hooks/useFeedback';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar,
  Filter,
  BarChart3 
} from 'lucide-react';

interface ExportConfig {
  format: 'excel' | 'pdf' | 'csv';
  type: 'feedback' | 'metrics' | 'tickets';
  dateRange: {
    start: string;
    end: string;
  };
  filters: {
    projects: string[];
    types: string[];
    severities: string[];
    status: string[];
  };
  includeAttachments: boolean;
}

export const FeedbackExport: React.FC = () => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'excel',
    type: 'feedback',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0]
    },
    filters: {
      projects: [],
      types: [],
      severities: [],
      status: []
    },
    includeAttachments: false
  });

  const [isExporting, setIsExporting] = useState(false);
  const { getFeedbackMetrics } = useFeedback();

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Generate export data based on config
      let exportData: any[] = [];
      let filename = '';
      
      if (config.type === 'feedback') {
        // Export feedback entries
        exportData = await generateFeedbackExport();
        filename = `feedback-export-${config.dateRange.start}-to-${config.dateRange.end}`;
      } else if (config.type === 'metrics') {
        // Export metrics
        exportData = await generateMetricsExport();
        filename = `metrics-export-${config.dateRange.start}-to-${config.dateRange.end}`;
      } else if (config.type === 'tickets') {
        // Export tickets
        exportData = await generateTicketsExport();
        filename = `tickets-export-${config.dateRange.start}-to-${config.dateRange.end}`;
      }

      // Generate file based on format
      if (config.format === 'excel') {
        await generateExcelFile(exportData, filename);
      } else if (config.format === 'pdf') {
        await generatePDFFile(exportData, filename);
      } else if (config.format === 'csv') {
        await generateCSVFile(exportData, filename);
      }

      toast({
        title: "Export concluído",
        description: `Arquivo ${filename}.${config.format} foi baixado com sucesso`,
      });
      
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Erro no export",
        description: "Não foi possível gerar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateFeedbackExport = async () => {
    // In a real implementation, this would fetch data from the database
    // For now, return mock data structure
    return [
      {
        id: 'sample',
        created_at: new Date().toISOString(),
        project_key: 'sample-project',
        type: 'bug',
        severity: 'high',
        verbatim: 'Sample feedback',
        score: 8,
        persona: 'usuario_final',
        channel: 'inapp',
        status: 'new'
      }
    ];
  };

  const generateMetricsExport = async () => {
    const metrics = await getFeedbackMetrics(config.dateRange.start, config.dateRange.end);
    return [
      {
        date: config.dateRange.start,
        total_feedback: metrics.total,
        avg_nps: metrics.avgNPS,
        avg_csat: 0, // Not available in current metrics
        bugs_count: metrics.bugs || 0,
        ideas_count: metrics.ideas || 0,
        response_time: 24 // Mock value - not available in current metrics
      }
    ];
  };

  const generateTicketsExport = async () => {
    // Mock tickets data
    return [
      {
        id: 'sample-ticket',
        subject: 'Sample Ticket',
        status: 'open',
        priority: 'high',
        created_at: new Date().toISOString(),
        resolved_at: null,
        response_time_hours: 24
      }
    ];
  };

  const generateExcelFile = async (data: any[], filename: string) => {
    // Mock Excel generation - in real implementation would use a library like xlsx
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`); // Simplified for demo
  };

  const generatePDFFile = async (data: any[], filename: string) => {
    // Mock PDF generation - in real implementation would use jsPDF or similar
    const reportContent = generateReportContent(data);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    downloadFile(blob, `${filename}.txt`); // Simplified for demo
  };

  const generateCSVFile = async (data: any[], filename: string) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
  };

  const generateReportContent = (data: any[]) => {
    return `
RELATÓRIO DE FEEDBACK
Período: ${config.dateRange.start} até ${config.dateRange.end}
Tipo: ${config.type}
Gerado em: ${new Date().toLocaleString('pt-BR')}

DADOS:
${JSON.stringify(data, null, 2)}
    `;
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'excel': return FileSpreadsheet;
      case 'pdf': return FileText;
      case 'csv': return BarChart3;
      default: return Download;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportar Dados
          </CardTitle>
          <CardDescription>
            Gere relatórios e exports dos dados de feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export Type */}
          <div className="grid grid-cols-3 gap-4">
            {['feedback', 'metrics', 'tickets'].map(type => (
              <Button
                key={type}
                variant={config.type === type ? "default" : "outline"}
                onClick={() => setConfig(prev => ({ ...prev, type: type as any }))}
                className="flex flex-col gap-2 h-auto p-4"
              >
                <div className="text-sm font-medium capitalize">{type}</div>
                <div className="text-xs text-muted-foreground">
                  {type === 'feedback' && 'Entradas de feedback'}
                  {type === 'metrics' && 'Métricas agregadas'}
                  {type === 'tickets' && 'Tickets de suporte'}
                </div>
              </Button>
            ))}
          </div>

          {/* Format Selection */}
          <div>
            <Label className="text-sm font-medium">Formato</Label>
            <div className="flex gap-2 mt-2">
              {['excel', 'pdf', 'csv'].map(format => {
                const Icon = getFormatIcon(format);
                return (
                  <Button
                    key={format}
                    variant={config.format === format ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig(prev => ({ ...prev, format: format as any }))}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-3 w-3" />
                    {format.toUpperCase()}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Data Início</Label>
              <Input
                type="date"
                value={config.dateRange.start}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Data Fim</Label>
              <Input
                type="date"
                value={config.dateRange.end}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Label>
            
            {config.type === 'feedback' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Tipos</Label>
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bugs</SelectItem>
                      <SelectItem value="ideia">Ideias</SelectItem>
                      <SelectItem value="duvida">Dúvidas</SelectItem>
                      <SelectItem value="nps">NPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Severidade</Label>
                  <Select>
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blocker">Bloqueante</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="attachments"
                checked={config.includeAttachments}
                onCheckedChange={(checked) => 
                  setConfig(prev => ({ ...prev, includeAttachments: !!checked }))
                }
              />
              <Label htmlFor="attachments" className="text-sm">
                Incluir anexos (somente para Excel/PDF)
              </Label>
            </div>
          </div>

          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
          >
            {isExporting ? 'Gerando export...' : 'Gerar Export'}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Exports Rápidos</CardTitle>
          <CardDescription>
            Relatórios pré-configurados para uso comum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setConfig(prev => ({
                  ...prev,
                  type: 'metrics',
                  format: 'pdf',
                  dateRange: {
                    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  }
                }));
                handleExport();
              }}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <FileText className="h-5 w-5" />
              <span className="text-xs">Relatório Semanal</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                setConfig(prev => ({
                  ...prev,
                  type: 'feedback',
                  format: 'excel',
                  dateRange: {
                    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  }
                }));
                handleExport();
              }}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <FileSpreadsheet className="h-5 w-5" />
              <span className="text-xs">Feedback Mensal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};