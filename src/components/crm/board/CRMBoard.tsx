import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Settings, List, Grid3X3, BarChart3, Bell, Filter } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { DealForm } from '../forms/DealForm';
import { useCRM, CRMDeal } from '@/hooks/useCRM';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CRMFilters, type CRMFilters as CRMFiltersType } from '../filters/CRMFilters';
import { CRMDashboard } from '../dashboard/CRMDashboard';
import { CRMNotifications, useCRMNotifications } from '../notifications/CRMNotifications';
import { isAfter, isBefore, parseISO } from 'date-fns';

export function CRMBoard() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showDealForm, setShowDealForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'board' | 'dashboard' | 'notifications'>('board');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  
  const { pipelines, pipelinesLoading, fetchStagesByPipeline, fetchDealsByPipeline, moveDeal } = useCRM();
  const { notifications, markAsRead, markAllAsRead, archive: archiveNotification, handleAction } = useCRMNotifications();

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
          
          <Button type="button" variant="outline">
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
    </div>
  );
}