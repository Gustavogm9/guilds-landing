import { useState } from 'react';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IdeaCard } from '@/components/craft/IdeaCard';
import { PartnershipForm } from '@/components/craft/PartnershipForm';
import { useCraft } from '@/hooks/useCraft';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

export default function CraftPortfolio() {
  const { ideas, stages, ideasLoading, stagesLoading } = useCraft();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);

  // Filter ideas based on search term and stage
  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.problem_thesis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.target_persona.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || idea.current_stage === selectedStage;
    
    return matchesSearch && matchesStage;
  });

  // Group ideas by stage for display
  const ideasByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = filteredIdeas.filter(idea => idea.current_stage === stage.id);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <SEOHead 
        title="Portfólio de Projetos - Guilds Craft"
        description="Explore nosso portfólio completo de projetos inovadores em diferentes estágios de desenvolvimento. Encontre oportunidades de parceria."
        keywords={['portfólio', 'projetos', 'inovação', 'parcerias', 'P&D']}
      />

      {/* Header */}
      <Section className="bg-gradient-to-r from-background to-muted/30 py-16">
        <div className="space-y-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/craft">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Craft
            </Link>
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Portfólio de Projetos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore nossos projetos inovadores em diferentes estágios de desenvolvimento
            </p>
          </div>

          {/* Search and Filters */}
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, problema ou público-alvo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedStage} onValueChange={setSelectedStage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por estágio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os estágios</SelectItem>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setIsPartnershipModalOpen(true)}>
                Propor Parceria
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-center">
            <Badge variant="secondary">
              {filteredIdeas.length} {filteredIdeas.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
            </Badge>
          </div>
        </div>
      </Section>

      {/* Ideas Grid */}
      <Section>
        {ideasLoading || stagesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar seus filtros ou termo de busca
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedStage('all');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        ) : selectedStage === 'all' ? (
          // Show by stage when no specific stage is selected
          <div className="space-y-12">
            {stages.map((stage) => {
              const stageIdeas = ideasByStage[stage.id];
              if (!stageIdeas || stageIdeas.length === 0) return null;

              return (
                <div key={stage.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold">{stage.name}</h2>
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: stage.color, color: 'white' }}
                    >
                      {stageIdeas.length} {stageIdeas.length === 1 ? 'projeto' : 'projetos'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stageIdeas.map((idea) => (
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
                </div>
              );
            })}
          </div>
        ) : (
          // Show all ideas for selected stage
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
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
      </Section>

      {/* CTA Section */}
      {filteredIdeas.length > 0 && (
        <Section className="bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Encontrou um projeto interessante?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entre em contato conosco para discutir oportunidades de parceria e colaboração.
            </p>
            <Button 
              size="lg" 
              onClick={() => setIsPartnershipModalOpen(true)}
              className="px-8"
            >
              Propor Parceria
            </Button>
          </div>
        </Section>
      )}

      <PartnershipForm
        isOpen={isPartnershipModalOpen}
        onClose={() => setIsPartnershipModalOpen(false)}
      />
    </>
  );
}