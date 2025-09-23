import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Download,
  Eye,
  Lock,
  Gavel
} from 'lucide-react';
import { useComplianceCenter } from '@/hooks/useComplianceCenter';
import { Skeleton } from '@/components/ui/skeleton';

const ComplianceCenter = () => {
  const { 
    complianceData, 
    auditReports, 
    generateReport, 
    runComplianceCheck,
    isLoading 
  } = useComplianceCenter();
  
  const [activeCheck, setActiveCheck] = useState<string | null>(null);

  const complianceFrameworks = [
    {
      id: 'lgpd',
      name: 'LGPD',
      description: 'Lei Geral de Proteção de Dados',
      status: 'compliant',
      score: 95,
      lastCheck: '2024-01-15',
      criticalIssues: 0,
      totalChecks: 25
    },
    {
      id: 'sox',
      name: 'SOX',
      description: 'Sarbanes-Oxley Act',
      status: 'warning',
      score: 78,
      lastCheck: '2024-01-10',
      criticalIssues: 2,
      totalChecks: 18
    },
    {
      id: 'pci',
      name: 'PCI DSS',
      description: 'Payment Card Industry Data Security',
      status: 'non_compliant',
      score: 65,
      lastCheck: '2024-01-05',
      criticalIssues: 4,
      totalChecks: 22
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      description: 'Information Security Management',
      status: 'compliant',
      score: 88,
      lastCheck: '2024-01-12',
      criticalIssues: 1,
      totalChecks: 30
    }
  ];

  const auditTrail = [
    {
      id: 1,
      timestamp: '2024-01-15 10:30:00',
      user: 'admin@guilds.com.br',
      action: 'financial_transaction_created',
      resource: 'Transaction #TX-001',
      details: 'Receita de projeto - R$ 50.000',
      risk: 'low'
    },
    {
      id: 2,
      timestamp: '2024-01-15 09:45:00',
      user: 'finance@guilds.com.br',
      action: 'account_updated',
      resource: 'Account #ACC-123',
      details: 'Alteração de saldo - Conta Corrente',
      risk: 'medium'
    },
    {
      id: 3,
      timestamp: '2024-01-15 08:20:00',
      user: 'system',
      action: 'automated_backup',
      resource: 'Financial Database',
      details: 'Backup automático executado',
      risk: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-success bg-success/10';
      case 'warning': return 'text-warning bg-warning/10';
      case 'non_compliant': return 'text-danger bg-danger/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Centro de Conformidade</h2>
          <p className="text-muted-foreground">
            Monitore e garanta a conformidade regulatória
          </p>
        </div>
        <Button onClick={() => generateReport('full')} className="gap-2">
          <Download className="h-4 w-4" />
          Relatório Completo
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {complianceFrameworks.map((framework) => (
          <Card key={framework.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {framework.name}
                </CardTitle>
                <Badge className={getStatusColor(framework.status)}>
                  {framework.status === 'compliant' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {framework.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {framework.status === 'non_compliant' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {framework.status === 'compliant' ? 'Conforme' : 
                   framework.status === 'warning' ? 'Atenção' : 'Não Conforme'}
                </Badge>
              </div>
              <CardDescription>{framework.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score</span>
                  <span className="font-medium">{framework.score}%</span>
                </div>
                <Progress value={framework.score} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Última verificação: {framework.lastCheck}</span>
                  <span>{framework.criticalIssues} críticos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="frameworks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="frameworks" className="gap-2">
            <Shield className="h-4 w-4" />
            Frameworks
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Eye className="h-4 w-4" />
            Auditoria
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="legal" className="gap-2">
            <Gavel className="h-4 w-4" />
            Legal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frameworks" className="mt-6">
          <div className="grid gap-4">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{framework.name}</CardTitle>
                      <CardDescription>{framework.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveCheck(framework.id)}
                        disabled={activeCheck === framework.id}
                      >
                        {activeCheck === framework.id ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Verificando...
                          </>
                        ) : (
                          'Verificar Agora'
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Score Atual</p>
                      <p className="text-2xl font-bold">{framework.score}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Verificações</p>
                      <p className="text-2xl font-bold">{framework.totalChecks}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Problemas Críticos</p>
                      <p className="text-2xl font-bold text-danger">{framework.criticalIssues}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Última Verificação</p>
                      <p className="text-sm text-muted-foreground">{framework.lastCheck}</p>
                    </div>
                  </div>
                  
                  {framework.criticalIssues > 0 && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {framework.criticalIssues} problema(s) crítico(s) encontrado(s). 
                        Ação imediata necessária.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Trilha de Auditoria</CardTitle>
              <CardDescription>
                Histórico completo de ações e alterações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div>
                        <p className="text-sm font-medium">{entry.timestamp}</p>
                        <p className="text-xs text-muted-foreground">{entry.user}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-muted-foreground">{entry.resource}</p>
                      </div>
                      <div>
                        <p className="text-sm">{entry.details}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge className={getRiskColor(entry.risk)}>
                          {entry.risk === 'low' ? 'Baixo' : 
                           entry.risk === 'medium' ? 'Médio' : 'Alto'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Segurança</CardTitle>
                <CardDescription>
                  Status da segurança de dados financeiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-success" />
                      <h4 className="font-medium">Criptografia</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dados em repouso e em trânsito criptografados
                    </p>
                    <Badge className="mt-2 text-success bg-success/10">Ativo</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-success" />
                      <h4 className="font-medium">Controle de Acesso</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Autenticação multifator e permissões granulares
                    </p>
                    <Badge className="mt-2 text-success bg-success/10">Ativo</Badge>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-warning" />
                      <h4 className="font-medium">Monitoramento</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Detecção de anomalias e atividades suspeitas
                    </p>
                    <Badge className="mt-2 text-warning bg-warning/10">Parcial</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="mt-6">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentos Legais</CardTitle>
                <CardDescription>
                  Contratos, políticas e documentação de conformidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Política de Privacidade', status: 'Atualizada', date: '2024-01-01' },
                    { name: 'Termos de Uso', status: 'Atualizada', date: '2024-01-01' },
                    { name: 'Política de Cookies', status: 'Pendente', date: '2023-12-15' },
                    { name: 'Manual de Segurança', status: 'Atualizada', date: '2024-01-10' }
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Última atualização: {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={doc.status === 'Atualizada' ? 'text-success bg-success/10' : 'text-warning bg-warning/10'}>
                          {doc.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceCenter;