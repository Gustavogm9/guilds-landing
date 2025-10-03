import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, List, Grid3X3, BarChart3, Bell, Filter, Star, User, Clock, History as HistoryIcon } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { DealForm } from '../forms/DealForm';
import { useCRM, CRMDeal } from '@/hooks/useCRM';
import { useUserCRMPreferences } from '@/hooks/useUserCRMPreferences';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRMFilters, type CRMFilters as CRMFiltersType } from '../filters/CRMFilters';
import { CRMDashboard } from '../dashboard/CRMDashboard';
import { CRMNotifications, useCRMNotifications } from '../notifications/CRMNotifications';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { DealDetailModal } from '../deal/DealDetailModal';
import { DealInteractionModal } from '../deal/DealInteractionModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ActivityScheduleModal } from '../activities/ActivityScheduleModal';
import { CRMBoardSettings } from './CRMBoardSettings';
 
export function CRMBoard() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showDealForm, setShowDealForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'dashboard' | 'notifications'>('board');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<CRMDeal | null>(null);
  const [showDealDetails, setShowDealDetails] = useState(false);
  const [showDealInteraction, setShowDealInteraction] = useState(false);
  const [interactionType, setInteractionType] = useState<string>('note');
  const [dealToEdit, setDealToEdit] = useState<CRMDeal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<CRMDeal | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForDeal, setActivityForDeal] = useState<CRMDeal | null>(null);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  
  const { 
    pipelines, 
    pipelinesLoading, 
    fetchStagesByPipeline, 
    fetchDealsByPipeline, 
    moveDeal,
    updatePipeline,
    updateStage,
    deleteStage,
    reorderStages,
    createStage,
    setDefaultPipeline,
  } = useCRM();
  const { notifications, markAsRead, markAllAsRead, archive: archiveNotification, handleAction } = useCRMNotifications();
  
  // User preferences
  const { 
    preferences: userPreferences, 
    updateLastViewedPipeline 
  } = useUserCRMPreferences();

  // Cascading pipeline selection logic
  React.useEffect(() => {
    if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
      let targetPipeline;
      
      // 1. User's default preference
      if (userPreferences?.default_pipeline_id) {
        targetPipeline = pipelines.find(p => p.id === userPreferences.default_pipeline_id);
      }
      
      // 2. Last viewed by user
      if (!targetPipeline && userPreferences?.last_viewed_pipeline_id) {
        targetPipeline = pipelines.find(p => p.id === userPreferences.last_viewed_pipeline_id);
      }
      
      // 3. Global default
      if (!targetPipeline) {
        targetPipeline = pipelines.find(p => p.is_default);
      }
      
      // 4. First pipeline
      if (!targetPipeline) {
        targetPipeline = pipelines[0];
      }
      
      setSelectedPipelineId(targetPipeline.id);
    }
  }, [pipelines, selectedPipelineId, userPreferences]);

  // Auto-save last viewed pipeline (debounced)
  React.useEffect(() => {
    if (selectedPipelineId && userPreferences !== undefined) {
      const timer = setTimeout(() => {
        updateLastViewedPipeline(selectedPipelineId);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [selectedPipelineId, updateLastViewedPipeline, userPreferences]);

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

  // Filter deals based on active filters
  const filteredDeals = useMemo(() => {
    if (!deals) return [];
    
    return deals.filter(deal => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          deal.title,
          deal.description,
          deal.contact?.name,
          deal.contact?.company,
          deal.contact?.email
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) return false;
      }
      
      // Source filter
      if (filters.source && deal.source !== filters.source) return false;
      
      // Lifecycle stage filter
      if (filters.lifecycleStage && deal.contact?.lifecycle_stage !== filters.lifecycleStage) return false;
      
      // Business unit filter
      if (filters.businessUnit && deal.business_unit !== filters.businessUnit) return false;
      
      // Product interests filter
      if (filters.productInterests && filters.productInterests.length > 0) {
        const contactInterests = deal.contact?.products_interest || [];
        const hasMatchingInterest = filters.productInterests.some(interest => 
          contactInterests.includes(interest)
        );
        if (!hasMatchingInterest) return false;
      }
      
      // Date range filter
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        const dealDate = parseISO(deal.created_at);
        if (isBefore(dealDate, filters.dateRange[0]) || isAfter(dealDate, filters.dateRange[1])) {
          return false;
        }
      }
      
      // Quick view filters
      if (filters.quickView) {
        switch (filters.quickView) {
          case 'hot':
            return (deal.contact?.lead_score || 0) >= 80;
          case 'cold':
            const daysSinceLastInteraction = deal.contact?.last_interaction_date 
              ? Math.floor((Date.now() - new Date(deal.contact.last_interaction_date).getTime()) / (1000 * 60 * 60 * 24))
              : 999;
            return daysSinceLastInteraction > 30;
          case 'my_leads':
            // Would filter by assigned user
            return true; // Mock - would check assigned_to
          case 'follow_ups':
            return deal.contact?.next_action_date && 
              new Date(deal.contact.next_action_date) <= new Date();
        }
      }
      
      return true;
    });
  }, [deals, filters]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    
    if (!destination) return;
    
    const stageId = destination.droppableId;
    moveDeal({ dealId: draggableId, stageId });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleViewDetails = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setShowDealDetails(true);
  };

  const handleAddInteraction = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setInteractionType('note');
    setShowDealInteraction(true);
  };

  const handleEmailInteraction = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setInteractionType('email');
    setShowDealInteraction(true);
  };

  const handlePhoneInteraction = (deal: CRMDeal) => {
    setSelectedDeal(deal);
    setInteractionType('phone');
    setShowDealInteraction(true);
  };

  const handleEditDeal = (deal: CRMDeal) => {
    setDealToEdit(deal);
    setShowDealForm(true);
  };

  const handleDuplicateDeal = async (deal: CRMDeal) => {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .insert({
          pipeline_id: deal.pipeline_id,
          stage_id: deal.stage_id,
          contact_id: deal.contact_id,
          title: `${deal.title} (Cópia)`,
          description: deal.description,
          value: deal.value,
          currency: deal.currency,
          probability: deal.probability,
          expected_close_date: deal.expected_close_date,
          source: deal.source,
          business_unit: deal.business_unit,
          tags: deal.tags,
          custom_fields: deal.custom_fields,
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Deal duplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao duplicar deal:', error);
      toast.error('Erro ao duplicar deal');
    }
  };

  const handleDeleteDeal = (deal: CRMDeal) => {
    setDealToDelete(deal);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      const { error } = await supabase
        .from('crm_deals')
        .update({ is_active: false })
        .eq('id', dealToDelete.id);

      if (error) throw error;
      
      toast.success('Deal excluído com sucesso!');
      setShowDeleteDialog(false);
      setDealToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir deal:', error);
      toast.error('Erro ao excluir deal');
    }
  };

  const handleScheduleActivity = (deal: CRMDeal) => {
    setActivityForDeal(deal);
    setShowActivityModal(true);
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
              className="flex items-center gap-1"
            >
              {userPreferences?.default_pipeline_id === selectedPipeline.id && (
                <User className="h-3 w-3" />
              )}
              {selectedPipeline.is_default && !userPreferences?.default_pipeline_id && (
                <Star className="h-3 w-3 fill-current" />
              )}
              {userPreferences?.last_viewed_pipeline_id === selectedPipeline.id && 
               userPreferences?.default_pipeline_id !== selectedPipeline.id && 
               !selectedPipeline.is_default && (
                <Clock className="h-3 w-3" />
              )}
              {selectedPipeline.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Link to="/admin/crm/history">
            <Button variant="outline" size="sm">
              <HistoryIcon className="h-4 w-4 mr-2" />
              Histórico Global
            </Button>
          </Link>
          <Dialog open={showDealForm} onOpenChange={(open) => {
            setShowDealForm(open);
            if (!open) setDealToEdit(null);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Oportunidade
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {dealToEdit ? 'Editar Oportunidade' : 'Nova Oportunidade'}
                </DialogTitle>
              </DialogHeader>
              {stages && stages.length > 0 && (
                <DealForm 
                  pipelineId={selectedPipelineId}
                  stages={stages}
                  deal={dealToEdit || undefined}
                  mode={dealToEdit ? 'edit' : 'create'}
                  onSuccess={() => {
                    setShowDealForm(false);
                    setDealToEdit(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
          
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowBoardSettings(true)}
          >
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="board" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
            {notifications.filter(n => !n.isRead && !n.isArchived).length > 0 && (
              <Badge variant="destructive" className="text-xs h-5 w-5 p-0 flex items-center justify-center">
                {notifications.filter(n => !n.isRead && !n.isArchived).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6 mt-6">
          {/* Filters */}
          {selectedPipelineId && (
            <>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filtros
                  {Object.values(filters).some(f => f !== undefined && f !== null && (Array.isArray(f) ? f.length > 0 : true)) && (
                    <Badge variant="secondary" className="text-xs">
                      {Object.values(filters).filter(f => f !== undefined && f !== null && (Array.isArray(f) ? f.length > 0 : true)).length}
                    </Badge>
                  )}
                </Button>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg border bg-card p-1">
                  <Button
                    type="button"
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showFilters && (
                <CRMFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  totalDeals={deals?.length || 0}
                  filteredDeals={filteredDeals.length}
                />
              )}
            </>
          )}

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
                              deals={filteredDeals.filter(deal => deal.stage_id === stage.id)}
                              isLoading={dealsLoading}
                              onViewDetails={handleViewDetails}
                              onAddInteraction={handleAddInteraction}
                              onEmailInteraction={handleEmailInteraction}
                              onPhoneInteraction={handlePhoneInteraction}
                              onEdit={handleEditDeal}
                              onDuplicate={handleDuplicateDeal}
                              onDelete={handleDeleteDeal}
                              onScheduleActivity={handleScheduleActivity}
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
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6">
          {selectedPipelineId && stages && (
            <CRMDashboard
              deals={filteredDeals}
              pipelines={pipelines || []}
              stages={stages}
              selectedPipelineId={selectedPipelineId}
            />
          )}
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="max-w-2xl">
            <CRMNotifications
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onArchive={archiveNotification}
              onAction={handleAction}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Deal Detail Modal */}
      <DealDetailModal
        deal={selectedDeal}
        open={showDealDetails}
        onOpenChange={setShowDealDetails}
        onEdit={handleEditDeal}
      />

      {/* Deal Interaction Modal */}
      <DealInteractionModal
        deal={selectedDeal}
        open={showDealInteraction}
        onOpenChange={setShowDealInteraction}
        defaultType={interactionType}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o deal "{dealToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDeal} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activity Schedule Modal */}
      <ActivityScheduleModal
        open={showActivityModal}
        onOpenChange={(open) => {
          setShowActivityModal(open);
          if (!open) setActivityForDeal(null);
        }}
        dealId={activityForDeal?.id}
        contactId={activityForDeal?.contact_id}
      />

      {/* Board Settings */}
      {selectedPipeline && stages && (
        <CRMBoardSettings
          open={showBoardSettings}
          onOpenChange={setShowBoardSettings}
          pipeline={selectedPipeline}
          stages={stages}
          onUpdatePipeline={(pipelineId, updates) => updatePipeline({ pipelineId, updates })}
          onUpdateStage={(stageId, updates) => updateStage({ stageId, updates })}
          onDeleteStage={deleteStage}
          onReorderStages={reorderStages}
          onCreateStage={(stage) => createStage(stage as any)}
          onSetDefaultPipeline={setDefaultPipeline}
        />
      )}
    </div>
  );
}