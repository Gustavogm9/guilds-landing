import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, AlertTriangle } from 'lucide-react';
import { useLegal, LegalClause } from '@/hooks/useLegal';

interface ClauseEditorProps {
  clause: LegalClause;
  onSave: (updatedClause: Partial<LegalClause>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClauseEditor({ clause, onSave, onCancel, isLoading }: ClauseEditorProps) {
  const { clauseGroups } = useLegal();
  
  const [title, setTitle] = useState(clause.title);
  const [content, setContent] = useState(clause.content_markdown);
  const [group, setGroup] = useState(clause.group_id);
  const [variables, setVariables] = useState<string[]>(clause.variables || []);
  const [tags, setTags] = useState<string[]>(clause.tags || []);
  const [lockedByLegal, setLockedByLegal] = useState(clause.is_locked_by_legal);
  const [isActive, setIsActive] = useState(clause.is_active);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Extract variables from content (placeholders like {{variable_name}})
  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const matches = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1].trim());
    }
    
    return [...new Set(matches)];
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }
    
    if (!group) {
      newErrors.group = 'Grupo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    const extractedVariables = extractVariables(content);
    const combinedVariables = Array.from(new Set([...variables, ...extractedVariables]));
    
    onSave({
      title,
      content_markdown: content,
      group_id: group,
      variables: combinedVariables,
      tags,
      is_locked_by_legal: lockedByLegal,
      is_active: isActive
    });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    // Auto-extract variables when content changes
    const extractedVars = extractVariables(newContent);
    setVariables(prev => {
      const manualVars = prev.filter(v => !extractedVars.includes(v));
      return [...manualVars, ...extractedVars];
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Editar Cláusula: {clause.title}</span>
            <Badge variant={clause.is_locked_by_legal ? "destructive" : "secondary"}>
              {clause.is_locked_by_legal ? "Travado" : "Editável"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground mb-4">
            Cláusula ID: {clause.id} | Ordem: {clause.display_order || 1}
          </p>

          {clause.is_locked_by_legal && (
            <Badge variant="outline" className="mb-4">
              <Lock className="mr-1 h-3 w-3" />
              Travado pelo Jurídico
            </Badge>
          )}

          {clause.is_locked_by_legal && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Cláusula Travada</AlertTitle>
              <AlertDescription>
                Esta cláusula foi travada pelo time jurídico. Alterações podem precisar de aprovação especial.
              </AlertDescription>
            </Alert>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Cláusula</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Propriedade Intelectual"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">Grupo</Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className={errors.group ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {clauseGroups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.group && (
                <p className="text-sm text-destructive">{errors.group}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              placeholder="Ex: software, propriedade, intelectual"
            />
          </div>

          {/* Settings */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="locked"
                checked={lockedByLegal}
                onCheckedChange={setLockedByLegal}
              />
              <Label htmlFor="locked">Travado pelo Jurídico</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Ativo</Label>
            </div>
          </div>

          {/* Variables */}
          <div className="space-y-2">
            <Label htmlFor="variables">Variáveis (auto-extraídas do conteúdo)</Label>
            <Textarea
              id="variables"
              value={variables.join(', ')}
              onChange={(e) => setVariables(e.target.value.split(',').map(v => v.trim()).filter(Boolean))}
              placeholder="Ex: nome_cliente, valor_total, data_inicio"
              rows={2}
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Variáveis são automaticamente extraídas do conteúdo quando você usa {"{{nome_variavel}}"} 
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo da Cláusula (Markdown)</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Escreva o conteúdo da cláusula usando Markdown..."
              rows={15}
              className={`font-mono text-sm ${errors.content ? "border-destructive" : ""}`}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Use {"{{nome_variavel}}"} para criar campos dinâmicos. Suporte completo para Markdown.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}