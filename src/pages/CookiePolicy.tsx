import { SEOHead } from '@/components/seo/SEOHead';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useConsent } from '@/hooks/useConsent';
import { Cookie, Clock, Settings, Shield, BarChart3, Target, Zap } from 'lucide-react';

export default function CookiePolicy() {
  const lastUpdated = '03 de Janeiro de 2025';
  const { openPreferences } = useConsent();

  const cookieCategories = [
    {
      title: 'Cookies Necessários',
      icon: Shield,
      description: 'Essenciais para o funcionamento básico do website',
      always_active: true,
      examples: [
        'Sessão de autenticação',
        'Carrinho de compras',
        'Preferências de segurança',
        'Prevenção de CSRF'
      ],
      duration: 'Sessão ou até 1 ano',
      third_party: false
    },
    {
      title: 'Cookies de Analytics',
      icon: BarChart3,
      description: 'Coletam informações sobre como você usa nosso site',
      always_active: false,
      examples: [
        'Google Analytics (_ga, _gid, _gat)',
        'Hotjar (hj*)',
        'Métricas de performance',
        'Mapas de calor'
      ],
      duration: '2 anos',
      third_party: true
    },
    {
      title: 'Cookies de Marketing',
      icon: Target,
      description: 'Utilizados para personalizar anúncios e medir campanhas',
      always_active: false,
      examples: [
        'Facebook Pixel (_fbp, _fbc)',
        'LinkedIn Insight (lidc, li_gc)',
        'Google Ads (IDE, DSID)',
        'Remarketing tags'
      ],
      duration: '1-2 anos',
      third_party: true
    },
    {
      title: 'Cookies de Funcionalidade',
      icon: Zap,
      description: 'Melhoram a funcionalidade e personalização do site',
      always_active: false,
      examples: [
        'Preferências de tema',
        'Chat ao vivo',
        'Configurações salvas',
        'Idioma selecionado'
      ],
      duration: '1 ano',
      third_party: false
    }
  ];

  return (
    <>
      <SEOHead 
        title="Política de Cookies - Guilds"
        description="Política de Cookies da Guilds. Entenda como utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site."
        canonicalUrl="/cookies"
      />
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Cookie className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-foreground">
                  Política de Cookies
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Entenda como utilizamos cookies e tecnologias similares para melhorar sua experiência
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Última atualização: {lastUpdated}</span>
              </div>
            </div>

            {/* Controles */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Gerenciar Preferências</h2>
                  <p className="text-sm text-muted-foreground">
                    Você pode alterar suas preferências de cookies a qualquer momento
                  </p>
                </div>
                <Button onClick={openPreferences} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurar Cookies
                </Button>
              </div>
            </Card>

            {/* O que são cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">O que são Cookies?</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) 
                  quando você visita um website. Eles são amplamente utilizados para fazer os websites funcionarem de 
                  forma mais eficiente, bem como fornecer informações aos proprietários do site.
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Cookies Próprios</h3>
                    <p className="text-sm text-muted-foreground">
                      Definidos diretamente pelo nosso website (guilds.com.br) e utilizados apenas por nós.
                    </p>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-medium mb-2">Cookies de Terceiros</h3>
                    <p className="text-sm text-muted-foreground">
                      Definidos por domínios externos (Google, Facebook, LinkedIn) para analytics e marketing.
                    </p>
                  </Card>
                </div>
              </div>
            </section>

            <Separator />

            {/* Categorias de Cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Categorias de Cookies que Utilizamos</h2>
              <div className="space-y-6">
                {cookieCategories.map((category, index) => {
                  const Icon = category.icon;
                  
                  return (
                    <Card key={index} className="p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{category.title}</h3>
                              {category.always_active && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900 dark:text-green-200">
                                  Sempre Ativo
                                </span>
                              )}
                              {category.third_party && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-200">
                                  Terceiros
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              {category.description}
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid gap-4 md:grid-cols-3 ml-10">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Exemplos</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {category.examples.map((example, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <span className="text-primary">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Duração</h4>
                            <p className="text-xs text-muted-foreground">{category.duration}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Finalidade</h4>
                            <p className="text-xs text-muted-foreground">
                              {category.always_active 
                                ? 'Funcionamento essencial do site' 
                                : 'Pode ser desabilitado nas configurações'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <Separator />

            {/* Cookies Específicos */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Lista Detalhada de Cookies</h2>
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Google Analytics</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2">Cookie</th>
                          <th className="text-left py-2 px-2">Finalidade</th>
                          <th className="text-left py-2 px-2">Duração</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">_ga</td>
                          <td className="py-2 px-2 text-muted-foreground">Distinguir usuários únicos</td>
                          <td className="py-2 px-2 text-muted-foreground">2 anos</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">_gid</td>
                          <td className="py-2 px-2 text-muted-foreground">Distinguir usuários únicos</td>
                          <td className="py-2 px-2 text-muted-foreground">24 horas</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">_gat_gtag_*</td>
                          <td className="py-2 px-2 text-muted-foreground">Controlar taxa de solicitações</td>
                          <td className="py-2 px-2 text-muted-foreground">1 minuto</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3">Facebook Pixel</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2">Cookie</th>
                          <th className="text-left py-2 px-2">Finalidade</th>
                          <th className="text-left py-2 px-2">Duração</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">_fbp</td>
                          <td className="py-2 px-2 text-muted-foreground">Rastreamento de conversões</td>
                          <td className="py-2 px-2 text-muted-foreground">3 meses</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">_fbc</td>
                          <td className="py-2 px-2 text-muted-foreground">Atribuição de cliques</td>
                          <td className="py-2 px-2 text-muted-foreground">1 ano</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3">LinkedIn Insight</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2">Cookie</th>
                          <th className="text-left py-2 px-2">Finalidade</th>
                          <th className="text-left py-2 px-2">Duração</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">lidc</td>
                          <td className="py-2 px-2 text-muted-foreground">Roteamento de datacenter</td>
                          <td className="py-2 px-2 text-muted-foreground">24 horas</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-2 px-2 font-mono text-xs">li_gc</td>
                          <td className="py-2 px-2 text-muted-foreground">Armazenar consentimento</td>
                          <td className="py-2 px-2 text-muted-foreground">2 anos</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Como controlar cookies */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Como Controlar Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">1. Através do nosso site</h3>
                  <p className="text-muted-foreground mb-3">
                    Use o botão "Configurar Cookies" acima ou clique no ícone de cookies no rodapé do site 
                    para gerenciar suas preferências a qualquer momento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">2. Configurações do navegador</h3>
                  <p className="text-muted-foreground mb-3">
                    Todos os navegadores modernos permitem controlar cookies através das configurações:
                  </p>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Card className="p-3">
                      <h4 className="font-medium text-sm mb-1">Chrome</h4>
                      <p className="text-xs text-muted-foreground">Configurações → Privacidade e segurança → Cookies</p>
                    </Card>
                    <Card className="p-3">
                      <h4 className="font-medium text-sm mb-1">Firefox</h4>
                      <p className="text-xs text-muted-foreground">Preferências → Privacidade e segurança → Cookies</p>
                    </Card>
                    <Card className="p-3">
                      <h4 className="font-medium text-sm mb-1">Safari</h4>
                      <p className="text-xs text-muted-foreground">Preferências → Privacidade → Cookies</p>
                    </Card>
                    <Card className="p-3">
                      <h4 className="font-medium text-sm mb-1">Edge</h4>
                      <p className="text-xs text-muted-foreground">Configurações → Privacidade → Cookies</p>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">3. Opt-out específico</h3>
                  <p className="text-muted-foreground mb-3">
                    Você também pode optar por não participar de serviços específicos:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>
                      <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-primary hover:underline">
                        Google Analytics Opt-out
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/settings?tab=ads" target="_blank" rel="noopener" className="text-primary hover:underline">
                        Facebook Ad Preferences
                      </a>
                    </li>
                    <li>
                      <a href="https://www.linkedin.com/psettings/advertising" target="_blank" rel="noopener" className="text-primary hover:underline">
                        LinkedIn Ad Settings
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Impacto de desabilitar */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Impacto de Desabilitar Cookies</h2>
              <div className="grid gap-4">
                <Card className="p-4 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                  <h3 className="font-medium mb-2">Cookies Necessários</h3>
                  <p className="text-sm text-muted-foreground">
                    Não podem ser desabilitados pois são essenciais. Bloqueá-los pode impedir o funcionamento correto do site.
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Cookies de Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Desabilitar não afeta a funcionalidade, mas nos impede de melhorar a experiência baseada no uso.
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Cookies de Marketing</h3>
                  <p className="text-sm text-muted-foreground">
                    Você pode continuar usando o site normalmente, mas os anúncios serão menos relevantes.
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Cookies de Funcionalidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Algumas funcionalidades como chat ao vivo ou preferências salvas podem não funcionar adequadamente.
                  </p>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Atualizações */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Atualizações desta Política</h2>
              <p className="text-muted-foreground mb-4">
                Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças em nossa 
                prática ou por outros motivos operacionais, legais ou regulatórios.
              </p>
              <p className="text-muted-foreground">
                Recomendamos que você revise esta página regularmente. A data da última atualização está 
                disponível no topo desta página.
              </p>
            </section>

            <Separator />

            {/* Contato */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Dúvidas sobre Cookies?</h2>
              <Card className="p-4 bg-muted/30">
                <p className="text-muted-foreground mb-3">
                  Se você tiver dúvidas sobre nossa utilização de cookies, entre em contato conosco:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> contato@guilds.com.br</p>
                  <p><strong>DPO:</strong> contato@guilds.com.br</p>
                  <p>
                    <strong>Mais informações:</strong>{' '}
                    <a href="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </a>
                  </p>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}