import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Mail, 
  Smartphone,
  Settings,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConnectorConfig {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms';
  status: 'connected' | 'disconnected' | 'error';
  isActive: boolean;
  config: Record<string, any>;
  lastSync?: string;
}

export function CommunicationConnectors() {
  const { toast } = useToast();
  const [connectors, setConnectors] = useState<ConnectorConfig[]>([
    {
      id: '1',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      status: 'disconnected',
      isActive: false,
      config: {
        apiKey: '',
        businessAccountId: '',
        phoneNumberId: '',
        webhookUrl: ''
      }
    },
    {
      id: '2',
      name: 'Resend Email',
      type: 'email',
      status: 'connected',
      isActive: true,
      config: {
        apiKey: 'res_****',
        fromEmail: 'noreply@guilds.com.br',
        fromName: 'Guilds System'
      },
      lastSync: new Date().toISOString()
    }
  ]);

  const [whatsappConfig, setWhatsappConfig] = useState({
    apiKey: '',
    businessAccountId: '',
    phoneNumberId: '',
    webhookUrl: '',
    verifyToken: 'guilds-webhook-token-' + Math.random().toString(36).substring(7)
  });

  const [emailConfig, setEmailConfig] = useState({
    apiKey: '',
    fromEmail: 'noreply@guilds.com.br',
    fromName: 'Guilds System'
  });

  const handleWhatsAppConnect = async () => {
    try {
      // Validate required fields
      if (!whatsappConfig.apiKey || !whatsappConfig.businessAccountId || !whatsappConfig.phoneNumberId) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios para conectar o WhatsApp",
          variant: "destructive"
        });
        return;
      }

      // Here you would make the actual API call to validate and connect
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 1500));

      setConnectors(prev => 
        prev.map(connector => 
          connector.type === 'whatsapp' 
            ? {
                ...connector,
                status: 'connected',
                isActive: true,
                config: whatsappConfig,
                lastSync: new Date().toISOString()
              }
            : connector
        )
      );

      toast({
        title: "WhatsApp conectado!",
        description: "WhatsApp Business API configurado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao WhatsApp Business API",
        variant: "destructive"
      });
    }
  };

  const handleEmailConnect = async () => {
    try {
      if (!emailConfig.apiKey || !emailConfig.fromEmail) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha a API Key e o email remetente",
          variant: "destructive"
        });
        return;
      }

      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 1000));

      setConnectors(prev => 
        prev.map(connector => 
          connector.type === 'email' 
            ? {
                ...connector,
                status: 'connected',
                isActive: true,
                config: emailConfig,
                lastSync: new Date().toISOString()
              }
            : connector
        )
      );

      toast({
        title: "Email conectado!",
        description: "Provedor de email configurado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar ao provedor de email",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-500 border-green-200';
      case 'error':
        return 'bg-red-500/10 text-red-500 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Conectores de Comunicação</h2>
        <p className="text-muted-foreground">
          Configure as integrações para envio de campanhas de feedback
        </p>
      </div>

      {/* Connectors Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {connectors.map((connector) => (
          <Card key={connector.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {connector.type === 'whatsapp' && <MessageCircle className="h-5 w-5 text-green-600" />}
                  {connector.type === 'email' && <Mail className="h-5 w-5 text-blue-600" />}
                  {connector.type === 'sms' && <Smartphone className="h-5 w-5 text-purple-600" />}
                  <span className="font-medium">{connector.name}</span>
                </div>
                {getStatusIcon(connector.status)}
              </div>
              <div className="space-y-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(connector.status)}`}
                >
                  {connector.status === 'connected' ? 'Conectado' : 
                   connector.status === 'error' ? 'Erro' : 'Desconectado'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={connector.isActive} 
                    disabled={connector.status !== 'connected'}
                  />
                  <span className="text-sm text-muted-foreground">Ativo</span>
                </div>
                {connector.lastSync && (
                  <p className="text-xs text-muted-foreground">
                    Última sinc: {new Date(connector.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="whatsapp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Business
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Provider
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-2">
            <Smartphone className="h-4 w-4" />
            SMS Gateway
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                Configuração WhatsApp Business API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wa-api-key">Access Token *</Label>
                  <Input
                    id="wa-api-key"
                    type="password"
                    placeholder="EAAx..."
                    value={whatsappConfig.apiKey}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      apiKey: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-business-id">Business Account ID *</Label>
                  <Input
                    id="wa-business-id"
                    placeholder="123456789012345"
                    value={whatsappConfig.businessAccountId}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      businessAccountId: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-phone-id">Phone Number ID *</Label>
                  <Input
                    id="wa-phone-id"
                    placeholder="123456789012345"
                    value={whatsappConfig.phoneNumberId}
                    onChange={(e) => setWhatsappConfig(prev => ({
                      ...prev,
                      phoneNumberId: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wa-verify-token">Verify Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wa-verify-token"
                      value={whatsappConfig.verifyToken}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(whatsappConfig.verifyToken)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wa-webhook-url">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="wa-webhook-url"
                    value="https://guilds.com.br/api/webhooks/whatsapp"
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard("https://guilds.com.br/api/webhooks/whatsapp")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure esta URL no seu webhook do WhatsApp Business
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://developers.facebook.com/docs/whatsapp', '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Documentação Meta
                </Button>
                <Button onClick={handleWhatsAppConnect}>
                  Conectar WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Configuração Email Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email-api-key">API Key (Resend) *</Label>
                  <Input
                    id="email-api-key"
                    type="password"
                    placeholder="re_..."
                    value={emailConfig.apiKey}
                    onChange={(e) => setEmailConfig(prev => ({
                      ...prev,
                      apiKey: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">Email Remetente *</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@guilds.com.br"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig(prev => ({
                      ...prev,
                      fromEmail: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">Nome Remetente</Label>
                <Input
                  id="from-name"
                  placeholder="Guilds System"
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfig(prev => ({
                    ...prev,
                    fromName: e.target.value
                  }))}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://resend.com/docs', '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Documentação Resend
                </Button>
                <Button onClick={handleEmailConnect}>
                  Conectar Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-purple-600" />
                Configuração SMS Gateway
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">SMS Gateway</h3>
                <p className="text-muted-foreground mb-4">
                  Integração com provedores SMS será implementada em breve
                </p>
                <Badge variant="outline">Em Desenvolvimento</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}