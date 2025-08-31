import React from 'react';
import { SEOHead } from '@/components/seo/SEOHead';
import { useTeamMembers } from '@/hooks/useCompanyData';
import { TeamMemberCard } from '@/components/company/TeamMemberCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Team() {
  const { members, loading, error } = useTeamMembers();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead 
          title="Nossa Equipe"
          description="Conheça o time de especialistas da Guilds: desenvolvedores, designers e estrategistas digitais que transformam ideias em soluções inovadoras."
          keywords={['equipe Guilds', 'time desenvolvimento', 'especialistas tecnologia', 'profissionais TI']}
        />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>
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
          <h1 className="text-2xl font-bold text-foreground">Erro ao carregar equipe</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Nossa Equipe"
        description="Conheça o time de especialistas da Guilds: desenvolvedores, designers e estrategistas digitais que transformam ideias em soluções inovadoras."
        keywords={['equipe Guilds', 'time desenvolvimento', 'especialistas tecnologia', 'profissionais TI']}
      />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <Users className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Conheça Nossa Equipe
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Especialistas apaixonados por tecnologia que transformam ideias em soluções inovadoras
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {members.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Equipe em construção
              </h3>
              <p className="text-muted-foreground">
                Em breve você conhecerá nosso incrível time!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {members.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Quer fazer parte do nosso time?
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Estamos sempre em busca de talentos que compartilhem nossa paixão por tecnologia e inovação
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link to="/carreiras">
                  Ver Oportunidades
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/contato">
                  Enviar Currículo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}