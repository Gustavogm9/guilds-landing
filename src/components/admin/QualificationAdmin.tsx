import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  BarChart3, 
  MessageSquare,
  Save,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useQualificationForm } from '@/hooks/useQualificationForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FormSubmission {
  id: string;
  form_data: any;
  source_page: string;
  created_at: string;
  status: string;
}

export const QualificationAdmin = () => {
  const { forms, companySettings, fetchForms, fetchCompanySettings } = useQualificationForm();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [isViewingSubmission, setIsViewingSubmission] = useState(false);
  
  // Company Settings State
  const [settingsForm, setSettingsForm] = useState({
    whatsapp_number: '',
    company_name: '',
    support_email: '',
    brand_primary_color: '',
    brand_accent_color: ''
  });

  // Stats State
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    thisWeekSubmissions: 0,
    conversionRate: 0,
    avgResponseTime: 0
  });

  // Load data
  useEffect(() => {
    fetchSubmissions();
    fetchStats();
    
    if (companySettings) {
      setSettingsForm({
        whatsapp_number: companySettings.whatsapp_number,
        company_name: companySettings.company_name,
        support_email: companySettings.support_email,
        brand_primary_color: companySettings.brand_primary_color,
        brand_accent_color: companySettings.brand_accent_color
      });
    }
  }, [companySettings]);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('qualification_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as submissões.",
        variant: "destructive"
      });
    }
  };

  const fetchStats = async () => {
    try {
      // Get total submissions
      const { count: totalSubmissions } = await supabase
        .from('qualification_submissions')
        .select('*', { count: 'exact', head: true });

      // Get this week's submissions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { count: thisWeekSubmissions } = await supabase
        .from('qualification_submissions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString());

      setStats({
        totalSubmissions: totalSubmissions || 0,
        thisWeekSubmissions: thisWeekSubmissions || 0,
        conversionRate: 15.2, // Mock data - calculate based on page views
        avgResponseTime: 2.5 // Mock data - hours
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateCompanySettings = async () => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .update(settingsForm)
        .eq('id', companySettings?.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações da empresa atualizadas com sucesso."
      });

      fetchCompanySettings();
    } catch (error) {
      console.error('Error updating company settings:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as configurações.",
        variant: "destructive"
      });
    }
  };

  const updateSubmissionStatus = async (submissionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('qualification_submissions')
        .update({ status: newStatus })
        .eq('id', submissionId);

      if (error) throw error;

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: newStatus }
            : sub
        )
      );

      toast({
        title: "Sucesso",
        description: "Status da submissão atualizado."
      });
    } catch (error) {
      console.error('Error updating submission status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'outline';
      case 'converted': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Formulários de Qualificação</h1>
          <p className="text-muted-foreground">
            Gerencie formulários, leads e configurações do sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Dashboard</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="forms">Formulários</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Analytics Dashboard */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                  <p className="text-sm text-muted-foreground">Total de Leads</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeekSubmissions}</p>
                  <p className="text-sm text-muted-foreground">Esta Semana</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgResponseTime}h</p>
                  <p className="text-sm text-muted-foreground">Tempo Resposta</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Leads Management */}
        <TabsContent value="leads" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Leads Capturados</h2>
            <Button onClick={fetchSubmissions} variant="outline">
              Atualizar Lista
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.form_data.name || '-'}
                    </TableCell>
                    <TableCell>{submission.form_data.email || '-'}</TableCell>
                    <TableCell>{submission.form_data.company || '-'}</TableCell>
                    <TableCell>{submission.source_page}</TableCell>
                    <TableCell>
                      {format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(submission.status)}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsViewingSubmission(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {submission.form_data.email && (
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <a href={`mailto:${submission.form_data.email}`}>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Forms Management */}
        <TabsContent value="forms" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Formulários Configurados</h2>
            <Button>
              <Plus className="mr-2 w-4 h-4" />
              Novo Formulário
            </Button>
          </div>

          <div className="grid gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">{form.name}</h3>
                    <p className="text-muted-foreground">{form.description}</p>
                    <div className="flex items-center gap-4">
                      <Badge variant={form.is_active ? "default" : "secondary"}>
                        {form.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                      {form.page_paths && (
                        <Badge variant="outline">
                          {form.page_paths.length} páginas
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Configurações da Empresa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="company_name">Nome da Empresa</Label>
                <Input
                  id="company_name"
                  value={settingsForm.company_name}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <Label htmlFor="support_email">E-mail de Suporte</Label>
                <Input
                  id="support_email"
                  type="email"
                  value={settingsForm.support_email}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, support_email: e.target.value }))}
                  placeholder="contato@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="whatsapp_number">WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  value={settingsForm.whatsapp_number}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                  placeholder="+5511999999999"
                />
              </div>

              <div>
                <Label htmlFor="brand_primary_color">Cor Primária</Label>
                <Input
                  id="brand_primary_color"
                  value={settingsForm.brand_primary_color}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, brand_primary_color: e.target.value }))}
                  placeholder="hsl(240, 85%, 55%)"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="brand_accent_color">Cor de Destaque</Label>
                <Input
                  id="brand_accent_color"
                  value={settingsForm.brand_accent_color}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, brand_accent_color: e.target.value }))}
                  placeholder="hsl(165, 85%, 45%)"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={updateCompanySettings} className="btn-forge">
                <Save className="mr-2 w-4 h-4" />
                Salvar Configurações
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submission Details Modal */}
      <Dialog open={isViewingSubmission} onOpenChange={setIsViewingSubmission}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
            <DialogDescription>
              Informações completas da submissão
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Submissão</Label>
                  <p className="text-sm font-medium">
                    {format(new Date(selectedSubmission.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label>Página de Origem</Label>
                  <p className="text-sm font-medium">{selectedSubmission.source_page}</p>
                </div>
              </div>
              
              <div>
                <Label>Dados do Formulário</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <pre className="text-sm">
                    {JSON.stringify(selectedSubmission.form_data, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingSubmission(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};