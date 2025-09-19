import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  Calendar, 
  DollarSign, 
  Clock, 
  TrendingDown,
  AlertTriangle,
  Target,
  Settings,
  Plus,
  Edit
} from 'lucide-react';

interface AutomationTrigger {
  id: string;
  name: string;
  description: string;
  type: 'schedule' | 'condition' | 'event' | 'threshold';
  isActive: boolean;
  configuration: any;
  triggerCount: number;
  lastTriggered?: string;
  connectedWorkflows: number;
}

export function AutomationTriggers() {
  const [triggers] = useState<AutomationTrigger[]>([
    {
      id: '1',
      name: 'Vencimento de Conta',
      description: 'Disparado 3 dias antes do vencimento',
      type: 'condition',
      isActive: true,
      configuration: {
        days_before: 3,
        account_types: ['payable', 'receivable']
      },
      triggerCount: 234,
      lastTriggered: '2024-01-20T10:30:00Z',
      connectedWorkflows: 2
    },
    {
      id: '2',
      name: 'Relatório Semanal',
      description: 'Toda segunda-feira às 08:00',
      type: 'schedule',
      isActive: true,
      configuration: {
        schedule: 'weekly',
        day_of_week: 'monday',
        time: '08:00'
      },
      triggerCount: 48,
      lastTriggered: '2024-01-15T08:00:00Z',
      connectedWorkflows: 1
    },
    {
      id: '3',
      name: 'Fluxo Negativo',
      description: 'Quando fluxo de caixa fica abaixo de R$ 10.000',
      type: 'threshold',
      isActive: true,
      configuration: {
        metric: 'cash_flow',
        operator: 'less_than',
        value: 10000
      },
      triggerCount: 12,
      lastTriggered: '2024-01-18T14:22:00Z',
      connectedWorkflows: 3
    },
    {
      id: '4',
      name: 'Nova Transação',
      description: 'Quando uma nova transação é criada',
      type: 'event',
      isActive: false,
      configuration: {
        event_type: 'transaction_created',
        min_amount: 1000
      },
      triggerCount: 567,
      lastTriggered: '2024-01-20T15:45:00Z',
      connectedWorkflows: 1
    },
    {
      id: '5',
      name: 'Contas em Atraso',
      description: 'Quando há mais de 5 contas em atraso',
      type: 'threshold',
      isActive: true,
      configuration: {
        metric: 'overdue_accounts',
        operator: 'greater_than',
        value: 5
      },
      triggerCount: 28,
      lastTriggered: '2024-01-19T16:10:00Z',
      connectedWorkflows: 2
    }
  ]);

  const [selectedTrigger, setSelectedTrigger] = useState<AutomationTrigger | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return <Calendar className="h-5 w-5 text-primary" />;
      case 'condition':
        return <Target className="h-5 w-5 text-accent" />;
      case 'event':
        return <Zap className="h-5 w-5 text-warning" />;
      case 'threshold':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Settings className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTriggerBadge = (type: string) => {
    const variants = {
      schedule: 'default',
      condition: 'secondary',
      event: 'outline',
      threshold: 'destructive'
    } as const;
    
    const labels = {
      schedule: 'Agendamento',
      condition: 'Condição',
      event: 'Evento',
      threshold: 'Limite'
    };

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {labels[type as keyof typeof labels] || type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gatilhos de Automação</h3>
          <p className="text-sm text-muted-foreground">
            Configure quando suas automações devem ser executadas
          </p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Gatilho
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Gatilhos */}
        <div className="lg:col-span-2 space-y-4">
          {triggers.map((trigger) => (
            <Card 
              key={trigger.id} 
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedTrigger?.id === trigger.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTrigger(trigger)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getTriggerIcon(trigger.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{trigger.name}</h4>
                        {getTriggerBadge(trigger.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {trigger.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {trigger.triggerCount} execuções
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {trigger.connectedWorkflows} workflows
                        </span>
                        {trigger.lastTriggered && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(trigger.lastTriggered).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={trigger.isActive}
                      onCheckedChange={(checked) => {
                        // Handle toggle
                      }}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrigger(trigger);
                        setIsEditing(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Painel de Configuração */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isEditing ? 'Configurar Gatilho' : 'Detalhes do Gatilho'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedTrigger ? (
                <>
                  {!isEditing ? (
                    <>
                      <div>
                        <Label className="text-sm font-medium">Nome</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTrigger.name}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tipo</Label>
                        <div className="mt-1">
                          {getTriggerBadge(selectedTrigger.type)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Descrição</Label>
                        <p className="text-sm text-muted-foreground">
                          {selectedTrigger.description}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="mt-1">
                          <Badge variant={selectedTrigger.isActive ? 'default' : 'secondary'}>
                            {selectedTrigger.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Configuração</Label>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(selectedTrigger.configuration, null, 2)}
                        </pre>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="trigger-name">Nome</Label>
                        <Input 
                          id="trigger-name" 
                          defaultValue={selectedTrigger.name}
                        />
                      </div>
                      <div>
                        <Label htmlFor="trigger-type">Tipo</Label>
                        <Select defaultValue={selectedTrigger.type}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="schedule">Agendamento</SelectItem>
                            <SelectItem value="condition">Condição</SelectItem>
                            <SelectItem value="event">Evento</SelectItem>
                            <SelectItem value="threshold">Limite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trigger-description">Descrição</Label>
                        <Input 
                          id="trigger-description" 
                          defaultValue={selectedTrigger.description}
                        />
                      </div>
                      
                      {selectedTrigger.type === 'threshold' && (
                        <>
                          <div>
                            <Label htmlFor="metric">Métrica</Label>
                            <Select defaultValue={selectedTrigger.configuration.metric}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash_flow">Fluxo de Caixa</SelectItem>
                                <SelectItem value="overdue_accounts">Contas em Atraso</SelectItem>
                                <SelectItem value="total_receivable">Total a Receber</SelectItem>
                                <SelectItem value="total_payable">Total a Pagar</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="operator">Operador</Label>
                            <Select defaultValue={selectedTrigger.configuration.operator}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="greater_than">Maior que</SelectItem>
                                <SelectItem value="less_than">Menor que</SelectItem>
                                <SelectItem value="equals">Igual a</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="value">Valor</Label>
                            <Input 
                              id="value" 
                              type="number"
                              defaultValue={selectedTrigger.configuration.value}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => setIsEditing(false)}
                        >
                          Salvar
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Selecione um gatilho para ver os detalhes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedTrigger && !isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total de Execuções</span>
                  <span className="font-medium">{selectedTrigger.triggerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Workflows Conectados</span>
                  <span className="font-medium">{selectedTrigger.connectedWorkflows}</span>
                </div>
                {selectedTrigger.lastTriggered && (
                  <div className="flex justify-between">
                    <span className="text-sm">Última Execução</span>
                    <span className="font-medium text-xs">
                      {new Date(selectedTrigger.lastTriggered).toLocaleString('pt-BR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}