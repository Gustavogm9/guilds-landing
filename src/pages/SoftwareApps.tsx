import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FAQ } from "@/components/ui/FAQ";
import {
  Code,
  Smartphone,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { softwareProblems, softwareDeliverables, softwareProcess, softwareQuality, softwareCases, softwareFAQ } from "@/data/defaultContent";
import { useContent } from "@/hooks/useContent";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const SoftwareApps = () => {
  const { getContent } = useContent('services');

  const defaultContent = {
    problems: softwareProblems,
    deliverables: softwareDeliverables,
    process: softwareProcess,
    quality: softwareQuality,
    cases: softwareCases,
    faq: softwareFAQ
  };

  const content = getContent('page_software', defaultContent);

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
              <BreadcrumbPage>Software & Apps</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Code className="w-4 h-4 mr-2" />
                Desenvolvimento Sob Medida
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
                Produtos digitais sob medida, do zero ao lançamento
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Transformamos suas ideias em soluções digitais robustas e escaláveis.
                Do MVP ao produto final, desenvolvemos software que realmente funciona
                para o seu negócio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="btn-hero">
                  Estimar projeto
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Falar com especialista
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="card-glass p-8 space-y-4">
                <MetricBadge
                  icon={Clock}
                  value="12-16"
                  suffix=" semanas"
                  label="Tempo médio de entrega"
                  variant="primary"
                />
                <MetricBadge
                  icon={CheckCircle}
                  value="95%"
                  label="Taxa de aprovação em produção"
                  variant="success"
                />
                <MetricBadge
                  icon={Code}
                  value="50+"
                  label="Projetos entregues"
                  variant="accent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas que Resolvemos */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Problemas que resolvemos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Identificamos e solucionamos os principais desafios que impedem o crescimento digital da sua empresa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.problems.map((problem: any, index: number) => (
              <Card key={index} className="card-elevated h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                    {/* Note: Icons handling for dynamic content would need a mapping component in a real dynamic scenario, 
                        but for now falling back to hardcoded icons or assuming they match if using the fallback.
                        If strictly dynamic, we'd need a StringToIcon mapper. 
                        For 100% fidelity with the mock data structure which has component references, 
                        the JSON in DB stored icon names strings. We would need a mapper.
                        Since we are reusing the mock logic which had component refs, but the DB has strings...
                        This will break if we don't handle the icon mapping.
                        
                        However, the fallback `softwareProblems` has direct component refs. 
                        The DB content has strings "AlertTriangle", etc.
                        
                        I need to import Lucide icons and map them OR just accept that dynamic icons need a mapper.
                        For this refactor, I will add a simple icon mapper.
                    */}
                    <DynamicIcon name={problem.icon} className="w-6 h-6 text-destructive" />
                  </div>
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {problem.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Entregáveis */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              O que desenvolvemos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Soluções digitais completas, desde interfaces até integrações complexas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.deliverables.map((deliverable: any, index: number) => (
              <Card key={index} className="card-shield h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <DynamicIcon name={deliverable.icon} className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{deliverable.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {deliverable.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {deliverable.features.map((feature: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Processo e Prazos */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Processo e prazos típicos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Metodologia ágil com entregas incrementais e feedback constante
            </p>
          </div>

          <div className="space-y-8">
            {content.process.map((step: any, index: number) => (
              <div key={index} className="flex flex-col lg:flex-row gap-8 items-center">
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                    <h3 className="text-2xl font-semibold">{step.title}</h3>
                    <Badge variant="outline" className="w-fit">
                      <Clock className="w-4 h-4 mr-2" />
                      {step.duration}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.deliverables.map((deliverable: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {deliverable}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualidade & Segurança */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Qualidade & Segurança
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Padrões rigorosos de desenvolvimento e segurança em todos os projetos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.quality.map((item: any, index: number) => (
              <Card key={index} className="card-elevated text-center h-full">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <DynamicIcon name={item.icon} className="w-8 h-8 text-success" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {item.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {item.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-success mr-2 flex-shrink-0" />
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

      {/* Cases Relevantes */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Cases relevantes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Projetos reais que transformaram negócios
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {content.cases.map((caseStudy: any, index: number) => (
              <Card key={index} className="card-elevated overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {caseStudy.technologies.map((tech: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">{caseStudy.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {caseStudy.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Problema:</h4>
                      <p className="text-sm text-muted-foreground">{caseStudy.problem}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Solução:</h4>
                      <p className="text-sm text-muted-foreground">{caseStudy.solution}</p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t">
                      <MetricBadge
                        icon={BarChart3}
                        value={caseStudy.metric}
                        label={caseStudy.metricLabel}
                        variant="success"
                        size="sm"
                      />
                      <Button variant="ghost" size="sm">
                        Ver case completo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tire suas dúvidas sobre desenvolvimento de software
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQ questions={content.faq} />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-lg bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Pronto para transformar sua ideia em realidade?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nossa equipe sênior está pronta para desenvolver a solução digital
              que seu negócio precisa. Vamos conversar sobre seu projeto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-hero">
                Estimar meu projeto
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                <Smartphone className="w-5 h-5 mr-2" />
                Falar com especialista
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2" />
                Orçamento gratuito
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2" />
                Sem compromisso
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-success mr-2" />
                Resposta em 24h
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import * as Icons from "lucide-react";
import { BarChart3 } from "lucide-react";

// Helper component to render icons dynamically
const DynamicIcon = ({ name, className }: { name: any; className?: string }) => {
  // If name is already a component (from mockData fallback), render it
  if (typeof name !== 'string') {
    const IconComponent = name;
    return <IconComponent className={className} />;
  }

  // If name is a string (from DB), look it up in Lucide icons
  // @ts-ignore
  const Icon = Icons[name];

  if (!Icon) {
    // Fallback icon if not found
    return <Icons.HelpCircle className={className} />;
  }

  return <Icon className={className} />;
};

export default SoftwareApps;