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
import { 
  ArrowRight,
  Clock,
  Unlink,
  Users,
  Brain,
  Search,
  FileText,
  Code,
  BarChart3,
  Rocket,
  Hammer,
  Lightbulb,
  GraduationCap,
  Zap,
  Shield,
  Trophy
} from "lucide-react";
import { GuildShield, GuildHammer, GuildCrest, TechKnight } from "@/components/icons";
import FloatingBadges from "@/components/ui/FloatingBadges";
import heroImage from "@/assets/hero-image.jpg";
import teamImage from "@/assets/team-collaboration.jpg";
import { 
  clientLogos, 
  stackLogos, 
  testimonials, 
  featuredCases, 
  workflowSteps, 
  painPoints, 
  services,
  valuePillars 
} from "@/data/mockData";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection className="flex items-center justify-center relative">
        <FloatingBadges className="hidden md:block" />
        
        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="text-center relative">
            {/* Main Headlines */}
            <div className="space-y-4 md:space-y-6 mb-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
                <span className="block text-foreground hero-text-shadow">
                  SISTEMAS
                </span>
                <span className="block text-primary hero-outline md:text-stroke">
                  INTELIGENTES
                </span>
              </h1>
              
              {/* Tech Knight positioned over text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <TechKnight 
                  className="w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem] opacity-90 hover:opacity-100 transition-opacity duration-500" 
                />
              </div>
            </div>

            {/* Subtitle and CTA */}
            <div className="relative z-20 bg-background/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mx-auto max-w-4xl border border-primary/10">
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6">
                Desenvolvemos software sob medida, automações com IA e jogos corporativos 
                que transformam processos e engajam equipes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button asChild size="lg" className="text-lg px-8 py-4">
                  <Link to="/contato">
                    Falar com Especialista
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                  <Link to="/cases">
                    Ver Portfólio
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-8 justify-center">
                <MetricBadge
                  icon={Shield}
                  value="150"
                  suffix="+"
                  label="Projetos Entregues"
                  variant="success"
                />
                <MetricBadge
                  icon={Trophy}
                  value="98"
                  suffix="%"
                  label="Satisfação"
                  variant="primary"
                />
              </div>
            </div>
          </div>
        </div>
      </HeroSection>

      {/* 2. Barra de Valor - 4 Pilares */}
      <FeatureSection spacing="sm">
        <FeatureGrid>
          {valuePillars.map((pillar, index) => (
            <div key={index} className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">{pillar.title}</h3>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </FeatureGrid>
      </FeatureSection>

      {/* 3. Guilds Lab & Guilds Craft - Seção Dedicada */}
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
                <GraduationCap className="h-6 w-6 text-accent" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.href}
                className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    {index === 0 ? <Code className="h-6 w-6 text-primary" /> :
                     index === 1 ? <Zap className="h-6 w-6 text-primary" /> :
                     index === 2 ? <Users className="h-6 w-6 text-primary" /> :
                     <Search className="h-6 w-6 text-primary" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-primary group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Saiba mais</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
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
              
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{pain.title}</h3>
                    <p className="text-sm text-muted-foreground">{pain.description}</p>
                  </div>
                </div>
              );
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
                
                return (
                  <div key={index} className="text-center space-y-4 relative">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto relative z-10">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm border border-border">
                      <div className="text-sm font-medium text-primary mb-1">{step.number}</div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Cases em destaque */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cases em <span className="text-gradient">destaque</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Resultados reais que nossos clientes alcançaram
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCases.map((caseItem, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={caseItem.image} 
                  alt={caseItem.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">{caseItem.company}</Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{caseItem.metric}</div>
                      <div className="text-xs text-muted-foreground">{caseItem.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{caseItem.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{caseItem.description}</p>
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    Ver case completo
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/cases">
                Ver todos os cases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. Clientes e depoimentos */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Clientes e <span className="text-gradient">depoimentos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja o que nossos clientes falam sobre os resultados
            </p>
          </div>

          {/* Logo Strip */}
          <div className="mb-16">
            <LogoStrip 
              title="Confiam na Guilds"
              logos={clientLogos}
              className="mb-8"
            />
          </div>

          {/* Testimonials */}
          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel 
              testimonials={testimonials}
              autoRotate={true}
              rotateInterval={8000}
            />
          </div>

          {/* Espaço reservado para vídeo futuro */}
          <div className="mt-16 text-center">
            <div className="bg-card border border-border rounded-2xl p-12">
              <h3 className="text-xl font-semibold mb-4">Depoimentos em vídeo</h3>
              <p className="text-muted-foreground mb-6">
                Em breve, depoimentos completos de nossos clientes em vídeo
              </p>
              <div className="w-32 h-32 bg-muted rounded-xl mx-auto flex items-center justify-center">
                <span className="text-4xl">🎬</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Stack & Integrações */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stack & <span className="text-gradient">Integrações</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnologias de ponta que utilizamos para criar soluções robustas
            </p>
          </div>

          <LogoStrip 
            title="Tecnologias que dominamos"
            logos={stackLogos}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Frontend</h3>
              <p className="text-sm text-muted-foreground">React, Next.js, TypeScript, Tailwind CSS</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Backend & IA</h3>
              <p className="text-sm text-muted-foreground">Node.js, Python, OpenAI, Supabase</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Automação</h3>
              <p className="text-sm text-muted-foreground">n8n, Zapier, WhatsApp Business, CRMs</p>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Home;