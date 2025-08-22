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
import { ArrowRight, Clock, Unlink, Users, Brain, Search, FileText, Code, BarChart3, Rocket, Hammer, Lightbulb, GraduationCap, Zap, Shield, Trophy } from "lucide-react";
import { GuildShield, GuildHammer, GuildCrest } from "@/components/icons";
import heroImage from "@/assets/hero-image.jpg";
import teamImage from "@/assets/team-collaboration.jpg";
import { clientLogos, stackLogos, testimonials, featuredCases, workflowSteps, painPoints, services, valuePillars } from "@/data/mockData";
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
            <Link to="/lab" className="group bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  Guilds Lab
                </h3>
                <p className="text-muted-foreground mb-4">
                  Workshops práticos em tecnologias emergentes, desenvolvimento de jogos e habilidades do futuro.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-accent/20 text-accent">Workshops</Badge>
                  <Badge variant="outline" className="text-xs border-accent/20 text-accent">Educação</Badge>
                  <Badge variant="outline" className="text-xs border-accent/20 text-accent">Soft Skills</Badge>
                </div>
              </div>
              <div className="flex items-center text-accent group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">Explorar Lab</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>

            {/* Guilds Craft Card */}
            <Link to="/craft" className="group bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-500 transition-colors">
                  Guilds Craft
                </h3>
                <p className="text-muted-foreground mb-4">
                  Parcerias estratégicas e P&D para transformar ideias inovadoras em produtos de impacto real.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-500">Parcerias</Badge>
                  <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-500">P&D</Badge>
                  <Badge variant="outline" className="text-xs border-purple-500/20 text-purple-500">Inovação</Badge>
                </div>
              </div>
              <div className="flex items-center text-purple-500 group-hover:translate-x-2 transition-transform">
                <span className="text-sm font-medium">Explorar Craft</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
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

      {/* 7. Cases em destaque */}
      

      {/* 8. Clientes e depoimentos */}
      

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

          <LogoStrip title="Tecnologias que dominamos" logos={stackLogos} />

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