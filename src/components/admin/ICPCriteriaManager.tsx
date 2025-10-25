import { useState } from "react";
import { Plus, Pencil, Trash2, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { useLeadScoring, type ICPCriteria } from "@/hooks/useLeadScoring";

export function ICPCriteriaManager() {
  const { icpCriteria, criteriaLoading, createCriteria, updateCriteria, deleteCriteria, isCreatingCriteria, isUpdatingCriteria, isDeletingCriteria } = useLeadScoring();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<ICPCriteria | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
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
    } else {
      setEditingCriteria(null);
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

      {/* Dialog para criar/editar critério */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCriteria ? "Editar Critério" : "Novo Critério de ICP"}</DialogTitle>
            <DialogDescription>
              Configure um critério que define o perfil de cliente ideal para seu negócio
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="criterion_name">Nome do Critério *</Label>
              <Input
                id="criterion_name"
                value={formData.criterion_name}
                onChange={(e) => setFormData({ ...formData, criterion_name: e.target.value })}
                placeholder="Ex: Empresas de Porte Médio"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="criterion_type">Tipo de Critério</Label>
                <Select value={formData.criterion_type} onValueChange={(value) => setFormData({ ...formData, criterion_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_size">Tamanho da Empresa</SelectItem>
                    <SelectItem value="industry">Indústria</SelectItem>
                    <SelectItem value="job_title">Cargo</SelectItem>
                    <SelectItem value="budget">Orçamento</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="location">Localização</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="criterion_field">Campo no CRM *</Label>
                <Input
                  id="criterion_field"
                  value={formData.criterion_field}
                  onChange={(e) => setFormData({ ...formData, criterion_field: e.target.value })}
                  placeholder="Ex: company_size"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="target_values">Valores-Alvo (JSON Array) *</Label>
              <Textarea
                id="target_values"
                value={formData.target_values}
                onChange={(e) => setFormData({ ...formData, target_values: e.target.value })}
                placeholder='["11-50", "51-200", "201-500"]'
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Liste os valores que caracterizam seu cliente ideal em formato JSON array
              </p>
            </div>

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
                  <span className="text-warning ml-1">(⚠️ Ideal: 100%)</span>
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
          </div>

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
    </Card>
  );
}
