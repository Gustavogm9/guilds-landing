import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface ChangeRequest {
  id: string;
  proposal_id: string;
  from_version: number;
  to_version: number;
  change_type: string;
  requested_by: string;
  notes: string;
  created_at: string;
  proposals: {
    proposal_number: string;
    title: string;
  };
}

export const ChangeRequestsAdmin = () => {
  const navigate = useNavigate();

  const { data: changeRequests, isLoading } = useQuery({
    queryKey: ['proposal_change_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_change_requests')
        .select(`
          *,
          proposals:proposal_id (
            proposal_number,
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ChangeRequest[];
    },
  });


  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitações de Alteração</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as solicitações de ajustes feitas pelos clientes nas propostas.
        </p>
      </div>

      <div className="grid gap-4">
        {changeRequests?.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {request.proposals.proposal_number} - {request.proposals.title}
                  </CardTitle>
                  <CardDescription>
                    De v{request.from_version} para v{request.to_version} • {format(new Date(request.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{request.change_type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Notas:</span>
                </div>
                <p className="text-sm bg-muted p-3 rounded-md">{request.notes}</p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Por: {request.requested_by}
                </span>
                <Button
                  onClick={() =>
                    navigate(`/admin/propostas/${request.proposal_id}/versao/${request.to_version}`)
                  }
                >
                  Criar Nova Versão
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {changeRequests?.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma solicitação de alteração no momento.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
