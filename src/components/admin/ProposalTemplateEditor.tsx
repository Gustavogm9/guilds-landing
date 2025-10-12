import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useProposals, ProposalTemplate } from '@/hooks/useProposals';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const ProposalTemplateEditor = () => {
  const { templates, templatesLoading } = useProposals();
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate | null>(null);

  if (templatesLoading) {
    return <div className="text-center py-8">Carregando templates...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Templates de Propostas</h2>
          <p className="text-muted-foreground">Configure os templates modulares</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista de Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Templates Disponíveis</CardTitle>
            <CardDescription>{templates?.length || 0} template(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {templates?.map((template) => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {template.is_default && (
                      <Badge variant="default">Padrão</Badge>
                    )}
                    {template.is_active ? (
                      <Badge variant="secondary">Ativo</Badge>
                    ) : (
                      <Badge variant="outline">Inativo</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Editor de Template */}
        {selectedTemplate && (
          <Card>
            <CardHeader>
              <CardTitle>Editor de Template</CardTitle>
              <CardDescription>Editar: {selectedTemplate.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome do Template</Label>
                <Input value={selectedTemplate.name} readOnly />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={selectedTemplate.description || ''}
                  readOnly
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Template Padrão</Label>
                <Switch checked={selectedTemplate.is_default} disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label>Ativo</Label>
                <Switch checked={selectedTemplate.is_active} disabled />
              </div>
              <div>
                <Label>Seções Configuradas</Label>
                <div className="mt-2 space-y-1">
                  {selectedTemplate.schema?.sections?.map((section: any, idx: number) => (
                    <Badge key={idx} variant="outline" className="mr-2">
                      {section.title}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Edição avançada de templates será implementada em breve.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
