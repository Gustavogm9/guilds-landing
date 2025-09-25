import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Play, Pause, BarChart, MessageSquare, Clock, Users, Target } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  trigger_event: string;
  target_persona: string;
  channel: string;
  message_template: string;
  trigger_delay_hours: number;
  is_active: boolean;
  settings: any;
  created_at: string;
  updated_at: string;
  project_id: string;
}

interface CampaignExecution {
  id: string;
  campaign_id: string;
  contact_id: string;
  status: string;
  channel: string;
  sent_at: string;
  delivered_at: string;
  responded_at: string;
  error_message: string;
}

export const CampaignAdmin = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [executions, setExecutions] = useState<CampaignExecution[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'feedback_request',
    trigger_event: 'project_milestone',
    target_persona: 'gestor',
    channel: 'whatsapp',
    message_template: '',
    trigger_delay_hours: 24,
    project_id: '',
    is_active: true,
    settings: {}
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch campaigns
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('feedback_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;
      setCampaigns(campaignsData || []);

      // Fetch campaign executions
      const { data: executionsData, error: executionsError } = await supabase
        .from('feedback_campaign_executions')
        .select(`
          *,
          campaign:feedback_campaigns(name),
          contact:crm_contacts(name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (executionsError) throw executionsError;
      setExecutions(executionsData || []);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, title')
        .eq('is_active', true)
        .order('title');

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (error) {
      console.error('Error fetching campaign data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados das campanhas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('feedback_campaigns')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setCampaigns([data, ...campaigns]);
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Campanha criada",
        description: "A campanha foi criada com sucesso.",
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erro ao criar campanha",
        description: "Não foi possível criar a campanha.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCampaign) return;

    try {
      const { data, error } = await supabase
        .from('feedback_campaigns')
        .update(formData)
        .eq('id', selectedCampaign.id)
        .select()
        .single();

      if (error) throw error;

      setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? data : c));
      setIsEditDialogOpen(false);
      setSelectedCampaign(null);
      resetForm();
      
      toast({
        title: "Campanha atualizada",
        description: "A campanha foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Erro ao atualizar campanha",
        description: "Não foi possível atualizar a campanha.",
        variant: "destructive",
      });
    }
  };

  const handleToggleCampaign = async (campaign: Campaign) => {
    try {
      const { error } = await supabase
        .from('feedback_campaigns')
        .update({ is_active: !campaign.is_active })
        .eq('id', campaign.id);

      if (error) throw error;

      setCampaigns(campaigns.map(c => 
        c.id === campaign.id ? { ...c, is_active: !c.is_active } : c
      ));
      
      toast({
        title: campaign.is_active ? "Campanha pausada" : "Campanha ativada",
        description: `A campanha foi ${campaign.is_active ? 'pausada' : 'ativada'} com sucesso.`,
      });
    } catch (error) {
      console.error('Error toggling campaign:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status da campanha.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('feedback_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      
      toast({
        title: "Campanha excluída",
        description: "A campanha foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Erro ao excluir campanha",
        description: "Não foi possível excluir a campanha.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'feedback_request',
      trigger_event: 'project_milestone',
      target_persona: 'gestor',
      channel: 'whatsapp',
      message_template: '',
      trigger_delay_hours: 24,
      project_id: '',
      is_active: true,
      settings: {}
    });
  };

  const openEditDialog = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      trigger_event: campaign.trigger_event,
      target_persona: campaign.target_persona,
      channel: campaign.channel,
      message_template: campaign.message_template,
      trigger_delay_hours: campaign.trigger_delay_hours,
      project_id: campaign.project_id,
      is_active: campaign.is_active,
      settings: campaign.settings || {}
    });
    setIsEditDialogOpen(true);
  };

  const getCampaignStats = (campaignId: string) => {
    const campaignExecutions = executions.filter(e => e.campaign_id === campaignId);
    const sent = campaignExecutions.filter(e => e.status === 'sent').length;
    const delivered = campaignExecutions.filter(e => e.delivered_at).length;
    const responded = campaignExecutions.filter(e => e.responded_at).length;
    const failed = campaignExecutions.filter(e => e.status === 'failed').length;

    return { sent, delivered, responded, failed, total: campaignExecutions.length };
  };

  const CampaignForm = ({ onSubmit, isEdit = false }: { onSubmit: (e: React.FormEvent) => void; isEdit?: boolean }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Campanha</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: NPS Pós-Projeto"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="project_id">Projeto</Label>
          <Select value={formData.project_id} onValueChange={(value) => setFormData({ ...formData, project_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Campanha</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feedback_request">Solicitação de Feedback</SelectItem>
              <SelectItem value="nps">Pesquisa NPS</SelectItem>
              <SelectItem value="csat">Pesquisa CSAT</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trigger_event">Evento Gatilho</Label>
          <Select value={formData.trigger_event} onValueChange={(value) => setFormData({ ...formData, trigger_event: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project_milestone">Marco do Projeto</SelectItem>
              <SelectItem value="project_completion">Conclusão do Projeto</SelectItem>
              <SelectItem value="task_completion">Conclusão de Tarefa</SelectItem>
              <SelectItem value="feedback_submitted">Feedback Enviado</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target_persona">Persona Alvo</Label>
          <Select value={formData.target_persona} onValueChange={(value) => setFormData({ ...formData, target_persona: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gestor">Gestor</SelectItem>
              <SelectItem value="usuario_final">Usuário Final</SelectItem>
              <SelectItem value="parceiro">Parceiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel">Canal</Label>
          <Select value={formData.channel} onValueChange={(value) => setFormData({ ...formData, channel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="trigger_delay_hours">Delay (horas)</Label>
          <Input
            id="trigger_delay_hours"
            type="number"
            value={formData.trigger_delay_hours}
            onChange={(e) => setFormData({ ...formData, trigger_delay_hours: parseInt(e.target.value) })}
            min="0"
            max="8760"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message_template">Template da Mensagem</Label>
        <Textarea
          id="message_template"
          value={formData.message_template}
          onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
          placeholder="Olá {nome}, como foi sua experiência com o projeto {projeto}?"
          rows={4}
          required
        />
        <p className="text-sm text-muted-foreground">
          Use variáveis: {"{nome}"}, {"{projeto}"}, {"{empresa}"}, {"{data}"}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Campanha ativa</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setSelectedCampaign(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancelar
        </Button>
        <Button type="submit">
          {isEdit ? 'Atualizar' : 'Criar'} Campanha
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando campanhas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Campanhas</h2>
          <p className="text-muted-foreground">
            Gerencie campanhas automatizadas de feedback e engajamento
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Campanha</DialogTitle>
            </DialogHeader>
            <CampaignForm onSubmit={handleCreateCampaign} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              const stats = getCampaignStats(campaign.id);
              
              return (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {campaign.name}
                          <Badge variant={campaign.is_active ? "default" : "secondary"}>
                            {campaign.is_active ? 'Ativa' : 'Pausada'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {campaign.type} • {campaign.channel} • {campaign.target_persona}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleCampaign(campaign)}
                        >
                          {campaign.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
                        <div className="text-xs text-muted-foreground">Enviadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
                        <div className="text-xs text-muted-foreground">Entregues</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.responded}</div>
                        <div className="text-xs text-muted-foreground">Respondidas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                        <div className="text-xs text-muted-foreground">Falharam</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">
                        <strong>Gatilho:</strong> {campaign.trigger_event} (delay: {campaign.trigger_delay_hours}h)
                      </p>
                      <p className="mb-1">
                        <strong>Mensagem:</strong> {campaign.message_template.substring(0, 100)}...
                      </p>
                      <p>
                        <strong>Criada em:</strong> {new Date(campaign.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execuções Recentes</CardTitle>
              <CardDescription>
                Últimas 100 execuções de campanhas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enviado</TableHead>
                    <TableHead>Entregue</TableHead>
                    <TableHead>Respondido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {executions.map((execution) => (
                    <TableRow key={execution.id}>
                      <TableCell>{(execution as any).campaign?.name || 'N/A'}</TableCell>
                      <TableCell>{(execution as any).contact?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{execution.channel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            execution.status === 'sent' ? 'default' :
                            execution.status === 'failed' ? 'destructive' : 'secondary'
                          }
                        >
                          {execution.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {execution.sent_at ? new Date(execution.sent_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </TableCell>
                      <TableCell>
                        {execution.delivered_at ? new Date(execution.delivered_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </TableCell>
                      <TableCell>
                        {execution.responded_at ? new Date(execution.responded_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{campaigns.length}</div>
                <p className="text-xs text-muted-foreground">
                  {campaigns.filter(c => c.is_active).length} ativas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {executions.filter(e => e.status === 'sent').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Últimos 30 dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {executions.length > 0 
                    ? Math.round((executions.filter(e => e.responded_at).length / executions.length) * 100)
                    : 0
                  }%
                </div>
                <p className="text-xs text-muted-foreground">
                  Média geral
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contatos Únicos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(executions.map(e => e.contact_id)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Alcançados
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Campanha</DialogTitle>
          </DialogHeader>
          <CampaignForm onSubmit={handleUpdateCampaign} isEdit />
        </DialogContent>
      </Dialog>
    </div>
  );
};