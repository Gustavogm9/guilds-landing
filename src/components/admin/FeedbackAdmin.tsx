import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFeedback, FeedbackEntry, FeedbackTicket } from '@/hooks/useFeedback';
import { useProjects } from '@/hooks/useProjects';
import { MessageSquare, Bug, Lightbulb, HelpCircle, Star, TrendingUp, Filter, Search, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const FeedbackAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const { fetchAllFeedback, fetchAllTickets, updateFeedbackStatus, updateTicketStatus } = useFeedback();
  const { projects } = useProjects();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [entriesData, ticketsData] = await Promise.all([
          fetchAllFeedback(),
          fetchAllTickets()
        ]);
        setFeedbackEntries(entriesData || []);
        setFeedbackTickets(ticketsData || []);
      } catch (error) {
        console.error('Error loading feedback data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  const getSeverityColor = (severity: string) => {
    const colors = {
      blocker: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
      idea: 'bg-blue-100 text-blue-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityScore = (entry: FeedbackEntry) => {
    if (!entry.rice_score && !entry.wsjf_score) return 'N/A';
    return entry.rice_score || entry.wsjf_score || 'N/A';
  };

  const filteredFeedback = feedbackEntries.filter(entry => {
    const matchesSearch = entry.verbatim.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || entry.severity === filterSeverity;
    
    return matchesSearch && matchesType && matchesStatus && matchesSeverity;
  });

  const filteredTickets = feedbackTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Metrics calculations
  const totalFeedback = feedbackEntries.length;
  const totalTickets = feedbackTickets.length;
  const bugReports = feedbackEntries.filter(e => e.type === 'bug').length;
  const ideas = feedbackEntries.filter(e => e.type === 'ideia').length;
  const avgNPS = feedbackEntries
    .filter(e => e.type === 'nps' && e.score)
    .reduce((acc, e, _, arr) => acc + (e.score || 0) / arr.length, 0);

  const handleStatusChange = async (entryId: string, newStatus: string) => {
    try {
      await updateFeedbackStatus(entryId, newStatus as any);
      setFeedbackEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, status: newStatus as any }
            : entry
        )
      );
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
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
      <div>
        <h2 className="text-2xl font-bold">Gestão de Feedback</h2>
        <p className="text-muted-foreground">
          Gerencie feedbacks, bugs, ideias e tickets de suporte
        </p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFeedback}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bugs Reportados</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bugReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ideias</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ideas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Médio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {avgNPS > 0 ? avgNPS.toFixed(1) : 'N/A'}
            </div>
          </CardContent>
        </Card>
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

            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="blocker">Bloqueante</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="feedback">Feedbacks ({filteredFeedback.length})</TabsTrigger>
          <TabsTrigger value="tickets">Tickets ({filteredTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Priority Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Itens de Alta Prioridade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackEntries
                    .filter(e => e.severity === 'blocker' || e.severity === 'high')
                    .slice(0, 5)
                    .map(entry => {
                      const TypeIcon = getTypeIcon(entry.type);
                      return (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <TypeIcon className="h-4 w-4" />
                            <div>
                              <p className="text-sm font-medium line-clamp-1">{entry.verbatim}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(entry.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <Badge className={getSeverityColor(entry.severity)}>
                            {entry.severity}
                          </Badge>
                        </div>
                      );
                    })}
                  {feedbackEntries.filter(e => e.severity === 'blocker' || e.severity === 'high').length === 0 && (
                    <p className="text-muted-foreground text-sm">Nenhum item de alta prioridade</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedbackEntries
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map(entry => {
                      const TypeIcon = getTypeIcon(entry.type);
                      return (
                        <div key={entry.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <TypeIcon className="h-4 w-4" />
                          <div className="flex-1">
                            <p className="text-sm line-clamp-1">{entry.verbatim}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status}
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum feedback encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros de busca
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
                              {format(new Date(entry.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(entry.status)}>
                              {entry.status === 'new' && 'Novo'}
                              {entry.status === 'triaged' && 'Triado'}
                              {entry.status === 'in_backlog' && 'No Backlog'}
                              {entry.status === 'in_progress' && 'Em Progresso'}
                              {entry.status === 'released' && 'Entregue'}
                              {entry.status === 'wont_fix' && 'Não será feito'}
                            </Badge>
                            
                            <Select
                              value={entry.status}
                              onValueChange={(value) => handleStatusChange(entry.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Novo</SelectItem>
                                <SelectItem value="triaged">Triado</SelectItem>
                                <SelectItem value="in_backlog">No Backlog</SelectItem>
                                <SelectItem value="in_progress">Em Progresso</SelectItem>
                                <SelectItem value="released">Entregue</SelectItem>
                                <SelectItem value="wont_fix">Não será feito</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {entry.score && (
                              <Badge variant="outline">
                                {entry.type === 'csat' ? `${entry.score}/5` : `${entry.score}/10`}
                              </Badge>
                            )}
                            
                            {entry.severity && (
                              <Badge className={getSeverityColor(entry.severity)}>
                                {entry.severity === 'blocker' && 'Bloqueante'}
                                {entry.severity === 'high' && 'Alta'}
                                {entry.severity === 'medium' && 'Média'}
                                {entry.severity === 'low' && 'Baixa'}
                                {entry.severity === 'idea' && 'Ideia'}
                              </Badge>
                            )}
                            
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Prioridade: {getPriorityScore(entry)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm leading-relaxed mb-4">{entry.verbatim}</p>
                      
                      {entry.resolution_note && (
                        <div className="p-3 bg-muted rounded-lg">
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
                    Tente ajustar os filtros de busca
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
                        <CardDescription>
                          {format(new Date(ticket.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={
                          ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                          ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'solved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {ticket.status === 'open' && 'Aberto'}
                          {ticket.status === 'pending' && 'Pendente'}
                          {ticket.status === 'solved' && 'Resolvido'}
                          {ticket.status === 'closed' && 'Fechado'}
                        </Badge>
                        
                        <Badge className={
                          ticket.priority === 'low' ? 'bg-green-100 text-green-800' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }>
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