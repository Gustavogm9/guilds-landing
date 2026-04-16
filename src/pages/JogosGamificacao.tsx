import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FAQ } from "@/components/ui/FAQ";
import {
  Gamepad2,
  Users,
  Trophy,
  Target,
  TrendingUp,
  Shield,
  Heart,
  Crown,
  UserPlus,
  FileCheck,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  BarChart3
} from "lucide-react";
import { gamificationFormats, gamificationObjectives, gamificationMetrics, gamificationProcess, gamificationCases, gamificationFAQ } from "@/data/defaultContent";
import { useContent } from "@/hooks/useContent";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const JogosGamificacao = () => {
  const { getContent } = useContent('services');

  const defaultContent = {
    formats: gamificationFormats,
    objectives: gamificationObjectives,
    metrics: gamificationMetrics,
    process: gamificationProcess,
    cases: gamificationCases,
    faq: gamificationFAQ
  };

  const content = getContent('page_gamification', defaultContent);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-lg bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="container">
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
              <BreadcrumbPage>Jogos & Gamificação</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Jogos & Gamificação
              </Badge>

              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Aprendizado que engaja.{" "}
                <span className="text-primary">Cultura que fica.</span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Transformamos treinamentos corporativos em experiências memoráveis através de
                gamificação, simulações empresariais e serious games que realmente engajam
                e geram resultados duradouros.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="group">
                  Gamificar treinamento
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Ver demonstração
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <MetricBadge
                  icon={TrendingUp}
                  value="85%"
                  label="Taxa de retenção"
                />
                <MetricBadge
                  icon={Clock}
                  value="3.2x"
                  label="Mais engajamento"
                />
                <MetricBadge
                  icon={Award}
                  value="92%"
                  label="Taxa conclusão"
                />
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 p-8">
                  <div className="aspect-square bg-card rounded-lg shadow-sm flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <div className="aspect-square bg-card rounded-lg shadow-sm flex items-center justify-center">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <div className="aspect-square bg-card rounded-lg shadow-sm flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div className="aspect-square bg-card rounded-lg shadow-sm flex items-center justify-center">
                    <Gamepad2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos Disponíveis */}
      <section className="section-lg">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Trophy className="w-4 h-4 mr-2" />
              Formatos
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Soluções para cada necessidade</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Do workshop presencial ao serious game customizado, criamos experiências
              de aprendizado que se adaptam à sua cultura e objetivos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.formats.map((format: any, index: number) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name={format.icon} className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{format.title}</CardTitle>
                  <CardDescription>{format.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {format.features.map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objetivos & Aplicações */}
      <section className="section-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Target className="w-4 h-4 mr-2" />
              Aplicações
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Objetivos que atingimos</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada contexto empresarial tem suas particularidades. Desenvolvemos soluções
              gamificadas específicas para diferentes necessidades organizacionais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.objectives.map((objective: any, index: number) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <DynamicIcon name={objective.icon} className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{objective.title}</CardTitle>
                  </div>
                  <CardDescription>{objective.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {objective.benefits.map((benefit: string, benefitIndex: number) => (
                      <Badge key={benefitIndex} variant="secondary" className="justify-center">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Métricas de Engajamento */}
      <section className="section-lg">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Engajamento & Retenção comprovados</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Métricas reais dos nossos projetos mostram a eficácia da gamificação
              comparada aos métodos tradicionais de treinamento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.metrics.map((metric: any, index: number) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name={metric.icon || 'Target'} className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{metric.title}</div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-primary">
                    {metric.highlight}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Metodologia & Processo */}
      <section className="section-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              Metodologia
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Processo comprovado em 5 etapas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa metodologia estruturada garante que cada solução gamificada
              seja desenvolvida com foco nos seus objetivos específicos.
            </p>
          </div>

          <div className="space-y-8">
            {content.process.map((step: any, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-4 gap-6">
                    <div className="text-center lg:text-left">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4">
                        <span className="text-2xl font-bold text-primary">{step.number}</span>
                      </div>
                      <div className="text-sm text-primary font-semibold mb-2">{step.duration}</div>
                    </div>

                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Entregas:</h4>
                      <div className="space-y-2">
                        {step.deliverables.map((deliverable: string, deliverableIndex: number) => (
                          <div key={deliverableIndex} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {deliverable}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cases & Depoimentos */}
      <section className="section-lg">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="w-4 h-4 mr-2" />
              Cases de Sucesso
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Resultados reais, impacto mensurável</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça como empresas transformaram seus processos de treinamento
              e desenvolvimento através da gamificação.
            </p>
          </div>

          <div className="space-y-12">
            {content.cases.map((caseItem: any, index: number) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-square bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Gamepad2 className="w-16 h-16 text-primary mx-auto mb-4" />
                      <div className="text-2xl font-bold text-primary mb-2">{caseItem.company}</div>
                      <p className="text-muted-foreground">{caseItem.title}</p>
                    </div>
                  </div>

                  <CardContent className="p-8">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4">{caseItem.title}</h3>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Desafio</h4>
                          <p className="text-sm text-muted-foreground">{caseItem.problem}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm uppercase tracking-wide text-primary mb-2">Solução</h4>
                          <p className="text-sm text-muted-foreground">{caseItem.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {caseItem.metrics.map((metric: any, metricIndex: number) => (
                          <div key={metricIndex} className="text-center">
                            <div className="text-2xl font-bold text-primary">{metric.value}</div>
                            <div className="text-xs text-muted-foreground">{metric.label}</div>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {metric.improvement}
                            </Badge>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <blockquote className="text-sm italic text-muted-foreground mb-3">
                          "{caseItem.testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{caseItem.testimonial.author}</div>
                            <div className="text-xs text-muted-foreground">{caseItem.testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <CheckCircle className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Perguntas frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Esclarecemos as principais dúvidas sobre gamificação corporativa
              e como ela pode transformar seus treinamentos.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQ questions={content.faq} />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-lg bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para gamificar seu treinamento?
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Comece com um diagnóstico gratuito e descubra como a gamificação pode
            revolucionar o aprendizado na sua empresa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="group">
              Diagnóstico gratuito
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 hover:bg-primary-foreground/10">
              <Play className="w-4 h-4 mr-2" />
              Ver demonstração
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/70">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Cases comprovados
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              ROI em 6 meses
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Suporte completo
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JogosGamificacao;