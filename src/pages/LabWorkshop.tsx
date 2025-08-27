import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Trophy, CheckCircle, Calendar, MapPin, Star } from 'lucide-react';
import { Section, ContentSection } from '@/components/ui/section';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QualificationButton } from '@/components/forms/QualificationButton';
import { InstructorCard } from '@/components/lab/InstructorCard';
import { ModuleAccordion } from '@/components/lab/ModuleAccordion';
import { useWorkshop } from '@/hooks/useWorkshops';
import { SEOHead } from '@/components/seo/SEOHead';

export default function LabWorkshop() {
  const { slug } = useParams<{ slug: string }>();
  const { data: workshop, isLoading, error } = useWorkshop(slug!);

  if (isLoading) {
    return (
      <ContentSection>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </ContentSection>
    );
  }

  if (error || !workshop) {
    return (
      <ContentSection>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Workshop não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O workshop que você está procurando não foi encontrado ou não está mais disponível.
          </p>
          <Button asChild variant="outline">
            <Link to="/lab">Voltar para o Lab</Link>
          </Button>
        </div>
      </ContentSection>
    );
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'intermediate': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'advanced': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return level;
    }
  };

  return (
    <>
      <SEOHead
        title={`${workshop.title} - Guilds Lab`}
        description={workshop.meta_description || workshop.description}
        keywords={workshop.keywords}
      />

      {/* Breadcrumb */}
      <ContentSection>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/lab" className="hover:text-primary transition-colors">
            Guilds Lab
          </Link>
          <span>/</span>
          <span>Workshops</span>
          <span>/</span>
          <span className="text-foreground">{workshop.title}</span>
        </div>

        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/lab">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Lab
          </Link>
        </Button>
      </ContentSection>

      {/* Hero do Workshop */}
      <Section spacing="md" background="muted">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {workshop.is_featured && (
              <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
            <Badge variant="outline" className={getDifficultyColor(workshop.difficulty_level)}>
              {getDifficultyText(workshop.difficulty_level)}
            </Badge>
            {workshop.category && (
              <Badge variant="secondary">
                {workshop.category.name}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{workshop.title}</h1>
          
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {workshop.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{workshop.duration_hours} horas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{workshop.instructors?.length || 1} instrutor{(workshop.instructors?.length || 1) > 1 ? 'es' : ''}</span>
            </div>
            {workshop.certificate_included && (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Certificado incluso</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <QualificationButton variant="default" size="lg" className="min-w-[200px]">
              Solicitar Proposta
            </QualificationButton>
            <QualificationButton variant="outline" size="lg" className="min-w-[200px]">
              Falar sobre este Workshop
            </QualificationButton>
          </div>
        </div>
      </Section>

      <ContentSection>
        <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Público-alvo e Pré-requisitos */}
            <div className="grid md:grid-cols-2 gap-6">
              {workshop.target_audience && workshop.target_audience.length > 0 && (
                <Card className="border-muted/30">
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Público-alvo
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workshop.target_audience.map((audience, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{audience}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {workshop.prerequisites && workshop.prerequisites.length > 0 && (
                <Card className="border-muted/30">
                  <CardHeader>
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-amber-500" />
                      Pré-requisitos
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {workshop.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{prerequisite}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Objetivos de Aprendizado */}
            {workshop.learning_objectives && workshop.learning_objectives.length > 0 && (
              <Card className="border-muted/30">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    O que você vai aprender
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {workshop.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Cronograma/Módulos */}
            {workshop.modules && workshop.modules.length > 0 && (
              <Card className="border-muted/30">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Cronograma do Workshop
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {workshop.modules.length} módulos • {workshop.duration_hours} horas total
                  </p>
                </CardHeader>
                <CardContent>
                  <ModuleAccordion modules={workshop.modules} />
                </CardContent>
              </Card>
            )}

            {/* Projeto Prático */}
            {workshop.practical_project && (
              <Card className="border-muted/30">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Projeto Prático
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {workshop.practical_project}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Workshop */}
            <Card className="border-muted/30 sticky top-6">
              <CardHeader>
                <h3 className="font-semibold">Informações do Workshop</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duração:</span>
                    <span className="text-sm font-medium">{workshop.duration_hours} horas</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Nível:</span>
                    <Badge variant="outline" className={getDifficultyColor(workshop.difficulty_level)}>
                      {getDifficultyText(workshop.difficulty_level)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Certificado:</span>
                    <span className="text-sm font-medium">
                      {workshop.certificate_included ? 'Incluso' : 'Não incluso'}
                    </span>
                  </div>

                  <Separator />

                  <div>
                    <span className="text-sm text-muted-foreground mb-2 block">Modalidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {workshop.modalities?.map((modality, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {modality === 'online' ? 'Online' : 
                           modality === 'presential' ? 'Presencial' :
                           modality === 'in-company' ? 'In-company' : modality}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">Sob consulta</div>
                    <p className="text-xs text-muted-foreground mb-4">
                      Preço varia conforme modalidade e turma
                    </p>
                    
                    <div className="space-y-2">
                      <QualificationButton variant="default" size="sm" className="w-full">
                        Solicitar Proposta
                      </QualificationButton>
                      <QualificationButton variant="outline" size="sm" className="w-full">
                        Mais Informações
                      </QualificationButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ContentSection>

      {/* Instrutores */}
      {workshop.instructors && workshop.instructors.length > 0 && (
        <Section spacing="lg" background="muted">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {workshop.instructors.length === 1 ? 'Instrutor' : 'Instrutores'}
              </h2>
              <p className="text-muted-foreground">
                Conheça {workshop.instructors.length === 1 ? 'o especialista' : 'os especialistas'} que vai{workshop.instructors.length === 1 ? '' : 'ão'} guiar seu aprendizado
              </p>
            </div>

            <div className={`grid gap-6 ${workshop.instructors.length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-2'}`}>
              {workshop.instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          </div>
        </Section>
      )}
    </>
  );
}