import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WidgetConfig, WidgetData, DashboardLayout, Widget, WidgetCategory } from '@/types/widgets';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UseWidgetsReturn {
  widgets: Widget[];
  layouts: DashboardLayout[];
  activeLayout: DashboardLayout | null;
  isLoading: boolean;
  error: string | null;
  addWidget: (config: Omit<WidgetConfig, 'id'>) => Promise<void>;
  removeWidget: (widgetId: string) => Promise<void>;
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => Promise<void>;
  refreshWidget: (widgetId: string) => Promise<void>;
  refreshAllWidgets: () => Promise<void>;
  saveLayout: (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loadLayout: (layoutId: string) => Promise<void>;
  getWidgetsByCategory: (category: WidgetCategory) => Widget[];
  setWidgetData: (widgetId: string, data: WidgetData) => void;
}

const REFRESH_INTERVALS = {
  realtime: 0, // WebSocket updates
  '1m': 60 * 1000,
  '5m': 5 * 60 * 1000,
  '15m': 15 * 60 * 1000,
  '30m': 30 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  manual: null
} as const;

export function useWidgets(): UseWidgetsReturn {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [activeLayout, setActiveLayout] = useState<DashboardLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTimers, setRefreshTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Load user's widget configuration
  const loadWidgets = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);

      // Load layouts
      const { data: layoutsData, error: layoutsError } = await supabase
        .from('dashboard_layouts')
        .select('*')
        .eq('created_by', user.id)
        .order('is_default', { ascending: false });

      if (layoutsError) throw layoutsError;

      const formattedLayouts = (layoutsData || []).map(layout => ({
        id: layout.id,
        name: layout.name,
        description: layout.description || undefined,
        widgets: (layout.widgets_config as any) || [],
        isDefault: layout.is_default,
        createdBy: layout.created_by,
        createdAt: new Date(layout.created_at),
        updatedAt: new Date(layout.updated_at)
      })) as DashboardLayout[];

      setLayouts(formattedLayouts);
      
      // Set active layout (first default or first layout)
      const defaultLayout = formattedLayouts.find(l => l.isDefault) || formattedLayouts[0];
      if (defaultLayout) {
        setActiveLayout(defaultLayout);
        await loadWidgetsForLayout(defaultLayout);
      }
    } catch (err) {
      console.error('Error loading widgets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load widgets');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load widgets for a specific layout
  const loadWidgetsForLayout = useCallback(async (layout: DashboardLayout) => {
    try {
      const widgetPromises = layout.widgets.map(async (config) => {
        const data = await fetchWidgetData(config);
        return {
          config,
          data,
          component: await getWidgetComponent(config.type)
        };
      });

      const loadedWidgets = await Promise.all(widgetPromises);
      setWidgets(loadedWidgets);
      
      // Setup refresh timers
      setupRefreshTimers(loadedWidgets);
    } catch (err) {
      console.error('Error loading widgets for layout:', err);
      setError(err instanceof Error ? err.message : 'Failed to load widget data');
    }
  }, []);

  // Fetch data for a specific widget
  const fetchWidgetData = useCallback(async (config: WidgetConfig): Promise<WidgetData> => {
    try {
      const response = await supabase.functions.invoke('widget-data-provider', {
        body: {
          widgetType: config.type,
          filters: config.filters,
          settings: config.settings
        }
      });

      if (response.error) throw response.error;

      return {
        timestamp: new Date(),
        data: response.data,
        isLoading: false
      };
    } catch (err) {
      console.error(`Error fetching data for widget ${config.id}:`, err);
      return {
        timestamp: new Date(),
        data: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch data'
      };
    }
  }, []);

  // Dynamically import widget component
  const getWidgetComponent = useCallback(async (widgetType: string) => {
    try {
      // Convert kebab-case to PascalCase for component names
      const componentName = widgetType.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      
      const module = await import(`@/components/widgets/${widgetType}/${componentName}Widget.tsx`);
      return module.default;
    } catch (err) {
      console.error(`Error loading widget component ${widgetType}:`, err);
      // Return fallback component
      const fallback = await import('@/components/widgets/FallbackWidget');
      return fallback.default;
    }
  }, []);

  // Setup refresh timers for widgets
  const setupRefreshTimers = useCallback((widgetList: Widget[]) => {
    // Clear existing timers
    refreshTimers.forEach(timer => clearInterval(timer));
    const newTimers = new Map<string, NodeJS.Timeout>();

    widgetList.forEach(widget => {
      const interval = REFRESH_INTERVALS[widget.config.refreshInterval];
      if (interval) {
        const timer = setInterval(async () => {
          await refreshWidget(widget.config.id);
        }, interval);
        newTimers.set(widget.config.id, timer);
      }
    });

    setRefreshTimers(newTimers);
  }, [refreshTimers]);

  // Add new widget
  const addWidget = useCallback(async (config: Omit<WidgetConfig, 'id'>) => {
    if (!activeLayout || !user) return;

    try {
      const newWidget: WidgetConfig = {
        ...config,
        id: crypto.randomUUID()
      };

      const updatedLayout = {
        ...activeLayout,
        widgets: [...activeLayout.widgets, newWidget],
        updatedAt: new Date()
      };

      await saveLayoutToDatabase(updatedLayout);
      setActiveLayout(updatedLayout);
      await loadWidgetsForLayout(updatedLayout);

      toast({
        title: "Widget adicionado",
        description: `Widget "${config.title}" foi adicionado ao dashboard.`,
      });
    } catch (err) {
      console.error('Error adding widget:', err);
      toast({
        title: "Erro",
        description: "Falha ao adicionar widget.",
        variant: "destructive",
      });
    }
  }, [activeLayout, user, toast]);

  // Remove widget
  const removeWidget = useCallback(async (widgetId: string) => {
    if (!activeLayout) return;

    try {
      const updatedLayout = {
        ...activeLayout,
        widgets: activeLayout.widgets.filter(w => w.id !== widgetId),
        updatedAt: new Date()
      };

      await saveLayoutToDatabase(updatedLayout);
      setActiveLayout(updatedLayout);
      setWidgets(prev => prev.filter(w => w.config.id !== widgetId));

      // Clear timer for removed widget
      const timer = refreshTimers.get(widgetId);
      if (timer) {
        clearInterval(timer);
        refreshTimers.delete(widgetId);
      }

      toast({
        title: "Widget removido",
        description: "Widget foi removido do dashboard.",
      });
    } catch (err) {
      console.error('Error removing widget:', err);
      toast({
        title: "Erro",
        description: "Falha ao remover widget.",
        variant: "destructive",
      });
    }
  }, [activeLayout, refreshTimers, toast]);

  // Update widget configuration
  const updateWidget = useCallback(async (widgetId: string, updates: Partial<WidgetConfig>) => {
    if (!activeLayout) return;

    try {
      const updatedLayout = {
        ...activeLayout,
        widgets: activeLayout.widgets.map(w => 
          w.id === widgetId ? { ...w, ...updates } : w
        ),
        updatedAt: new Date()
      };

      await saveLayoutToDatabase(updatedLayout);
      setActiveLayout(updatedLayout);
      
      // Update widget in state
      setWidgets(prev => prev.map(w => 
        w.config.id === widgetId 
          ? { ...w, config: { ...w.config, ...updates } }
          : w
      ));

      // Refresh widget data if needed
      if (updates.settings || updates.filters) {
        await refreshWidget(widgetId);
      }
    } catch (err) {
      console.error('Error updating widget:', err);
      toast({
        title: "Erro",
        description: "Falha ao atualizar widget.",
        variant: "destructive",
      });
    }
  }, [activeLayout, toast]);

  // Refresh specific widget
  const refreshWidget = useCallback(async (widgetId: string) => {
    const widget = widgets.find(w => w.config.id === widgetId);
    if (!widget) return;

    try {
      // Set loading state
      setWidgets(prev => prev.map(w => 
        w.config.id === widgetId 
          ? { ...w, data: { ...w.data, isLoading: true, error: undefined } }
          : w
      ));

      const newData = await fetchWidgetData(widget.config);
      
      setWidgets(prev => prev.map(w => 
        w.config.id === widgetId ? { ...w, data: newData } : w
      ));
    } catch (err) {
      console.error(`Error refreshing widget ${widgetId}:`, err);
      setWidgets(prev => prev.map(w => 
        w.config.id === widgetId 
          ? { 
              ...w, 
              data: { 
                ...w.data, 
                isLoading: false, 
                error: err instanceof Error ? err.message : 'Refresh failed' 
              } 
            }
          : w
      ));
    }
  }, [widgets, fetchWidgetData]);

  // Refresh all widgets
  const refreshAllWidgets = useCallback(async () => {
    if (!activeLayout) return;

    try {
      await loadWidgetsForLayout(activeLayout);
      toast({
        title: "Dashboard atualizado",
        description: "Todos os widgets foram atualizados.",
      });
    } catch (err) {
      console.error('Error refreshing all widgets:', err);
      toast({
        title: "Erro",
        description: "Falha ao atualizar dashboard.",
        variant: "destructive",
      });
    }
  }, [activeLayout, loadWidgetsForLayout, toast]);

  // Save layout to database
  const saveLayoutToDatabase = useCallback(async (layout: DashboardLayout) => {
    if (!user) return;

    if (layout.id === crypto.randomUUID()) {
      // New layout - use insert
      const { error } = await supabase
        .from('dashboard_layouts')
        .insert({
          name: layout.name,
          description: layout.description,
          widgets_config: layout.widgets as any,
          is_default: layout.isDefault,
          created_by: user.id
        });
      if (error) throw error;
    } else {
      // Existing layout - use update
      const { error } = await supabase
        .from('dashboard_layouts')
        .update({
          name: layout.name,
          description: layout.description,
          widgets_config: layout.widgets as any,
          is_default: layout.isDefault,
          updated_at: new Date().toISOString()
        })
        .eq('id', layout.id);
      if (error) throw error;
    }

    if (error) throw error;
  }, [user]);

  // Save layout
  const saveLayout = useCallback(async (layout: Omit<DashboardLayout, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const newLayout: DashboardLayout = {
        ...layout,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await saveLayoutToDatabase(newLayout);
      setLayouts(prev => [...prev, newLayout]);

      toast({
        title: "Layout salvo",
        description: `Layout "${layout.name}" foi salvo com sucesso.`,
      });
    } catch (err) {
      console.error('Error saving layout:', err);
      toast({
        title: "Erro",
        description: "Falha ao salvar layout.",
        variant: "destructive",
      });
    }
  }, [user, saveLayoutToDatabase, toast]);

  // Load layout
  const loadLayout = useCallback(async (layoutId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (!layout) return;

    try {
      setActiveLayout(layout);
      await loadWidgetsForLayout(layout);
      
      toast({
        title: "Layout carregado",
        description: `Layout "${layout.name}" foi carregado.`,
      });
    } catch (err) {
      console.error('Error loading layout:', err);
      toast({
        title: "Erro",
        description: "Falha ao carregar layout.",
        variant: "destructive",
      });
    }
  }, [layouts, loadWidgetsForLayout, toast]);

  // Get widgets by category
  const getWidgetsByCategory = useCallback((category: WidgetCategory) => {
    return widgets.filter(w => w.config.category === category);
  }, [widgets]);

  // Set widget data (for external updates)
  const setWidgetData = useCallback((widgetId: string, data: WidgetData) => {
    setWidgets(prev => prev.map(w => 
      w.config.id === widgetId ? { ...w, data } : w
    ));
  }, []);

  // Initialize
  useEffect(() => {
    loadWidgets();
    
    // Cleanup timers on unmount
    return () => {
      refreshTimers.forEach(timer => clearInterval(timer));
    };
  }, [user]);

  // Memoized return value
  const returnValue = useMemo(() => ({
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
    getWidgetsByCategory,
    setWidgetData
  }), [
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
    getWidgetsByCategory,
    setWidgetData
  ]);

  return returnValue;
}