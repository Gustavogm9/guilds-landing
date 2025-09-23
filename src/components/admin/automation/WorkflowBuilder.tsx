import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Play, 
  Save,
  GitBranch,
  Clock,
  Mail,
  Database,
  AlertTriangle,
  CheckCircle,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  description: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  condition?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

export function WorkflowBuilder() {
  const [workflow, setWorkflow] = useState<{
    name: string;
    description: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
  }>({
    name: '',
    description: '',
    nodes: [],
    connections: []
  });

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);

  const nodeTypes = [
    {
      type: 'trigger',
      name: 'Gatilho',
      icon: <Play className="h-4 w-4" />,
      color: 'hsl(var(--primary))',
      options: [
        { value: 'invoice_created', label: 'Fatura Criada' },
        { value: 'payment_received', label: 'Pagamento Recebido' },
        { value: 'invoice_overdue', label: 'Fatura Vencida' },
        { value: 'schedule_daily', label: 'Diário' },
        { value: 'schedule_weekly', label: 'Semanal' },
        { value: 'cash_flow_low', label: 'Fluxo de Caixa Baixo' }
      ]
    },
    {
      type: 'condition',
      name: 'Condição',
      icon: <GitBranch className="h-4 w-4" />,
      color: 'hsl(var(--accent))',
      options: [
        { value: 'amount_greater', label: 'Valor Maior Que' },
        { value: 'client_type', label: 'Tipo de Cliente' },
        { value: 'payment_method', label: 'Método de Pagamento' },
        { value: 'overdue_days', label: 'Dias em Atraso' },
        { value: 'first_invoice', label: 'Primeira Fatura' }
      ]
    },
    {
      type: 'action',
      name: 'Ação',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'hsl(var(--success))',
      options: [
        { value: 'send_email', label: 'Enviar Email' },
        { value: 'send_whatsapp', label: 'Enviar WhatsApp' },
        { value: 'create_task', label: 'Criar Tarefa' },
        { value: 'update_status', label: 'Atualizar Status' },
        { value: 'generate_report', label: 'Gerar Relatório' },
        { value: 'webhook_call', label: 'Chamar Webhook' }
      ]
    },
    {
      type: 'delay',
      name: 'Aguardar',
      icon: <Clock className="h-4 w-4" />,
      color: 'hsl(var(--warning))',
      options: [
        { value: 'minutes', label: 'Minutos' },
        { value: 'hours', label: 'Horas' },
        { value: 'days', label: 'Dias' },
        { value: 'weeks', label: 'Semanas' }
      ]
    }
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'overdue_collection',
      name: 'Cobrança Automática',
      description: 'Processo completo de cobrança para faturas vencidas',
      category: 'Cobrança',
      nodes: [
        {
          id: '1',
          type: 'trigger',
          name: 'Fatura Vencida',
          description: 'Detecta faturas vencidas há 3 dias',
          config: { event: 'invoice_overdue', days: 3 },
          position: { x: 0, y: 0 }
        },
        {
          id: '2',
          type: 'condition',
          name: 'Valor > R$ 100',
          description: 'Verifica se valor é significativo',
          config: { field: 'amount', operator: 'greater', value: 100 },
          position: { x: 0, y: 100 }
        },
        {
          id: '3',
          type: 'action',
          name: 'Enviar Primeira Cobrança',
          description: 'Email automático educado',
          config: { template: 'first_reminder', channel: 'email' },
          position: { x: 0, y: 200 }
        },
        {
          id: '4',
          type: 'delay',
          name: 'Aguardar 7 dias',
          description: 'Período de carência',
          config: { amount: 7, unit: 'days' },
          position: { x: 0, y: 300 }
        },
        {
          id: '5',
          type: 'action',
          name: 'Segunda Cobrança',
          description: 'Email mais assertivo',
          config: { template: 'second_reminder', channel: 'email' },
          position: { x: 0, y: 400 }
        }
      ],
      connections: [
        { id: 'c1', from: '1', to: '2' },
        { id: 'c2', from: '2', to: '3', condition: 'true' },
        { id: 'c3', from: '3', to: '4' },
        { id: 'c4', from: '4', to: '5' }
      ]
    },
    {
      id: 'payment_confirmation',
      name: 'Confirmação de Pagamento',
      description: 'Notifica clientes sobre pagamentos recebidos',
      category: 'Pagamento',
      nodes: [
        {
          id: '1',
          type: 'trigger',
          name: 'Pagamento Recebido',
          description: 'Webhook de pagamento confirmado',
          config: { event: 'payment_received' },
          position: { x: 0, y: 0 }
        },
        {
          id: '2',
          type: 'action',
          name: 'Atualizar Status',
          description: 'Marca fatura como paga',
          config: { status: 'paid', update_fields: ['payment_date', 'payment_method'] },
          position: { x: 0, y: 100 }
        },
        {
          id: '3',
          type: 'action',
          name: 'Enviar Confirmação',
          description: 'Email de confirmação ao cliente',
          config: { template: 'payment_confirmation', channel: 'email' },
          position: { x: 0, y: 200 }
        }
      ],
      connections: [
        { id: 'c1', from: '1', to: '2' },
        { id: 'c2', from: '2', to: '3' }
      ]
    }
  ];

  const addNode = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    if (!nodeType) return;

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type: type as any,
      name: `${nodeType.name} ${workflow.nodes.length + 1}`,
      description: '',
      config: {},
      position: { x: 50, y: workflow.nodes.length * 120 + 50 }
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const deleteNode = (nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.from !== nodeId && conn.to !== nodeId
      )
    }));
  };

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(workflow.nodes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkflow(prev => ({ ...prev, nodes: items }));
  }, [workflow.nodes]);

  const loadTemplate = (template: WorkflowTemplate) => {
    setWorkflow({
      name: template.name,
      description: template.description,
      nodes: template.nodes,
      connections: template.connections
    });
    setIsTemplateOpen(false);
  };

  const getNodeIcon = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    return nodeType?.icon || <Settings className="h-4 w-4" />;
  };

  const getNodeColor = (type: string) => {
    const nodeType = nodeTypes.find(nt => nt.type === type);
    return nodeType?.color || 'hsl(var(--muted))';
  };

  const saveWorkflow = () => {
    console.log('Saving workflow:', workflow);
    // Implement save functionality
  };

  const testWorkflow = () => {
    console.log('Testing workflow:', workflow);
    // Implement test functionality
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-1">
          <Input
            placeholder="Nome do workflow"
            value={workflow.name}
            onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
            className="text-lg font-semibold"
          />
          <Input
            placeholder="Descrição do workflow"
            value={workflow.description}
            onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <GitBranch className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Templates de Workflow</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {workflowTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-muted/50" onClick={() => loadTemplate(template)}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="text-xs text-muted-foreground">
                        {template.nodes.length} etapas
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" onClick={testWorkflow}>
            <Play className="h-4 w-4 mr-2" />
            Testar
          </Button>
          
          <Button size="sm" onClick={saveWorkflow}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Node Palette */}
        <Card className="w-64 flex-shrink-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Componentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <Button
                key={nodeType.type}
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addNode(nodeType.type)}
              >
                <div className="flex items-center gap-2">
                  <div style={{ color: nodeType.color }}>
                    {nodeType.icon}
                  </div>
                  <span>{nodeType.name}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Canvas do Workflow</CardTitle>
          </CardHeader>
          <CardContent className="h-96 overflow-auto">
            {workflow.nodes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Adicione componentes para começar</p>
                </div>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="workflow-nodes">
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3"
                    >
                      {workflow.nodes.map((node, index) => (
                        <Draggable key={node.id} draggableId={node.id} index={index}>
                          {(provided, snapshot) => (
                            <div className="relative">
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`
                                  flex items-center gap-3 p-3 border rounded-lg bg-background
                                  ${snapshot.isDragging ? 'shadow-lg' : 'hover:bg-muted/50'}
                                `}
                              >
                                <div 
                                  {...provided.dragHandleProps}
                                  className="flex items-center gap-2 flex-1"
                                >
                                  <div style={{ color: getNodeColor(node.type) }}>
                                    {getNodeIcon(node.type)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{node.name}</div>
                                    {node.description && (
                                      <div className="text-xs text-muted-foreground">
                                        {node.description}
                                      </div>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {node.type}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedNode(node);
                                      setIsConfigOpen(true);
                                    }}
                                  >
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => deleteNode(node.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              {index < workflow.nodes.length - 1 && (
                                <div className="flex justify-center my-2">
                                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>

        {/* Node Configuration */}
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Configurar {selectedNode?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedNode && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="node-name">Nome</Label>
                  <Input
                    id="node-name"
                    value={selectedNode.name}
                    onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="node-description">Descrição</Label>
                  <Textarea
                    id="node-description"
                    value={selectedNode.description}
                    onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                  />
                </div>

                {selectedNode.type === 'trigger' && (
                  <div>
                    <Label htmlFor="trigger-event">Evento</Label>
                    <Select
                      value={selectedNode.config.event || ''}
                      onValueChange={(value) => updateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, event: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um evento" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodeTypes.find(nt => nt.type === 'trigger')?.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedNode.type === 'action' && (
                  <div>
                    <Label htmlFor="action-type">Tipo de Ação</Label>
                    <Select
                      value={selectedNode.config.action_type || ''}
                      onValueChange={(value) => updateNode(selectedNode.id, { 
                        config: { ...selectedNode.config, action_type: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ação" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodeTypes.find(nt => nt.type === 'action')?.options.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedNode.type === 'delay' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="delay-amount">Quantidade</Label>
                      <Input
                        id="delay-amount"
                        type="number"
                        value={selectedNode.config.amount || ''}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, amount: parseInt(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="delay-unit">Unidade</Label>
                      <Select
                        value={selectedNode.config.unit || ''}
                        onValueChange={(value) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, unit: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Unidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodeTypes.find(nt => nt.type === 'delay')?.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'condition' && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="condition-field">Campo</Label>
                      <Input
                        id="condition-field"
                        value={selectedNode.config.field || ''}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, field: e.target.value }
                        })}
                        placeholder="amount, status, client_type..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="condition-operator">Operador</Label>
                      <Select
                        value={selectedNode.config.operator || ''}
                        onValueChange={(value) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, operator: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione operador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Igual a</SelectItem>
                          <SelectItem value="greater">Maior que</SelectItem>
                          <SelectItem value="less">Menor que</SelectItem>
                          <SelectItem value="contains">Contém</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="condition-value">Valor</Label>
                      <Input
                        id="condition-value"
                        value={selectedNode.config.value || ''}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          config: { ...selectedNode.config, value: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                )}

                <Button onClick={() => setIsConfigOpen(false)} className="w-full">
                  Salvar Configuração
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}