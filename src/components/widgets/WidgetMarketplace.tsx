import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig, WidgetCategory, WidgetSize, RefreshInterval } from '@/types/widgets';
import { 
  TrendingUp, 
  Filter, 
  DollarSign, 
  Users, 
  Activity, 
  Brain, 
  Shield, 
  Zap, 
  Globe,
  Target,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WidgetTemplate {
  type: string;
  title: string;
  description: string;
  category: WidgetCategory;
  icon: React.ComponentType<any>;
  defaultSize: WidgetSize;
  defaultRefreshInterval: RefreshInterval;
  requiredPermissions?: string[];
  tags: string[];
}

const widgetTemplates: WidgetTemplate[] = [
  // Executive Widgets
  {
    type: 'revenue-intelligence',
    title: 'Revenue Intelligence',
    description: 'Análise preditiva de receita com IA, MRR, ARR e projeções',
    category: 'executive',
    icon: TrendingUp,
    defaultSize: 'large',
    defaultRefreshInterval: '15m',
    tags: ['receita', 'predição', 'ia']
  },
  {
    type: 'funnel',
    title: 'Funil de Vendas',
    description: 'Pipeline em tempo real com conversion rates e alertas de gargalo',
    category: 'commercial',
    icon: Filter,
    defaultSize: 'medium',
    defaultRefreshInterval: '5m',
    tags: ['vendas', 'pipeline', 'conversão']
  },
  {
    type: 'cash-flow',
    title: 'Cash Flow Preditivo',
    description: 'Projeção de fluxo de caixa 90 dias com alertas automáticos',
    category: 'financial',
    icon: DollarSign,
    defaultSize: 'medium',
    defaultRefreshInterval: '30m',
    tags: ['financeiro', 'fluxo', 'predição']
  },

  // Operational Widgets
  {
    type: 'capacity',
    title: 'Capacity Planning',
    description: 'Carga de trabalho da equipe e balanceamento de recursos',
    category: 'operational',
    icon: Users,
    defaultSize: 'medium',
    defaultRefreshInterval: '15m',
    tags: ['equipe', 'recursos', 'planejamento']
  },
  {
    type: 'team-health',
    title: 'Team Health',
    description: 'Bem-estar da equipe com análise de sentiment e burnout',
    category: 'people',
    icon: Activity,
    defaultSize: 'medium',
    defaultRefreshInterval: '1h',
    tags: ['bem-estar', 'sentiment', 'burnout']
  },
  {
    type: 'project-velocity',
    title: 'Project Velocity',
    description: 'Velocity de sprints, blockers e predição de entrega',
    category: 'operational',
    icon: Zap,
    defaultSize: 'medium',
    defaultRefreshInterval: '15m',
    tags: ['agile', 'velocity', 'blockers']
  },

  // Intelligence Widgets
  {
    type: 'ai-insights',
    title: 'AI Insights',
    description: 'Insights automáticos com IA e detecção de anomalias',
    category: 'ai',
    icon: Brain,
    defaultSize: 'large',
    defaultRefreshInterval: '1h',
    tags: ['ia', 'insights', 'anomalias']
  },
  {
    type: 'security',
    title: 'Security Dashboard',
    description: 'Monitoramento de segurança em tempo real e conformidade',
    category: 'security',
    icon: Shield,
    defaultSize: 'medium',
    defaultRefreshInterval: '5m',
    tags: ['segurança', 'conformidade', 'lgpd']
  },
  {
    type: 'performance-monitoring',
    title: 'Performance Monitor',
    description: 'Core Web Vitals, uptime e performance do sistema',
    category: 'operational',
    icon: Globe,
    defaultSize: 'medium',
    defaultRefreshInterval: '5m',
    tags: ['performance', 'uptime', 'web-vitals']
  },
  {
    type: 'market-intelligence',
    title: 'Market Intelligence',
    description: 'Análise competitiva e oportunidades de mercado',
    category: 'market',
    icon: Target,
    defaultSize: 'large',
    defaultRefreshInterval: '1h',
    tags: ['mercado', 'competidores', 'oportunidades']
  },
  {
    type: 'automation-status',
    title: 'Automation Status',
    description: 'Status de workflows e automações do sistema',
    category: 'operational',
    icon: Settings,
    defaultSize: 'medium',
    defaultRefreshInterval: '15m',
    tags: ['automação', 'workflows', 'sistema']
  }
];

interface WidgetMarketplaceProps {
  onAddWidget: (config: Omit<WidgetConfig, 'id'>) => void;
  existingWidgets: WidgetConfig[];
}

export function WidgetMarketplace({ onAddWidget, existingWidgets }: WidgetMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WidgetCategory | 'all'>('all');
  const [selectedWidget, setSelectedWidget] = useState<WidgetTemplate | null>(null);
  const { toast } = useToast();

  const filteredTemplates = widgetTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddWidget = (template: WidgetTemplate) => {
    // Check if widget already exists
    const existingWidget = existingWidgets.find(w => w.type === template.type);
    if (existingWidget) {
      toast({
        title: "Widget já existe",
        description: `O widget "${template.title}" já está no seu dashboard.`,
        variant: "destructive",
      });
      return;
    }

    const widgetConfig: Omit<WidgetConfig, 'id'> = {
      type: template.type,
      title: template.title,
      category: template.category,
      size: template.defaultSize,
      refreshInterval: template.defaultRefreshInterval,
      isVisible: true,
      isResizable: true,
      isDraggable: true,
      settings: {},
      requiredPermissions: template.requiredPermissions || []
    };

    onAddWidget(widgetConfig);
    
    toast({
      title: "Widget adicionado",
      description: `Widget "${template.title}" foi adicionado ao seu dashboard.`,
    });
  };

  const categoryColors = {
    executive: 'bg-purple-100 text-purple-800',
    commercial: 'bg-green-100 text-green-800',
    operational: 'bg-blue-100 text-blue-800',
    financial: 'bg-yellow-100 text-yellow-800',
    people: 'bg-pink-100 text-pink-800',
    market: 'bg-orange-100 text-orange-800',
    security: 'bg-red-100 text-red-800',
    ai: 'bg-indigo-100 text-indigo-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Widget Marketplace</h2>
        <p className="text-muted-foreground">
          Adicione widgets inteligentes ao seu dashboard para ter insights em tempo real
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar widgets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        
        <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="executive">Executivo</SelectItem>
            <SelectItem value="commercial">Comercial</SelectItem>
            <SelectItem value="operational">Operacional</SelectItem>
            <SelectItem value="financial">Financeiro</SelectItem>
            <SelectItem value="people">People</SelectItem>
            <SelectItem value="market">Market</SelectItem>
            <SelectItem value="security">Segurança</SelectItem>
            <SelectItem value="ai">IA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          const isAdded = existingWidgets.some(w => w.type === template.type);
          
          return (
            <Card key={template.type} className={`transition-all hover:shadow-md ${isAdded ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <Badge 
                        className={`text-xs mt-1 ${categoryColors[template.category]}`}
                        variant="secondary"
                      >
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Settings */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tamanho: {template.defaultSize}</span>
                    <span>Refresh: {template.defaultRefreshInterval}</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleAddWidget(template)}
                    disabled={isAdded}
                    className="w-full"
                    variant={isAdded ? "outline" : "default"}
                  >
                    {isAdded ? 'Já adicionado' : 'Adicionar Widget'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum widget encontrado para "{searchQuery}" na categoria {selectedCategory}
          </p>
        </div>
      )}
    </div>
  );
}