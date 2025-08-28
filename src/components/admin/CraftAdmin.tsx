import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  Mail, 
  ExternalLink,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';

export const CraftAdmin = () => {
  // Fetch craft ideas
  const { data: ideas = [], isLoading: ideasLoading } = useQuery({
    queryKey: ['admin-craft-ideas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craft_ideas')
        .select(`
          *,
          stage:current_stage(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Fetch partnership inquiries
  const { data: partnerships = [], isLoading: partnershipsLoading } = useQuery({
    queryKey: ['admin-craft-partnerships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('craft_partnership_inquiries')
        .select(`
          *,
          idea:idea_id(title, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Update partnership status
  const updatePartnershipStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('craft_partnership_inquiries')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating partnership status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'reviewing': return 'bg-yellow-500';
      case 'contacted': return 'bg-orange-500';
      case 'negotiating': return 'bg-purple-500';
      case 'accepted': return 'bg-green-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Novo';
      case 'reviewing': return 'Analisando';
      case 'contacted': return 'Contatado';
      case 'negotiating': return 'Negociando';
      case 'accepted': return 'Aceito';
      case 'declined': return 'Recusado';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">{ideas.length}</div>
            <div className="text-sm text-muted-foreground">Projetos Ativos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">{partnerships.length}</div>
            <div className="text-sm text-muted-foreground">Propostas de Parceria</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {partnerships.filter(p => p.status === 'new').length}
            </div>
            <div className="text-sm text-muted-foreground">Novas Propostas</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <div className="text-2xl font-bold mb-1">
              {partnerships.filter(p => p.status === 'accepted').length}
            </div>
            <div className="text-sm text-muted-foreground">Parcerias Aceitas</div>
          </CardContent>
        </Card>
      </div>

      {/* Ideas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Projetos Craft</CardTitle>
        </CardHeader>
        <CardContent>
          {ideasLoading ? (
            <div className="text-center py-8">Carregando projetos...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ideas.map((idea) => (
                  <TableRow key={idea.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{idea.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {idea.problem_thesis}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {idea.stage && (
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: idea.stage.color, color: 'white' }}
                        >
                          {idea.stage.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {idea.estimated_timeline}
                    </TableCell>
                    <TableCell className="text-sm">
                      {idea.estimated_investment}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(idea.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={`/craft/ideias/${idea.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Partnership Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Propostas de Parceria</CardTitle>
        </CardHeader>
        <CardContent>
          {partnershipsLoading ? (
            <div className="text-center py-8">Carregando propostas...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parceiro</TableHead>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partnerships.map((partnership) => (
                  <TableRow key={partnership.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{partnership.partner_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {partnership.partner_email}
                        </div>
                        {partnership.company && (
                          <div className="text-sm text-muted-foreground">
                            {partnership.company}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {partnership.idea ? (
                        <a 
                          href={`/craft/ideias/${partnership.idea.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {partnership.idea.title}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">Geral</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {partnership.partner_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`${getStatusColor(partnership.status)} text-white`}
                      >
                        {getStatusLabel(partnership.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(partnership.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Open modal or expand row to show full message
                            alert(`Mensagem: ${partnership.message}`);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${partnership.partner_email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>

                        {partnership.portfolio_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a 
                              href={partnership.portfolio_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};