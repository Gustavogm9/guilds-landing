import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Lightbulb, TrendingUp, Shield, Handshake, Target } from 'lucide-react';

interface PartnerCalloutProps {
  onPartnershipClick: () => void;
}

export const PartnerCallout = ({ onPartnershipClick }: PartnerCalloutProps) => {
  const partnerTypes = [
    {
      icon: TrendingUp,
      title: 'Investidores de Impacto',
      description: 'Capital para escalar soluções com potencial de transformação social e ambiental.',
      badge: 'Financeiro'
    },
    {
      icon: Lightbulb,
      title: 'Especialistas Técnicos',
      description: 'Desenvolvedores, designers e arquitetos de software para construir produtos robustos.',
      badge: 'Técnico'
    },
    {
      icon: Target,
      title: 'Estrategistas de Mercado',
      description: 'Profissionais com expertise setorial para acelerar o go-to-market.',
      badge: 'Estratégico'
    },
    {
      icon: Shield,
      title: 'Mentores Seniores',
      description: 'Executivos experientes para guiar decisões estratégicas e operacionais.',
      badge: 'Mentoria'
    },
    {
      icon: Users,
      title: 'Redes Corporativas',
      description: 'Empresas interessadas em inovação aberta e parcerias estratégicas.',
      badge: 'Corporativo'
    },
    {
      icon: Handshake,
      title: 'Instituições de Pesquisa',
      description: 'Universidades e centros de pesquisa para validação científica e acadêmica.',
      badge: 'Acadêmico'
    }
  ];

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">O que buscamos em parceiros</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Procuramos parceiros que compartilhem nossa visão de criar impacto real através da inovação tecnológica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnerTypes.map((partner, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <partner.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary">{partner.badge}</Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">{partner.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {partner.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-4">
              Pronto para fazer parte da próxima inovação?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Seja você um investidor, especialista técnico, mentor ou empresa, 
              temos projetos que podem se beneficiar de sua expertise e recursos.
            </p>
            <Button onClick={onPartnershipClick} size="lg" className="px-8">
              Propor Parceria
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};