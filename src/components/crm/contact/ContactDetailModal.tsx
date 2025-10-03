import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  TrendingUp, 
  Target,
  MessageSquare,
  Clock,
  DollarSign,
  Star,
  Activity,
  Globe,
  Linkedin,
  Twitter,
  Edit,
  History,
  Plus
} from 'lucide-react';
import { CRMContact, CRMContactInteraction, useCRM } from '@/hooks/useCRM';
import { useCRMAuditLog, CRMAuditLog } from '@/hooks/useCRMAuditLog';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { AuditLogTimeline } from '../audit/AuditLogTimeline';
import { EditHistoricalEventModal } from '../audit/EditHistoricalEventModal';
import { AddManualEventModal } from '../audit/AddManualEventModal';

interface ContactDetailModalProps {
  contact: CRMContact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (contact: CRMContact) => void;
}

export function ContactDetailModal({ 
  contact, 
  open, 
  onOpenChange, 
  onEdit 
}: ContactDetailModalProps) {
  const { fetchContactInteractions, fetchProductInterests } = useCRM();
  const { useContactAuditLogs } = useCRMAuditLog();
  const [editingLog, setEditingLog] = useState<CRMAuditLog | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const { data: interactions = [] } = useQuery({
    queryKey: ['contact-interactions', contact?.id],
    queryFn: () => contact ? fetchContactInteractions(contact.id) : Promise.resolve([]),
    enabled: !!contact
  });

  const { data: productInterests = [] } = useQuery({
    queryKey: ['product-interests', contact?.id],
    queryFn: () => contact ? fetchProductInterests(contact.id) : Promise.resolve([]),
    enabled: !!contact
  });

  const { data: auditLogs = [], isLoading: auditLogsLoading } = useContactAuditLogs(contact?.id || '');

  if (!contact) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLifecycleColor = (stage?: string) => {
    switch (stage) {
      case 'lead': return 'bg-gray-500';
      case 'mql': return 'bg-blue-500';
      case 'sql': return 'bg-purple-500';
      case 'customer': return 'bg-green-500';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLifecycleLabel = (stage?: string) => {
    switch (stage) {
      case 'lead': return 'Lead';
      case 'mql': return 'MQL';
      case 'sql': return 'SQL';
      case 'customer': return 'Cliente';
      case 'closed_lost': return 'Perdido';
      default: return 'Lead';
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'form': return <User className="h-4 w-4" />;
      case 'newsletter': return <Mail className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getProductCategoryLabel = (category: string) => {
    switch (category) {
      case 'software_apps': return 'Software & Apps';
      case 'automacao_ia': return 'Automação IA';
      case 'jogos_gamificacao': return 'Jogos & Gamificação';
      case 'consultoria': return 'Consultoria';
      case 'workshops': return 'Workshops';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {getInitials(contact.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{contact.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getLifecycleColor(contact.lifecycle_stage)} text-white`}
                  >
                    {getLifecycleLabel(contact.lifecycle_stage)}
                  </Badge>
                  {contact.lead_score && contact.lead_score > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" />
                      {contact.lead_score} pontos
                    </Badge>
                  )}
                  {contact.lead_source && (
                    <Badge variant="outline">
                      {contact.lead_source}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => onEdit?.(contact)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="interactions">Interações ({interactions.length})</TabsTrigger>
            <TabsTrigger value="interests">Produtos</TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.company}</span>
                    </div>
                  )}
                  {contact.job_title && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.job_title}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {contact.engagement_score || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Score de Engajamento</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">
                        {contact.icp_score || 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">ICP Match</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">
                        {contact.lead_score || 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Lead Score</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Comerciais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.budget_range && (
                    <div>
                      <span className="font-medium">Faixa de Orçamento: </span>
                      <span>{contact.budget_range}</span>
                    </div>
                  )}
                  {contact.decision_timeline && (
                    <div>
                      <span className="font-medium">Timeline de Decisão: </span>
                      <span>{contact.decision_timeline}</span>
                    </div>
                  )}
                  {contact.company_size && (
                    <div>
                      <span className="font-medium">Tamanho da Empresa: </span>
                      <span>{contact.company_size}</span>
                    </div>
                  )}
                  {contact.industry && (
                    <div>
                      <span className="font-medium">Setor: </span>
                      <span>{contact.industry}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pain Points */}
              {contact.pain_points && contact.pain_points.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Dores Identificadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {contact.pain_points.map((pain, index) => (
                        <Badge key={index} variant="secondary">
                          {pain}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              {interactions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma interação registrada</p>
                  </CardContent>
                </Card>
              ) : (
                interactions.map((interaction) => (
                  <Card key={interaction.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getInteractionIcon(interaction.interaction_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{interaction.subject || 'Sem título'}</h4>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(interaction.interaction_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                          {interaction.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {interaction.description}
                            </p>
                          )}
                          {interaction.outcome && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Resultado: </span>
                              <span className="text-sm">{interaction.outcome}</span>
                            </div>
                          )}
                          {interaction.next_steps && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Próximos passos: </span>
                              <span className="text-sm">{interaction.next_steps}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="interests" className="space-y-4">
              {productInterests.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum produto de interesse registrado</p>
                  </CardContent>
                </Card>
              ) : (
                productInterests.map((interest) => (
                  <Card key={interest.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">
                          {getProductCategoryLabel(interest.product_category)}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Interesse:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= interest.interest_level
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {interest.specific_products && interest.specific_products.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-muted-foreground">Produtos específicos: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {interest.specific_products.map((product, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {interest.budget_indicated && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Orçamento indicado: </span>
                            <span className="text-sm">R$ {interest.budget_indicated.toLocaleString()}</span>
                          </div>
                        )}
                        {interest.timeline_indicated && (
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Timeline: </span>
                            <span className="text-sm">{interest.timeline_indicated}</span>
                          </div>
                        )}
                      </div>

                      {interest.notes && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-muted-foreground">Observações: </span>
                          <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded mt-1">
                            {interest.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Histórico de Alterações</h3>
                <Button variant="outline" size="sm" onClick={() => setShowAddEventModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Evento Manual
                </Button>
              </div>
              {auditLogsLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando histórico...</p>
                </div>
              ) : (
                <AuditLogTimeline 
                  logs={auditLogs} 
                  onEditEvent={(log) => setEditingLog(log)}
                />
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {/* Next Action */}
              {contact.next_action && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Próxima Ação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2">{contact.next_action}</p>
                    {contact.next_action_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(contact.next_action_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {contact.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {contact.notes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* System Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Criado em: </span>
                    <span>{format(new Date(contact.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                  <div>
                    <span className="font-medium">Última atualização: </span>
                    <span>{format(new Date(contact.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                  {contact.last_interaction_date && (
                    <div>
                      <span className="font-medium">Última interação: </span>
                      <span>{format(new Date(contact.last_interaction_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                    </div>
                  )}
                  {contact.source && (
                    <div>
                      <span className="font-medium">Fonte original: </span>
                      <span>{contact.source}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>

      {/* Modals */}
      <EditHistoricalEventModal
        log={editingLog}
        open={!!editingLog}
        onOpenChange={(open) => !open && setEditingLog(null)}
      />
      
      <AddManualEventModal
        open={showAddEventModal}
        onOpenChange={setShowAddEventModal}
        defaultEntityType="contact"
        defaultEntityId={contact.id}
      />
    </Dialog>
  );
}