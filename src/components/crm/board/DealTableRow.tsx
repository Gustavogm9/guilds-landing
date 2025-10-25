import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  Edit,
  Copy,
  Trash2,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CRMDeal, CRMStage } from '@/hooks/useCRM';
import { useCRMContractIntegration } from '@/hooks/useCRMContractIntegration';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCRM } from '@/hooks/useCRM';

interface DealTableRowProps {
  deal: CRMDeal;
  stages: CRMStage[];
  onViewDetails: (deal: CRMDeal) => void;
  onAddInteraction: (deal: CRMDeal) => void;
  onEmailInteraction: (deal: CRMDeal) => void;
  onPhoneInteraction: (deal: CRMDeal) => void;
  onEdit: (deal: CRMDeal) => void;
  onDuplicate: (deal: CRMDeal) => void;
  onDelete: (deal: CRMDeal) => void;
  onScheduleActivity: (deal: CRMDeal) => void;
}

export function DealTableRow({
  deal,
  stages,
  onViewDetails,
  onAddInteraction,
  onEmailInteraction,
  onPhoneInteraction,
  onEdit,
  onDuplicate,
  onDelete,
  onScheduleActivity,
}: DealTableRowProps) {
  const { generateContractFromDeal, isGenerating } = useCRMContractIntegration();
  const { markDealAsClosed, isMarkingDealAsClosed } = useCRM();
  
  const existingContractId = deal.legal_contract?.id || null;
  const currentStage = stages.find(s => s.id === deal.stage_id);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return '-';
    }
  };

  const getLeadScoreBadge = (score: number | undefined) => {
    if (!score) return <Badge variant="outline">-</Badge>;
    
    if (score >= 80) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">🔥 {score}</Badge>;
    } else if (score >= 50) {
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">⚡ {score}</Badge>;
    } else {
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">❄️ {score}</Badge>;
    }
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

  const handleMarkAsWon = async () => {
    await markDealAsClosed({ dealId: deal.id, isWon: true });
  };

  const handleMarkAsLost = async () => {
    await markDealAsClosed({ dealId: deal.id, isWon: false });
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onViewDetails(deal)}
    >
      {/* Contact */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(deal.contact?.name || 'N/A')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-semibold truncate">{deal.contact?.name || 'N/A'}</div>
            <div className="text-sm text-muted-foreground truncate">
              {deal.contact?.company || '-'}
            </div>
          </div>
        </div>
      </TableCell>

      {/* Deal Title */}
      <TableCell>
        <div className="min-w-0">
          <div className="font-medium truncate">{deal.title}</div>
          {deal.description && (
            <div className="text-sm text-muted-foreground truncate">
              {deal.description}
            </div>
          )}
        </div>
      </TableCell>

      {/* Value */}
      <TableCell className="text-right font-semibold">
        {formatCurrency(deal.value)}
      </TableCell>

      {/* Probability */}
      <TableCell className="text-center">
        <Badge variant="outline">
          {deal.probability || 0}%
        </Badge>
      </TableCell>

      {/* Stage */}
      <TableCell>
        <Badge 
          style={{ 
            backgroundColor: `${currentStage?.color || '#6366f1'}20`,
            color: currentStage?.color || '#6366f1',
            borderColor: `${currentStage?.color || '#6366f1'}40`
          }}
          className="border"
        >
          {currentStage?.name || 'Sem stage'}
        </Badge>
      </TableCell>

      {/* Expected Close Date */}
      <TableCell className="text-center">
        {formatDate(deal.expected_close_date)}
      </TableCell>

      {/* Lead Score */}
      <TableCell className="text-center">
        {getLeadScoreBadge(deal.contact?.lead_score)}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-2">
          {/* Contract Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleContractAction();
            }}
            disabled={isGenerating}
          >
            <FileText className="h-4 w-4" />
            {existingContractId && (
              <Badge variant="secondary" className="ml-2 text-xs">
                ✓
              </Badge>
            )}
          </Button>

          {/* Proposal Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/admin/propostas?dealId=${deal.id}`;
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onViewDetails(deal)}>
                <Eye className="h-4 w-4 mr-2" />
                Ver detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddInteraction(deal)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Adicionar interação
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEmailInteraction(deal)}>
                <Mail className="h-4 w-4 mr-2" />
                Enviar e-mail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPhoneInteraction(deal)}>
                <Phone className="h-4 w-4 mr-2" />
                Registrar ligação
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onScheduleActivity(deal)}>
                <Calendar className="h-4 w-4 mr-2" />
                Agendar atividade
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleMarkAsWon} disabled={isMarkingDealAsClosed}>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Marcar como Ganho
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMarkAsLost} disabled={isMarkingDealAsClosed}>
                <XCircle className="h-4 w-4 mr-2 text-red-600" />
                Marcar como Perdido
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(deal)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(deal)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(deal)} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
