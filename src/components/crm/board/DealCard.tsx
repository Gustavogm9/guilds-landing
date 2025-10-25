import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  DollarSign, 
  Mail, 
  MoreHorizontal, 
  Phone, 
  User,
  Building2,
  FileText,
  MessageSquare,
  Flame,
  Snowflake,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CRMDeal, useCRM } from '@/hooks/useCRM';
import { useCRMContractIntegration } from '@/hooks/useCRMContractIntegration';
import { ProposalButton } from './ProposalButton';
import {
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityBadge } from '../activities/ActivityBadge';

interface DealCardProps {
  deal: CRMDeal;
  index: number;
  onViewDetails?: (deal: CRMDeal) => void;
  onAddInteraction?: (deal: CRMDeal) => void;
  onEmailInteraction?: (deal: CRMDeal) => void;
  onPhoneInteraction?: (deal: CRMDeal) => void;
  onEdit?: (deal: CRMDeal) => void;
  onDuplicate?: (deal: CRMDeal) => void;
  onDelete?: (deal: CRMDeal) => void;
  onScheduleActivity?: (deal: CRMDeal) => void;
}

export function DealCard({ 
  deal, 
  index, 
  onViewDetails,
  onAddInteraction,
  onEmailInteraction,
  onPhoneInteraction,
  onEdit,
  onDuplicate,
  onDelete,
  onScheduleActivity
}: DealCardProps) {
  const { generateContractFromDeal, isGenerating } = useCRMContractIntegration();
  const { markDealAsClosed, isMarkingDealAsClosed } = useCRM();
  
  // Use contract data from server-side join
  const existingContractId = deal.legal_contract?.id || null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
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

  const handleContractAction = async () => {
    if (existingContractId) {
      window.location.href = `/admin/contratos?id=${existingContractId}`;
    } else {
      try {
        const contractId = await generateContractFromDeal(deal.id);
        window.location.href = `/admin/contratos?id=${contractId}`;
      } catch (error) {
        console.error('Erro ao gerar contrato:', error);
      }
    }
  };

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-move transition-all hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg rotate-2' : ''
          }`}
        >
          <CardContent className="p-4 space-y-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {deal.title}
                  </h4>
                  <ActivityBadge dealId={deal.id} />
                </div>
                
                {deal.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {deal.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContractAction();
                    }}
                    disabled={isGenerating}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {existingContractId ? (
                      <>
                        <Badge variant="secondary" className="mr-2">
                          Existente
                        </Badge>
                        Ver Contrato
                      </>
                    ) : (
                      isGenerating ? 'Gerando...' : 'Gerar Contrato'
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onScheduleActivity?.(deal);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Atividade
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {deal.is_won === null && (
                    <>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          markDealAsClosed({ dealId: deal.id, isWon: true });
                        }}
                        disabled={isMarkingDealAsClosed}
                        className="text-green-600"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Marcar como Ganho
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          markDealAsClosed({ dealId: deal.id, isWon: false });
                        }}
                        disabled={isMarkingDealAsClosed}
                        className="text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Marcar como Perdido
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(deal);
                    }}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate?.(deal);
                    }}
                  >
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(deal);
                    }}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Value and Probability */}
            {deal.value && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(deal.value)}
                  </span>
                </div>
                
                {deal.probability > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {deal.probability}%
                  </Badge>
                )}
              </div>
            )}

            {/* Contact Info */}
            {deal.contact && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs">
                    {getInitials(deal.contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">
                    {deal.contact.name}
                  </p>
                  
                  {deal.contact.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {deal.contact.company}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {deal.contact.email && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEmailInteraction?.(deal);
                      }}
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {deal.contact.phone && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPhoneInteraction?.(deal);
                      }}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Expected Close Date */}
            {deal.expected_close_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {format(new Date(deal.expected_close_date), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            )}

            {/* Tags */}
            {deal.tags && deal.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {deal.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                
                {deal.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{deal.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Source */}
            {deal.source && (
              <div className="text-xs text-muted-foreground">
                Origem: {deal.source}
              </div>
            )}

            {/* Action Buttons - Responsive */}
            <div className="flex flex-col gap-2 pt-2 border-t sm:flex-row w-full">
              <div className="w-full sm:flex-1">
                <ProposalButton 
                  dealId={deal.id} 
                  contactId={deal.contact_id}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-center sm:flex-1 min-w-0 shrink"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddInteraction?.(deal);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">Nova Interação</span>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-center sm:flex-1 min-w-0 shrink"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(deal);
                }}
              >
                <span className="truncate">Ver Detalhes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}