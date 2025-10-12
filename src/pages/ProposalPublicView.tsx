import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, MessageCircle, Download, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { SEOHead } from '@/components/seo/SEOHead';

export default function ProposalPublicView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [version, setVersion] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState('');
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token inválido ou ausente');
      setLoading(false);
      return;
    }

    loadProposal();
  }, [token]);

  const loadProposal = async () => {
    try {
      // Buscar versão publicada via token
      const { data: versionData, error: versionError } = await supabase
        .from('proposal_versions')
        .select('*')
        .eq('published_token', token)
        .gt('published_expires_at', new Date().toISOString())
        .single();

      if (versionError) throw new Error('Proposta não encontrada ou expirada');

      setVersion(versionData);

      // Buscar dados da proposta
      const { data: proposalData, error: proposalError } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', versionData.proposal_id)
        .single();

      if (proposalError) throw proposalError;

      setProposal(proposalData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!version || !proposal) return;

    setApproving(true);
    try {
      // Registrar aprovação
      const { error: approvalError } = await supabase
        .from('proposal_approvals')
        .insert({
          proposal_id: proposal.id,
          version_number: version.version_number,
          approver_type: 'client',
          approver_email: 'cliente@example.com', // TODO: Pegar do contexto
          comments,
          metadata: {
            user_agent: navigator.userAgent,
          },
        });

      if (approvalError) throw approvalError;

      // Atualizar status da proposta
      const { error: updateError } = await supabase
        .from('proposals')
        .update({ status: 'approved' })
        .eq('id', proposal.id);

      if (updateError) throw updateError;

      toast({
        title: 'Proposta aprovada!',
        description: 'Em breve entraremos em contato para os próximos passos.',
      });

      // Recarregar
      await loadProposal();
    } catch (err: any) {
      toast({
        title: 'Erro ao aprovar proposta',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error || !version || !proposal) {
    return (
      <>
        <SEOHead
          title="Proposta não encontrada"
          description="A proposta que você está tentando acessar não foi encontrada ou expirou."
        />
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardHeader>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-center">Proposta não encontrada</CardTitle>
              <CardDescription className="text-center">
                {error || 'A proposta que você está tentando acessar não existe ou expirou.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/')}>
                Voltar para o site
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const isExpired = new Date(proposal.valid_until) < new Date();
  const canApprove = proposal.status === 'sent' && !isExpired;

  return (
    <>
      <SEOHead
        title={`Proposta: ${proposal.title}`}
        description={`Visualize e aprove a proposta comercial ${proposal.proposal_number}`}
        noIndex
      />
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{proposal.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {proposal.proposal_number} • Versão {version.version_number}
                  </CardDescription>
                </div>
                <Badge variant={isExpired ? 'destructive' : 'default'}>
                  {isExpired ? 'Expirada' : `Válida até ${format(new Date(proposal.valid_until), 'dd/MM/yyyy', { locale: ptBR })}`}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* PDF Viewer */}
          {version.pdf_url && (
            <Card>
              <CardHeader>
                <CardTitle>Visualizar Proposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[210/297] bg-muted rounded-lg flex items-center justify-center">
                  <iframe
                    src={version.pdf_url}
                    className="w-full h-full rounded-lg"
                    title="Proposta PDF"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  {version.pdf_url && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={version.pdf_url} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </a>
                    </Button>
                  )}
                  {version.docx_url && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={version.docx_url} download>
                        <Download className="h-4 w-4 mr-2" />
                        Download DOCX
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {proposal.status !== 'approved' && (
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
                <CardDescription>
                  {canApprove
                    ? 'Aprove a proposta ou solicite ajustes'
                    : 'Esta proposta não pode ser aprovada no momento'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Comentários (opcional)
                  </label>
                  <Textarea
                    placeholder="Adicione comentários ou dúvidas..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    disabled={!canApprove}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleApprove}
                    disabled={!canApprove || approving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approving ? 'Aprovando...' : 'Aprovar Proposta'}
                  </Button>
                  <Button variant="outline" className="flex-1" disabled={!canApprove}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Solicitar Ajuste
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {proposal.status === 'approved' && (
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <CardTitle>Proposta Aprovada!</CardTitle>
                </div>
                <CardDescription>
                  Esta proposta foi aprovada. Em breve entraremos em contato para os próximos passos.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
