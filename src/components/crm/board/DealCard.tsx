import React, { useState, useEffect } from 'react';
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
  Clock
} from 'lucide-react';
import { CRMDeal } from '@/hooks/useCRM';
import { useCRMContractIntegration } from '@/hooks/useCRMContractIntegration';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  onDelete
}: DealCardProps) {
  const { generateContractFromDeal, checkExistingContract, isGenerating } = useCRMContractIntegration();
  const [existingContractId, setExistingContractId] = useState<string | null>(null);
  const [checkingContract, setCheckingContract] = useState(false);

  // Check if contract already exists for this deal
  useEffect(() => {
    const checkContract = async () => {
      setCheckingContract(true);
      try {
        const contractId = await checkExistingContract(deal.id);
        setExistingContractId(contractId);
      } catch (error) {
        console.error('Erro ao verificar contrato:', error);
      } finally {
        setCheckingContract(false);
      }
    };

    checkContract();
  }, [deal.id, checkExistingContract]);

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
      // Navigate to existing contract
      window.location.href = `/admin/contratos?id=${existingContractId}`;
    } else {
      // Generate new contract
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
          <CardContent className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                  {deal.title}
                </h4>
                
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
                    disabled={isGenerating || checkingContract}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {checkingContract ? (
                      'Verificando...'
                    ) : existingContractId ? (
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
            <div className="flex flex-col gap-2 pt-2 border-t sm:flex-row">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-center sm:flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddInteraction?.(deal);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Nova Interação
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full justify-center sm:flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(deal);
                }}
              >
                Ver Detalhes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}