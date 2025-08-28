import { useCraft } from '@/hooks/useCraft';
import { StageCard } from './StageCard';
import { ArrowRight } from 'lucide-react';

export const PipelineFlow = () => {
  const { stages, ideas, stagesLoading } = useCraft();

  if (stagesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  // Count ideas per stage
  const getIdeasCountForStage = (stageId: string) => {
    return ideas.filter(idea => idea.current_stage === stageId).length;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Pipeline de Inovação</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nossa metodologia estruturada para transformar ideias em produtos de impacto real
        </p>
      </div>

      <div className="relative">
        {/* Desktop Flow */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-6 relative">
            {stages.map((stage, index) => (
              <div key={stage.id} className="relative">
                <StageCard
                  name={stage.name}
                  description={stage.description}
                  color={stage.color}
                  icon_name={stage.icon_name}
                  display_order={stage.display_order}
                  ideasCount={getIdeasCountForStage(stage.id)}
                />
                {index < stages.length - 1 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="bg-background p-2 rounded-full border shadow-sm">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="lg:hidden space-y-6">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              <StageCard
                name={stage.name}
                description={stage.description}
                color={stage.color}
                icon_name={stage.icon_name}
                display_order={stage.display_order}
                ideasCount={getIdeasCountForStage(stage.id)}
              />
              {index < stages.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="bg-background p-2 rounded-full border shadow-sm">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};