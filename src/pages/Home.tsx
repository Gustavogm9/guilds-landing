import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoStrip } from "@/components/ui/LogoStrip";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { TestimonialCarousel } from "@/components/ui/TestimonialCarousel";
import { Section, HeroSection, ContentSection, FeatureSection } from "@/components/ui/section";
import { Grid, ServiceGrid, FeatureGrid, MetricGrid, CaseGrid } from "@/components/ui/grid";
import { HeroImage } from "@/components/ui/OptimizedImage";
import { Card } from "@/components/ui/card";
import { DynamicLogo } from "@/components/ui/DynamicLogo";
import { QualificationButton } from "@/components/forms/QualificationButton";
import { Search, FileText, Code, BarChart3, Rocket, Clock, Unlink, Users, Brain, Globe, Zap, Shield, ArrowRight, Star, CheckCircle, Play, ChevronRight, MessageSquare, Target, TrendingUp, Award, Lightbulb, Settings, Puzzle, Database, Smartphone, Bot, Activity, BookOpen, Hammer, RefreshCw, Map, Edit } from 'lucide-react';
import { GuildShield, GuildHammer, GuildCrest } from "@/components/icons";
import heroImage from "@/assets/hero-image.jpg";
import teamImage from "@/assets/team-collaboration.jpg";
import { SEOHead } from "@/components/seo/SEOHead";
import { workflowSteps, painPoints, services, valuePillars, testimonials, featuredCases, evaluationFramework } from '../data/mockData';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocalizedNavigation } from '@/hooks/useLocalizedNavigation';

const Home = () => {
  const { t } = useTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  return (
    <>
      <SEOHead />
      <div className="min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection className="relative overflow-hidden pb-16 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background opacity-80"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative">
          <Grid cols={2} gap="xl" align="center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {t('pages.home.hero.badge')}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {t('pages.home.hero.title')}
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  {t('pages.home.hero.subtitle')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <QualificationButton variant="hero" size="lg">
                  {t('pages.home.hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </QualificationButton>
                <Button asChild variant="glass" size="lg">
                  <Link to={getLocalizedPath('/cases')}>
                    {t('pages.home.hero.secondaryCta')}
                  </Link>
                </Button>
              </div>

              {/* Prova Social */}
              
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
              <HeroImage 
                src={heroImage} 
                alt="Guilds - Sistemas inteligentes, resultados reais" 
                className="relative rounded-3xl"
                width={588}
                height={331}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 588px"
              />
            </div>
          </Grid>
        </div>
      </HeroSection>

      {/* 2. Diferenciais Competitivos */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pages.home.differentials.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('pages.home.differentials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePillars.map((pillar, index) => {
            const icons = {
              "zap": Zap,
              "users": Users,
              "trending-up": TrendingUp,
              "refresh-cw": RefreshCw
            };
            const Icon = icons[pillar.icon as keyof typeof icons] || Zap;
            return <div key={index} className="group relative">
                  {/* Card Container */}
                  <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover-scale relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content */}
                    <div className="relative space-y-6">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>

                      {/* Title & Metric */}
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                          {pillar.title}
                        </h3>
                        <div className="text-sm font-semibold text-accent mb-3">
                          {pillar.metric}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                  </div>
                </div>;
          })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            
          </div>
        </div>
      </section>


      {/* 4. O que fazemos - Grid 2x2 */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pages.home.whatWeDo.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pages.home.whatWeDo.subtitle')}
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
                  <span className="text-sm font-medium">{t('pages.home.whatWeDo.learnMore')}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>)}

            {/* Guilds Lab Card */}
            <Link to={getLocalizedPath('/lab')} className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                      {t('pages.home.guildsLab.title')}
                    </h3>
                    <p className="text-accent font-medium text-sm">{t('pages.home.guildsLab.tagline')}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {t('pages.home.guildsLab.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Workshops', 'Educação Tech', 'Soft Skills', 'Certificação'].map((badge: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{badge}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                {t('pages.home.guildsLab.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Guilds Craft Card */}
            <Link to={getLocalizedPath('/craft')} className="group bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover-scale animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {t('pages.home.guildsCraft.title')}
                    </h3>
                    <p className="text-primary font-medium text-sm">{t('pages.home.guildsCraft.tagline')}</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {t('pages.home.guildsCraft.description')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Parcerias', 'P&D', 'Validação', 'Lançamento'].map((badge: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{badge}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                {t('pages.home.guildsCraft.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Dores que resolvemos */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pages.home.painPoints.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('pages.home.painPoints.subtitle')}
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
            const Icon = icons[pain.icon as keyof typeof icons] || Clock;
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
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-primary/10 px-6 py-3 rounded-full mb-6">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Hammer className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">{t('pages.home.methodology.badge')}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t('pages.home.methodology.title')}
              </span>
            </h2>
            
            <p className="text-xl font-medium text-muted-foreground mb-4 max-w-4xl mx-auto">
              {t('pages.home.methodology.subtitle')}
            </p>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('pages.home.methodology.description')}
            </p>
          </div>

          <div className="relative">
            {/* Enhanced Timeline with gradient */}
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20 rounded-full -translate-y-1/2"></div>
            <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
              {workflowSteps.map((step, index) => {
              const icons = {
                map: Map,
                search: Search,
                edit: Edit,
                code: Code,
                users: Users,
                chart: BarChart3
              };
              const Icon = icons[step.icon as keyof typeof icons] || Search;

              // Color progression through the steps
              const stepColors = ['from-blue-500/20 to-blue-600/10 border-blue-200/50', 'from-purple-500/20 to-purple-600/10 border-purple-200/50', 'from-green-500/20 to-green-600/10 border-green-200/50', 'from-orange-500/20 to-orange-600/10 border-orange-200/50', 'from-red-500/20 to-red-600/10 border-red-200/50', 'from-cyan-500/20 to-cyan-600/10 border-cyan-200/50'];
              return <div key={index} className="text-center space-y-6 relative group animate-fade-in" style={{
                animationDelay: `${index * 0.1}s`
              }}>
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Icon Container with enhanced styling */}
                    <div className="relative">
                      <div className={`w-20 h-20 bg-gradient-to-br ${stepColors[index]} rounded-3xl flex items-center justify-center mx-auto relative z-10 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <Icon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-border/50 group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300 min-h-[200px] flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Step benefit indicator */}
                      <div className="mt-4 pt-4 border-t border-border/30">
                        <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary/70">
                          <CheckCircle className="w-4 h-4" />
                          <span>Entrega {index === 0 ? 'Estratégica' : index === 1 ? 'Analítica' : index === 2 ? 'Criativa' : index === 3 ? 'Técnica' : index === 4 ? 'Operacional' : 'Evolutiva'}</span>
                        </div>
                      </div>
                    </div>
                  </div>;
            })}
            </div>
            
            {/* Methodology CTA */}
            <div className="text-center mt-16">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold mb-4">
                  Pronto para acelerar seu crescimento?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Descubra como nossa metodologia G-FORGE pode transformar seus desafios em oportunidades de crescimento exponencial.
                </p>
                <Button asChild variant="hero" size="lg" className="group">
                  <Link to="/contato">
                    Iniciar Diagnóstico G-FORGE
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Como Resolvemos - Framework de Avaliação */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-background via-muted/20 to-accent/10">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
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
                const Icon = icons[quadrant.title as keyof typeof icons] || Bot;
                return <div key={index} className={`bg-gradient-to-br ${colors[quadrant.color as keyof typeof colors]} border rounded-2xl p-6 relative`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="w-6 h-6" />
                        <h3 className="font-bold text-lg">{quadrant.title}</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {quadrant.tools.map((tool, toolIndex) => <div key={toolIndex} className="text-sm font-medium bg-background/50 rounded-lg px-3 py-2">
                            {tool}
                          </div>)}
                      </div>
                    </div>;
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
              const Icon = icons[step.icon as keyof typeof icons] || Target;
              return <div key={index} className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover-scale">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>;
            })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-xl font-bold mb-4">Quer ver nossa avaliação para seu projeto?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Fazemos uma análise gratuita das suas necessidades e apresentamos a combinação ideal de ferramentas
              </p>
              <QualificationButton size="lg" className="gap-2 btn-forge">
                <Rocket className="w-4 h-4" />
                Solicitar Avaliação Gratuita
                <ArrowRight className="w-4 h-4" />
              </QualificationButton>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Cases em destaque */}
      

      {/* 8. Clientes e depoimentos */}
      

      {/* 9. Stack & Integrações */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12 md:mb-16">
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
        </div>
      </section>


      {/* 10. CTA Final */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-accent text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <DynamicLogo usageContext="CTA e chamadas para ação" type="symbol" variant="light" className="h-16 w-16 mx-auto mb-6" alt="Guilds" fallback={<GuildCrest className="h-16 w-16 mx-auto mb-6 text-white opacity-90" />} />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Junte-se a mais de 100 empresas que já transformaram seus processos com nossas soluções digitais. 
              Vamos descobrir como podemos ajudar você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QualificationButton size="lg" className="bg-white text-primary hover:bg-white/90">
                <Hammer className="mr-2 h-4 w-4" />
                Agendar conversa
                <ArrowRight className="ml-2 h-4 w-4" />
              </QualificationButton>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;