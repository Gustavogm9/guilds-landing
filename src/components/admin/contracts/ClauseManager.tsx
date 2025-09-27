import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock,
  FileText,
  Tags,
  Settings
} from 'lucide-react';
import { useLegal, LegalClause } from '@/hooks/useLegal';

export const ClauseManager = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClause, setEditingClause] = useState<LegalClause | null>(null);
  const [clausesByGroup, setClausesByGroup] = useState<Record<string, LegalClause[]>>({});

  const [clauseForm, setClauseForm] = useState({
    title: '',
    content_markdown: '',
    group_id: '',
    variables: '[]',
    conditions: '{}',
    tags: '',
    is_locked_by_legal: false
  });

  const {
    clauseGroups,
    fetchClausesByGroup,
    createClause,
    createClauseGroup
  } = useLegal();

  // Load clauses for each group
  useEffect(() => {
    const loadAllClauses = async () => {
      const clausesData: Record<string, LegalClause[]> = {};
      for (const group of clauseGroups) {
        try {
          const clauses = await fetchClausesByGroup(group.id);
          clausesData[group.id] = clauses;
        } catch (error) {
          console.error('Erro ao carregar cláusulas:', error);
        }
      }
      setClausesByGroup(clausesData);
    };

    if (clauseGroups.length > 0) {
      loadAllClauses();
    }
  }, [clauseGroups, fetchClausesByGroup]);

  const handleCreateClause = async () => {
    try {
      await createClause.mutateAsync({
        ...clauseForm,
        variables: JSON.parse(clauseForm.variables || '[]'),
        conditions: JSON.parse(clauseForm.conditions || '{}'),
        tags: clauseForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
      
      // Recarregar cláusulas do grupo
      if (clauseForm.group_id) {
        const updatedClauses = await fetchClausesByGroup(clauseForm.group_id);
        setClausesByGroup(prev => ({
          ...prev,
          [clauseForm.group_id]: updatedClauses
        }));
      }
    } catch (error) {
      console.error('Erro ao criar cláusula:', error);
    }
  };

  const resetForm = () => {
    setClauseForm({
      title: '',
      content_markdown: '',
      group_id: '',
      variables: '[]',
      conditions: '{}',
      tags: '',
      is_locked_by_legal: false
    });
    setEditingClause(null);
  };

  const openEditDialog = (clause: LegalClause) => {
    setEditingClause(clause);
    setClauseForm({
      title: clause.title,
      content_markdown: clause.content_markdown,
      group_id: clause.group_id,
      variables: JSON.stringify(clause.variables || []),
      conditions: JSON.stringify(clause.conditions || {}),
      tags: clause.tags.join(', '),
      is_locked_by_legal: clause.is_locked_by_legal
    });
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Gerenciamento de Cláusulas</h3>
          <p className="text-muted-foreground">
            Configure as cláusulas que podem ser usadas nos contratos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Cláusula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClause ? 'Editar Cláusula' : 'Nova Cláusula'}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes da cláusula que será usada nos contratos
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Cláusula</Label>
                  <Input
                    id="title"
                    value={clauseForm.title}
                    onChange={(e) => setClauseForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Propriedade Intelectual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group">Grupo</Label>
                  <Select 
                    value={clauseForm.group_id} 
                    onValueChange={(value) => setClauseForm(prev => ({ ...prev, group_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {clauseGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo da Cláusula (Markdown)</Label>
                <Textarea
                  id="content"
                  value={clauseForm.content_markdown}
                  onChange={(e) => setClauseForm(prev => ({ ...prev, content_markdown: e.target.value }))}
                  placeholder="Escreva o conteúdo da cláusula em Markdown..."
                  className="min-h-[200px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="variables">Variáveis (JSON Array)</Label>
                  <Textarea
                    id="variables"
                    value={clauseForm.variables}
                    onChange={(e) => setClauseForm(prev => ({ ...prev, variables: e.target.value }))}
                    placeholder='["CONTRATANTE_NOME", "VALOR_TOTAL"]'
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Condições (JSON Object)</Label>
                  <Textarea
                    id="conditions"
                    value={clauseForm.conditions}
                    onChange={(e) => setClauseForm(prev => ({ ...prev, conditions: e.target.value }))}
                    placeholder='{"white_label": true, "maintenance": "premium"}'
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={clauseForm.tags}
                  onChange={(e) => setClauseForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="LGPD, white-label, premium"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="locked"
                  checked={clauseForm.is_locked_by_legal}
                  onCheckedChange={(checked) => setClauseForm(prev => ({ ...prev, is_locked_by_legal: checked }))}
                />
                <Label htmlFor="locked" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Travado pelo Jurídico
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateClause}>
                {editingClause ? 'Atualizar' : 'Criar'} Cláusula
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Accordion type="multiple" className="w-full">
          {clauseGroups.map((group) => (
            <AccordionItem key={group.id} value={group.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3" 
                      style={{ backgroundColor: group.color }}
                    />
                    <span>{group.name}</span>
                  </div>
                  <Badge variant="secondary">
                    {clausesByGroup[group.id]?.length || 0} cláusulas
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pl-7">
                  <p className="text-sm text-muted-foreground mb-4">
                    {group.description}
                  </p>
                  
                  {clausesByGroup[group.id]?.map((clause) => (
                    <Card key={clause.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{clause.title}</h4>
                            {clause.is_locked_by_legal ? (
                              <Badge variant="outline" className="text-xs">
                                <Lock className="mr-1 h-3 w-3" />
                                Travado
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                <Unlock className="mr-1 h-3 w-3" />
                                Editável
                              </Badge>
                            )}
                            {clause.tags.length > 0 && (
                              <div className="flex space-x-1">
                                {clause.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {clause.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{clause.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {clause.content_markdown.substring(0, 200)}...
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(clause)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {(!clausesByGroup[group.id] || clausesByGroup[group.id].length === 0) && (
                    <p className="text-sm text-muted-foreground italic py-8 text-center">
                      Nenhuma cláusula encontrada neste grupo.
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};