import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Settings, 
  Users, 
  Workflow, 
  Activity,
  MoreHorizontal,
  Edit,
  Trash
} from 'lucide-react';
import { useCRM } from '@/hooks/useCRM';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PipelineForm } from './PipelineForm';
import { StageForm } from './StageForm';
import { ContactForm } from './ContactForm';

export function CRMAdmin() {
  const [selectedTab, setSelectedTab] = useState('pipelines');
  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [showStageForm, setShowStageForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

  const { 
    pipelines, 
    contacts, 
    pipelinesLoading, 
    contactsLoading,
    fetchStagesByPipeline 
  } = useCRM();

  const { data: stages } = useQuery({
    queryKey: ['crm-stages-admin', selectedPipelineId],
    queryFn: () => selectedPipelineId ? fetchStagesByPipeline(selectedPipelineId) : Promise.resolve([]),
    enabled: !!selectedPipelineId
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">CRM - Administração</h1>
          <p className="text-muted-foreground">
            Configure pipelines, estágios, contatos e campos personalizados
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipelines">
            <Workflow className="h-4 w-4 mr-2" />
            Pipelines
          </TabsTrigger>
          <TabsTrigger value="stages">
            <Settings className="h-4 w-4 mr-2" />
            Estágios
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contatos
          </TabsTrigger>
          <TabsTrigger value="fields">
            <Activity className="h-4 w-4 mr-2" />
            Campos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pipelines</h2>
            
            <Dialog open={showPipelineForm} onOpenChange={setShowPipelineForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Pipeline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Pipeline</DialogTitle>
                </DialogHeader>
                <PipelineForm onSuccess={() => setShowPipelineForm(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              {pipelinesLoading ? (
                <div className="text-center py-8">Carregando pipelines...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pipelines?.map(pipeline => (
                      <TableRow key={pipeline.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: pipeline.color }}
                            />
                            <span className="font-medium">{pipeline.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {pipeline.type === 'sales' ? 'Vendas' : 
                             pipeline.type === 'support' ? 'Suporte' : 'Projetos'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="line-clamp-2">{pipeline.description}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={pipeline.is_active ? "default" : "secondary"}>
                            {pipeline.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedPipelineId(pipeline.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedPipelineId(pipeline.id);
                                  setSelectedTab('stages');
                                }}
                              >
                                <Settings className="h-4 w-4 mr-2" />
                                Configurar Estágios
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Estágios</h2>
              {selectedPipelineId && (
                <p className="text-sm text-muted-foreground">
                  Pipeline: {pipelines?.find(p => p.id === selectedPipelineId)?.name}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <select 
                value={selectedPipelineId}
                onChange={(e) => setSelectedPipelineId(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="">Selecione um pipeline</option>
                {pipelines?.map(pipeline => (
                  <option key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </option>
                ))}
              </select>
              
              <Dialog open={showStageForm} onOpenChange={setShowStageForm}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedPipelineId}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Estágio
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Estágio</DialogTitle>
                  </DialogHeader>
                  <StageForm 
                    pipelineId={selectedPipelineId}
                    onSuccess={() => setShowStageForm(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent>
              {selectedPipelineId ? (
                stages && stages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stages.map((stage, index) => (
                      <Card key={stage.id} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: stage.color }}
                              />
                              {stage.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            {stage.description || 'Sem descrição'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    Nenhum estágio encontrado para este pipeline
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  Selecione um pipeline para ver os estágios
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contatos</h2>
            
            <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Contato
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Contato</DialogTitle>
                </DialogHeader>
                <ContactForm onSuccess={() => setShowContactForm(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              {contactsLoading ? (
                <div className="text-center py-8">Carregando contatos...</div>
              ) : contacts && contacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.email || '-'}</TableCell>
                        <TableCell>{contact.company || '-'}</TableCell>
                        <TableCell>{contact.phone || '-'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  Nenhum contato encontrado
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Campos Personalizados</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Campo
            </Button>
          </div>

          <Card>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Funcionalidade de campos personalizados em desenvolvimento...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}