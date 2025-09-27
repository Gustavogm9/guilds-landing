import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Save, X, Lock, Unlock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLegal } from '@/hooks/useLegal';

interface LegalClause {
  id: string;
  title: string;
  content: string;
  group_id: string;
  variables: string[];
  tags: string[];
  locked_by_legal: boolean;
  version: number;
  is_active: boolean;
}

interface ClauseEditorProps {
  clause: LegalClause;
  onSave: (updatedClause: Partial<LegalClause>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClauseEditor({ clause, onSave, onCancel, isLoading }: ClauseEditorProps) {
  const { clauseGroups } = useLegal();
  
  const [formData, setFormData] = useState({
    title: clause.title,
    content: clause.content,
    group_id: clause.group_id,
    variables: clause.variables?.join(', ') || '',
    tags: clause.tags?.join(', ') || '',
    locked_by_legal: clause.locked_by_legal,
    is_active: clause.is_active
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Extrair variáveis automaticamente do conteúdo
  const extractVariables = (content: string): string[] => {
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(variableRegex) || [];
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '')))];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }

    if (!formData.group_id) {
      newErrors.group_id = 'Grupo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const extractedVariables = extractVariables(formData.content);
    const manualVariables = formData.variables
      .split(',')
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const allVariables = [...new Set([...extractedVariables, ...manualVariables])];

    const updatedClause = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      group_id: formData.group_id,
      variables: allVariables,
      tags: formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
      locked_by_legal: formData.locked_by_legal,
      is_active: formData.is_active
    };

    onSave(updatedClause);
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
    
    // Auto-extrair variáveis
    const extractedVars = extractVariables(content);
    if (extractedVars.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        variables: [...new Set([
          ...extractedVars,
          ...prev.variables.split(',').map(v => v.trim()).filter(v => v.length > 0)
        ])].join(', ')
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Editar Cláusula</h3>
          <p className="text-sm text-muted-foreground">
            Versão {clause.version} • ID: {clause.id.slice(0, 8)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={clause.locked_by_legal ? "destructive" : "secondary"}>
            {clause.locked_by_legal ? (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Travado
              </>
            ) : (
              <>
                <Unlock className="h-3 w-3 mr-1" />
                Editável
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Alert se travado pelo jurídico */}
      {clause.locked_by_legal && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta cláusula foi travada pelo departamento jurídico. 
            Alterações podem exigir aprovação adicional.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário Principal */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Cláusula</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Cláusula de Confidencialidade"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo</Label>
                <Select 
                  value={formData.group_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, group_id: value }))}
                >
                  <SelectTrigger className={errors.group_id ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {clauseGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.group_id && (
                  <p className="text-sm text-destructive">{errors.group_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Ex: confidencialidade, dados, privacidade"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="locked">Travado pelo Jurídico</Label>
                    <p className="text-xs text-muted-foreground">
                      Impede edições não autorizadas
                    </p>
                  </div>
                  <Switch
                    id="locked"
                    checked={formData.locked_by_legal}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, locked_by_legal: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Cláusula Ativa</Label>
                    <p className="text-xs text-muted-foreground">
                      Disponível para uso em contratos
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variáveis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variáveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="variables">Variáveis Disponíveis</Label>
                <Textarea
                  id="variables"
                  value={formData.variables}
                  onChange={(e) => setFormData(prev => ({ ...prev, variables: e.target.value }))}
                  placeholder="Ex: cliente_nome, valor_total, data_inicio"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis são extraídas automaticamente do conteúdo. 
                  Use o formato {`{{nome_variavel}}`} no texto.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo da Cláusula */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Conteúdo da Cláusula</CardTitle>
            </CardHeader>
            <CardContent className="h-full">
              <div className="space-y-2">
                <Label htmlFor="content">Texto da Cláusula (Markdown suportado)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Escreva o conteúdo da cláusula aqui..."
                  rows={20}
                  className={`font-mono text-sm resize-none ${errors.content ? "border-destructive" : ""}`}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content}</p>
                )}
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>💡 Dicas:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Use {`{{variavel}}`} para inserir variáveis dinâmicas</li>
                    <li>Suporte a Markdown para formatação</li>
                    <li>Variáveis são extraídas automaticamente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}