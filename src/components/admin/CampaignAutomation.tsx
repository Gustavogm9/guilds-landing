import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, AlertTriangle, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useMultiProduct } from '@/contexts/MultiProductContext';
import { useCurrentProduct } from '@/hooks/useCurrentProduct';

interface AutomationRule {
  id: string;
  name: string;
  trigger_event: string;
  conditions: any;
  actions: any;
  is_active: boolean;
  last_triggered: string;
  trigger_count: number;
  success_rate: number;
}

interface PendingExecution {
  id: string;
  campaign_id: string;
  contact_id: string;
  project_id: string;
  channel: string;
  status: string;
  created_at: string;
  sent_at: string;
  delivered_at: string;
  responded_at: string;
  error_message: string;
  message_sent: string;
  response_feedback_id: string;
}

export const CampaignAutomation = () => {
  const { activeProduct } = useMultiProduct();
  const currentProduct = useCurrentProduct(true, activeProduct === 'all' ? 'guilds' : activeProduct);
  
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [pendingExecutions, setPendingExecutions] = useState<PendingExecution[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingQueue, setProcessingQueue] = useState(false);

  useEffect(() => {
    fetchData();
    // Setup real-time updates for pending executions
    const channel = supabase
      .channel('campaign-automation')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback_campaign_executions'
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProduct]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch pending executions
      const { data: executionsData, error: executionsError } = await supabase
        .from('feedback_campaign_executions')
        .select(`
          *,
          campaign:feedback_campaigns(name, type),
          contact:crm_contacts(name, email)
        `)
        .eq('status', 'pending')
        .eq('business_unit', currentProduct)
        .order('created_at', { ascending: true });

      if (executionsError) throw executionsError;
      setPendingExecutions(executionsData || []);

      // Fetch campaigns for stats
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('feedback_campaigns')
        .select('*')
        .eq('is_active', true)
        .eq('business_unit', currentProduct);

      if (campaignsError) throw campaignsError;
      setCampaigns(campaignsData || []);

      // Fetch contacts for stats
      const { data: contactsData, error: contactsError } = await supabase
        .from('crm_contacts')
        .select('id, name, email')
        .eq('is_active', true)
        .limit(100);

      if (contactsError) throw contactsError;
      setContacts(contactsData || []);

    } catch (error) {
      console.error('Error fetching automation data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados de automação.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processQueue = async () => {
    try {
      setProcessingQueue(true);
      
      // Call the campaign executor edge function
      const { data, error } = await supabase.functions.invoke('campaign-executor', {
        body: { force_process: true }
      });

      if (error) throw error;

      toast({
        title: "Fila processada",
        description: "As execuções pendentes foram processadas com sucesso.",
      });
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error processing queue:', error);
      toast({
        title: "Erro ao processar fila",
        description: "Não foi possível processar as execuções pendentes.",
        variant: "destructive",
      });
    } finally {
      setProcessingQueue(false);
    }
  };

  const retryExecution = async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('feedback_campaign_executions')
        .update({ 
          status: 'pending',
          error_message: null 
        })
        .eq('id', executionId);

      if (error) throw error;

      toast({
        title: "Execução reagendada",
        description: "A execução foi reagendada para novo processamento.",
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error retrying execution:', error);
      toast({
        title: "Erro ao reagendar",
        description: "Não foi possível reagendar a execução.",
        variant: "destructive",
      });
    }
  };

  const cancelExecution = async (executionId: string) => {
    try {
      const { error } = await supabase
        .from('feedback_campaign_executions')
        .update({ status: 'cancelled' })
        .eq('id', executionId);

      if (error) throw error;

      toast({
        title: "Execução cancelada",
        description: "A execução foi cancelada com sucesso.",
      });
      
      await fetchData();
    } catch (error) {
      console.error('Error cancelling execution:', error);
      toast({
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar a execução.",
        variant: "destructive",
      });
    }
  };

  const getQueueStats = () => {
    const total = pendingExecutions.length;
    const scheduled = pendingExecutions.filter(e => e.status === 'pending').length;
    const overdue = pendingExecutions.filter(e => e.status === 'failed').length;
    const withErrors = pendingExecutions.filter(e => e.error_message).length;

    return { total, scheduled, overdue, withErrors };
  };

  const queueStats = getQueueStats();

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando automação...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automação de Campanhas</h2>
          <p className="text-muted-foreground">
            Monitore e gerencie a execução automática das campanhas
          </p>
        </div>
        
        <Button 
          onClick={processQueue}
          disabled={processingQueue || queueStats.total === 0}
        >
          {processingQueue ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Processar Fila ({queueStats.total})
            </>
          )}
        </Button>
      </div>

      {/* Queue Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total na Fila</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queueStats.total}</div>
            <p className="text-xs text-muted-foreground">
              execuções pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{queueStats.scheduled}</div>
            <p className="text-xs text-muted-foreground">
              aguardando horário
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasadas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{queueStats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              precisam processamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Erro</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{queueStats.withErrors}</div>
            <p className="text-xs text-muted-foreground">
              com falhas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Campanhas Ativas</CardTitle>
          <CardDescription>
            Status das campanhas em execução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => {
              const campaignExecutions = pendingExecutions.filter(e => e.campaign_id === campaign.id);
              const progress = campaignExecutions.length > 0 ? 
                (campaignExecutions.filter(e => e.status === 'sent').length / campaignExecutions.length) * 100 : 0;
              
              return (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.type} • {campaignExecutions.length} execuções pendentes
                    </p>
                    <div className="mt-2">
                      <Progress value={progress} className="w-full h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round(progress)}% processado
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={campaign.is_active ? 'default' : 'secondary'}>
                      {campaign.is_active ? 'Ativa' : 'Pausada'}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pending Executions Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Fila de Execução</CardTitle>
          <CardDescription>
            Execuções pendentes e agendadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Agendado para</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tentativas</TableHead>
                <TableHead>Último Erro</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingExecutions.slice(0, 50).map((execution) => {
                const isOverdue = execution.status === 'failed';
                
                return (
                  <TableRow key={execution.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {(execution as any).campaign?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(execution as any).campaign?.type || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {(execution as any).contact?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {(execution as any).contact?.email || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className={isOverdue ? 'text-red-600' : ''}>
                        {new Date(execution.created_at).toLocaleString('pt-BR')}
                      </div>
                      {isOverdue && (
                        <Badge variant="destructive" className="mt-1">
                          Falhada
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={
                          execution.status === 'pending' ? 'default' :
                          execution.status === 'failed' ? 'destructive' : 'secondary'
                        }
                      >
                        {execution.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span>0</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {execution.error_message && (
                        <div className="max-w-48 truncate text-sm text-red-600">
                          {execution.error_message}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryExecution(execution.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelExecution(execution.id)}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {pendingExecutions.length > 50 && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando 50 de {pendingExecutions.length} execuções pendentes
            </div>
          )}
        </CardContent>
      </Card>

      {/* Automation Health */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>
            Saúde geral do sistema de automação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">Campanhas Ativas</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {contacts.length}
              </div>
              <div className="text-sm text-muted-foreground">Contatos Ativos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {queueStats.total === 0 ? '✓' : queueStats.total}
              </div>
              <div className="text-sm text-muted-foreground">
                {queueStats.total === 0 ? 'Fila Limpa' : 'Na Fila'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};