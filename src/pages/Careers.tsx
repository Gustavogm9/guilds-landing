import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { useJobPositions, useCompanyCulture } from '@/hooks/useCompanyData';
import { JobCard } from '@/components/company/JobCard';
import { BenefitCard } from '@/components/company/BenefitCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Send, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Careers() {
  const { positions, loading: positionsLoading } = useJobPositions();
  const { culture, loading: cultureLoading } = useCompanyCulture();

  const loading = positionsLoading || cultureLoading;

  const handleApply = () => {
    window.open('mailto:carreiras@guilds.com.br', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Carreiras"
          description="Junte-se ao time da Guilds! Descubra oportunidades em desenvolvimento, design e tecnologia. Trabalho remoto, horário flexível e ambiente inovador."
          keywords={['vagas Guilds', 'carreiras tecnologia', 'trabalho remoto', 'oportunidades TI']}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Carreiras"
        description="Junte-se ao time da Guilds! Descubra oportunidades em desenvolvimento, design e tecnologia. Trabalho remoto, horário flexível e ambiente inovador."
        keywords={['vagas Guilds', 'carreiras tecnologia', 'trabalho remoto', 'oportunidades TI']}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Briefcase className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Construa o Futuro Conosco
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Junte-se a uma equipe apaixonada por tecnologia e inovação. Transforme ideias em realidade.
            </p>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      {culture && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Por que trabalhar na Guilds?
              </h2>
              {culture.culture_description && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {culture.culture_description}
                </p>
              )}
            </div>

            {/* Benefits Grid */}
            {culture.benefits && culture.benefits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culture.benefits.map((benefit, index) => (
                  <BenefitCard key={index} benefit={benefit} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Open Positions */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Vagas Abertas
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encontre a oportunidade perfeita para sua carreira
            </p>
          </div>

          {positions.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhuma vaga disponível no momento
              </h3>
              <p className="text-muted-foreground mb-6">
                Mas estamos sempre em busca de talentos! Envie seu currículo mesmo assim.
              </p>
              <Button onClick={handleApply} size="lg">
                <Send className="mr-2 h-4 w-4" />
                Enviar Currículo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position) => (
                <JobCard 
                  key={position.id} 
                  position={position} 
                  onApply={handleApply}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Selection Process */}
      {culture?.selection_process && culture.selection_process.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Nosso Processo Seletivo
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um processo transparente e humano para conhecer você melhor
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culture.selection_process.map((step, index) => (
                  <Card key={index} className="relative">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {step.step}
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Pronto para começar?
            </h2>
            
            {culture?.application_info && (
              <p className="text-lg text-muted-foreground">
                {culture.application_info}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleApply} size="lg" className="group">
                <Send className="mr-2 h-4 w-4" />
                Enviar Currículo
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/equipe">
                  Conhecer o Time
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}