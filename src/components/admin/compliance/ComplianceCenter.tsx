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
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Lock,
  Users,
  Database,
  Eye,
  Key,
  Calendar,
  FileCheck
} from 'lucide-react';
import { useComplianceCenter } from '@/hooks/useComplianceCenter';

export const ComplianceCenter = () => {
  const {
    auditLogs,
    complianceReports,
    accessControls,
    backupStatus,
    securityMetrics,
    generateComplianceReport,
    exportAuditTrail,
    runSecurityScan,
    performBackup,
    isGeneratingReport,
    isExportingAudit,
    isRunningSecurityScan,
    isPerformingBackup
  } = useComplianceCenter();

  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Central de Compliance</h2>
          <p className="text-muted-foreground">
            Auditoria, conformidade e controles de segurança financeira
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => runSecurityScan()}
            disabled={isRunningSecurityScan}
          >
            <Shield className="w-4 h-4 mr-2" />
            Scan Segurança
          </Button>
          <Button 
            variant="outline"
            onClick={() => performBackup()}
            disabled={isPerformingBackup}
          >
            <Database className="w-4 h-4 mr-2" />
            Backup Manual
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score de Compliance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">94%</div>
            <Progress value={94} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Excelente conformidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Logs de Auditoria
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +127 nas últimas 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Último Backup
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-success">
              ✓ Backup automático ativo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas de Segurança
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
                    <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="access">Acessos</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="audit" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Trilha de Auditoria Recente
                </CardTitle>
                <CardDescription>
                  Últimas atividades registradas no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Transação Criada",
                    user: "admin@guilds.com.br",
                    details: "Nova transação de R$ 5.400,00",
                    timestamp: "15:34:22",
                    type: "create"
                  },
                  {
                    action: "Relatório Exportado",
                    user: "financeiro@guilds.com.br", 
                    details: "Relatório DRE - Janeiro 2024",
                    timestamp: "14:21:10",
                    type: "export"
                  },
                  {
                    action: "Usuário Logado",
                    user: "gestor@guilds.com.br",
                    details: "Login via SSO",
                    timestamp: "13:45:33",
                    type: "auth"
                  },
                  {
                    action: "Configuração Alterada",
                    user: "admin@guilds.com.br",
                    details: "Política de backup atualizada",
                    timestamp: "12:12:45",
                    type: "config"
                  }
                ].map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.type === 'create' ? 'bg-success' :
                      log.type === 'export' ? 'bg-primary' :
                      log.type === 'auth' ? 'bg-warning' :
                      'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{log.action}</p>
                        <Badge variant="outline" className="text-xs">
                          {log.timestamp}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {log.user} - {log.details}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => exportAuditTrail(selectedTimeframe)}
                  disabled={isExportingAudit}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Trilha Completa
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Eventos Críticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tentativa de acesso suspeita</strong><br/>
                    IP 192.168.1.100 tentou acessar dados financeiros sensíveis
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sessão expirada</strong><br/>
                    Usuário admin@guilds.com.br teve sessão encerrada por inatividade
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <FileCheck className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Backup verificado</strong><br/>
                    Integridade dos dados confirmada no backup de 14:00
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "LGPD - Lei Geral de Proteção de Dados",
                status: "Conforme", 
                progress: 95,
                items: [
                  "✓ Política de Privacidade atualizada",
                  "✓ Consentimento explícito implementado",
                  "✓ Direito ao esquecimento configurado",
                  "⚠ Relatório de impacto pendente"
                ]
              },
              {
                title: "SOX - Sarbanes-Oxley",
                status: "Conforme",
                progress: 92,
                items: [
                  "✓ Controles internos documentados",
                  "✓ Segregação de funções implementada", 
                  "✓ Auditoria independente aprovada",
                  "✓ Relatórios de conformidade atuais"
                ]
              },
              {
                title: "Receita Federal",
                status: "Conforme",
                progress: 98,
                items: [
                  "✓ SPED Fiscal em dia",
                  "✓ Certificado digital válido",
                  "✓ Backup de segurança ativo",
                  "✓ Controle de versões implementado"
                ]
              }
            ].map((compliance, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{compliance.title}</CardTitle>
                    <Badge 
                      variant={compliance.progress > 90 ? "default" : "destructive"}
                    >
                      {compliance.status}
                    </Badge>
                  </div>
                  <Progress value={compliance.progress} className="mt-2" />
                  <p className="text-sm text-muted-foreground">
                    {compliance.progress}% de conformidade
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {compliance.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Status de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">98%</div>
                    <p className="text-sm text-muted-foreground">Proteção Geral</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">SSL</div>
                    <p className="text-sm text-muted-foreground">Criptografia</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-warning">3</div>
                    <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-success">0</div>
                    <p className="text-sm text-muted-foreground">Violações</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Firewall</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Antivírus</span>
                    <Badge variant="default">Atualizado</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detecção de Intrusão</span>
                    <Badge variant="default">Monitorando</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Criptografado</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vulnerabilidades Detectadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-l-4 border-warning pl-3">
                    <p className="font-semibold text-sm">Senha Fraca Detectada</p>
                    <p className="text-xs text-muted-foreground">
                      Usuário com senha não conforme à política
                    </p>
                    <Badge variant="destructive" className="mt-1">Média</Badge>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-3">
                    <p className="font-semibold text-sm">Certificado Próximo ao Vencimento</p>
                    <p className="text-xs text-muted-foreground">
                      SSL expira em 45 dias
                    </p>
                    <Badge variant="secondary" className="mt-1">Baixa</Badge>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-semibold text-sm">Atualização Disponível</p>
                    <p className="text-xs text-muted-foreground">
                      Nova versão de segurança do sistema
                    </p>
                    <Badge variant="outline" className="mt-1">Info</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Controle de Acesso e Permissões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    user: "admin@guilds.com.br",
                    role: "Administrador", 
                    permissions: ["Todas as permissões"],
                    lastAccess: "Hoje, 15:30",
                    status: "online"
                  },
                  {
                    user: "financeiro@guilds.com.br",
                    role: "Financeiro",
                    permissions: ["Transações", "Relatórios", "Configurações Financeiras"],
                    lastAccess: "Hoje, 14:20",
                    status: "online"
                  },
                  {
                    user: "gestor@guilds.com.br", 
                    role: "Gestor",
                    permissions: ["Visualizar Dashboards", "Exportar Relatórios"],
                    lastAccess: "Ontem, 18:45",
                    status: "offline"
                  },
                  {
                    user: "auditor@guilds.com.br",
                    role: "Auditor",
                    permissions: ["Apenas Leitura", "Logs de Auditoria"],
                    lastAccess: "2 dias atrás",
                    status: "offline"
                  }
                ].map((access, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{access.user}</p>
                        <Badge variant="outline">{access.role}</Badge>
                        <div className={`w-2 h-2 rounded-full ${
                          access.status === 'online' ? 'bg-success' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Permissões: {access.permissions.join(', ')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Último acesso: {access.lastAccess}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Key className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Status do Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 border rounded-lg bg-success/5">
                  <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                  <div className="text-2xl font-bold text-success">Atualizado</div>
                  <p className="text-sm text-muted-foreground">
                    Último backup: Hoje às 14:00
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup Automático</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Frequência</span>
                    <span className="text-sm text-muted-foreground">A cada 4 horas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retenção</span>
                    <span className="text-sm text-muted-foreground">30 dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Criptografia</span>
                    <Badge variant="default">AES-256</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "14:00", date: "Hoje", size: "145 MB", status: "success" },
                    { time: "10:00", date: "Hoje", size: "142 MB", status: "success" },
                    { time: "06:00", date: "Hoje", size: "140 MB", status: "success" },
                    { time: "02:00", date: "Hoje", size: "138 MB", status: "success" },
                    { time: "22:00", date: "Ontem", size: "136 MB", status: "success" }
                  ].map((backup, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <div>
                          <p className="font-medium text-sm">{backup.date} - {backup.time}</p>
                          <p className="text-xs text-muted-foreground">
                            Tamanho: {backup.size}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Relatório de Auditoria",
                description: "Trilha completa de atividades do sistema",
                icon: FileText,
                action: "generate_audit"
              },
              {
                title: "Relatório de Compliance",
                description: "Status de conformidade regulatória",
                icon: CheckCircle,
                action: "generate_compliance"
              },
              {
                title: "Relatório de Segurança",
                description: "Análise de vulnerabilidades e proteções",
                icon: Shield,
                action: "generate_security"
              }
            ].map((report, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <report.icon className="w-12 h-12 mx-auto text-primary mb-4" />
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => generateComplianceReport(report.action)}
                    disabled={isGeneratingReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Gerar Relatório
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};