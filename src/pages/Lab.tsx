import { Suspense } from 'react';
import { Section, HeroSection, ContentSection } from '@/components/ui/section';
import { Grid } from '@/components/ui/grid';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricBadge } from '@/components/ui/MetricBadge';
import { QualificationButton } from '@/components/forms/QualificationButton';
import { WorkshopCard } from '@/components/lab/WorkshopCard';
import { CategoryGrid } from '@/components/lab/CategoryGrid';
import { InstructorCard } from '@/components/lab/InstructorCard';
import { PricingGrid } from '@/components/lab/PricingCard';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { useWorkshops, useWorkshopCategories, useWorkshopInstructors } from '@/hooks/useWorkshops';
import { SEOHead } from '@/components/seo/SEOHead';
import { 
  Target, 
  Zap, 
  Trophy, 
  Users,
  Lightbulb,
  Code,
  Calendar,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Lab() {
  const { data: workshops = [], isLoading: workshopsLoading } = useWorkshops();
  const { data: categories = [], isLoading: categoriesLoading } = useWorkshopCategories();
  const { data: instructors = [], isLoading: instructorsLoading } = useWorkshopInstructors();

  const featuredWorkshops = workshops.filter(w => w.is_featured).slice(0, 3);
  const allWorkshops = workshops.slice(0, 6);

  return (
    <>
      <SEOHead
        title="Guilds Lab - Pessoas no centro. Habilidades que escalam."
        description="Workshops práticos em tecnologia, desenvolvimento de jogos e aplicativos. Aprenda com especialistas através de metodologia hands-on focada em resultados."
        keywords={["workshop", "tecnologia", "desenvolvimento", "games", "aplicativos", "treinamento", "capacitação"]}
      />

      {/* Hero Section */}
      <HeroSection className="bg-gradient-to-br from-background via-muted/20 to-primary/5">
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/20">
              🎯 Guilds Lab
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Pessoas no centro.{" "}
              <span className="bg-gradient-to-r from-primary via-primary-foreground to-accent bg-clip-text text-transparent">
                Habilidades que escalam.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Workshops práticos em tecnologia, desenvolvimento de jogos e aplicativos.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <QualificationButton variant="default" size="lg" className="min-w-[200px]">
              Solicitar Proposta
            </QualificationButton>
            <QualificationButton variant="outline" size="lg" className="min-w-[200px]">
              Falar com o Lab
            </QualificationButton>
          </div>
        </div>
      </HeroSection>

      {/* Métricas de Impacto */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Resultados que Comprovam</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossa metodologia prática gera impacto real no desenvolvimento profissional
          </p>
        </div>
        
        <Grid cols={1} gap="lg" className="md:grid-cols-3">
          <MetricBadge
            value="95%"
            label="Taxa de Conclusão"
            icon={CheckCircle}
            variant="success"
          />
          <MetricBadge
            value="4.8/5"
            label="Satisfação Média"
            icon={Award}
            variant="primary"
          />
          <MetricBadge
            value="89%"
            label="Aplicação em 30 dias"
            icon={TrendingUp}
            variant="accent"
          />
        </Grid>
      </ContentSection>

      {/* Metodologia */}
      <Section spacing="lg" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossa Metodologia</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprendizado prático com foco em resultados imediatos
          </p>
        </div>

        <Grid cols={1} gap="lg" className="md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center border-muted/30">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Prática Guiada</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Aprenda fazendo com orientação especializada a cada passo
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-muted/30">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-3">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Projetos Curtos</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Entregáveis concretos em cada módulo para fixar o aprendizado
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-muted/30">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary-foreground mx-auto flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Desafios Reais</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Resolva problemas baseados em cenários do mercado
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-muted/30">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Soft + Hard Skills</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Desenvolvimento técnico integrado com habilidades comportamentais
              </p>
            </CardContent>
          </Card>
        </Grid>
      </Section>

      {/* Trilhas & Temas */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trilhas de Aprendizado</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha sua jornada de desenvolvimento profissional
          </p>
        </div>

        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/30" />
          ))}
        </div>}>
          {!categoriesLoading && (
            <CategoryGrid categories={categories} />
          )}
        </Suspense>
      </ContentSection>

      {/* Catálogo de Workshops */}
      <Section spacing="lg" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Workshops em Destaque</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nossos workshops mais procurados por profissionais e empresas
          </p>
        </div>

        <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-80 animate-pulse bg-muted/30" />
          ))}
        </div>}>
          {!workshopsLoading && (
            <Grid cols={1} gap="lg" className="md:grid-cols-2 lg:grid-cols-3">
              {(featuredWorkshops.length > 0 ? featuredWorkshops : allWorkshops).map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </Grid>
          )}
        </Suspense>

        <div className="text-center mt-12">
          <QualificationButton variant="outline" size="lg">
            Ver Todos os Workshops
            <ArrowRight className="w-4 h-4 ml-2" />
          </QualificationButton>
        </div>
      </Section>

      {/* Mock Agenda */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Próximas Turmas</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Confira nossa agenda de workshops disponíveis
          </p>
        </div>

        <Card className="max-w-4xl mx-auto border-muted/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Agenda de Fevereiro 2025</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border border-muted/30 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">React do Zero ao Deploy</h4>
                    <Badge variant="secondary">Online</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">17-21 de Fevereiro • 19h às 22h</p>
                  <p className="text-sm font-medium text-primary">8 vagas restantes</p>
                </div>
                
                <div className="p-4 rounded-lg border border-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">UX/UI Design Thinking</h4>
                    <Badge variant="outline">Presencial</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">24-28 de Fevereiro • 14h às 18h</p>
                  <p className="text-sm font-medium text-amber-600">3 vagas restantes</p>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <QualificationButton variant="default">
                  Garantir Minha Vaga
                </QualificationButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentSection>

      {/* Pacotes */}
      <Section spacing="lg" background="muted">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Pacotes Empresariais</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Soluções completas para o desenvolvimento da sua equipe
          </p>
        </div>

        <PricingGrid />
      </Section>

      {/* Instrutores */}
      <ContentSection>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Instrutores & Mentores</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aprenda com profissionais experientes do mercado
          </p>
        </div>

        <Suspense fallback={<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-80 animate-pulse bg-muted/30" />
          ))}
        </div>}>
          {!instructorsLoading && (
            <Grid cols={1} gap="lg" className="md:grid-cols-2 lg:grid-cols-4">
              {instructors.slice(0, 4).map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </Grid>
          )}
        </Suspense>
      </ContentSection>

      {/* CTA Final */}
      <Section spacing="xl" background="gradient">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Escalar suas Habilidades?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de profissionais que já transformaram suas carreiras com nossos workshops práticos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <QualificationButton variant="default" size="lg" className="min-w-[200px]">
              Solicitar Proposta
            </QualificationButton>
            <QualificationButton variant="ghost" size="lg" className="min-w-[200px] border border-muted/30">
              Falar com o Lab
            </QualificationButton>
          </div>
        </div>
      </Section>
    </>
  );
}