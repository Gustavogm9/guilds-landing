import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useProposals } from '@/hooks/useProposals';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '@/hooks/useCRM';

interface ProposalButtonProps {
  dealId: string;
  contactId?: string;
}

export const ProposalButton = ({ dealId, contactId }: ProposalButtonProps) => {
  const navigate = useNavigate();
  const { useProposalsByDeal } = useProposals();
  const { data: proposals, isLoading } = useProposalsByDeal(dealId);

  const activeProposal = proposals?.find(
    p => !['rejected', 'expired'].includes(p.status)
  );

  if (isLoading) {
    return null;
  }

  const handleCreateProposal = () => {
    const queryParams = new URLSearchParams({
      dealId,
      ...(contactId && { contactId }),
    });
    navigate(`/admin/propostas/nova?${queryParams.toString()}`);
  };

  const handleViewProposal = () => {
    if (activeProposal) {
      navigate(`/admin/propostas/${activeProposal.id}`);
    }
  };

  if (activeProposal) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleViewProposal}
        >
          <FileText className="h-4 w-4" />
          Proposta
        </Button>
        <Badge variant="secondary" className="text-xs">
          v{activeProposal.current_version}
        </Badge>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-muted-foreground"
      onClick={handleCreateProposal}
    >
      <FileText className="h-4 w-4" />
      Criar Proposta
    </Button>
  );
};
