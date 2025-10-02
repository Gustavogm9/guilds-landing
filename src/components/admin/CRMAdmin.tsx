import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, FileText, Eye, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { useCRM } from '@/hooks/useCRM';
import { PipelineForm } from './PipelineForm';
import { StageForm } from './StageForm';
import { ContactForm } from './ContactForm';
import { EnhancedContactCard } from '@/components/crm/contact/EnhancedContactCard';
import { ContactDetailModal } from '@/components/crm/contact/ContactDetailModal';
import { useNavigate } from 'react-router-dom';

export default function CRMAdmin() {
  const navigate = useNavigate();
  const { 
    pipelines, 
    contacts, 
    pipelinesLoading, 
    contactsLoading,
    createPipeline,
    isCreatingPipeline,
    createContact,
    isCreatingContact
  } = useCRM();

  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
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
                {pipelinesLoading ? 'Carregando...' : `${pipelines?.length || 0} pipelines configurados`}
              </CardDescription>
            </div>
            <Button onClick={() => setShowPipelineForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pipeline
            </Button>
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
                <Card key={pipeline.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: pipeline.color }}
                        />
                        {pipeline.name}
                      </CardTitle>
                      <Badge 
                        variant={pipeline.is_active ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {pipeline.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {pipeline.description || 'Sem descrição'}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {pipeline.type === 'sales' ? 'Vendas' : 
                         pipeline.type === 'support' ? 'Suporte' : 'Projetos'}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPipeline(pipeline.id);
                          setShowStageForm(true);
                        }}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Estágios
                      </Button>
                    </div>
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
        <StageForm
          pipelineId={selectedPipeline}
          open={showStageForm}
          onOpenChange={(open) => {
            setShowStageForm(open);
            if (!open) setSelectedPipeline(null);
          }}
        />
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
    </div>
  );
}