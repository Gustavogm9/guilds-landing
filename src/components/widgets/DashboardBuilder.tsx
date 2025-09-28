import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WidgetDashboard } from './WidgetDashboard';
import { WidgetMarketplace } from './WidgetMarketplace';
import { useWidgets } from '@/hooks/useWidgets';
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  Save, 
  RefreshCw,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DashboardBuilder() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const { 
    widgets, 
    activeLayout, 
    addWidget, 
    removeWidget, 
    updateWidget, 
    refreshAllWidgets, 
    saveLayout,
    loadLayout,
    layouts,
    isLoading 
  } = useWidgets();
  const { toast } = useToast();

  const handleSaveLayout = async () => {
    if (!activeLayout) return;
    
    try {
      await saveLayout({
        name: activeLayout.name,
        description: activeLayout.description,
        widgets: activeLayout.widgets,
        isDefault: activeLayout.isDefault,
        createdBy: activeLayout.createdBy
      });
      
      toast({
        title: "Layout salvo",
        description: "Configuração do dashboard foi salva com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
    }
  };

  const handleToggleWidgetVisibility = (widgetId: string, isVisible: boolean) => {
    updateWidget(widgetId, { isVisible });
  };

  const handleRemoveWidget = (widgetId: string) => {
    removeWidget(widgetId);
    toast({
      title: "Widget removido",
      description: "Widget foi removido do dashboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Builder</h1>
              <p className="text-muted-foreground">
                {activeLayout?.name || 'Carregando...'} • {widgets.length} widgets
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshAllWidgets()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar Todos
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {isEditing ? 'Visualizar' : 'Editar'}
              </Button>
              
              <Button
                size="sm"
                onClick={handleSaveLayout}
                disabled={!activeLayout}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Layout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            <WidgetDashboard />
          </TabsContent>

          {/* Marketplace */}
          <TabsContent value="marketplace">
            <WidgetMarketplace 
              onAddWidget={addWidget}
              existingWidgets={widgets.map(w => w.config)}
            />
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              {/* Layout Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Layouts Salvos</CardTitle>
                  <CardDescription>
                    Gerencie seus layouts de dashboard salvos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {layouts.map((layout) => (
                      <div key={layout.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{layout.name}</h4>
                            {layout.isDefault && (
                              <Badge variant="secondary">Padrão</Badge>
                            )}
                          </div>
                          {layout.description && (
                            <p className="text-sm text-muted-foreground">
                              {layout.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {layout.widgets.length} widgets • Atualizado {new Date(layout.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadLayout(layout.id)}
                            disabled={activeLayout?.id === layout.id}
                          >
                            {activeLayout?.id === layout.id ? 'Ativo' : 'Carregar'}
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {layouts.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum layout salvo ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Widget Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Widgets Ativos</CardTitle>
                  <CardDescription>
                    Configure e gerencie os widgets do seu dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {widgets.map((widget) => (
                      <div key={widget.config.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{widget.config.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {widget.config.category}
                            </Badge>
                            {!widget.config.isVisible && (
                              <Badge variant="secondary" className="text-xs">
                                Oculto
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {widget.config.size} • Refresh: {widget.config.refreshInterval}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleWidgetVisibility(
                              widget.config.id, 
                              !widget.config.isVisible
                            )}
                          >
                            {widget.config.isVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWidget(widget.config.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {widgets.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum widget adicionado ainda
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}