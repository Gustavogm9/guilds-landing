import { useState, useEffect } from "react";
import { Sparkles, Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ICPQuickEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactId: string;
  contactName: string;
  currentData: {
    job_title?: string;
    company_size?: string;
    industry?: string;
    budget_range?: string;
    decision_timeline?: string;
  };
  onSuccess?: () => void;
}

export function ICPQuickEditModal({
  open,
  onOpenChange,
  contactId,
  contactName,
  currentData,
  onSuccess
}: ICPQuickEditModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(currentData);

  useEffect(() => {
    setFormData(currentData);
  }, [currentData, open]);

  const calculateCompleteness = () => {
    const fields = ['job_title', 'company_size', 'industry', 'budget_range', 'decision_timeline'];
    const filledFields = fields.filter(f => formData[f as keyof typeof formData]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const completeness = calculateCompleteness();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({
          job_title: formData.job_title || null,
          company_size: formData.company_size || null,
          industry: formData.industry || null,
          budget_range: formData.budget_range || null,
          decision_timeline: formData.decision_timeline || null,
        })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Dados de ICP atualizados!",
        description: `Score ICP de ${contactName} será recalculado.`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Completar Dados de ICP
          </DialogTitle>
          <DialogDescription>
            Preencha os dados que influenciam o score ICP de {contactName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Completeness Bar */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Completude do Perfil</span>
              <Badge variant={completeness === 100 ? "default" : "secondary"}>
                {completeness}%
              </Badge>
            </div>
            <Progress value={completeness} className="h-2" />
          </div>

          {/* Fields */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="job_title">
                Cargo {!formData.job_title && <Badge variant="outline" className="ml-2 text-xs">Vazio</Badge>}
              </Label>
              <Input
                id="job_title"
                value={formData.job_title || ''}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                placeholder="Ex: Diretor de TI"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company_size">
                Tamanho da Empresa {!formData.company_size && <Badge variant="outline" className="ml-2 text-xs">Vazio</Badge>}
              </Label>
              <Select
                value={formData.company_size || ''}
                onValueChange={(value) => setFormData({ ...formData, company_size: value })}
              >
                <SelectTrigger id="company_size">
                  <SelectValue placeholder="Selecione o porte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 funcionários</SelectItem>
                  <SelectItem value="11-50">11-50 funcionários</SelectItem>
                  <SelectItem value="51-200">51-200 funcionários</SelectItem>
                  <SelectItem value="201-500">201-500 funcionários</SelectItem>
                  <SelectItem value="500+">500+ funcionários</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="industry">
                Indústria {!formData.industry && <Badge variant="outline" className="ml-2 text-xs">Vazio</Badge>}
              </Label>
              <Select
                value={formData.industry || ''}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Selecione a indústria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Indústria">Indústria</SelectItem>
                  <SelectItem value="Serviços">Serviços</SelectItem>
                  <SelectItem value="Varejo">Varejo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget_range">
                Orçamento {!formData.budget_range && <Badge variant="outline" className="ml-2 text-xs">Vazio</Badge>}
              </Label>
              <Select
                value={formData.budget_range || ''}
                onValueChange={(value) => setFormData({ ...formData, budget_range: value })}
              >
                <SelectTrigger id="budget_range">
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Até R$ 10k">Até R$ 10k</SelectItem>
                  <SelectItem value="R$ 10k - R$ 30k">R$ 10k - R$ 30k</SelectItem>
                  <SelectItem value="R$ 30k - R$ 50k">R$ 30k - R$ 50k</SelectItem>
                  <SelectItem value="R$ 50k - R$ 100k">R$ 50k - R$ 100k</SelectItem>
                  <SelectItem value="R$ 100k+">R$ 100k+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="decision_timeline">
                Timeline de Decisão {!formData.decision_timeline && <Badge variant="outline" className="ml-2 text-xs">Vazio</Badge>}
              </Label>
              <Select
                value={formData.decision_timeline || ''}
                onValueChange={(value) => setFormData({ ...formData, decision_timeline: value })}
              >
                <SelectTrigger id="decision_timeline">
                  <SelectValue placeholder="Selecione o prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Imediato">Imediato</SelectItem>
                  <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                  <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                  <SelectItem value="6-12 meses">6-12 meses</SelectItem>
                  <SelectItem value="12+ meses">12+ meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar e Recalcular Score'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
