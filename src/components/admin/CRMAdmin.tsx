import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, FileText, Eye, ExternalLink, Calendar as CalendarIcon, MoreVertical, Edit, Trash2, Power } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCRM } from '@/hooks/useCRM';
import { PipelineForm } from './PipelineForm';
import { PipelineEditForm } from './PipelineEditForm';
import { StageForm } from './StageForm';
import { ContactForm } from './ContactForm';
import { EnhancedContactCard } from '@/components/crm/contact/EnhancedContactCard';
import { ContactDetailModal } from '@/components/crm/contact/ContactDetailModal';
import { useNavigate } from 'react-router-dom';

export default function CRMAdmin() {
  const navigate = useNavigate();
  const [showInactive, setShowInactive] = useState(false);
  
  const { 
    pipelines, 
    contacts, 
    pipelinesLoading, 
    contactsLoading,
    createPipeline,
    isCreatingPipeline,
    createContact,
    isCreatingContact,
    updatePipeline,
    deletePipeline,
    isDeletingPipeline
  } = useCRM(showInactive);

  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [showPipelineEditForm, setShowPipelineEditForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<any>(null);
  const [pipelineToDelete, setPipelineToDelete] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDetail, setShowContactDetail] = useState(false);

  const handleCreatePipeline = (data: any) => {
    createPipeline(data);
  };

  const handleCreateContact = (data: any) => {
    createContact(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CRM Admin</h1>
          <p className="text-muted-foreground">
            Gerencie pipelines, estágios e contatos do sistema CRM
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/admin/crm/agenda')} 
            variant="outline"
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Minha Agenda
          </Button>
          <Button 
            onClick={() => navigate('/admin/crm/kanban')} 
            variant="outline"
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Kanban
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipelines Ativos</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pipelinesLoading ? '...' : pipelines?.filter(p => p.is_active).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {pipelines?.length || 0} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contatos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contactsLoading ? '...' : contacts?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de leads e clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos esta semana</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contactsLoading ? '...' : 
                contacts?.filter(c => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(c.created_at) > weekAgo;
                }).length || 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipelines */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pipelines</CardTitle>
              <CardDescription>
                {pipelinesLoading ? 'Carregando...' : `${pipelines?.filter(p => p.is_active).length || 0} ativos • ${pipelines?.filter(p => !p.is_active).length || 0} inativos`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-inactive"
                  checked={showInactive}
                  onCheckedChange={setShowInactive}
                />
                <Label htmlFor="show-inactive" className="text-sm cursor-pointer">
                  Mostrar inativos
                </Label>
              </div>
              <Button onClick={() => setShowPipelineForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Pipeline
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pipelinesLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando pipelines...</p>
            </div>
          ) : pipelines && pipelines.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pipelines.map((pipeline) => (
                <Card 
                  key={pipeline.id} 
                  className={`relative cursor-pointer hover:shadow-lg transition-all ${!pipeline.is_active ? 'opacity-60' : ''}`}
                  onClick={() => navigate(`/admin/crm/board?pipeline=${pipeline.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: pipeline.color }}
                        />
                        {pipeline.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={pipeline.is_active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {pipeline.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPipeline(pipeline);
                                setShowPipelineEditForm(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar Pipeline
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPipeline(pipeline);
                                setShowStageForm(true);
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Gerenciar Estágios
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePipeline({ 
                                  pipelineId: pipeline.id, 
                                  updates: { is_active: !pipeline.is_active } 
                                });
                              }}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {pipeline.is_active ? 'Desativar' : 'Ativar'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPipelineToDelete(pipeline.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pipeline.description || 'Sem descrição'}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {pipeline.type === 'sales' ? 'Vendas' : 
                       pipeline.type === 'support' ? 'Suporte' : 'Projetos'}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum pipeline encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Contatos</CardTitle>
              <CardDescription>
                {contactsLoading ? 'Carregando...' : `${contacts?.length || 0} contatos ativos`}
              </CardDescription>
            </div>
            <Button onClick={() => setShowContactForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Contato
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contactsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Carregando contatos...</p>
            </div>
          ) : contacts && contacts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {contacts.slice(0, 6).map((contact) => (
                <EnhancedContactCard
                  key={contact.id}
                  contact={contact}
                  onViewDetails={(contact) => {
                    setSelectedContact(contact);
                    setShowContactDetail(true);
                  }}
                  onAddInteraction={(contact) => {
                    // TODO: Implementar modal de nova interação
                    console.log('Add interaction for:', contact.name);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum contato encontrado</p>
            </div>
          )}
          
          {contacts && contacts.length > 6 && (
            <div className="text-center pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => navigate('/admin/crm/kanban')}>
                <Eye className="h-4 w-4 mr-2" />
                Ver todos os {contacts.length} contatos no CRM
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Sources Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Integração de Fontes de Lead</CardTitle>
          <CardDescription>
            Status das integrações automáticas com formulários e fontes de captura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Newsletter', status: 'active', pipeline: 'Inbound Marketing' },
              { name: 'Formulário Contato', status: 'active', pipeline: 'Contato Direto' },
              { name: 'Qualificação', status: 'active', pipeline: 'Qualificação' },
              { name: 'Workshops', status: 'active', pipeline: 'Educacional' }
            ].map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{source.name}</h4>
                  <p className="text-xs text-muted-foreground">{source.pipeline}</p>
                </div>
                <Badge 
                  variant={source.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {source.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PipelineForm
        open={showPipelineForm}
        onOpenChange={setShowPipelineForm}
      />

      {selectedPipeline && (
        <>
          <PipelineEditForm
            pipeline={selectedPipeline}
            open={showPipelineEditForm}
            onOpenChange={(open) => {
              setShowPipelineEditForm(open);
              if (!open) setSelectedPipeline(null);
            }}
          />
          
          <StageForm
            pipelineId={typeof selectedPipeline === 'string' ? selectedPipeline : selectedPipeline.id}
            open={showStageForm}
            onOpenChange={(open) => {
              setShowStageForm(open);
              if (!open) setSelectedPipeline(null);
            }}
          />
        </>
      )}

      <ContactForm
        open={showContactForm}
        onOpenChange={setShowContactForm}
      />

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={selectedContact}
        open={showContactDetail}
        onOpenChange={setShowContactDetail}
        onEdit={(contact) => {
          // TODO: Implementar edição de contato
          console.log('Edit contact:', contact.name);
        }}
      />

      {/* Delete Pipeline Confirmation */}
      <AlertDialog open={!!pipelineToDelete} onOpenChange={(open) => !open && setPipelineToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pipeline? Esta ação irá desativá-lo permanentemente.
              Todos os deals e estágios associados permanecerão no sistema mas este pipeline não estará mais visível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pipelineToDelete) {
                  deletePipeline(pipelineToDelete);
                  setPipelineToDelete(null);
                }
              }}
              disabled={isDeletingPipeline}
            >
              {isDeletingPipeline ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}