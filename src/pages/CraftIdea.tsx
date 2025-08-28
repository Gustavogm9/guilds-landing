import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IdeaHero } from '@/components/craft/IdeaHero';
import { PartnershipForm } from '@/components/craft/PartnershipForm';
import { useCraft } from '@/hooks/useCraft';
import { 
  Users, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  DollarSign,
  UserCheck,
  Wrench
} from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CraftIdea() {
  const { slug } = useParams<{ slug: string }>();
  const { getIdeaBySlug } = useCraft();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!slug) return;
      
      try {
        const ideaData = await getIdeaBySlug(slug);
        setIdea(ideaData);
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [slug, getIdeaBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
          <p className="text-muted-foreground">O projeto que você está procurando não existe ou foi removido.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={idea.title}
        description={idea.meta_description || idea.problem_thesis}
        keywords={idea.keywords}
      />

      {/* Hero */}
      <IdeaHero
        title={idea.title}
        problem_thesis={idea.problem_thesis}
        estimated_timeline={idea.estimated_timeline}
        estimated_investment={idea.estimated_investment}
        next_steps={idea.next_steps}
        stage={idea.stage}
        updated_at={idea.updated_at}
        onPartnershipClick={() => setIsPartnershipModalOpen(true)}
      />

      {/* Content Sections */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Persona & Pain Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Persona & Dores Identificadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Público-alvo</h4>
                  <p className="text-muted-foreground">{idea.target_persona}</p>
                </div>
                
                {idea.pain_points && idea.pain_points.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Principais dores</h4>
                    <ul className="space-y-2">
                      {idea.pain_points.map((pain: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposed Solution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Solução Proposta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {idea.proposed_solution}
                </p>
                
                {idea.mvp_description && (
                  <div>
                    <h4 className="font-semibold mb-2">MVP (Produto Mínimo Viável)</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {idea.mvp_description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Business Model */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Modelo de Negócios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {idea.business_model}
                </p>
                
                {idea.revenue_streams && idea.revenue_streams.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Fontes de receita</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.revenue_streams.map((stream: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {stream}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Roadmap & Risks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Roadmap & Análise de Riscos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.development_roadmap && (
                  <div>
                    <h4 className="font-semibold mb-2">Roadmap de desenvolvimento</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {idea.development_roadmap}
                    </p>
                  </div>
                )}
                
                {idea.risk_assessment && (
                  <div>
                    <h4 className="font-semibold mb-2">Principais riscos</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {idea.risk_assessment}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Partnership CTA */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6 text-center space-y-4">
                <h3 className="text-lg font-semibold">Interessado neste projeto?</h3>
                <p className="text-sm text-muted-foreground">
                  Vamos conversar sobre como podemos colaborar para tornar esta ideia realidade.
                </p>
                <Button 
                  onClick={() => setIsPartnershipModalOpen(true)}
                  className="w-full"
                >
                  Propor Parceria
                </Button>
              </CardContent>
            </Card>

            {/* Ideal Partners */}
            {idea.ideal_partners && idea.ideal_partners.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Parceiros Ideais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {idea.ideal_partners.map((partner: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{partner}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Required Skills */}
            {idea.required_skills && idea.required_skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Habilidades Necessárias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {idea.required_skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Investment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informações de Investimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Investimento estimado</h4>
                  <p className="font-semibold">{idea.estimated_investment}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Timeline</h4>
                  <p className="font-semibold">{idea.estimated_timeline}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <PartnershipForm
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
        ideaId={idea.id}
        ideaTitle={idea.title}
      />
    </>
  );
}