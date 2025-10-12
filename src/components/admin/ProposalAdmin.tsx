import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useProposals } from '@/hooks/useProposals';
import { FileText, Plus, Search, Eye, Edit, Send, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const statusColors = {
  draft: 'secondary',
  internal_review: 'outline',
  sent: 'default',
  negotiation: 'outline',
  approved: 'default',
  rejected: 'destructive',
  expired: 'secondary',
} as const;

const statusLabels = {
  draft: 'Rascunho',
  internal_review: 'Revisão Interna',
  sent: 'Enviada',
  negotiation: 'Negociação',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  expired: 'Expirada',
};

export const ProposalAdmin = () => {
  const navigate = useNavigate();
  const { proposals, proposalsLoading } = useProposals();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProposals = proposals?.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.proposal_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Propostas Comerciais</h2>
          <p className="text-muted-foreground">Gerencie propostas modulares e versionadas</p>
        </div>
        <Button onClick={() => navigate('/admin/proposals/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todas as Propostas</CardTitle>
              <CardDescription>
                {proposals?.length || 0} proposta(s) cadastrada(s)
              </CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {proposalsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : filteredProposals && filteredProposals.length > 0 ? (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-lg">{proposal.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {proposal.proposal_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Versão {proposal.current_version}</span>
                        <span>•</span>
                        <span>
                          Válida até:{' '}
                          {format(new Date(proposal.valid_until), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          Criada em:{' '}
                          {format(new Date(proposal.created_at), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={statusColors[proposal.status]}>
                          {statusLabels[proposal.status]}
                        </Badge>
                        {proposal.flags.partnership && (
                          <Badge variant="outline">Parceria</Badge>
                        )}
                        {proposal.flags.whitelabel && (
                          <Badge variant="outline">Whitelabel</Badge>
                        )}
                        {proposal.flags.maintenanceEnabled && (
                          <Badge variant="outline">Manutenção</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/proposals/${proposal.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/proposals/${proposal.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {proposal.status === 'draft' && (
                        <Button variant="ghost" size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {proposal.status === 'sent' && (
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma proposta encontrada
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
