import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Palette, GripVertical, Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { CRMPipeline, CRMStage } from '@/hooks/useCRM';
import { toast } from 'sonner';

interface CRMBoardSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipeline: CRMPipeline;
  stages: CRMStage[];
  onUpdatePipeline: (pipelineId: string, updates: Partial<CRMPipeline>) => void;
  onUpdateStage: (stageId: string, updates: Partial<CRMStage>) => void;
  onDeleteStage: (stageId: string) => void;
  onReorderStages: (stageIds: string[]) => void;
  onCreateStage: (stage: Partial<CRMStage>) => void;
}

export function CRMBoardSettings({
  open,
  onOpenChange,
  pipeline,
  stages,
  onUpdatePipeline,
  onUpdateStage,
  onDeleteStage,
  onReorderStages,
  onCreateStage,
}: CRMBoardSettingsProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'stages' | 'view'>('pipeline');
  
  // Pipeline editing state
  const [pipelineName, setPipelineName] = useState(pipeline.name);
  const [pipelineDescription, setPipelineDescription] = useState(pipeline.description || '');
  const [pipelineType, setPipelineType] = useState<string>(pipeline.type);
  const [pipelineColor, setPipelineColor] = useState(pipeline.color);
  const [pipelineActive, setPipelineActive] = useState(pipeline.is_active);
  
  // Stage editing state
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageName, setEditingStageName] = useState('');
  const [editingStageColor, setEditingStageColor] = useState('');
  const [editingStageDescription, setEditingStageDescription] = useState('');
  
  // New stage state
  const [showNewStageForm, setShowNewStageForm] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('hsl(var(--primary))');
  const [newStageDescription, setNewStageDescription] = useState('');
  
  // Delete confirmation
  const [stageToDelete, setStageToDelete] = useState<CRMStage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // View preferences
  const [showValue, setShowValue] = useState(true);
  const [showProbability, setShowProbability] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [showMetrics, setShowMetrics] = useState(true);
  
  // Ordered stages for drag and drop
  const [orderedStages, setOrderedStages] = useState<CRMStage[]>([...stages].sort((a, b) => a.display_order - b.display_order));

  React.useEffect(() => {
    setOrderedStages([...stages].sort((a, b) => a.display_order - b.display_order));
  }, [stages]);

  const handleSavePipeline = () => {
    onUpdatePipeline(pipeline.id, {
      name: pipelineName,
      description: pipelineDescription,
      type: pipelineType as any,
      color: pipelineColor,
      is_active: pipelineActive,
    });
    toast.success('Pipeline atualizado com sucesso!');
  };

  const handleEditStage = (stage: CRMStage) => {
    setEditingStageId(stage.id);
    setEditingStageName(stage.name);
    setEditingStageColor(stage.color);
    setEditingStageDescription(stage.description || '');
  };

  const handleSaveStage = () => {
    if (!editingStageId) return;
    
    onUpdateStage(editingStageId, {
      name: editingStageName,
      color: editingStageColor,
      description: editingStageDescription,
    });
    
    setEditingStageId(null);
    toast.success('Estágio atualizado com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditingStageId(null);
    setEditingStageName('');
    setEditingStageColor('');
    setEditingStageDescription('');
  };

  const handleDeleteStageClick = (stage: CRMStage) => {
    setStageToDelete(stage);
    setShowDeleteDialog(true);
  };

  const confirmDeleteStage = () => {
    if (!stageToDelete) return;
    onDeleteStage(stageToDelete.id);
    setShowDeleteDialog(false);
    setStageToDelete(null);
    toast.success('Estágio excluído com sucesso!');
  };

  const handleCreateStage = () => {
    if (!newStageName.trim()) {
      toast.error('Nome do estágio é obrigatório');
      return;
    }

    onCreateStage({
      pipeline_id: pipeline.id,
      name: newStageName,
      color: newStageColor,
      description: newStageDescription,
      display_order: orderedStages.length,
      is_active: true,
    });

    setShowNewStageForm(false);
    setNewStageName('');
    setNewStageColor('hsl(var(--primary))');
    setNewStageDescription('');
    toast.success('Estágio criado com sucesso!');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(orderedStages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedStages(items);
    onReorderStages(items.map(item => item.id));
    toast.success('Ordem dos estágios atualizada!');
  };

  const colorPresets = [
    { name: 'Azul', value: 'hsl(240, 85%, 55%)' },
    { name: 'Verde', value: 'hsl(142, 76%, 36%)' },
    { name: 'Laranja', value: 'hsl(38, 92%, 50%)' },
    { name: 'Vermelho', value: 'hsl(346, 87%, 43%)' },
    { name: 'Roxo', value: 'hsl(280, 70%, 55%)' },
    { name: 'Turquesa', value: 'hsl(165, 85%, 45%)' },
    { name: 'Cinza', value: 'hsl(220, 9%, 46%)' },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Configurações do Board</SheetTitle>
            <SheetDescription>
              Gerencie pipeline, estágios e preferências de visualização
            </SheetDescription>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              <TabsTrigger value="stages">Estágios</TabsTrigger>
              <TabsTrigger value="view">Visualização</TabsTrigger>
            </TabsList>

            {/* Pipeline Tab */}
            <TabsContent value="pipeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Pipeline</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pipeline-name">Nome</Label>
                    <Input
                      id="pipeline-name"
                      value={pipelineName}
                      onChange={(e) => setPipelineName(e.target.value)}
                      placeholder="Nome do pipeline"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pipeline-description">Descrição</Label>
                    <Textarea
                      id="pipeline-description"
                      value={pipelineDescription}
                      onChange={(e) => setPipelineDescription(e.target.value)}
                      placeholder="Descrição do pipeline"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pipeline-type">Tipo</Label>
                    <Select value={pipelineType} onValueChange={setPipelineType}>
                      <SelectTrigger id="pipeline-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Vendas</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="support">Suporte</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Cor do Pipeline</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setPipelineColor(color.value)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            pipelineColor === color.value ? 'border-foreground scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pipeline Ativo</Label>
                      <p className="text-sm text-muted-foreground">
                        Desative para arquivar este pipeline
                      </p>
                    </div>
                    <Switch
                      checked={pipelineActive}
                      onCheckedChange={setPipelineActive}
                    />
                  </div>

                  <Button onClick={handleSavePipeline} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stages Tab */}
            <TabsContent value="stages" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Estágios do Pipeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Arraste para reordenar
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewStageForm(!showNewStageForm)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Estágio
                </Button>
              </div>

              {/* New Stage Form */}
              {showNewStageForm && (
                <Card className="border-primary">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label>Nome do Estágio</Label>
                      <Input
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        placeholder="Ex: Proposta Enviada"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cor</Label>
                      <div className="flex flex-wrap gap-2">
                        {colorPresets.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => setNewStageColor(color.value)}
                            className={`w-8 h-8 rounded border-2 ${
                              newStageColor === color.value ? 'border-foreground' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={newStageDescription}
                        onChange={(e) => setNewStageDescription(e.target.value)}
                        placeholder="Descrição do estágio (opcional)"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleCreateStage} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Criar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewStageForm(false);
                          setNewStageName('');
                          setNewStageColor('hsl(var(--primary))');
                          setNewStageDescription('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stages List */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stages-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {orderedStages.map((stage, index) => (
                        <Draggable key={stage.id} draggableId={stage.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? 'shadow-lg' : ''}
                            >
                              <CardContent className="p-4">
                                {editingStageId === stage.id ? (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label>Nome</Label>
                                      <Input
                                        value={editingStageName}
                                        onChange={(e) => setEditingStageName(e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Cor</Label>
                                      <div className="flex flex-wrap gap-2">
                                        {colorPresets.map((color) => (
                                          <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setEditingStageColor(color.value)}
                                            className={`w-8 h-8 rounded border-2 ${
                                              editingStageColor === color.value ? 'border-foreground' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Descrição</Label>
                                      <Textarea
                                        value={editingStageDescription}
                                        onChange={(e) => setEditingStageDescription(e.target.value)}
                                        rows={2}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={handleSaveStage}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div
                                      className="w-4 h-4 rounded"
                                      style={{ backgroundColor: stage.color }}
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">{stage.name}</h4>
                                      {stage.description && (
                                        <p className="text-sm text-muted-foreground">{stage.description}</p>
                                      )}
                                    </div>
                                    <Badge variant="secondary">{index + 1}</Badge>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditStage(stage)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteStageClick(stage)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </TabsContent>

            {/* View Preferences Tab */}
            <TabsContent value="view" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campos Visíveis nos Cards</CardTitle>
                  <CardDescription>
                    Escolha quais informações exibir nos cards de deals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Valor do Deal</Label>
                    <Switch checked={showValue} onCheckedChange={setShowValue} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Probabilidade</Label>
                    <Switch checked={showProbability} onCheckedChange={setShowProbability} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Data de Fechamento</Label>
                    <Switch checked={showDate} onCheckedChange={setShowDate} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Densidade do Board</CardTitle>
                  <CardDescription>
                    Ajuste o espaçamento entre os cards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={density} onValueChange={(v: any) => setDensity(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compacto</SelectItem>
                      <SelectItem value="comfortable">Confortável</SelectItem>
                      <SelectItem value="spacious">Espaçoso</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métricas dos Estágios</CardTitle>
                  <CardDescription>
                    Exibir receita potencial e estatísticas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label>Mostrar Métricas</Label>
                    <Switch checked={showMetrics} onCheckedChange={setShowMetrics} />
                  </div>
                </CardContent>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Essas preferências são salvas localmente no seu navegador
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Delete Stage Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Estágio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o estágio "{stageToDelete?.name}"?
              {stageToDelete && (
                <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ Atenção: Os deals neste estágio precisarão ser movidos antes da exclusão.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
