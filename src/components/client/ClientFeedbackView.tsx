import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeedbackWidget } from '@/components/feedback/FeedbackWidget';
import { useFeedback, FeedbackEntry, FeedbackTicket } from '@/hooks/useFeedback';
import { useProjects } from '@/hooks/useProjects';
import { MessageSquare, Bug, Lightbulb, HelpCircle, Star, Calendar, User, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientFeedbackViewProps {
  projectId: string;
  contactId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'gestor' | 'usuario_final' | 'parceiro';
  };
}

export const ClientFeedbackView: React.FC<ClientFeedbackViewProps> = ({
  projectId,
  contactId,
  user
}) => {
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>([]);
  const [feedbackModules, setFeedbackModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { fetchFeedbackByProject, fetchFeedbackModulesByProject } = useProjects();
  const { fetchTicketsByProject } = useFeedback();

  useEffect(() => {
    const loadFeedbackData = async () => {
      if (!projectId) return;

      setLoading(true);
      try {
        const [entriesData, ticketsData, modulesData] = await Promise.all([
          fetchFeedbackByProject(projectId),
          fetchTicketsByProject(projectId),
          fetchFeedbackModulesByProject(projectId)
        ]);

        // Filter feedback entries by contact if available
        const filteredEntries = contactId 
          ? entriesData?.filter(entry => entry.contact_id === contactId) || []
          : entriesData || [];

        const filteredTickets = contactId
          ? ticketsData?.filter(ticket => ticket.contact_id === contactId) || []
          : ticketsData || [];

        // Type cast to ensure proper typing
        setFeedbackEntries(filteredEntries.map(entry => ({
          ...entry,
          persona: entry.persona as 'gestor' | 'usuario_final' | 'parceiro',
          channel: entry.channel as 'inapp' | 'whatsapp' | 'email' | 'import' | 'api',
          type: entry.type as 'bug' | 'ideia' | 'duvida' | 'srs' | 'nps' | 'csat' | 'ces' | 'pmf' | 'usability',
          severity: entry.severity as 'blocker' | 'high' | 'medium' | 'low' | 'idea',
          status: entry.status as 'new' | 'triaged' | 'in_backlog' | 'in_progress' | 'released' | 'wont_fix',
          attachments: Array.isArray(entry.attachments) ? entry.attachments : JSON.parse(entry.attachments as string || '[]'),
          context: typeof entry.context === 'object' ? entry.context : JSON.parse(entry.context as string || '{}'),
          ip_address: entry.ip_address as string || '',
          user_agent: entry.user_agent as string || ''
        })));
        setFeedbackTickets(filteredTickets);
        setFeedbackModules(modulesData || []);
      } catch (error) {
        console.error('Error loading feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbackData();
  }, [projectId, contactId]);

  const getTypeIcon = (type: string) => {
    const icons = {
      bug: Bug,
      ideia: Lightbulb,
      duvida: HelpCircle,
      srs: MessageSquare,
      nps: Star,
      csat: Star,
      ces: Star,
      pmf: Star,
      usability: MessageSquare
    };
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      triaged: 'bg-yellow-100 text-yellow-800',
      in_backlog: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-orange-100 text-orange-800',
      released: 'bg-green-100 text-green-800',
      wont_fix: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTicketStatusColor = (status: string) => {
    const colors = {
      open: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      solved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredFeedback = feedbackEntries.filter(entry => {
    const matchesSearch = entry.verbatim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredTickets = feedbackTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Central de Feedback</h2>
          <p className="text-muted-foreground">
            Compartilhe sua experiência e acompanhe o progresso das suas sugestões
          </p>
        </div>
        
        {/* Floating Feedback Widget */}
        <FeedbackWidget
          projectKey={projectId}
          contactId={contactId}
          user={user}
          position="inline"
          className="w-80"
          featureFlags={{
            srs: true,
            nps: true,
            attachments: true,
            ideas: true,
            questions: true
          }}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="ideia">Ideia</SelectItem>
                <SelectItem value="duvida">Dúvida</SelectItem>
                <SelectItem value="srs">Sprint Review</SelectItem>
                <SelectItem value="nps">NPS</SelectItem>
                <SelectItem value="csat">CSAT</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novo</SelectItem>
                <SelectItem value="triaged">Triado</SelectItem>
                <SelectItem value="in_backlog">No Backlog</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="released">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Meus Feedbacks ({feedbackEntries.length})
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Tickets de Suporte ({feedbackTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum feedback encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Use o widget ao lado para enviar seu primeiro feedback'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((entry) => {
                const TypeIcon = getTypeIcon(entry.type);
                
                return (
                  <Card key={entry.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">
                              {entry.type === 'bug' && 'Bug Report'}
                              {entry.type === 'ideia' && 'Sugestão'}
                              {entry.type === 'duvida' && 'Pergunta'}
                              {entry.type === 'srs' && 'Sprint Review'}
                              {entry.type === 'nps' && 'NPS'}
                              {entry.type === 'csat' && 'CSAT'}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                              {(entry as any).module && (
                                <>
                                  <span>•</span>
                                  <span>{((entry as any).module as any).name}</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status === 'new' && 'Novo'}
                            {entry.status === 'triaged' && 'Triado'}
                            {entry.status === 'in_backlog' && 'No Backlog'}
                            {entry.status === 'in_progress' && 'Em Progresso'}
                            {entry.status === 'released' && 'Entregue'}
                            {entry.status === 'wont_fix' && 'Não será feito'}
                          </Badge>
                          
                          {entry.score && (
                            <Badge variant="outline">
                              {entry.type === 'csat' ? `${entry.score}/5` : `${entry.score}/10`}
                            </Badge>
                          )}
                          
                          {entry.severity && entry.type === 'bug' && (
                            <Badge variant={entry.severity === 'high' || entry.severity === 'blocker' ? 'destructive' : 'secondary'}>
                              {entry.severity === 'blocker' && 'Bloqueante'}
                              {entry.severity === 'high' && 'Alta'}
                              {entry.severity === 'medium' && 'Média'}
                              {entry.severity === 'low' && 'Baixa'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm leading-relaxed">{entry.verbatim}</p>
                      
                      {entry.resolution_note && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Resolução:</h4>
                          <p className="text-sm">{entry.resolution_note}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum ticket encontrado</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterStatus !== 'all'
                      ? 'Tente ajustar os filtros de busca'
                      : 'Você não possui tickets de suporte ativos'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{ticket.subject}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getTicketStatusColor(ticket.status)}>
                          {ticket.status === 'open' && 'Aberto'}
                          {ticket.status === 'pending' && 'Pendente'}
                          {ticket.status === 'solved' && 'Resolvido'}
                          {ticket.status === 'closed' && 'Fechado'}
                        </Badge>
                        
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === 'low' && 'Baixa'}
                          {ticket.priority === 'medium' && 'Média'}
                          {ticket.priority === 'high' && 'Alta'}
                          {ticket.priority === 'urgent' && 'Urgente'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm leading-relaxed">{ticket.description}</p>
                    
                    {ticket.resolution_note && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Resolução:</h4>
                        <p className="text-sm">{ticket.resolution_note}</p>
                      </div>
                    )}

                    {ticket.csat_score && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Avaliação do suporte:</span>
                        <Badge variant="outline">{ticket.csat_score}/5 ⭐</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};