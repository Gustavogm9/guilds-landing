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
import { Plus, Edit, Copy, Star, FileText, Settings } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';
import { TemplateConfigurator } from './TemplateConfigurator';

export const TemplateManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    contract_type: '',
    is_default: false,
    default_groups: [] as string[],
    variables_mapping: '{}'
  });

  const { templates, clauseGroups, createTemplate, updateTemplate } = useLegal();

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

  const handleConfigureTemplate = (template: any) => {
    setSelectedTemplate(template);
    setIsConfigDialogOpen(true);
  };

  const handleSaveConfiguration = async (selectedClauses: string[]) => {
    if (!selectedTemplate) return;
    
    try {
      await updateTemplate.mutateAsync({
        id: selectedTemplate.id,
        default_clauses: selectedClauses
      });
      setIsConfigDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Erro ao configurar template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Templates de Contrato</h3>
          <p className="text-muted-foreground">Gerencie os templates base para geração de contratos</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Novo Template de Contrato</DialogTitle>
              <DialogDescription>Configure um novo template base</DialogDescription>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_default"
                  checked={templateForm.is_default}
                  onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_default: checked }))}
                />
                <Label htmlFor="is_default">Template Padrão</Label>
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
          <Card key={template.id}>
            <CardHeader>
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
              <CardDescription>{template.description || 'Sem descrição'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline">
                {contractTypes.find(t => t.value === template.contract_type)?.label || template.contract_type}
              </Badge>
              
              {/* Template Configuration Preview */}
              {template.default_clauses && template.default_clauses.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Settings className="mr-1 h-3 w-3" />
                    {template.default_clauses.length} cláusulas configuradas
                  </Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Criado em:</span>
                <span>{new Date(template.created_at).toLocaleDateString()}</span>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => handleConfigureTemplate(template)}
              >
                <Settings className="mr-2 h-3 w-3" />
                {template.default_clauses && template.default_clauses.length > 0 ? 'Reconfigurar' : 'Configurar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Selecione as cláusulas padrão que serão automaticamente incluídas neste template
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <TemplateConfigurator
              templateId={selectedTemplate.id}
              onSave={handleSaveConfiguration}
              onCancel={() => {
                setIsConfigDialogOpen(false);
                setSelectedTemplate(null);
              }}
              isLoading={updateTemplate.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};