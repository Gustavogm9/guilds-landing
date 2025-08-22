import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoStrip } from "@/components/ui/LogoStrip";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { Section, HeroSection, ContentSection, FeatureSection } from "@/components/ui/section";
import { Grid, ServiceGrid, FeatureGrid, MetricGrid, CaseGrid } from "@/components/ui/grid";
import { HeroImage } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Search, FileText, Code, BarChart3, Rocket, Clock, Unlink, Users, Brain, Globe, Zap, Shield, ArrowRight, Star, CheckCircle, Play, ChevronRight, MessageSquare, Target, TrendingUp, Award, Lightbulb, Settings, Puzzle, Database, Smartphone, Bot, Activity, BookOpen, Hammer } from 'lucide-react';
import { GuildShield, GuildHammer, GuildCrest } from "@/components/icons";
import heroImage from "@/assets/hero-image.jpg";
import teamImage from "@/assets/team-collaboration.jpg";
import { workflowSteps, painPoints, services, valuePillars, testimonials, featuredCases, evaluationFramework } from '../data/mockData';
const Home = () => {
  return <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background opacity-80"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <Grid cols={2} gap="xl" align="center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  ⚡ Inovação e resultados
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Sistemas{" "}
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    inteligentes
                  </span>
                  , resultados reais.
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Software, apps, automação, IA e gamificação feitos sob medida para o seu objetivo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/contato">
                    Falar com a Guilds
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <Link to="/cases">
                    Ver cases
                  </Link>
                </Button>
              </div>

              {/* Prova Social */}
              
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <HeroImage src={heroImage} alt="Guilds - Sistemas inteligentes, resultados reais" className="relative" />
            </div>
          </Grid>
        </div>
      </HeroSection>

      {/* 2. Barra de Valor - 4 Pilares */}
      <FeatureSection spacing="sm">
        <FeatureGrid>
          {valuePillars.map((pillar, index) => <div key={index} className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>)}
        </FeatureGrid>
      </FeatureSection>


      {/* 4. O que fazemos - Grid 2x2 */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que <span className="text-gradient">fazemos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluções digitais completas para transformar seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => <Link key={index} to={service.href} className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    {index === 0 ? <Code className="h-6 w-6 text-primary" /> : index === 1 ? <Zap className="h-6 w-6 text-primary" /> : index === 2 ? <Users className="h-6 w-6 text-primary" /> : <Search className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>)}
                  </div>
                </div>
                <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>)}

            {/* Guilds Lab Card */}
            <Link to="/lab" className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                      Guilds Lab
                    </h3>
                    <p className="text-accent font-medium text-sm">Pessoas no centro. Habilidades que escalam.</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Workshops práticos em tecnologia, desenvolvimento de jogos e aplicativos, 
                  focados nas habilidades que o mercado pede.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Workshops</Badge>
                  <Badge variant="secondary" className="text-xs">Educação Tech</Badge>
                  <Badge variant="secondary" className="text-xs">Soft Skills</Badge>
                  <Badge variant="secondary" className="text-xs">Certificação</Badge>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                Explorar Guilds Lab
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Guilds Craft Card */}
            <Link to="/craft" className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      Guilds Craft
                    </h3>
                    <p className="text-primary font-medium text-sm">Da ideia ao impacto.</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Parcerias e P&D para testar, construir e lançar soluções com potencial real. 
                  Transformamos ideias em produtos de impacto.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">Parcerias</Badge>
                  <Badge variant="secondary" className="text-xs">P&D</Badge>
                  <Badge variant="secondary" className="text-xs">Validação</Badge>
                  <Badge variant="secondary" className="text-xs">Lançamento</Badge>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                Explorar Guilds Craft
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Dores que resolvemos */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dores que <span className="text-gradient">resolvemos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Identificamos e solucionamos os principais gargalos que impedem o crescimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {painPoints.map((pain, index) => {
            const icons = {
              clock: Clock,
              unlink: Unlink,
              users: Users,
              brain: Brain
            };
            const Icon = icons[pain.icon as keyof typeof icons];
            return <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{pain.title}</h3>
                    <p className="text-sm text-muted-foreground">{pain.description}</p>
                  </div>
                </div>;
          })}
          </div>
        </div>
      </section>

      {/* 6. Como trabalhamos - 5 passos */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como <span className="text-gradient">trabalhamos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossa metodologia comprovada em 5 etapas para garantir resultados
            </p>
          </div>

          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {workflowSteps.map((step, index) => {
              const icons = {
                search: Search,
                blueprint: FileText,
                code: Code,
                chart: BarChart3,
                rocket: Rocket
              };
              const Icon = icons[step.icon as keyof typeof icons];
              return <div key={index} className="text-center space-y-4 relative">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto relative z-10">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
                      <div className="text-sm font-medium text-primary mb-1">{step.number}</div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Como Resolvemos - Framework de Avaliação */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como <span className="text-gradient">Resolvemos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nosso framework de avaliação garante que cada projeto use a combinação ideal de tecnologias, 
              maximizando resultados e minimizando complexidade
            </p>
          </div>

          {/* Framework Visual */}
          <div className="mb-16">
            <div className="relative max-w-4xl mx-auto">
              {/* Centro - Objetivo do Cliente */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center text-white">
                    <Target className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-sm font-semibold">Objetivo do</div>
                    <div className="text-sm font-semibold">Cliente</div>
                  </div>
                </div>
              </div>

              {/* Quadrantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {evaluationFramework.quadrants.map((quadrant, index) => {
                  const colors = {
                    blue: "from-blue-500/10 to-blue-600/5 border-blue-200 text-blue-700",
                    purple: "from-purple-500/10 to-purple-600/5 border-purple-200 text-purple-700", 
                    green: "from-green-500/10 to-green-600/5 border-green-200 text-green-700",
                    orange: "from-orange-500/10 to-orange-600/5 border-orange-200 text-orange-700"
                  };
                  const icons = {
                    "Automação": Bot,
                    "IA": Brain,
                    "Database": Database,
                    "Frontend": Smartphone
                  };
                  const Icon = icons[quadrant.title as keyof typeof icons];
                  
                  return (
                    <div key={index} className={`bg-gradient-to-br ${colors[quadrant.color as keyof typeof colors]} border rounded-2xl p-6 relative`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-6 h-6" />
                        <h3 className="font-bold text-lg">{quadrant.title}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {quadrant.tools.map((tool, toolIndex) => (
                          <div key={toolIndex} className="text-sm font-medium bg-background/50 rounded-lg px-3 py-2">
                            {tool}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Processo de Avaliação */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Processo de Avaliação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {evaluationFramework.process.map((step, index) => {
                const icons = {
                  target: Target,
                  settings: Settings,
                  puzzle: Puzzle,
                  check: CheckCircle
                };
                const Icon = icons[step.icon as keyof typeof icons];
                
                return (
                  <div key={index} className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover-scale">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critérios de Decisão */}
          <div className="space-y-12 mb-16">
            <div>
              <h3 className="text-xl font-bold mb-6">Critérios de Decisão</h3>
              <div className="space-y-3">
                {evaluationFramework.criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Exemplos Práticos</h3>
              <div className="space-y-4">
                {evaluationFramework.examples.map((example, index) => (
                  <div key={index} className="bg-background/30 rounded-lg p-4 border border-border/30">
                    <div className="flex items-start gap-3">
                      <Activity className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-sm mb-1">
                          <span className="text-muted-foreground">{example.scenario}</span> → <span className="text-primary">{example.solution}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{example.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold mb-4">Quer ver nossa avaliação para seu projeto?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Fazemos uma análise gratuita das suas necessidades e apresentamos a combinação ideal de ferramentas
              </p>
              <Button size="lg" className="gap-2">
                Solicitar Avaliação Gratuita
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Cases em destaque */}
      

      {/* 8. Clientes e depoimentos */}
      

      {/* 9. Stack & Integrações */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que nossos <span className="text-gradient">sistemas são confiáveis</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Utilizamos as tecnologias mais modernas e seguras do mercado para garantir que sua solução seja rápida, escalável e sempre disponível
            </p>
          </div>

          {/* Principais benefícios com ícones genéricos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group hover-scale">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Globe className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-primary">Interface Moderna</h3>
              <p className="text-sm text-muted-foreground">
                Interfaces responsivas e intuitivas que funcionam perfeitamente em qualquer dispositivo
              </p>
            </div>

            <div className="text-center group hover-scale">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <Brain className="w-12 h-12 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-accent">IA Integrada</h3>
              <p className="text-sm text-muted-foreground">
                Inteligência artificial para automatizar processos e oferecer insights inteligentes
              </p>
            </div>

            <div className="text-center group hover-scale">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/5 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                <Zap className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2 text-green-600">Performance Garantida</h3>
              <p className="text-sm text-muted-foreground">
                Sistemas otimizados que suportam milhares de usuários simultâneos sem lentidão
              </p>
            </div>

            <div className="text-center group hover-scale">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-emerald-500/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <Unlink className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="font-semibold mb-2 text-emerald-600">Integração Total</h3>
              <p className="text-sm text-muted-foreground">
                Conectamos seu sistema com WhatsApp, CRMs, ERPs e qualquer ferramenta que usar
              </p>
            </div>
          </div>

          {/* Garantias técnicas */}
          <div className="bg-muted/30 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Garantias técnicas que oferecemos</h3>
              <p className="text-muted-foreground">
                Trabalhamos apenas com tecnologias comprovadas e com suporte de longo prazo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="font-semibold mb-2">Segurança</h4>
                <p className="text-sm text-muted-foreground">
                  Criptografia de ponta a ponta e conformidade com LGPD para proteger seus dados
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <h4 className="font-semibold mb-2">99.9% Uptime</h4>
                <p className="text-sm text-muted-foreground">
                  Infraestrutura em nuvem com alta disponibilidade e backup automático
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-6 w-6 text-purple-500" />
                </div>
                <h4 className="font-semibold mb-2">Evolução Contínua</h4>
                <p className="text-sm text-muted-foreground">
                  Atualizações automáticas e novas funcionalidades sem interrupção do serviço
                </p>
              </div>
            </div>
          </div>

          {/* Parceiros tecnológicos */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-8">
              Parceiros tecnológicos confiáveis
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="text-sm font-medium">React</span>
              <span className="text-sm font-medium">OpenAI</span>
              <span className="text-sm font-medium">Node.js</span>
              <span className="text-sm font-medium">Supabase</span>
              <span className="text-sm font-medium">Vercel</span>
              <span className="text-sm font-medium">WhatsApp Business</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Guilds Lab & Guilds Craft - Seção Dedicada */}
      <ContentSection>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Produtos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Três frentes complementares para atender todas as suas necessidades digitais
          </p>
        </div>

        <ServiceGrid className="mb-12">
          {/* Guilds Lab */}
          <Card variant="elevated" className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Guilds Lab</h3>
                <p className="text-accent font-medium">Pessoas no centro. Habilidades que escalam.</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Workshops práticos em tecnologia, desenvolvimento de jogos e aplicativos, 
              focados nas habilidades que o mercado pede.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">Workshops</Badge>
              <Badge variant="secondary">Educação Tech</Badge>
              <Badge variant="secondary">Soft Skills</Badge>
              <Badge variant="secondary">Certificação</Badge>
            </div>
            <Button asChild variant="accent" className="w-full">
              <Link to="/lab">
                Explorar Guilds Lab
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>

          {/* Guilds Craft */}
          <Card variant="premium" className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Guilds Craft</h3>
                <p className="text-primary font-medium">Da ideia ao impacto.</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Parcerias e P&D para testar, construir e lançar soluções com potencial real. 
              Transformamos ideias em produtos de impacto.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">Parcerias</Badge>
              <Badge variant="secondary">P&D</Badge>
              <Badge variant="secondary">Validação</Badge>
              <Badge variant="secondary">Lançamento</Badge>
            </div>
            <Button asChild variant="premium" className="w-full">
              <Link to="/craft">
                Explorar Guilds Craft
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </ServiceGrid>
      </ContentSection>

      {/* 10. CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <GuildCrest className="h-16 w-16 mx-auto mb-6 text-white opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Junte-se a mais de 100 empresas que já transformaram seus processos com nossas soluções digitais. 
              Vamos descobrir como podemos ajudar você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/contato">
                  <Hammer className="mr-2 h-4 w-4" />
                  Agendar conversa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/cases">
                  Baixar one-pager PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>;
};
export default Home;