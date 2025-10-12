import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useProposals } from '@/hooks/useProposals';
import { Badge } from '@/components/ui/badge';

interface ProposalButtonProps {
  dealId: string;
  onCreateProposal?: () => void;
}

export const ProposalButton = ({ dealId, onCreateProposal }: ProposalButtonProps) => {
  const { useProposalsByDeal } = useProposals();
  const { data: proposals, isLoading } = useProposalsByDeal(dealId);

  const activeProposal = proposals?.find(
    p => !['rejected', 'expired'].includes(p.status)
  );

  if (isLoading) {
    return null;
  }

  if (activeProposal) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onCreateProposal}
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
      onClick={onCreateProposal}
    >
      <FileText className="h-4 w-4" />
      Criar Proposta
    </Button>
  );
};
