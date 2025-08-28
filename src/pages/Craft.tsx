import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IdeaCard } from '@/components/craft/IdeaCard';
import { PipelineFlow } from '@/components/craft/PipelineFlow';
import { PartnerCallout } from '@/components/craft/PartnerCallout';
import { PartnershipForm } from '@/components/craft/PartnershipForm';
import { useCraft } from '@/hooks/useCraft';
import { ArrowRight, Lightbulb, Users, TrendingUp, Target } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function Craft() {
  const { featuredIdeas, ideasLoading } = useCraft();
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);

  const metrics = [
    { label: 'Projetos ativos', value: '12', icon: Lightbulb },
    { label: 'Parcerias estabelecidas', value: '8', icon: Users },
    { label: 'Investimento médio', value: 'R$ 500k', icon: TrendingUp },
    { label: 'Taxa de sucesso', value: '75%', icon: Target }
  ];

  return (
    <>
      <SEOHead 
        title="Guilds Craft - P&D e Parcerias"
        description="Parcerias e P&D para testar, construir e lançar soluções com potencial real. Da ideia ao impacto."
        keywords={['P&D', 'parcerias', 'inovação', 'tecnologia', 'startups']}
      />

      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-background to-muted/30 py-20">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            Guilds Craft
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold">
            Da ideia ao impacto.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Parcerias e P&D para testar, construir e lançar soluções com potencial real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setIsPartnershipModalOpen(true)}
              className="px-8"
            >
              Propor parceria
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/craft/portfolio">
                Ver portfólio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* Metrics */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <metric.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Pipeline Flow */}
      <Section className="bg-muted/30">
        <PipelineFlow />
      </Section>

      {/* Featured Ideas Portfolio */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Portfólio de Ideias em Destaque</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Projetos inovadores em diferentes estágios de desenvolvimento, prontos para parcerias estratégicas
          </p>
        </div>

        {ideasLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredIdeas.slice(0, 6).map((idea) => (
              <IdeaCard
                key={idea.id}
                id={idea.id}
                slug={idea.slug}
                title={idea.title}
                problem_thesis={idea.problem_thesis}
                target_persona={idea.target_persona}
                next_steps={idea.next_steps}
                estimated_timeline={idea.estimated_timeline}
                is_featured={idea.is_featured}
                stage={idea.stage}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/craft/portfolio">
              Ver todos os projetos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Partner Callout */}
      <Section className="bg-muted/30">
        <PartnerCallout onPartnershipClick={() => setIsPartnershipModalOpen(true)} />
      </Section>

      {/* Partnership Model */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Modelo de Parceria</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Como estruturamos nossas colaborações para garantir sucesso mútuo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold">Alinhamento Estratégico</h3>
            <p className="text-muted-foreground">
              Definimos objetivos comuns, recursos disponíveis e expectativas de cada parte.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold">Desenvolvimento Colaborativo</h3>
            <p className="text-muted-foreground">
              Trabalhamos juntos na execução, com transparência e comunicação constante.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold">Compartilhamento de Resultados</h3>
            <p className="text-muted-foreground">
              Dividimos equitativamente os frutos do sucesso baseado na contribuição de cada um.
            </p>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Pronto para transformar uma ideia em realidade?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seja parte do futuro da inovação. Juntos, podemos criar soluções que geram impacto real no mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setIsPartnershipModalOpen(true)}
              className="px-8"
            >
              Iniciar uma parceria
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/craft/portfolio">
                Explorar projetos
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      <PartnershipForm
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
      />
    </>
  );
}