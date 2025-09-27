import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Settings, 
  Play, 
  Pause,
  Edit,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { useMultiProduct } from '@/contexts/MultiProductContext';

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  product: 'guilds' | 'doavya' | 'all';
  trigger: string;
  actions: AutomationAction[];
  isActive: boolean;
  executionCount: number;
  successRate: number;
  lastRun?: Date;
}

interface AutomationAction {
  id: string;
  type: 'email' | 'whatsapp' | 'webhook' | 'delay' | 'tag' | 'move_stage';
  config: Record<string, any>;
  order: number;
}

const mockTemplates: AutomationTemplate[] = [
  {
    id: 'guilds-welcome',
    name: 'Boas-vindas Guilds',
    description: 'Sequência de boas-vindas para leads Guilds',
    product: 'guilds',
    trigger: 'qualification_submitted',
    actions: [
      {
        id: 'action-1',
        type: 'email',
        config: {
          template: 'welcome_guilds',
          delay: 0,
          subject: 'Bem-vindo à Guilds! Vamos começar?'
        },
        order: 1
      },
      {
        id: 'action-2',
        type: 'delay',
        config: { duration: 24, unit: 'hours' },
        order: 2
      },
      {
        id: 'action-3',
        type: 'whatsapp',
        config: {
          template: 'followup_guilds',
          message: 'Olá! Vi que você tem interesse em nossos serviços. Posso ajudar com mais informações?'
        },
        order: 3
      }
    ],
    isActive: true,
    executionCount: 45,
    successRate: 87.5,
    lastRun: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'doavya-partner',
    name: 'Fluxo Parceiro Doavya',
    description: 'Automação específica para leads da Doavya',
    product: 'doavya',
    trigger: 'lead_created',
    actions: [
      {
        id: 'action-1',
        type: 'email',
        config: {
          template: 'doavya_welcome',
          delay: 0,
          subject: 'Parceria Doavya × Guilds - Vamos conversar!'
        },
        order: 1
      },
      {
        id: 'action-2',
        type: 'tag',
        config: { tags: ['doavya', 'priority'], action: 'add' },
        order: 2
      },
      {
        id: 'action-3',
        type: 'move_stage',
        config: { pipeline: 'Doavya Partnership', stage: 'Qualified' },
        order: 3
      }
    ],
    isActive: true,
    executionCount: 12,
    successRate: 91.7,
    lastRun: new Date('2024-01-14T16:45:00')
  },
  {
    id: 'cross-sell',
    name: 'Cross-sell Universal',
    description: 'Identifica oportunidades de cross-sell entre produtos',
    product: 'all',
    trigger: 'deal_won',
    actions: [
      {
        id: 'action-1',
        type: 'delay',
        config: { duration: 7, unit: 'days' },
        order: 1
      },
      {
        id: 'action-2',
        type: 'email',
        config: {
          template: 'cross_sell_opportunity',
          subject: 'Outras soluções que podem interessar'
        },
        order: 2
      }
    ],
    isActive: false,
    executionCount: 8,
    successRate: 62.5,
    lastRun: new Date('2024-01-10T09:15:00')
  }
];

export function MultiProductAutomation() {
  const { products, activeProduct } = useMultiProduct();
  const [templates, setTemplates] = useState<AutomationTemplate[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<AutomationTemplate | null>(null);

  // Filter templates based on active product
  const filteredTemplates = templates.filter(template => 
    activeProduct === 'all' || template.product === 'all' || template.product === activeProduct
  );

  const toggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const getProductColor = (product: string) => {
    if (product === 'all') return 'hsl(var(--muted-foreground))';
    const productConfig = products.find(p => p.slug === product);
    return productConfig?.color || 'hsl(var(--primary))';
  };

  const getProductName = (product: string) => {
    if (product === 'all') return 'Universal';
    const productConfig = products.find(p => p.slug === product);
    return productConfig?.name || product;
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageSquare;
      case 'webhook': return Zap;
      case 'delay': return Settings;
      default: return Settings;
    }
  };

  const formatLastRun = (date?: Date) => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automações Multi-Produto</h2>
          <p className="text-muted-foreground">
            Gerencie fluxos automatizados segmentados por linha de produto
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Automação
        </Button>
      </div>

      <Tabs defaultValue="templates">
        <TabsList>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-3 h-3 rounded-full mt-1"
                          style={{ backgroundColor: getProductColor(template.product) }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.name}
                          <Badge variant={template.isActive ? 'default' : 'secondary'}>
                            {template.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Produto: {getProductName(template.product)}</span>
                          <span>Trigger: {template.trigger}</span>
                          <span>Execuções: {template.executionCount}</span>
                          <span>Taxa sucesso: {template.successRate}%</span>
                          <span>Última execução: {formatLastRun(template.lastRun)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.isActive}
                        onCheckedChange={() => toggleTemplate(template.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Fluxo de Ações:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.actions.map((action, index) => {
                        const ActionIcon = getActionIcon(action.type);
                        return (
                          <div key={action.id} className="flex items-center gap-1">
                            <Badge variant="outline" className="gap-1">
                              <ActionIcon className="w-3 h-3" />
                              {action.type}
                            </Badge>
                            {index < template.actions.length - 1 && (
                              <span className="text-muted-foreground">→</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Templates Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredTemplates.filter(t => t.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  de {filteredTemplates.length} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Execuções (Mês)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {filteredTemplates.reduce((sum, t) => sum + t.executionCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taxa Sucesso Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(filteredTemplates.reduce((sum, t) => sum + t.successRate, 0) / filteredTemplates.length || 0).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Excelente performance
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance por Produto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map(product => {
                  const productTemplates = templates.filter(t => t.product === product.slug);
                  const avgSuccess = productTemplates.length > 0 
                    ? productTemplates.reduce((sum, t) => sum + t.successRate, 0) / productTemplates.length
                    : 0;
                  const totalExecutions = productTemplates.reduce((sum, t) => sum + t.executionCount, 0);
                  
                  return (
                    <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: product.color }}
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {productTemplates.length} template{productTemplates.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{avgSuccess.toFixed(1)}% sucesso</p>
                        <p className="text-sm text-muted-foreground">{totalExecutions} execuções</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configurações que se aplicam a todas as automações
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automações ativas</p>
                  <p className="text-sm text-muted-foreground">
                    Permitir execução de automações
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rate limiting</p>
                  <p className="text-sm text-muted-foreground">
                    Limitar execuções por contato/dia
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Logs detalhados</p>
                  <p className="text-sm text-muted-foreground">
                    Manter logs de todas as execuções
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: product.color }}
                    />
                    {product.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium mb-1">Templates padrão:</p>
                    <div className="space-y-1">
                      {product.automationTemplates.map(template => (
                        <Badge key={template} variant="outline" className="mr-1">
                          {template}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium mb-1">Configurações:</p>
                    <p className="text-muted-foreground">
                      WhatsApp: {product.settings.whatsapp}
                    </p>
                    <p className="text-muted-foreground">
                      Email: {product.settings.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}