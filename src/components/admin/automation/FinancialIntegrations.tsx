import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useFinancialEdgeFunctions } from '@/hooks/useFinancialEdgeFunctions';
import { 
  Plug, 
  Settings, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Webhook,
  CreditCard,
  Building2,
  Database,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'webhook' | 'api' | 'sync';
  status: 'active' | 'inactive' | 'error';
  isConfigured: boolean;
  lastSync?: string;
  syncCount: number;
  icon: React.ReactNode;
  testEndpoint?: string;
}

export function FinancialIntegrations() {
  const {
    processPaymentWebhook,
    processInvoiceWebhook,
    processBankTransaction,
    isProcessingWebhook
  } = useFinancialEdgeFunctions();

  const [integrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe Pagamentos',
      description: 'Integração com Stripe para recebimento de pagamentos',
      type: 'webhook',
      status: 'inactive',
      isConfigured: false,
      syncCount: 0,
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      id: 'pix',
      name: 'PIX Brasileiro',
      description: 'Integração com API PIX para pagamentos instantâneos',
      type: 'webhook',
      status: 'active',
      isConfigured: true,
      lastSync: '2024-01-20T10:30:00Z',
      syncCount: 156,
      icon: <Building2 className="h-5 w-5" />
    },
    {
      id: 'contabilizei',
      name: 'Contabilizei API',
      description: 'Sincronização automática com sistema contábil',
      type: 'api',
      status: 'active',
      isConfigured: true,
      lastSync: '2024-01-20T08:00:00Z',
      syncCount: 48,
      icon: <Database className="h-5 w-5" />
    },
    {
      id: 'banco_brasil',
      name: 'Banco do Brasil',
      description: 'Integração bancária para extrato automático',
      type: 'sync',
      status: 'error',
      isConfigured: true,
      lastSync: '2024-01-19T16:45:00Z',
      syncCount: 23,
      icon: <Building2 className="h-5 w-5" />
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testPayload, setTestPayload] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      error: 'destructive'
    } as const;
    
    const labels = {
      active: 'Ativo',
      inactive: 'Inativo',
      error: 'Erro'
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
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const handleTestWebhook = async () => {
    if (!testPayload) {
      toast.error('Insira um payload de teste válido');
      return;
    }

    setIsTestingWebhook(true);
    
    try {
      const payload = JSON.parse(testPayload);
      
      // Determine which webhook processor to use based on event type
      switch (payload.event_type) {
        case 'payment_received':
          await processPaymentWebhook(payload.data);
          break;
        case 'invoice_created':
          await processInvoiceWebhook(payload.data);
          break;
        case 'bank_transaction':
          await processBankTransaction(payload.data);
          break;
        default:
          toast.error('Tipo de evento não suportado');
          return;
      }
      
      toast.success('Webhook testado com sucesso!');
    } catch (error: any) {
      console.error('Error testing webhook:', error);
      toast.error(`Erro no teste: ${error.message}`);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const samplePayloads = {
    payment_received: {
      event_type: 'payment_received',
      data: {
        payment_id: 'pay_123456789',
        amount: 1500.00,
        reference_id: 'uuid-da-conta-a-receber',
        payment_method: 'pix',
        payment_date: new Date().toISOString().split('T')[0],
        payer_info: {
          name: 'João Silva',
          document: '12345678901'
        }
      }
    },
    invoice_created: {
      event_type: 'invoice_created',
      data: {
        invoice_id: 'inv_123456789',
        amount: 2500.00,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        client_id: 'uuid-do-cliente',
        description: 'Desenvolvimento de sistema personalizado',
        items: [
          {
            description: 'Desenvolvimento Frontend',
            amount: 1500.00
          },
          {
            description: 'Desenvolvimento Backend',
            amount: 1000.00
          }
        ]
      }
    },
    bank_transaction: {
      event_type: 'bank_transaction',
      data: {
        transaction_id: 'txn_123456789',
        amount: 1200.00,
        transaction_type: 'credit',
        description: 'TED Recebida - Cliente XYZ',
        date: new Date().toISOString().split('T')[0],
        category: 'payment_received'
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Plug className="h-6 w-6" />
            Integrações Financeiras
          </h2>
          <p className="text-muted-foreground">
            Configure e gerencie integrações com sistemas externos
          </p>
        </div>
        <Button>
          <Plug className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Integrações */}
        <div className="lg:col-span-2 space-y-4">
          {integrations.map((integration) => (
            <Card 
              key={integration.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedIntegration?.id === integration.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedIntegration(integration)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex flex-col items-center gap-1">
                      {integration.icon}
                      {getTypeIcon(integration.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusBadge(integration.status)}
                        <Badge variant="outline">{integration.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {integration.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          {integration.syncCount} sincronizações
                        </span>
                        {integration.lastSync && (
                          <span>
                            Última: {new Date(integration.lastSync).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(integration.status)}
                    <Switch 
                      checked={integration.status === 'active'}
                      onCheckedChange={() => {
                        // Handle toggle
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Painel de Configuração */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedIntegration ? `Configurar ${selectedIntegration.name}` : 'Selecione uma Integração'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedIntegration ? (
                <Tabs defaultValue="config" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="config">Config</TabsTrigger>
                    <TabsTrigger value="test">Teste</TabsTrigger>
                  </TabsList>

                  <TabsContent value="config" className="space-y-4">
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Insira a chave da API"
                      />
                    </div>
                    
                    {selectedIntegration.type === 'webhook' && (
                      <div>
                        <Label htmlFor="webhook-url">Webhook URL</Label>
                        <Input
                          id="webhook-url"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        {getStatusBadge(selectedIntegration.status)}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Configurado</Label>
                      <div className="mt-1">
                        <Badge variant={selectedIntegration.isConfigured ? 'default' : 'secondary'}>
                          {selectedIntegration.isConfigured ? 'Sim' : 'Não'}
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </TabsContent>

                  <TabsContent value="test" className="space-y-4">
                    <div>
                      <Label htmlFor="test-payload">Payload de Teste</Label>
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {Object.keys(samplePayloads).map((key) => (
                            <Button
                              key={key}
                              variant="outline"
                              size="sm"
                              onClick={() => setTestPayload(JSON.stringify(samplePayloads[key as keyof typeof samplePayloads], null, 2))}
                            >
                              {key}
                            </Button>
                          ))}
                        </div>
                        <Textarea
                          id="test-payload"
                          value={testPayload}
                          onChange={(e) => setTestPayload(e.target.value)}
                          placeholder="Cole ou edite um payload JSON aqui..."
                          rows={8}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook || isProcessingWebhook || !testPayload}
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      {isTestingWebhook || isProcessingWebhook ? 'Testando...' : 'Testar Webhook'}
                    </Button>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Plug className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Selecione uma integração para configurar</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedIntegration && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Links Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Documentação da API
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Status da Integração
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Logs de Webhook
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}