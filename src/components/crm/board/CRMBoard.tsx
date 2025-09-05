import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, List, Grid3X3 } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { DealForm } from '../forms/DealForm';
import { useCRM } from '@/hooks/useCRM';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CRMBoard() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showDealForm, setShowDealForm] = useState(false);
  
  const { pipelines, pipelinesLoading, fetchStagesByPipeline, fetchDealsByPipeline, moveDeal } = useCRM();

  // Set default pipeline when pipelines load
  React.useEffect(() => {
    if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  // Fetch stages for selected pipeline
  const { data: stages, isLoading: stagesLoading } = useQuery({
    queryKey: ['crm-stages', selectedPipelineId],
    queryFn: () => fetchStagesByPipeline(selectedPipelineId),
    enabled: !!selectedPipelineId
  });

  // Fetch deals for selected pipeline
  const { data: deals, isLoading: dealsLoading } = useQuery({
    queryKey: ['crm-deals', selectedPipelineId],
    queryFn: () => fetchDealsByPipeline(selectedPipelineId),
    enabled: !!selectedPipelineId
  });

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    
    if (!destination) return;
    
    const stageId = destination.droppableId;
    moveDeal({ dealId: draggableId, stageId });
  };

  const selectedPipeline = pipelines?.find(p => p.id === selectedPipelineId);

  if (pipelinesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando pipelines...</div>
      </div>
    );
  }

  if (!pipelines || pipelines.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nenhum pipeline encontrado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Você precisa criar um pipeline para começar a usar o CRM.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Criar Pipeline
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">CRM</h1>
            <p className="text-muted-foreground">
              Gerencie suas oportunidades e relacionamentos
            </p>
          </div>
          
          {selectedPipeline && (
            <Badge 
              variant="secondary" 
              style={{ backgroundColor: `${selectedPipeline.color}20`, color: selectedPipeline.color }}
            >
              {selectedPipeline.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border bg-card p-1">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Dialog open={showDealForm} onOpenChange={setShowDealForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Oportunidade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nova Oportunidade</DialogTitle>
              </DialogHeader>
              <DealForm
                pipelineId={selectedPipelineId}
                stages={stages || []}
                onSuccess={() => setShowDealForm(false)}
              />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Pipeline Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Pipeline:</label>
        <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecione um pipeline" />
          </SelectTrigger>
          <SelectContent>
            {pipelines.map(pipeline => (
              <SelectItem key={pipeline.id} value={pipeline.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: pipeline.color }}
                  />
                  {pipeline.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Board Content */}
      {selectedPipelineId && (
        <div className="border rounded-lg bg-card">
          {viewMode === 'kanban' ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-6 p-6 overflow-x-auto min-h-[600px]">
                {stages?.map(stage => (
                  <Droppable key={stage.id} droppableId={stage.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex-shrink-0"
                      >
                        <KanbanColumn
                          stage={stage}
                          deals={deals?.filter(deal => deal.stage_id === stage.id) || []}
                          isLoading={dealsLoading}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          ) : (
            <div className="p-6">
              <div className="text-center text-muted-foreground py-12">
                Vista em lista em desenvolvimento...
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}