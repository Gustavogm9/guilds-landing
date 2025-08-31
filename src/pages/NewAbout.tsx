import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { useCompanyManifesto } from '@/hooks/useCompanyData';
import { PrincipleCard } from '@/components/company/PrincipleCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, ArrowRight, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NewAbout() {
  const { manifesto, loading, error } = useCompanyManifesto();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Sobre Nós"
          description="Conheça a história, manifesto e valores da Guilds. Somos uma empresa de tecnologia que combina tradição e inovação para criar soluções digitais transformadoras."
          keywords={['sobre Guilds', 'empresa tecnologia', 'história', 'valores', 'manifesto']}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Erro ao carregar informações</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Sobre Nós"
        description="Conheça a história, manifesto e valores da Guilds. Somos uma empresa de tecnologia que combina tradição e inovação para criar soluções digitais transformadoras."
        keywords={['sobre Guilds', 'empresa tecnologia', 'história', 'valores', 'manifesto']}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {manifesto?.manifesto_title || 'Sobre Nós'}
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {manifesto?.manifesto_content || 'Conheça nossa história e valores'}
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      {manifesto && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {manifesto.history_title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {manifesto.history_content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* DNA Section */}
      {manifesto && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {manifesto.dna_title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {manifesto.dna_content}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Principles Section */}
      {manifesto?.principles && manifesto.principles.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Nossos Princípios
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Os valores que guiam nossa conduta e definem nossa identidade
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {manifesto.principles.map((principle, index) => (
                <PrincipleCard key={index} principle={principle} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Conheça Mais Sobre Nós
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Descubra quem somos, o que fazemos e como podemos ajudar seu negócio
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link to="/equipe">
                  <Users className="mr-2 h-4 w-4" />
                  Conhecer Nossa Equipe
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/carreiras">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Trabalhe Conosco
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}