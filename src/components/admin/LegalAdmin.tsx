import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Cookie, 
  FileText, 
  Settings, 
  BarChart3, 
  Target, 
  Zap,
  Save,
  Eye,
  AlertTriangle 
} from 'lucide-react';

export const LegalAdmin = () => {
  const { toast } = useToast();
  
  // Consent Banner Settings
  const [bannerSettings, setBannerSettings] = useState({
    enabled: true,
    title: 'Utilizamos cookies e tecnologias similares',
    description: 'Respeitamos sua privacidade. Utilizamos cookies essenciais para o funcionamento do site e, com seu consentimento, cookies para analytics e marketing para melhorar sua experiência.',
    position: 'bottom',
    theme: 'light'
  });

  // Cookie Categories Settings
  const [cookieCategories, setCookieCategories] = useState({
    necessary: { enabled: true, locked: true },
    analytics: { enabled: true, locked: false },
    marketing: { enabled: true, locked: false },
    functionality: { enabled: true, locked: false }
  });

  // reCAPTCHA Settings
  const [recaptchaSettings, setRecaptchaSettings] = useState({
    enabled: true,
    siteKey: '',
    secretKey: '',
    scoreThreshold: 0.5,
    actions: {
      qualification_form: true,
      newsletter_subscribe: true,
      contact_form: true
    }
  });

  // Legal Pages Settings
  const [legalPages, setLegalPages] = useState({
    privacy_policy: {
      enabled: true,
      last_updated: '2025-01-03',
      auto_update_notice: true
    },
    terms_of_service: {
      enabled: true,
      last_updated: '2025-01-03',
      auto_update_notice: true
    },
    cookie_policy: {
      enabled: true,
      last_updated: '2025-01-03',
      auto_update_notice: true
    }
  });

  // Compliance Stats (mock data)
  const [complianceStats] = useState({
    consent_rate: 87.3,
    gdpr_requests: 12,
    blocked_submissions: 45,
    cookie_preferences: {
      all_accepted: 65.2,
      necessary_only: 23.4,
      custom: 11.4
    }
  });

  const handleSaveBannerSettings = () => {
    // Here you would save to your backend/database
    toast({
      title: "Configurações salvas",
      description: "As configurações do banner de consentimento foram atualizadas.",
    });
  };

  const handleSaveRecaptchaSettings = () => {
    // Here you would save to your backend/database
    toast({
      title: "reCAPTCHA configurado",
      description: "As configurações do reCAPTCHA foram atualizadas.",
    });
  };

  const handleTestRecaptcha = () => {
    toast({
      title: "Teste iniciado",
      description: "Testando configurações do reCAPTCHA...",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance & Legal</h2>
          <p className="text-muted-foreground">
            Gerencie configurações de LGPD, cookies e segurança
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="consent">Consentimento</TabsTrigger>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="recaptcha">reCAPTCHA</TabsTrigger>
          <TabsTrigger value="legal-pages">Páginas Legais</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Taxa de Consentimento</h3>
              </div>
              <div className="text-2xl font-bold text-primary">
                {complianceStats.consent_rate}%
              </div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-green-600" />
                <h3 className="font-medium text-sm">Requests LGPD</h3>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {complianceStats.gdpr_requests}
              </div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="font-medium text-sm">Spam Bloqueado</h3>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {complianceStats.blocked_submissions}
              </div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-sm">Todos os Cookies</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {complianceStats.cookie_preferences.all_accepted}%
              </div>
              <p className="text-xs text-muted-foreground">Aceitos</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Status de Compliance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Política de Privacidade</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded dark:bg-green-900">
                  Ativo
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Termos de Uso</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded dark:bg-green-900">
                  Ativo
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Banner de Consentimento</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded dark:bg-green-900">
                  Ativo
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-green-600" />
                  <span className="text-sm">reCAPTCHA</span>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded dark:bg-green-900">
                  Configurado
                </span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Consent Banner Tab */}
        <TabsContent value="consent" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações do Banner de Consentimento</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="banner-enabled"
                  checked={bannerSettings.enabled}
                  onCheckedChange={(checked) => 
                    setBannerSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="banner-enabled">Exibir banner de consentimento</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-title">Título do Banner</Label>
                <Input
                  id="banner-title"
                  value={bannerSettings.title}
                  onChange={(e) => 
                    setBannerSettings(prev => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner-description">Descrição</Label>
                <Textarea
                  id="banner-description"
                  value={bannerSettings.description}
                  onChange={(e) => 
                    setBannerSettings(prev => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveBannerSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Visualizar
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Cookies Tab */}
        <TabsContent value="cookies" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Categorias de Cookies</h3>
            
            <div className="space-y-4">
              {Object.entries(cookieCategories).map(([key, category]) => (
                <div key={key} className="flex items-center justify-between p-3 border border-border rounded">
                  <div>
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {key === 'necessary' && 'Essenciais para funcionamento'}
                      {key === 'analytics' && 'Google Analytics, métricas'}
                      {key === 'marketing' && 'Facebook Pixel, LinkedIn'}
                      {key === 'functionality' && 'Chat, preferências'}
                    </p>
                  </div>
                  <Switch
                    checked={category.enabled}
                    disabled={category.locked}
                    onCheckedChange={(checked) =>
                      setCookieCategories(prev => ({
                        ...prev,
                        [key]: { ...prev[key as keyof typeof prev], enabled: checked }
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h4 className="font-medium">Preferências dos Usuários</h4>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="text-center p-3 border border-border rounded">
                  <div className="text-lg font-semibold text-primary">
                    {complianceStats.cookie_preferences.all_accepted}%
                  </div>
                  <div className="text-sm text-muted-foreground">Todos aceitos</div>
                </div>
                <div className="text-center p-3 border border-border rounded">
                  <div className="text-lg font-semibold text-amber-600">
                    {complianceStats.cookie_preferences.necessary_only}%
                  </div>
                  <div className="text-sm text-muted-foreground">Apenas necessários</div>
                </div>
                <div className="text-center p-3 border border-border rounded">
                  <div className="text-lg font-semibold text-blue-600">
                    {complianceStats.cookie_preferences.custom}%
                  </div>
                  <div className="text-sm text-muted-foreground">Personalizado</div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* reCAPTCHA Tab */}
        <TabsContent value="recaptcha" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configurações do reCAPTCHA v3</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recaptcha-enabled"
                  checked={recaptchaSettings.enabled}
                  onCheckedChange={(checked) =>
                    setRecaptchaSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <Label htmlFor="recaptcha-enabled">Habilitar reCAPTCHA</Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="site-key">Site Key (Público)</Label>
                  <Input
                    id="site-key"
                    type="password"
                    value={recaptchaSettings.siteKey}
                    onChange={(e) =>
                      setRecaptchaSettings(prev => ({ ...prev, siteKey: e.target.value }))
                    }
                    placeholder="6Le..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret Key (Privado)</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    value={recaptchaSettings.secretKey}
                    onChange={(e) =>
                      setRecaptchaSettings(prev => ({ ...prev, secretKey: e.target.value }))
                    }
                    placeholder="6Le..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score-threshold">Score Threshold (0.0 - 1.0)</Label>
                <Input
                  id="score-threshold"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={recaptchaSettings.scoreThreshold}
                  onChange={(e) =>
                    setRecaptchaSettings(prev => ({ 
                      ...prev, 
                      scoreThreshold: parseFloat(e.target.value) 
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Scores mais baixos indicam maior probabilidade de bot. Recomendado: 0.5
                </p>
              </div>

              <div className="space-y-3">
                <Label>Ações Protegidas</Label>
                {Object.entries(recaptchaSettings.actions).map(([action, enabled]) => (
                  <div key={action} className="flex items-center space-x-2">
                    <Switch
                      id={`action-${action}`}
                      checked={enabled}
                      onCheckedChange={(checked) =>
                        setRecaptchaSettings(prev => ({
                          ...prev,
                          actions: { ...prev.actions, [action]: checked }
                        }))
                      }
                    />
                    <Label htmlFor={`action-${action}`} className="capitalize">
                      {action.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSaveRecaptchaSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Configurações
                </Button>
                <Button variant="outline" onClick={handleTestRecaptcha}>
                  <Settings className="mr-2 h-4 w-4" />
                  Testar Configuração
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Legal Pages Tab */}
        <TabsContent value="legal-pages" className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(legalPages).map(([page, settings]) => (
              <Card key={page} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">
                      {page.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Última atualização: {settings.last_updated}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={settings.enabled}
                      onCheckedChange={(checked) =>
                        setLegalPages(prev => ({
                          ...prev,
                          [page]: { ...prev[page as keyof typeof prev], enabled: checked }
                        }))
                      }
                    />
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};