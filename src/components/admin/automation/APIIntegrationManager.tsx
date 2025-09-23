import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plug, 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Key,
  Webhook,
  Database,
  RefreshCw,
  Plus,
  Clock,
  Activity,
  Code,
  Globe,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface APIEndpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string>;
  body?: string;
  authentication: {
    type: 'none' | 'api_key' | 'bearer' | 'basic' | 'oauth';
    config: Record<string, string>;
  };
  isActive: boolean;
  lastCalled?: string;
  responseTime?: number;
  successRate: number;
  callCount: number;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: 'webhook' | 'api' | 'sync' | 'streaming';
  status: 'active' | 'inactive' | 'error' | 'testing';
  config: Record<string, any>;
  endpoints: APIEndpoint[];
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  monitoring: {
    healthCheckUrl?: string;
    healthCheckInterval: number;
    alertOnFailure: boolean;
  };
  security: {
    requireSSL: boolean;
    validateSignature: boolean;
    whitelistIPs: string[];
  };
  createdAt: string;
  lastSync?: string;
  syncCount: number;
}

export function APIIntegrationManager() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'banking_api',
      name: 'API Bancária',
      description: 'Integração com Open Banking para extrato automático',
      provider: 'Banco Central',
      type: 'api',
      status: 'active',
      config: {
        baseUrl: 'https://api.bancocentral.gov.br/v1',
        version: '1.0',
        timeout: 30000
      },
      endpoints: [
        {
          id: 'get_balance',
          name: 'Consultar Saldo',
          url: '/accounts/{account_id}/balance',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          authentication: {
            type: 'bearer',
            config: { token: '{{BANKING_TOKEN}}' }
          },
          isActive: true,
          lastCalled: '2024-01-20T10:30:00Z',
          responseTime: 1200,
          successRate: 98.5,
          callCount: 456
        },
        {
          id: 'get_transactions',
          name: 'Listar Transações',
          url: '/accounts/{account_id}/transactions',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          authentication: {
            type: 'bearer',
            config: { token: '{{BANKING_TOKEN}}' }
          },
          isActive: true,
          lastCalled: '2024-01-20T09:15:00Z',
          responseTime: 2500,
          successRate: 96.8,
          callCount: 234
        }
      ],
      rateLimits: {
        requestsPerMinute: 60,
        requestsPerHour: 1000,
        requestsPerDay: 10000
      },
      monitoring: {
        healthCheckUrl: '/health',
        healthCheckInterval: 300,
        alertOnFailure: true
      },
      security: {
        requireSSL: true,
        validateSignature: true,
        whitelistIPs: ['191.235.84.0/24']
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastSync: '2024-01-20T10:30:00Z',
      syncCount: 1250
    },
    {
      id: 'stripe_payments',
      name: 'Stripe Pagamentos',
      description: 'Processamento de pagamentos online',
      provider: 'Stripe Inc.',
      type: 'webhook',
      status: 'active',
      config: {
        baseUrl: 'https://api.stripe.com/v1',
        webhookSecret: '{{STRIPE_WEBHOOK_SECRET}}'
      },
      endpoints: [
        {
          id: 'create_payment_intent',
          name: 'Criar Intenção de Pagamento',
          url: '/payment_intents',
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          authentication: {
            type: 'bearer',
            config: { token: '{{STRIPE_SECRET_KEY}}' }
          },
          isActive: true,
          lastCalled: '2024-01-20T11:45:00Z',
          responseTime: 850,
          successRate: 99.2,
          callCount: 89
        }
      ],
      rateLimits: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        requestsPerDay: 25000
      },
      monitoring: {
        healthCheckUrl: '/status',
        healthCheckInterval: 600,
        alertOnFailure: true
      },
      security: {
        requireSSL: true,
        validateSignature: true,
        whitelistIPs: []
      },
      createdAt: '2024-01-10T00:00:00Z',
      lastSync: '2024-01-20T11:45:00Z',
      syncCount: 89
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isEndpointOpen, setIsEndpointOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const testEndpoint = async (endpoint: APIEndpoint) => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Simular teste de endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        status: 200,
        responseTime: Math.floor(Math.random() * 2000) + 500,
        data: {
          success: true,
          message: 'Endpoint testado com sucesso',
          timestamp: new Date().toISOString()
        },
        headers: {
          'content-type': 'application/json',
          'x-ratelimit-remaining': '58'
        }
      };

      setTestResult(mockResult);
      toast.success('Teste do endpoint realizado com sucesso');
    } catch (error) {
      setTestResult({
        status: 500,
        error: 'Falha na conexão com o endpoint',
        message: 'Verifique a configuração e tente novamente'
      });
      toast.error('Falha no teste do endpoint');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'testing':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive',
      testing: 'outline'
    } as const;
    
    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      error: 'Erro',
      testing: 'Testando'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'webhook':
        return <Webhook className="h-4 w-4" />;
      case 'api':
        return <Plug className="h-4 w-4" />;  
      case 'sync':
        return <RefreshCw className="h-4 w-4" />;
      case 'streaming':
        return <Activity className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'text-blue-600',
      POST: 'text-green-600',
      PUT: 'text-yellow-600',
      DELETE: 'text-red-600',
      PATCH: 'text-purple-600'
    };
    return colors[method as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Gerenciador de Integrações API
          </h2>
          <p className="text-muted-foreground">
            Gerencie conexões com APIs externas e monitore performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sincronizar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Integração
          </Button>
        </div>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted rounded-lg">
                        {getTypeIcon(integration.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {integration.description}
                        </p>
                      </div>
                    </div>
                    {getStatusIcon(integration.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(integration.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <Badge variant="outline">{integration.type}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Endpoints</span>
                    <span className="text-sm font-medium">{integration.endpoints.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Chamadas</span>
                    <span className="text-sm font-medium">{integration.syncCount.toLocaleString()}</span>
                  </div>
                  
                  {integration.lastSync && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Última sync</span>
                      <span className="text-sm">
                        {new Date(integration.lastSync).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setIsConfigOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <TestTube className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endpoints Configurados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrations.flatMap(integration => 
                  integration.endpoints.map(endpoint => (
                    <div key={endpoint.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge variant="outline" className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{endpoint.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {endpoint.url}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="text-right">
                          <div>{endpoint.successRate.toFixed(1)}% sucesso</div>
                          <div className="text-xs text-muted-foreground">
                            {endpoint.callCount} chamadas
                          </div>
                        </div>
                        
                        {endpoint.responseTime && (
                          <div className="text-right">
                            <div>{endpoint.responseTime}ms</div>
                            <div className="text-xs text-muted-foreground">
                              tempo resp.
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setIsEndpointOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => testEndpoint(endpoint)}
                          disabled={isTesting}
                        >
                          <TestTube className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Chamadas API/hora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,456</div>
                <div className="text-sm text-green-600">+12% vs hora anterior</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taxa de Sucesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <div className="text-sm text-green-600">Dentro do SLA</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tempo Resp. Médio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <div className="text-sm text-yellow-600">+200ms vs média</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Integrações Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {integrations.filter(i => i.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  de {integrations.length} total
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Log de Atividade da API</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {[
                    { time: '14:30:15', endpoint: 'GET /balance', status: 200, duration: '1.2s' },
                    { time: '14:29:45', endpoint: 'POST /payment_intents', status: 200, duration: '0.8s' },
                    { time: '14:29:12', endpoint: 'GET /transactions', status: 200, duration: '2.1s' },
                    { time: '14:28:30', endpoint: 'GET /balance', status: 500, duration: '5.0s' },
                    { time: '14:27:55', endpoint: 'GET /health', status: 200, duration: '0.3s' }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between text-sm py-2 px-3 hover:bg-muted/50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground font-mono">{log.time}</span>
                        <code className="text-sm bg-muted px-2 py-1 rounded">{log.endpoint}</code>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={log.status === 200 ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                        <span className="text-muted-foreground">{log.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configurações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{integration.name}</span>
                      {getStatusIcon(integration.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>SSL Obrigatório</span>
                        <Badge variant={integration.security.requireSSL ? 'default' : 'destructive'}>
                          {integration.security.requireSSL ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Validação de Assinatura</span>
                        <Badge variant={integration.security.validateSignature ? 'default' : 'secondary'}>
                          {integration.security.validateSignature ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>IPs na Whitelist</span>
                        <span>{integration.security.whitelistIPs.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rate Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="p-3 border rounded-lg">
                    <div className="font-medium mb-3">{integration.name}</div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Por minuto</span>
                        <span>{integration.rateLimits.requestsPerMinute}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Por hora</span>
                        <span>{integration.rateLimits.requestsPerHour.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Por dia</span>
                        <span>{integration.rateLimits.requestsPerDay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Configurar {selectedIntegration?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label>Nome da Integração</Label>
                <Input value={selectedIntegration.name} />
              </div>
              
              <div>
                <Label>URL Base</Label>
                <Input value={selectedIntegration.config.baseUrl || ''} />
              </div>
              
              <div>
                <Label>Timeout (ms)</Label>
                <Input type="number" value={selectedIntegration.config.timeout || 30000} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>SSL Obrigatório</Label>
                <Switch checked={selectedIntegration.security.requireSSL} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Validar Assinatura</Label>
                <Switch checked={selectedIntegration.security.validateSignature} />
              </div>
              
              <div>
                <Label>IPs Permitidos (um por linha)</Label>
                <Textarea
                  value={selectedIntegration.security.whitelistIPs.join('\n')}
                  placeholder="191.235.84.0/24"
                  rows={3}
                />
              </div>
              
              <Button className="w-full">
                Salvar Configurações
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Endpoint Test Dialog */}
      <Dialog open={isEndpointOpen} onOpenChange={setIsEndpointOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Testar Endpoint: {selectedEndpoint?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEndpoint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Método</Label>
                  <Input value={selectedEndpoint.method} readOnly />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input value={selectedEndpoint.url} readOnly />
                </div>
              </div>
              
              <div>
                <Label>Headers</Label>
                <Textarea
                  value={JSON.stringify(selectedEndpoint.headers, null, 2)}
                  className="font-mono text-sm"
                  rows={4}
                />
              </div>
              
              {selectedEndpoint.body && (
                <div>
                  <Label>Body</Label>
                  <Textarea
                    value={selectedEndpoint.body}
                    className="font-mono text-sm"
                    rows={6}
                  />
                </div>
              )}
              
              <Button 
                onClick={() => testEndpoint(selectedEndpoint)}
                disabled={isTesting}
                className="w-full"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTesting ? 'Testando...' : 'Executar Teste'}
              </Button>
              
              {testResult && (
                <div className="mt-4">
                  <Label>Resultado do Teste</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(testResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}