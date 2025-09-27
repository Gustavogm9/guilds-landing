import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, X, Eye, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { useLegal } from '@/hooks/useLegal';

interface TemplateConfiguratorProps {
  templateId: string;
  onSave: (selectedClauses: string[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TemplateConfigurator({ templateId, onSave, onCancel, isLoading }: TemplateConfiguratorProps) {
  const { clauseGroups, fetchClausesByGroup, templates } = useLegal();
  const [clausesByGroup, setClausesByGroup] = useState<Record<string, any[]>>({});
  const [selectedClauses, setSelectedClauses] = useState<Set<string>>(new Set());
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const template = templates?.find(t => t.id === templateId);

  useEffect(() => {
    loadClausesAndTemplate();
  }, [templateId, clauseGroups]);

  const loadClausesAndTemplate = async () => {
    setLoading(true);
    
    try {
      // Carregar cláusulas por grupo
      const clausesData: Record<string, any[]> = {};
      
      for (const group of clauseGroups) {
        const clauses = await fetchClausesByGroup(group.id);
        clausesData[group.id] = clauses.filter(c => c.is_active);
      }
      
      setClausesByGroup(clausesData);

      // Carregar cláusulas já selecionadas no template (implementar após migração)
      // if (template?.default_clauses) {
      //   setSelectedClauses(new Set(template.default_clauses));
      // }
    } catch (error) {
      console.error('Error loading clauses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleClause = (clauseId: string) => {
    const newSelected = new Set(selectedClauses);
    if (newSelected.has(clauseId)) {
      newSelected.delete(clauseId);
    } else {
      newSelected.add(clauseId);
    }
    setSelectedClauses(newSelected);
  };

  const toggleGroup = (groupId: string) => {
    const groupClauses = clausesByGroup[groupId] || [];
    const allSelected = groupClauses.every(clause => selectedClauses.has(clause.id));
    
    const newSelected = new Set(selectedClauses);
    
    if (allSelected) {
      // Desmarcar todos do grupo
      groupClauses.forEach(clause => newSelected.delete(clause.id));
    } else {
      // Marcar todos do grupo
      groupClauses.forEach(clause => newSelected.add(clause.id));
    }
    
    setSelectedClauses(newSelected);
  };

  const getGroupStats = (groupId: string) => {
    const clauses = clausesByGroup[groupId] || [];
    const selected = clauses.filter(clause => selectedClauses.has(clause.id)).length;
    const total = clauses.length;
    return { selected, total };
  };

  const handleSave = () => {
    onSave(Array.from(selectedClauses));
  };

  const generatePreview = () => {
    const selectedClausesList = Object.values(clausesByGroup)
      .flat()
      .filter(clause => selectedClauses.has(clause.id))
      .sort((a, b) => {
        // Ordenar por grupo primeiro, depois por título
        const groupA = clauseGroups.find(g => g.id === a.group_id)?.name || '';
        const groupB = clauseGroups.find(g => g.id === b.group_id)?.name || '';
        
        if (groupA !== groupB) {
          return groupA.localeCompare(groupB);
        }
        
        return a.title.localeCompare(b.title);
      });

    return selectedClausesList;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configuração...</p>
        </div>
      </div>
    );
  }

  const previewClauses = generatePreview();
  const totalSelected = selectedClauses.size;
  const totalAvailable = Object.values(clausesByGroup).flat().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Configurar Template</h3>
          <p className="text-sm text-muted-foreground">
            {template?.name} • {totalSelected} de {totalAvailable} cláusulas selecionadas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Editar' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Alert de orientação */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Selecione as cláusulas padrão que serão automaticamente incluídas 
          quando este template for usado para criar novos contratos.
        </AlertDescription>
      </Alert>

      {previewMode ? (
        /* Preview Mode */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview do Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {previewClauses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma cláusula selecionada</p>
                  <p className="text-sm">Volte para o modo de edição para selecionar cláusulas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {previewClauses.map((clause, index) => {
                    const group = clauseGroups.find(g => g.id === clause.group_id);
                    return (
                      <div key={clause.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{index + 1}. {clause.title}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {group?.name}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                          {clause.content ? (
                            clause.content.length > 200 ? 
                              `${clause.content.substring(0, 200)}...` : 
                              clause.content
                          ) : 'Sem conteúdo definido'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seleção de Cláusulas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cláusulas Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <Accordion type="multiple" className="w-full">
                    {clauseGroups.map(group => {
                      const clauses = clausesByGroup[group.id] || [];
                      const stats = getGroupStats(group.id);
                      const allSelected = stats.selected === stats.total && stats.total > 0;
                      const someSelected = stats.selected > 0 && stats.selected < stats.total;

                      return (
                        <AccordionItem key={group.id} value={group.id}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 w-full">
                                  <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={() => toggleGroup(group.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                              <div className="flex-1 text-left">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium">{group.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {stats.selected}/{stats.total}
                                  </Badge>
                                </div>
                                {group.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {group.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 ml-6">
                              {clauses.map(clause => (
                                <div key={clause.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50">
                                  <Checkbox
                                    checked={selectedClauses.has(clause.id)}
                                    onCheckedChange={() => toggleClause(clause.id)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">{clause.title}</span>
                                      {clause.locked_by_legal && (
                                        <Badge variant="destructive" className="text-xs">
                                          Travado
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    {clause.content && (
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {clause.content.length > 100 ? 
                                          `${clause.content.substring(0, 100)}...` : 
                                          clause.content
                                        }
                                      </p>
                                    )}
                                    
                                    {clause.tags && clause.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
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
                                </div>
                              ))}
                              
                              {clauses.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                  Nenhuma cláusula ativa neste grupo
                                </p>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Resumo da Seleção */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Resumo da Seleção
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalSelected}</div>
                  <div className="text-sm text-muted-foreground">cláusulas selecionadas</div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Por Grupo:</h4>
                  {clauseGroups.map(group => {
                    const stats = getGroupStats(group.id);
                    if (stats.total === 0) return null;

                    return (
                      <div key={group.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{group.name}</span>
                        <Badge variant={stats.selected > 0 ? "default" : "secondary"} className="text-xs">
                          {stats.selected}/{stats.total}
                        </Badge>
                      </div>
                    );
                  })}
                </div>

                {totalSelected > 0 && (
                  <>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-2">✅ Template configurado</p>
                      <p>Estas cláusulas serão automaticamente selecionadas em novos contratos usando este template.</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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
          disabled={isLoading || totalSelected === 0}
          className="min-w-[140px]"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Salvando...' : 'Salvar Configuração'}
        </Button>
      </div>
    </div>
  );
}