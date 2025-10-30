import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, RotateCw } from 'lucide-react';
import { ActivityListView } from '@/components/crm/activities/ActivityListView';
import { ActivityScheduleModal } from '@/components/crm/activities/ActivityScheduleModal';
import { RecurringActivitiesList } from '@/components/crm/activities/RecurringActivitiesList';

export function Agenda() {
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('today');

  const handleEdit = (activity: any) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

  const handleCloseModal = () => {
    setShowActivityModal(false);
    setSelectedActivity(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Minha Agenda
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas atividades e compromissos
          </p>
        </div>
        
        <Button onClick={() => setShowActivityModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Atividade
        </Button>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="week">Próximos 7 dias</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="recurring">
            <RotateCw className="h-4 w-4 mr-2" />
            Recorrências
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          {activeTab === 'today' && (
            <ActivityListView 
              daysAhead={1} 
              onEdit={handleEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="week" className="mt-6">
          {activeTab === 'week' && (
            <ActivityListView 
              daysAhead={7} 
              onEdit={handleEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {activeTab === 'all' && (
            <ActivityListView 
              daysAhead={365} 
              onEdit={handleEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="recurring" className="mt-6">
          {activeTab === 'recurring' && (
            <RecurringActivitiesList onEdit={handleEdit} />
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Agendamento */}
      <ActivityScheduleModal
        open={showActivityModal}
        onOpenChange={handleCloseModal}
        activity={selectedActivity}
      />
    </div>
  );
}
