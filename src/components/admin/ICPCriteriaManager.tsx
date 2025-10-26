import { useState } from "react";
import { Plus, Pencil, Trash2, Power, PowerOff, Lightbulb, Sparkles, AlertCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLeadScoring, type ICPCriteria } from "@/hooks/useLeadScoring";
import { FieldSelector } from "./icp/FieldSelector";
import { TargetValuesBuilder } from "./icp/TargetValuesBuilder";
import { CriteriaTemplates } from "./icp/CriteriaTemplates";
import { ScoreSimulator } from "./icp/ScoreSimulator";
import { ICPGuidedTour } from "./icp/ICPGuidedTour";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateCriterionField } from "@/lib/icpValidation";

export function ICPCriteriaManager() {
  const { icpCriteria, criteriaLoading, createCriteria, updateCriteria, deleteCriteria, isCreatingCriteria, isUpdatingCriteria, isDeletingCriteria } = useLeadScoring();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<ICPCriteria | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(() => {
    const hasSeenTour = localStorage.getItem('icp_tour_completed');
    return !hasSeenTour && (!icpCriteria || icpCriteria.length === 0);
  });
  const [fieldValidation, setFieldValidation] = useState<ReturnType<typeof validateCriterionField> | null>(null);
  
  const [formData, setFormData] = useState({
    criterion_name: "",
    criterion_type: "company_size",
    criterion_field: "",
    target_values: "[]",
    weight: 10,
    description: "",
    is_active: true,
  });

  const handleOpenDialog = (criteria?: ICPCriteria) => {
    if (criteria) {
      setEditingCriteria(criteria);
      setFormData({
        criterion_name: criteria.criterion_name,
        criterion_type: criteria.criterion_type,
        criterion_field: criteria.criterion_field,
        target_values: JSON.stringify(criteria.target_values),
        weight: criteria.weight,
        description: criteria.description || "",
        is_active: criteria.is_active,
      });
      setFieldValidation(validateCriterionField(criteria.criterion_field));
    } else {
      setEditingCriteria(null);
      setFieldValidation(null);
      setFormData({
        criterion_name: "",
        criterion_type: "company_size",
        criterion_field: "",
        target_values: "[]",
        weight: 10,
        description: "",
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleFieldChange = (newField: string) => {
    setFormData(prev => ({ ...prev, criterion_field: newField }));
    setFieldValidation(validateCriterionField(newField));
  };

  const handleCompleteTour = () => {
    localStorage.setItem('icp_tour_completed', 'true');
    setShowTour(false);
  };

  const handleSubmit = () => {
    try {
      const targetValues = formData.target_values ? JSON.parse(formData.target_values) : [];
      
      const criteriaData = {
        ...formData,
        target_values: targetValues,
      };

      if (editingCriteria) {
        updateCriteria({ id: editingCriteria.id, updates: criteriaData });
      } else {
        createCriteria(criteriaData);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Invalid JSON in target_values:", error);
    }
  };

  const handleToggleActive = (criteria: ICPCriteria) => {
    updateCriteria({ id: criteria.id, updates: { is_active: !criteria.is_active } });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteCriteria(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getCriterionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      company_size: "Tamanho da Empresa",
      industry: "Indústria",
      job_title: "Cargo",
      budget: "Orçamento",
      timeline: "Timeline",
      location: "Localização",
      custom: "Personalizado",
    };
    return labels[type] || type;
  };

  const totalWeight = icpCriteria?.reduce((sum, c) => c.is_active ? sum + c.weight : sum, 0) || 0;

  return (
    <>
      {showTour && (
        <ICPGuidedTour
          onComplete={handleCompleteTour}
          onSkip={handleCompleteTour}
        />
      )}
      
      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manage">Gerenciar Critérios</TabsTrigger>
          <TabsTrigger value="simulate">
            <Sparkles className="h-4 w-4 mr-2" />
            Simulador
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Critérios de ICP (Ideal Customer Profile)</CardTitle>
                  <CardDescription>
                    Defina os critérios do perfil de cliente ideal e seus pesos na pontuação
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Peso Total</div>
                    <div className="text-2xl font-bold">{totalWeight}%</div>
                  </div>
                  <Button onClick={() => handleOpenDialog()} disabled={isCreatingCriteria}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Critério
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {criteriaLoading ? (
                <div className="text-center py-8 text-muted-foreground">Carregando critérios...</div>
              ) : !icpCriteria || icpCriteria.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum critério configurado. Crie o primeiro critério para definir seu ICP.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Critério</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Campo</TableHead>
                      <TableHead>Valores-Alvo</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {icpCriteria.map((criteria) => (
                      <TableRow key={criteria.id}>
                        <TableCell className="font-medium">{criteria.criterion_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCriterionTypeLabel(criteria.criterion_type)}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{criteria.criterion_field}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {criteria.target_values?.slice(0, 3).map((value, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {typeof value === 'string' ? value : JSON.stringify(value)}
                              </Badge>
                            ))}
                            {criteria.target_values?.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{criteria.target_values.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${criteria.weight}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{criteria.weight}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {criteria.is_active ? (
                            <Badge variant="default" className="gap-1">
                              <Power className="h-3 w-3" /> Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <PowerOff className="h-3 w-3" /> Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(criteria)}
                              disabled={isUpdatingCriteria}
                            >
                              {criteria.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(criteria)}
                              disabled={isUpdatingCriteria}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(criteria.id)}
                              disabled={isDeletingCriteria}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulate">
          <ScoreSimulator criteria={icpCriteria || []} />
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar critério */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCriteria ? "Editar Critério" : "Novo Critério de ICP"}</DialogTitle>
            <DialogDescription>
              Configure um critério que define o perfil de cliente ideal para seu negócio
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">
                <Lightbulb className="h-4 w-4 mr-2" />
                Construtor Visual
              </TabsTrigger>
              <TabsTrigger value="templates">
                Templates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="criterion_name">Nome do Critério *</Label>
                <Input
                  id="criterion_name"
                  value={formData.criterion_name}
                  onChange={(e) => setFormData({ ...formData, criterion_name: e.target.value })}
                  placeholder="Ex: Empresas de Porte Médio"
                />
              </div>

              <div>
                <Label>Campo de Dados *</Label>
                <FieldSelector
                  value={formData.criterion_field}
                  onChange={handleFieldChange}
                  usedFields={icpCriteria?.filter(c => c.id !== editingCriteria?.id).map(c => c.criterion_field)}
                />
                
                {/* Field Validation Alerts */}
                {fieldValidation && (
                  <div className="mt-2 space-y-2">
                    {!fieldValidation.exists && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {fieldValidation.warnings[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                    {fieldValidation.exists && !fieldValidation.inForm && !fieldValidation.isCustomField && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <div className="flex items-center justify-between">
                            <div>
                              {fieldValidation.warnings[0]}
                              <div className="mt-1 text-xs text-muted-foreground">
                                {fieldValidation.suggestions[0]}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2 h-7 text-xs"
                              onClick={() => {
                                window.open('/admin', '_blank');
                                alert(`Para adicionar o campo "${formData.criterion_field}" ao formulário de contato:\n\n1. Vá até Admin → Configurações Públicas\n2. Ou edite src/components/forms/ContactForm.tsx\n3. Adicione um campo para: ${formData.criterion_field}`);
                              }}
                            >
                              Como Adicionar?
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              <TargetValuesBuilder
                fieldName={formData.criterion_field}
                fieldType={formData.criterion_type}
                value={formData.target_values}
                onChange={(value) => setFormData({ ...formData, target_values: value })}
              />

              <div className="grid gap-2">
                <Label htmlFor="weight">Peso no Score ICP: {formData.weight}%</Label>
                <Slider
                  id="weight"
                  value={[formData.weight]}
                  onValueChange={([value]) => setFormData({ ...formData, weight: value })}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Peso total de todos os critérios ativos: {totalWeight}%
                  {totalWeight !== 100 && totalWeight > 0 && (
                    <span className="text-orange-600 ml-1">(⚠️ Ideal: 100%)</span>
                  )}
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva por que este critério é importante..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-4">
              <CriteriaTemplates
                onApplyTemplate={(template) => {
                  setFormData({
                    criterion_name: template.criterion_name,
                    criterion_type: template.criterion_type,
                    criterion_field: template.criterion_field,
                    target_values: JSON.stringify(template.target_values),
                    weight: template.weight,
                    description: template.description,
                    is_active: true,
                  });
                }}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isCreatingCriteria || isUpdatingCriteria}>
              {editingCriteria ? "Salvar Alterações" : "Criar Critério"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este critério de ICP? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}