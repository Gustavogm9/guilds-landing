import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Settings, 
  Palette, 
  MessageSquare, 
  Mail, 
  Zap,
  Save,
  RotateCcw,
  Copy,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import { useMultiProduct } from '@/contexts/MultiProductContext';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';
import { BusinessUnit } from '@/hooks/useCurrentProduct';

export function MultiProductSettings() {
  const { products } = useMultiProduct();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [showSecrets, setShowSecrets] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<BusinessUnit>('guilds');
  
  const { seoSettings, updateSEOSettings, loading: seoLoading } = useSEO(true, selectedProduct);

  // Mock settings state
  const [settings, setSettings] = useState({
    general: {
      companyName: 'Guilds',
      supportEmail: 'contato@guilds.com.br',
      supportPhone: '+5511999999999',
      timezone: 'America/Sao_Paulo',
      language: 'pt-BR',
      currency: 'BRL'
    },
    automation: {
      enabled: true,
      dailyLimit: 100,
      rateLimitPerContact: 3,
      retryAttempts: 3,
      enableWebhooks: true,
      webhookUrl: 'https://webhook.site/your-webhook-url',
      enableSlack: false,
      slackWebhook: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      dailyReports: true,
      weeklyReports: true,
      errorAlerts: true
    },
    integrations: {
      whatsappToken: '',
      emailProvider: 'resend',
      resendApiKey: '',
      openaiApiKey: '',
      zapierWebhook: ''
    }
  });

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Configurações salvas",
      description: "Todas as configurações foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    // Mock reset functionality
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para os valores padrão.",
    });
  };

  const handleSaveSEO = async () => {
    if (!seoSettings) return;
    
    try {
      await updateSEOSettings({
        site_name: seoSettings.site_name,
        title_template: seoSettings.title_template,
        meta_description: seoSettings.meta_description,
        og_image: seoSettings.og_image,
        twitter_handle: seoSettings.twitter_handle,
      });
      
      toast({
        title: "SEO atualizado",
        description: "Configurações de SEO atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações de SEO.",
        variant: "destructive",
      });
    }
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações Multi-Produto</h2>
          <p className="text-muted-foreground">
            Gerencie configurações globais e específicas por linha de produto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select 
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Telefone de Suporte</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select 
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moeda</Label>
                  <Select 
                    value={settings.general.currency}
                    onValueChange={(value) => updateSetting('general', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: product.color }}
                    />
                    {product.name}
                    <Badge variant={product.isActive ? 'default' : 'secondary'}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pipeline Padrão</Label>
                      <Input value={product.defaultPipeline || 'Não definido'} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Cor do Produto</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: product.color }}
                        />
                        <Input value={product.color} readOnly />
                        <Button variant="outline" size="sm">
                          <Palette className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fontes de Lead</Label>
                    <div className="flex flex-wrap gap-2">
                      {product.leadSources.map(source => (
                        <Badge key={source} variant="outline">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>WhatsApp</Label>
                      <Input value={product.settings.whatsapp} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={product.settings.email} readOnly />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={product.isActive}
                      onCheckedChange={() => {}}
                    />
                    <Label>Produto ativo</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Configurações de SEO
                  </CardTitle>
                  <CardDescription>
                    Configure SEO básico por produto
                  </CardDescription>
                </div>
                <Select value={selectedProduct} onValueChange={(value: BusinessUnit) => setSelectedProduct(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Produto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guilds">Guilds</SelectItem>
                    <SelectItem value="doavya">Doavya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {seoLoading ? (
                <p className="text-sm text-muted-foreground">Carregando...</p>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Nome do Site</Label>
                    <Input 
                      value={seoSettings?.site_name || ''} 
                      onChange={(e) => {
                        if (seoSettings) {
                          updateSEOSettings({ ...seoSettings, site_name: e.target.value });
                        }
                      }}
                      placeholder="Guilds"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Template de Título</Label>
                    <Input 
                      value={seoSettings?.title_template || ''} 
                      onChange={(e) => {
                        if (seoSettings) {
                          updateSEOSettings({ ...seoSettings, title_template: e.target.value });
                        }
                      }}
                      placeholder="{title} | Guilds"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use {'{title}'} como placeholder para o título da página
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Meta Description Padrão</Label>
                    <Textarea 
                      value={seoSettings?.meta_description || ''} 
                      onChange={(e) => {
                        if (seoSettings) {
                          updateSEOSettings({ ...seoSettings, meta_description: e.target.value });
                        }
                      }}
                      placeholder="Descrição padrão do site"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Twitter Handle</Label>
                    <Input 
                      value={seoSettings?.twitter_handle || ''} 
                      onChange={(e) => {
                        if (seoSettings) {
                          updateSEOSettings({ ...seoSettings, twitter_handle: e.target.value });
                        }
                      }}
                      placeholder="@guilds"
                    />
                  </div>

                  <Button onClick={handleSaveSEO} className="w-full">
                    Salvar Configurações SEO
                  </Button>

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Para configurações avançadas de SEO (páginas específicas, custom tags, analytics), 
                      use a página dedicada de <strong>SEO Admin</strong>.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Configurações de Automação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automações Ativas</p>
                  <p className="text-sm text-muted-foreground">
                    Permitir execução de automações
                  </p>
                </div>
                <Switch 
                  checked={settings.automation.enabled}
                  onCheckedChange={(checked) => updateSetting('automation', 'enabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Limite Diário</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={settings.automation.dailyLimit}
                    onChange={(e) => updateSetting('automation', 'dailyLimit', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rateLimitPerContact">Limite por Contato</Label>
                  <Input
                    id="rateLimitPerContact"
                    type="number"
                    value={settings.automation.rateLimitPerContact}
                    onChange={(e) => updateSetting('automation', 'rateLimitPerContact', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Tentativas de Reenvio</Label>
                <Input
                  id="retryAttempts"
                  type="number"
                  value={settings.automation.retryAttempts}
                  onChange={(e) => updateSetting('automation', 'retryAttempts', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Webhooks</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações via webhook
                    </p>
                  </div>
                  <Switch 
                    checked={settings.automation.enableWebhooks}
                    onCheckedChange={(checked) => updateSetting('automation', 'enableWebhooks', checked)}
                  />
                </div>

                {settings.automation.enableWebhooks && (
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">URL do Webhook</Label>
                    <Input
                      id="webhookUrl"
                      value={settings.automation.webhookUrl}
                      onChange={(e) => updateSetting('automation', 'webhookUrl', e.target.value)}
                      placeholder="https://seu-webhook.com/endpoint"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Configurações de Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por email
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações por SMS
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push</p>
                    <p className="text-sm text-muted-foreground">
                      Receber notificações push
                    </p>
                  </div>
                  <Switch 
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium">Relatórios</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Relatórios Diários</p>
                      <p className="text-sm text-muted-foreground">
                        Resumo diário de atividades
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.dailyReports}
                      onCheckedChange={(checked) => updateSetting('notifications', 'dailyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Relatórios Semanais</p>
                      <p className="text-sm text-muted-foreground">
                        Análise semanal completa
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertas de Erro</p>
                      <p className="text-sm text-muted-foreground">
                        Notificações de falhas críticas
                      </p>
                    </div>
                    <Switch 
                      checked={settings.notifications.errorAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'errorAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Integrações de API
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="gap-2"
                >
                  {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showSecrets ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsappToken">WhatsApp API Token</Label>
                <div className="flex gap-2">
                  <Input
                    id="whatsappToken"
                    type={showSecrets ? 'text' : 'password'}
                    value={settings.integrations.whatsappToken}
                    onChange={(e) => updateSetting('integrations', 'whatsappToken', e.target.value)}
                    placeholder="Insira o token da API do WhatsApp"
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailProvider">Provedor de Email</Label>
                <Select 
                  value={settings.integrations.emailProvider}
                  onValueChange={(value) => updateSetting('integrations', 'emailProvider', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resend">Resend</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resendApiKey">Resend API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="resendApiKey"
                    type={showSecrets ? 'text' : 'password'}
                    value={settings.integrations.resendApiKey}
                    onChange={(e) => updateSetting('integrations', 'resendApiKey', e.target.value)}
                    placeholder="re_..."
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openaiApiKey"
                    type={showSecrets ? 'text' : 'password'}
                    value={settings.integrations.openaiApiKey}
                    onChange={(e) => updateSetting('integrations', 'openaiApiKey', e.target.value)}
                    placeholder="sk-..."
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zapierWebhook">Zapier Webhook</Label>
                <div className="flex gap-2">
                  <Input
                    id="zapierWebhook"
                    value={settings.integrations.zapierWebhook}
                    onChange={(e) => updateSetting('integrations', 'zapierWebhook', e.target.value)}
                    placeholder="https://hooks.zapier.com/..."
                  />
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}