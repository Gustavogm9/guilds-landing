import { Search, FileText, MapPin, TrendingUp, Shield, CheckCircle, Target, Users, Calendar, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { FAQ } from "@/components/ui/FAQ";
import { 
  consultoriaServices, 
  consultoriaDeliverables, 
  consultoriaProcess, 
  consultoriaCases, 
  consultoriaFAQ 
} from "@/data/mockData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Consultoria() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/10">
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
              <BreadcrumbItem>
                <BreadcrumbPage>Consultoria & Discovery</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Mapeamento estratégico. Decisões assertivas.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Diagnóstico completo, arquitetura de soluções e roadmaps trimestrais 
              para acelerar sua transformação digital com decisões baseadas em dados.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg px-8">
                Solicitar Diagnóstico
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Ver Metodologia
              </Button>
            </div>

            <div className="flex flex-wrap gap-6">
              <MetricBadge 
                value="30%" 
                label="Aceleração na execução" 
                icon={TrendingUp}
              />
              <MetricBadge 
                value="95%" 
                label="Assertividade dos roadmaps" 
                icon={Target}
              />
              <MetricBadge 
                value="40+" 
                label="Empresas atendidas" 
                icon={Users}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Serviços de Consultoria */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Serviços de Consultoria
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mapeamento completo do cenário atual e planejamento estratégico 
              para sua transformação digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {consultoriaServices.map((service, index) => {
              const IconComponent = {
                Search,
                FileText,
                MapPin,
                TrendingUp
              }[service.icon] || Search;

              return (
                <Card key={index} className="h-full border-2 hover:border-primary/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
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

      {/* Entregáveis Estratégicos */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Entregáveis Estratégicos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Documentação completa e roadmaps detalhados para guiar 
              sua estratégia de transformação digital
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {consultoriaDeliverables.map((deliverable, index) => {
              const IconComponent = {
                FileText,
                Target,
                Calendar,
                Shield
              }[deliverable.icon] || FileText;

              return (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-secondary/10 rounded-lg">
                        <IconComponent className="h-8 w-8 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{deliverable.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {deliverable.duration}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {deliverable.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {deliverable.components.map((component, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{component}</span>
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

      {/* Metodologia & Processo */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Metodologia & Processo
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Framework próprio testado em 40+ empresas para garantir 
              máxima assertividade nos diagnósticos e roadmaps
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary hidden md:block" />
            
            <div className="space-y-12">
              {consultoriaProcess.map((step, index) => (
                <div key={index} className="relative flex flex-col md:flex-row items-start gap-6">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg relative z-10">
                    {step.number}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <Card className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <Badge variant="secondary">{step.duration}</Badge>
                        </div>
                        <CardDescription className="text-base leading-relaxed">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {step.deliverables.map((deliverable, idx) => (
                            <Badge key={idx} variant="outline">
                              {deliverable}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Casos de Sucesso */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Casos de Sucesso
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Diagnósticos e roadmaps que geraram resultados comprovados 
              em empresas de diversos portes
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {consultoriaCases.map((caseStudy, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{caseStudy.company}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">SITUAÇÃO</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.situation}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">SOLUÇÃO</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.solution}</p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Resultado:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {caseStudy.result}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Esclarecemos as principais dúvidas sobre nossos serviços de consultoria
            </p>
          </div>
          
          <FAQ questions={consultoriaFAQ} />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para acelerar sua transformação digital?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Comece com um diagnóstico gratuito e descubra as oportunidades 
              que sua empresa está perdendo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Diagnóstico Gratuito
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                Agendar Consultoria
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>40+ empresas atendidas</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% confidencial</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Metodologia própria</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}