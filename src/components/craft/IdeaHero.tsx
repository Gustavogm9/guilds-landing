import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CraftStage {
  id: string;
  name: string;
  color: string;
}

interface IdeaHeroProps {
  title: string;
  problem_thesis: string;
  estimated_timeline: string;
  estimated_investment: string;
  next_steps: string;
  stage?: CraftStage;
  updated_at: string;
  onPartnershipClick: () => void;
}

export const IdeaHero = ({
  title,
  problem_thesis,
  estimated_timeline,
  estimated_investment,
  next_steps,
  stage,
  updated_at,
  onPartnershipClick
}: IdeaHeroProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section className="bg-gradient-to-r from-background to-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/craft" className="hover:text-foreground transition-colors">
              Guilds Craft
            </Link>
            <span>/</span>
            <span>Ideias</span>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </div>

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/craft">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Craft
              </Link>
            </Button>
          </div>

          {/* Title and Stage */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
              {stage && (
                <Badge 
                  variant="secondary" 
                  className="text-sm px-3 py-1"
                  style={{ backgroundColor: stage.color, color: 'white' }}
                >
                  {stage.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Atualizado em {formatDate(updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Problem Thesis */}
          <div className="bg-card/50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Problema Identificado</h2>
            <p className="text-muted-foreground leading-relaxed">{problem_thesis}</p>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Timeline</h3>
              </div>
              <p className="text-sm text-muted-foreground">{estimated_timeline}</p>
            </div>

            <div className="bg-card/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Investimento</h3>
              </div>
              <p className="text-sm text-muted-foreground">{estimated_investment}</p>
            </div>

            <div className="bg-card/50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <ArrowLeft className="h-5 w-5 text-primary rotate-180" />
                <h3 className="font-semibold">Próximos Passos</h3>
              </div>
              <p className="text-sm text-muted-foreground">{next_steps}</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button onClick={onPartnershipClick} size="lg" className="px-8">
              Propor Parceria para este Projeto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};