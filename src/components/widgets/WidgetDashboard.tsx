import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Settings, 
  RefreshCw, 
  Layout, 
  Save,
  Eye,
  Edit3,
  Grid3X3,
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Shield,
  Brain,
  TrendingUp
} from 'lucide-react';
import { useWidgets } from '@/hooks/useWidgets';
import { WidgetContainer } from './WidgetContainer';
import { WidgetCategory } from '@/types/widgets';

interface WidgetTemplate {
  type: string;
  title: string;
  category: WidgetCategory;
  description: string;
  icon: React.ElementType;
  size: 'small' | 'medium' | 'large';
  refreshInterval: '1m' | '5m' | '15m' | '30m' | '1h';
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    type: 'revenue-intelligence',
    title: 'Revenue Intelligence',
    category: 'executive',
    description: 'MRR, ARR, crescimento e predições',
    icon: DollarSign,
    size: 'medium',
    refreshInterval: '15m'
  },
  {
    type: 'funnel',
    title: 'Funil de Vendas',
    category: 'commercial',
    description: 'Pipeline e conversão em tempo real',
    icon: BarChart3,
    size: 'medium',
    refreshInterval: '5m'
  },
  {
    type: 'cash-flow',
    title: 'Cash Flow Predictive',
    category: 'financial',
    description: 'Projeção de fluxo de caixa 90 dias',
    icon: TrendingUp,
    size: 'large',
    refreshInterval: '1h'
  },
  {
    type: 'capacity',
    title: 'Capacity Planning',
    category: 'operational',
    description: 'Carga de trabalho e recursos',
    icon: Users,
    size: 'medium',
    refreshInterval: '30m'
  },
  {
    type: 'team-health',
    title: 'Team Health',
    category: 'people',
    description: 'Bem-estar e engagement da equipe',
    icon: Activity,
    size: 'medium',
    refreshInterval: '1h'
  },
  {
    type: 'ai-insights',
    title: 'AI Insights',
    category: 'ai',
    description: 'Insights automáticos e anomalias',
    icon: Brain,
    size: 'large',
    refreshInterval: '15m'
  },
  {
    type: 'security',
    title: 'Security Dashboard',
    category: 'security',
    description: 'Métricas de segurança e conformidade',
    icon: Shield,
    size: 'medium',
    refreshInterval: '5m'
  }
];

const CATEGORY_ICONS = {
  executive: DollarSign,
  commercial: BarChart3,
  operational: Users,
  financial: DollarSign,
  people: Activity,
  market: Grid3X3,
  security: Shield,
  ai: Brain
} as const;

export function WidgetDashboard() {
  const {
    widgets,
    layouts,
    activeLayout,
    isLoading,
    error,
    addWidget,
    removeWidget,
    updateWidget,
    refreshWidget,
    refreshAllWidgets,
    saveLayout,
    loadLayout,
    getWidgetsByCategory
  } = useWidgets();

  const [isEditing, setIsEditing] = useState(false);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory>('executive');

  const handleAddWidget = async (template: WidgetTemplate) => {
    await addWidget({
      type: template.type,
      title: template.title,
      category: template.category,
      size: template.size,
      refreshInterval: template.refreshInterval,
      isVisible: true,
      isResizable: true,
      isDraggable: true,
      settings: {},
      filters: {}
    });
    setShowAddWidget(false);
  };

  const handleSaveLayout = async () => {
    if (!activeLayout) return;
    
    await saveLayout({
      name: `${activeLayout.name} - ${new Date().toLocaleDateString()}`,
      description: 'Layout personalizado',
      widgets: activeLayout.widgets,
      isDefault: false,
      createdBy: 'current-user' // This would come from auth context
    });
  };

  const categories = Object.keys(CATEGORY_ICONS) as WidgetCategory[];
  const availableTemplates = WIDGET_TEMPLATES.filter(t => t.category === selectedCategory);
  const categoryWidgets = getWidgetsByCategory(selectedCategory);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Erro ao carregar dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recarregar página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Inteligente</h1>
          <p className="text-muted-foreground">
            {activeLayout?.name || 'Dashboard principal'} • {widgets.length} widgets
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllWidgets}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          <Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Adicionar Widget</DialogTitle>
              </DialogHeader>
              
              <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as WidgetCategory)}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-8">
                  {categories.map(category => {
                    const Icon = CATEGORY_ICONS[category];
                    return (
                      <TabsTrigger key={category} value={category} className="gap-1">
                        <Icon className="h-3 w-3" />
                        <span className="capitalize hidden sm:inline">
                          {category}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {categories.map(category => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {WIDGET_TEMPLATES.filter(t => t.category === category).map(template => {
                        const Icon = template.icon;
                        return (
                          <Card 
                            key={template.type}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleAddWidget(template)}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="flex items-center gap-2 text-sm">
                                <Icon className="h-4 w-4 text-primary" />
                                {template.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-muted-foreground mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {template.size}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {template.refreshInterval}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </DialogContent>
          </Dialog>

          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4" />
                Visualizar
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                Editar
              </>
            )}
          </Button>

          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveLayout}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Salvar Layout
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Categories */}
      <Tabs defaultValue="executive" className="space-y-4">
        <TabsList>
          {categories.map(category => {
            const Icon = CATEGORY_ICONS[category];
            const categoryWidgets = getWidgetsByCategory(category);
            
            return (
              <TabsTrigger key={category} value={category} className="gap-2">
                <Icon className="h-3 w-3" />
                <span className="capitalize">{category}</span>
                {categoryWidgets.length > 0 && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    {categoryWidgets.length}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(category => {
          const categoryWidgets = getWidgetsByCategory(category);
          
          return (
            <TabsContent key={category} value={category}>
              <WidgetContainer
                widgets={categoryWidgets}
                isEditing={isEditing}
                onWidgetConfigChange={updateWidget}
                onWidgetRefresh={refreshWidget}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}