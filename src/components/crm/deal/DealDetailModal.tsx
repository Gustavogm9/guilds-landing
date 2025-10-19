import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp,
  MessageSquare,
  Building2,
  Mail,
  Phone,
  User,
  Edit,
  FileText,
  Activity,
  History,
  Plus,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CRMDeal, useCRM } from '@/hooks/useCRM';
import { useCRMAuditLog, CRMAuditLog } from '@/hooks/useCRMAuditLog';
import { useProposals } from '@/hooks/useProposals';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { AuditLogTimeline } from '../audit/AuditLogTimeline';
import { EditHistoricalEventModal } from '../audit/EditHistoricalEventModal';
import { AddManualEventModal } from '../audit/AddManualEventModal';

interface DealDetailModalProps {
  deal: CRMDeal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (deal: CRMDeal) => void;
}

export function DealDetailModal({ 
  deal, 
  open, 
  onOpenChange, 
  onEdit 
}: DealDetailModalProps) {
  const { fetchContactInteractions, markDealAsClosed, isMarkingDealAsClosed } = useCRM(); // Deal closing
  const { useDealAuditLogs } = useCRMAuditLog();
  const { useProposalsByDeal } = useProposals();
  const [editingLog, setEditingLog] = useState<CRMAuditLog | null>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const { data: interactions = [] } = useQuery({
    queryKey: ['deal-interactions', deal?.contact?.id],
    queryFn: () => deal?.contact ? fetchContactInteractions(deal.contact.id) : Promise.resolve([]),
    enabled: !!deal?.contact
  });

  const { data: auditLogs = [], isLoading: auditLogsLoading } = useDealAuditLogs(deal?.id || '');
  const { data: proposals = [], isLoading: proposalsLoading } = useProposalsByDeal(deal?.id || '');

  if (!deal) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: deal.currency || 'BRL'
    }).format(value);
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{deal.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {deal.value && (
                  <Badge variant="secondary" className="gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(deal.value)}
                  </Badge>
                )}
                {deal.probability > 0 && (
                  <Badge variant="outline">
                    {deal.probability}% de chance
                  </Badge>
                )}
                {deal.source && (
                  <Badge variant="outline">
                    {deal.source}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {deal.is_won === null && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => markDealAsClosed({ dealId: deal.id, isWon: true })}
                    disabled={isMarkingDealAsClosed}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Ganho
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => markDealAsClosed({ dealId: deal.id, isWon: false })}
                    disabled={isMarkingDealAsClosed}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Perdido
                  </Button>
                </>
              )}
              {deal.is_won !== null && (
                <Badge 
                  variant={deal.is_won ? "default" : "destructive"}
                  className="px-3 py-1"
                >
                  {deal.is_won ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Deal Ganho
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Deal Perdido
                    </>
                  )}
                </Badge>
              )}
              <Button variant="outline" onClick={() => onEdit?.(deal)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex-1">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="proposals">Propostas</TabsTrigger>
            <TabsTrigger value="interactions">Interações ({interactions.length})</TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Description */}
              {deal.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descrição</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{deal.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              {deal.contact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(deal.contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{deal.contact.name}</p>
                        {deal.contact.job_title && (
                          <p className="text-sm text-muted-foreground">{deal.contact.job_title}</p>
                        )}
                      </div>
                    </div>
                    
                    {deal.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{deal.contact.email}</span>
                      </div>
                    )}
                    
                    {deal.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{deal.contact.phone}</span>
                      </div>
                    )}
                    
                    {deal.contact.company && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{deal.contact.company}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Deal Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações do Deal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deal.expected_close_date && (
                    <div>
                      <span className="font-medium">Data Prevista de Fechamento: </span>
                      <span>{format(new Date(deal.expected_close_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  )}
                  {deal.business_unit && (
                    <div>
                      <span className="font-medium">Unidade de Negócio: </span>
                      <span>{deal.business_unit}</span>
                    </div>
                  )}
                  {deal.tags && deal.tags.length > 0 && (
                    <div>
                      <span className="font-medium">Tags: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {deal.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                            <p className="text-sm text-muted-foreground">
                              {interaction.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="proposals" className="space-y-4">
              {proposalsLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando propostas...</p>
                </div>
              ) : proposals.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhuma proposta criada para este deal</p>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Proposta
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                proposals.map((proposal: any) => (
                  <Card key={proposal.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{proposal.title}</h4>
                            <Badge variant={
                              proposal.status === 'approved' ? 'default' :
                              proposal.status === 'sent' ? 'secondary' :
                              proposal.status === 'rejected' ? 'destructive' :
                              'outline'
                            }>
                              {proposal.status === 'draft' && 'Rascunho'}
                              {proposal.status === 'internal_review' && 'Revisão'}
                              {proposal.status === 'sent' && 'Enviada'}
                              {proposal.status === 'negotiation' && 'Negociação'}
                              {proposal.status === 'approved' && 'Aprovada'}
                              {proposal.status === 'rejected' && 'Rejeitada'}
                              {proposal.status === 'expired' && 'Expirada'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{proposal.proposal_number}</span>
                            <span>•</span>
                            <span>Versão {proposal.current_version}</span>
                            <span>•</span>
                            <span>
                              Válida até {format(new Date(proposal.valid_until), 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/admin/propostas/${proposal.id}`} target="_blank">
                            Ver Detalhes
                          </a>
                        </Button>
                      </div>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="font-medium">Criado em: </span>
                    <span>{format(new Date(deal.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
                  <div>
                    <span className="font-medium">Última atualização: </span>
                    <span>{format(new Date(deal.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                  </div>
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
        defaultEntityType="deal"
        defaultEntityId={deal.id}
      />
    </Dialog>
  );
}
