import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useSEO } from '@/hooks/useSEO';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useToast } from '@/components/ui/use-toast';
import { Eye, AlertCircle, CheckCircle, BarChart3, Target, Users, TrendingUp } from 'lucide-react';

interface AnalyticsSettings {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  facebookPixelId: string;
  linkedinPartnerId: string;
  enableDebugMode: boolean;
  enableEnhancedEcommerce: boolean;
  enableConsentMode: boolean;
  customDimensions: Record<string, string>;
}

export function AnalyticsAdmin() {
  const { seoSettings, updateSEOSettings } = useSEO();
  const { isInitialized, enableDebugMode, disableDebugMode } = useAnalytics();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AnalyticsSettings>({
    googleAnalyticsId: '',
    googleTagManagerId: '',
    facebookPixelId: '',
    linkedinPartnerId: '',
    enableDebugMode: false,
    enableEnhancedEcommerce: true,
    enableConsentMode: true,
    customDimensions: {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [debugEvents, setDebugEvents] = useState<any[]>([]);

  // Load settings from SEO data
  useEffect(() => {
    if (seoSettings) {
      setSettings({
        googleAnalyticsId: seoSettings.google_analytics_id || '',
        googleTagManagerId: seoSettings.google_tag_manager_id || '',
        facebookPixelId: seoSettings.facebook_pixel_id || '',
        linkedinPartnerId: seoSettings.linkedin_partner_id || '',
        enableDebugMode: false,
        enableEnhancedEcommerce: true,
        enableConsentMode: true,
        customDimensions: {}
      });
    }
  }, [seoSettings]);

  // Listen for debug events when debug mode is enabled
  useEffect(() => {
    if (settings.enableDebugMode) {
      const originalLog = console.log;
      const events: any[] = [];
      
      console.log = (...args) => {
        if (args[0]?.includes?.('Analytics Event') || args[0]?.includes?.('🔍')) {
          events.push({
            timestamp: new Date().toISOString(),
            event: args
          });
          setDebugEvents([...events].slice(-20)); // Keep last 20 events
        }
        originalLog.apply(console, args);
      };

      return () => {
        console.log = originalLog;
      };
    }
  }, [settings.enableDebugMode]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateSEOSettings({
        ...seoSettings,
        google_analytics_id: settings.googleAnalyticsId,
        google_tag_manager_id: settings.googleTagManagerId,
        facebook_pixel_id: settings.facebookPixelId,
        linkedin_partner_id: settings.linkedinPartnerId
      });

      // Update debug mode
      if (settings.enableDebugMode) {
        enableDebugMode();
      } else {
        disableDebugMode();
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações de analytics foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Houve um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testEvent = (eventType: string) => {
    const { trackCTAClick, trackLeadSubmit, trackWhatsAppClick, trackNewsletterSubscribe } = useAnalytics();
    
    switch (eventType) {
      case 'cta_click':
        trackCTAClick('Test CTA Click', { cta_type: 'primary', section: 'admin_test' });
        break;
      case 'lead_submit':
        trackLeadSubmit('Teste', { utm_source: 'admin_test' });
        break;
      case 'whatsapp_click':
        trackWhatsAppClick('admin_test' as any, 'Teste do admin');
        break;
      case 'newsletter_subscribe':
        trackNewsletterSubscribe(true, 'inline');
        break;
    }

    toast({
      title: "Evento de teste enviado",
      description: `Evento ${eventType} foi enviado para o dataLayer.`,
    });
  };

  const getConnectionStatus = (id: string, platform: string) => {
    if (!id) return { status: 'disconnected', color: 'secondary' };
    
    // Simple validation for IDs
    const validations = {
      'Google Analytics': id.startsWith('G-') || id.startsWith('UA-'),
      'Google Tag Manager': id.startsWith('GTM-'),
      'Facebook Pixel': /^\d+$/.test(id),
      'LinkedIn': /^\d+$/.test(id)
    };

    const isValid = validations[platform as keyof typeof validations];
    return {
      status: isValid ? 'connected' : 'invalid',
      color: isValid ? 'default' : 'destructive'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics & Medição</h2>
          <p className="text-muted-foreground">
            Configure GTM, eventos e integração com plataformas de analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? "Inicializado" : "Desconectado"}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Google Analytics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">Google Analytics 4</CardTitle>
                  <CardDescription>Tracking ID (G-XXXXXXXXXX)</CardDescription>
                </div>
                <Badge variant={getConnectionStatus(settings.googleAnalyticsId, 'Google Analytics').color as any}>
                  {getConnectionStatus(settings.googleAnalyticsId, 'Google Analytics').status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="G-XXXXXXXXXX"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* Google Tag Manager */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">Google Tag Manager</CardTitle>
                  <CardDescription>Container ID (GTM-XXXXXXX)</CardDescription>
                </div>
                <Badge variant={getConnectionStatus(settings.googleTagManagerId, 'Google Tag Manager').color as any}>
                  {getConnectionStatus(settings.googleTagManagerId, 'Google Tag Manager').status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="GTM-XXXXXXX"
                  value={settings.googleTagManagerId}
                  onChange={(e) => setSettings({...settings, googleTagManagerId: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* Facebook Pixel */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">Meta Pixel</CardTitle>
                  <CardDescription>Pixel ID (números)</CardDescription>
                </div>
                <Badge variant={getConnectionStatus(settings.facebookPixelId, 'Facebook Pixel').color as any}>
                  {getConnectionStatus(settings.facebookPixelId, 'Facebook Pixel').status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="123456789012345"
                  value={settings.facebookPixelId}
                  onChange={(e) => setSettings({...settings, facebookPixelId: e.target.value})}
                />
              </CardContent>
            </Card>

            {/* LinkedIn Insight */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">LinkedIn Insight Tag</CardTitle>
                  <CardDescription>Partner ID (números)</CardDescription>
                </div>
                <Badge variant={getConnectionStatus(settings.linkedinPartnerId, 'LinkedIn').color as any}>
                  {getConnectionStatus(settings.linkedinPartnerId, 'LinkedIn').status}
                </Badge>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="12345"
                  value={settings.linkedinPartnerId}
                  onChange={(e) => setSettings({...settings, linkedinPartnerId: e.target.value})}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Debug</Label>
                  <p className="text-sm text-muted-foreground">Exibe eventos no console</p>
                </div>
                <Switch
                  checked={settings.enableDebugMode}
                  onCheckedChange={(checked) => setSettings({...settings, enableDebugMode: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enhanced Ecommerce</Label>
                  <p className="text-sm text-muted-foreground">Tracking de serviços como produtos</p>
                </div>
                <Switch
                  checked={settings.enableEnhancedEcommerce}
                  onCheckedChange={(checked) => setSettings({...settings, enableEnhancedEcommerce: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Consent Mode</Label>
                  <p className="text-sm text-muted-foreground">Conformidade com LGPD</p>
                </div>
                <Switch
                  checked={settings.enableConsentMode}
                  onCheckedChange={(checked) => setSettings({...settings, enableConsentMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Eventos Configurados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>cta_click</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>lead_submit</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>whatsapp_click</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>newsletter_subscribe</span>
                  <Badge variant="default">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>file_download</span>
                  <Badge variant="secondary">Planejado</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Teste de Eventos</CardTitle>
                <CardDescription>Envie eventos de teste para validar a configuração</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" onClick={() => testEvent('cta_click')}>
                  Testar CTA Click
                </Button>
                <Button variant="outline" size="sm" onClick={() => testEvent('lead_submit')}>
                  Testar Lead Submit
                </Button>
                <Button variant="outline" size="sm" onClick={() => testEvent('whatsapp_click')}>
                  Testar WhatsApp Click
                </Button>
                <Button variant="outline" size="sm" onClick={() => testEvent('newsletter_subscribe')}>
                  Testar Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="debug" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {settings.enableDebugMode 
                ? "Modo debug ativo. Eventos aparecerão abaixo e no console do navegador."
                : "Ative o modo debug nas configurações para ver eventos em tempo real."
              }
            </AlertDescription>
          </Alert>

          {debugEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Eventos Recentes</CardTitle>
                <CardDescription>Últimos 20 eventos capturados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {debugEvents.map((event, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                      <div className="text-xs text-muted-foreground mb-1">
                        {event.timestamp}
                      </div>
                      <div>{JSON.stringify(event.event, null, 2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Configure GA4 para ver dados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leads Gerados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Configure plataformas para ver dados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--%</div>
                <p className="text-xs text-muted-foreground">Configure plataformas para ver dados</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Eye className="h-4 w-4" />
            <AlertDescription>
              Para ver relatórios em tempo real, configure pelo menos uma plataforma de analytics e aguarde alguns eventos serem coletados.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}