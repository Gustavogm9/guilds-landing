import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { FAQ } from "@/components/ui/FAQ";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { 
  Bot, 
  Workflow, 
  BrainCircuit, 
  Zap, 
  MessageSquare, 
  BarChart3,
  Users,
  Shield,
  Database,
  Lock,
  Eye,
  RefreshCw,
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Phone,
  MessageCircle
} from "lucide-react";
import { 
  automationUseCases, 
  automationIntegrations, 
  automationDeliverables,
  automationCases,
  automationSecurity,
  automationFAQ 
} from "@/data/mockData";

const AutomacaoIA = () => {
  const useCaseIcons = {
    workflow: Workflow,
    bot: Bot,
    brain: BrainCircuit,
    analytics: BarChart3,
    message: MessageSquare,
    chart: TrendingUp
  };

  const integrationIcons = {
    users: Users,
    message: MessageCircle,
    database: Database,
    workflow: Workflow,
    zap: Zap,
    chart: BarChart3
  };

  const deliverableIcons = {
    workflow: Workflow,
    bot: Bot,
    brain: BrainCircuit,
    chart: BarChart3
  };

  const securityIcons = {
    shield: Shield,
    eye: Eye,
    lock: Lock,
    refresh: RefreshCw
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Automação & IA",
            "description": "Soluções de automação de processos e inteligência artificial para empresas. Automatize fluxos, decida melhor com IA.",
            "provider": {
              "@type": "Organization",
              "name": "Guilds"
            },
            "serviceType": "Automação de Processos e Inteligência Artificial",
            "areaServed": "Brasil"
          })
        }}
      />

      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Serviços",
                "item": "/servicos"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Automação & IA",
                "item": "/servicos/automacao-ia"
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/servicos">Serviços</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Automação & IA</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Automatize fluxos. Decida melhor com IA.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Otimize processos, elimine tarefas repetitivas e tome decisões mais inteligentes 
                com soluções de automação e inteligência artificial sob medida para sua empresa.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Automatizar processos
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Falar com especialista
                </Button>
              </div>

              <div className="flex flex-wrap gap-4">
                <MetricBadge 
                  icon={Clock}
                  value="70%"
                  label="Redução tempo administrativo"
                />
                <MetricBadge 
                  icon={DollarSign}
                  value="40%"
                  label="Economia em operações"
                />
                <MetricBadge 
                  icon={CheckCircle2}
                  value="85%"
                  label="Redução de erros"
                />
              </div>
            </div>

            <div className="lg:order-first">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-card p-8 rounded-2xl shadow-lg border">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                      <Bot className="w-8 h-8 text-primary" />
                      <div>
                        <div className="font-semibold">Chatbots</div>
                        <div className="text-sm text-muted-foreground">24/7</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                      <Workflow className="w-8 h-8 text-secondary" />
                      <div>
                        <div className="font-semibold">Workflows</div>
                        <div className="text-sm text-muted-foreground">n8n</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                      <BrainCircuit className="w-8 h-8 text-accent" />
                      <div>
                        <div className="font-semibold">IA Preditiva</div>
                        <div className="text-sm text-muted-foreground">ML</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-primary" />
                      <div>
                        <div className="font-semibold">Analytics</div>
                        <div className="text-sm text-muted-foreground">Real-time</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Uso */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Casos de Uso que Transformam Negócios
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra como nossa automação e IA podem revolucionar seus processos, 
              desde workflows simples até análises avançadas com machine learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {automationUseCases.map((useCase, index) => {
              const Icon = useCaseIcons[useCase.icon as keyof typeof useCaseIcons];
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      {Icon && <Icon className="w-8 h-8 text-primary" />}
                      <Badge variant="secondary">{useCase.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                    <CardDescription>{useCase.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {useCase.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrações Disponíveis */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Integrações que Conectam Tudo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conectamos seus sistemas existentes para criar fluxos automatizados 
              que funcionam perfeitamente com as ferramentas que você já usa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {automationIntegrations.map((integration, index) => {
              const Icon = integrationIcons[integration.icon as keyof typeof integrationIcons];
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    {Icon && <Icon className="w-12 h-12 text-primary mx-auto mb-4" />}
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {integration.tools.map((tool, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <strong>Casos comuns:</strong> {integration.useCases.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Entregáveis */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              O que Você Recebe
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Soluções completas, prontas para usar e monitorar, 
              com documentação detalhada e suporte contínuo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {automationDeliverables.map((deliverable, index) => {
              const Icon = deliverableIcons[deliverable.icon as keyof typeof deliverableIcons];
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {Icon && <Icon className="w-12 h-12 text-primary mx-auto mb-4" />}
                    <CardTitle className="text-lg">{deliverable.title}</CardTitle>
                    <CardDescription>{deliverable.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      {deliverable.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cases & Ganhos */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Resultados Reais, Impacto Mensurável
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja como empresas como a sua alcançaram resultados extraordinários 
              com nossas soluções de automação e inteligência artificial.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {automationCases.map((caseItem, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {index === 0 && <Clock className="w-6 h-6 text-primary" />}
                      {index === 1 && <DollarSign className="w-6 h-6 text-primary" />}
                      {index === 2 && <CheckCircle2 className="w-6 h-6 text-primary" />}
                    </div>
                    <Badge variant="outline">{caseItem.company}</Badge>
                  </div>
                  <CardTitle className="text-xl">{caseItem.title}</CardTitle>
                  <CardDescription>{caseItem.problem}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Solução:</h4>
                      <p className="text-sm text-muted-foreground">{caseItem.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Resultado:</h4>
                      <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        {caseItem.metric}
                        <span className="text-sm font-normal text-muted-foreground">
                          {caseItem.metricLabel}
                        </span>
                      </div>
                    </div>
                    <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary/20 pl-4">
                      "{caseItem.testimonial}"
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Segurança & Privacidade */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Segurança & Privacidade em Primeiro Lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Seus dados estão seguros. Seguimos as melhores práticas de segurança 
              e compliance para garantir proteção total em todas as automações.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {automationSecurity.map((security, index) => {
              const Icon = securityIcons[security.icon as keyof typeof securityIcons];
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {Icon && <Icon className="w-12 h-12 text-primary mx-auto mb-4" />}
                    <CardTitle className="text-lg">{security.title}</CardTitle>
                    <CardDescription>{security.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-2">
                      {security.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tire suas dúvidas sobre automação, inteligência artificial, 
              custos, segurança e prazos de implementação.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQ questions={automationFAQ} />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Pronto para Automatizar e Crescer?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Comece com um diagnóstico gratuito dos seus processos. 
              Identifique oportunidades de automação e veja o potencial de economia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Diagnóstico gratuito
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Agendar demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Diagnóstico sem compromisso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Projeto piloto disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>ROI garantido</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AutomacaoIA;