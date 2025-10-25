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
import { useLeadScoring, type LeadScoringRule } from "@/hooks/useLeadScoring";

export function LeadScoringRulesManager() {
  const { rules, rulesLoading, createRule, updateRule, deleteRule, isCreatingRule, isUpdatingRule, isDeletingRule } = useLeadScoring();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<LeadScoringRule | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    rule_name: "",
    rule_type: "demographic",
    condition_field: "",
    condition_operator: "equals",
    condition_value: "",
    points: 10,
    score_type: "lead_score",
    priority: 1,
    description: "",
    is_active: true,
  });

  const handleOpenDialog = (rule?: LeadScoringRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        rule_name: rule.rule_name,
        rule_type: rule.rule_type,
        condition_field: rule.condition_field,
        condition_operator: rule.condition_operator,
        condition_value: JSON.stringify(rule.condition_value),
        points: rule.points,
        score_type: rule.score_type,
        priority: rule.priority,
        description: rule.description || "",
        is_active: rule.is_active,
      });
    } else {
      setEditingRule(null);
      setFormData({
        rule_name: "",
        rule_type: "demographic",
        condition_field: "",
        condition_operator: "equals",
        condition_value: "",
        points: 10,
        score_type: "lead_score",
        priority: 1,
        description: "",
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    try {
      const conditionValue = formData.condition_value ? JSON.parse(formData.condition_value) : "";
      
      const ruleData = {
        ...formData,
        condition_value: conditionValue,
      };

      if (editingRule) {
        updateRule({ id: editingRule.id, updates: ruleData });
      } else {
        createRule(ruleData);
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Invalid JSON in condition_value:", error);
    }
  };

  const handleToggleActive = (rule: LeadScoringRule) => {
    updateRule({ id: rule.id, updates: { is_active: !rule.is_active } });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteRule(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getRuleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      demographic: "Demográfico",
      behavioral: "Comportamental",
      firmographic: "Firmográfico",
      engagement: "Engajamento",
      custom: "Personalizado",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Regras de Lead Scoring</CardTitle>
            <CardDescription>
              Configure as regras que calculam automaticamente o score dos leads
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} disabled={isCreatingRule}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Regra
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rulesLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando regras...</div>
        ) : !rules || rules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma regra configurada. Crie a primeira regra para começar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Regra</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Campo</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.rule_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRuleTypeLabel(rule.rule_type)}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{rule.condition_field}</TableCell>
                  <TableCell className="text-sm">{rule.condition_operator}</TableCell>
                  <TableCell>
                    <Badge variant={rule.points > 0 ? "default" : "destructive"}>
                      {rule.points > 0 ? "+" : ""}{rule.points}
                    </Badge>
                  </TableCell>
                  <TableCell>{rule.priority}</TableCell>
                  <TableCell>
                    {rule.is_active ? (
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
                        onClick={() => handleToggleActive(rule)}
                        disabled={isUpdatingRule}
                      >
                        {rule.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(rule)}
                        disabled={isUpdatingRule}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(rule.id)}
                        disabled={isDeletingRule}
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

      {/* Dialog para criar/editar regra */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Editar Regra" : "Nova Regra de Scoring"}</DialogTitle>
            <DialogDescription>
              Configure os critérios que determinam a pontuação automática dos leads
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rule_name">Nome da Regra *</Label>
              <Input
                id="rule_name"
                value={formData.rule_name}
                onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                placeholder="Ex: CEO em empresa de tecnologia"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rule_type">Tipo de Regra</Label>
                <Select value={formData.rule_type} onValueChange={(value) => setFormData({ ...formData, rule_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demographic">Demográfico</SelectItem>
                    <SelectItem value="firmographic">Firmográfico</SelectItem>
                    <SelectItem value="behavioral">Comportamental</SelectItem>
                    <SelectItem value="engagement">Engajamento</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="score_type">Tipo de Score</Label>
                <Select value={formData.score_type} onValueChange={(value) => setFormData({ ...formData, score_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead_score">Lead Score</SelectItem>
                    <SelectItem value="engagement_score">Engagement Score</SelectItem>
                    <SelectItem value="icp_score">ICP Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition_field">Campo da Condição *</Label>
              <Input
                id="condition_field"
                value={formData.condition_field}
                onChange={(e) => setFormData({ ...formData, condition_field: e.target.value })}
                placeholder="Ex: job_title, company_size, industry"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="condition_operator">Operador</Label>
                <Select value={formData.condition_operator} onValueChange={(value) => setFormData({ ...formData, condition_operator: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Igual</SelectItem>
                    <SelectItem value="not_equals">Diferente</SelectItem>
                    <SelectItem value="contains">Contém</SelectItem>
                    <SelectItem value="not_contains">Não contém</SelectItem>
                    <SelectItem value="greater_than">Maior que</SelectItem>
                    <SelectItem value="less_than">Menor que</SelectItem>
                    <SelectItem value="in">Em lista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="condition_value">Valor (JSON) *</Label>
                <Input
                  id="condition_value"
                  value={formData.condition_value}
                  onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                  placeholder='Ex: "CEO" ou ["CEO", "CTO"]'
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="points">Pontos *</Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o propósito desta regra..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isCreatingRule || isUpdatingRule}>
              {editingRule ? "Salvar Alterações" : "Criar Regra"}
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
              Tem certeza que deseja excluir esta regra? Esta ação não pode ser desfeita.
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
