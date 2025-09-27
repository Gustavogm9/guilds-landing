import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Edit, 
  Copy, 
  Star,
  FileText,
  Settings,
  Layers
} from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';

export const TemplateManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    contract_type: '',
    is_default: false,
    default_groups: [] as string[],
    variables_mapping: '{}'
  });

  const { templates, clauseGroups, createTemplate } = useLegal();

  const contractTypes = [
    { value: 'software', label: 'Desenvolvimento de Software' },
    { value: 'white_label', label: 'White Label' },
    { value: 'maintenance', label: 'Manutenção' },
    { value: 'consulting', label: 'Consultoria' },
    { value: 'saas', label: 'SaaS' },
    { value: 'standard', label: 'Padrão' }
  ];

  const handleCreateTemplate = async () => {
    try {
      await createTemplate.mutateAsync({
        ...templateForm,
        variables_mapping: JSON.parse(templateForm.variables_mapping || '{}')
      });
      
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao criar template:', error);
    }
  };

  const resetForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      contract_type: '',
      is_default: false,
      default_groups: [],
      variables_mapping: '{}'
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    setTemplateForm(prev => ({
      ...prev,
      default_groups: prev.default_groups.includes(groupId)
        ? prev.default_groups.filter(id => id !== groupId)
        : [...prev.default_groups, groupId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Templates de Contrato</h3>
          <p className="text-muted-foreground">
            Gerencie os templates base para geração de contratos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Template de Contrato</DialogTitle>
              <DialogDescription>
                Configure um novo template que servirá como base para gerar contratos
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Template</Label>
                  <Input
                    id="name"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Desenvolvimento Sob Encomenda"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contract_type">Tipo de Contrato</Label>
                  <Select 
                    value={templateForm.contract_type} 
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, contract_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={templateForm.description}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva quando usar este template..."
                />
              </div>

              <div className="space-y-4">
                <Label>Grupos de Cláusulas Incluídos por Padrão</Label>
                <div className="grid grid-cols-2 gap-2">
                  {clauseGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.id}
                        checked={templateForm.default_groups.includes(group.id)}
                        onCheckedChange={() => toggleGroupSelection(group.id)}
                      />
                      <Label htmlFor={group.id} className="text-sm">
                        {group.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variables_mapping">Mapeamento de Variáveis (JSON)</Label>
                <Textarea
                  id="variables_mapping"
                  value={templateForm.variables_mapping}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, variables_mapping: e.target.value }))}
                  placeholder='{"CONTRATANTE_NOME": "client.name", "VALOR_TOTAL": "deal.value"}'
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define como as variáveis do template são mapeadas para dados do CRM
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_default"
                  checked={templateForm.is_default}
                  onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_default: checked }))}
                />
                <Label htmlFor="is_default" className="flex items-center">
                  <Star className="mr-2 h-4 w-4" />
                  Template Padrão
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTemplate}>
                Criar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="mr-2 h-5 w-5" />
                    {template.name}
                    {template.is_default && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="mr-1 h-3 w-3" />
                        Padrão
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {template.description || 'Sem descrição'}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tipo:</span>
                <Badge variant="outline">
                  {contractTypes.find(t => t.value === template.contract_type)?.label || template.contract_type}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Grupos incluídos:</span>
                <Badge variant="secondary">
                  {template.default_groups?.length || 0} grupos
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Criado em:</span>
                <span>{new Date(template.created_at).toLocaleDateString()}</span>
              </div>

              <div className="pt-2 border-t">
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="mr-2 h-3 w-3" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {templates.length === 0 && (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum template encontrado</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Crie o primeiro template para começar a gerar contratos automaticamente
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Template
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};