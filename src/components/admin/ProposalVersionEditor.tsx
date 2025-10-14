import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useProposals } from "@/hooks/useProposals";
import { VariablesEditor } from "./proposal/VariablesEditor";
import { ArrowLeft, Save, Eye, FileText } from "lucide-react";
import { calculatePaymentSchedule, calculateMaintenancePlans, formatCurrency, generateChangelog } from "@/lib/proposalCalculations";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PublishProposalModal } from "./proposal/PublishProposalModal";
import { supabase } from "@/integrations/supabase/client";

export const ProposalVersionEditor = () => {
  const { id, versionNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { useProposal, useProposalVersions, pricingCatalog, createVersion } = useProposals();
  
  const { data: proposal } = useProposal(id || '');
  const { data: versions } = useProposalVersions(id || '');
  
  const currentVersion = versions?.find(v => v.version_number === parseInt(versionNumber || '1'));
  const previousVersion = versions?.find(v => v.version_number === parseInt(versionNumber || '1') - 1);

  const [variables, setVariables] = useState<any>({
    cliente: {},
    projeto: {},
    prazos: { sprints: [] },
    investimento: { valor: 0, moeda: 'BRL' },
    pagamento: { modelo: '30-20-20-30', vencimentos: [] },
    manutencao: { habilitado: true, planos: [] },
    parceria: { ativo: false },
    flags: proposal?.flags || {},
  });

  const [sections, setSections] = useState<string>('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Load existing version or initialize
  useEffect(() => {
    if (currentVersion) {
      setVariables(currentVersion.variables || {});
      setSections(JSON.stringify(currentVersion.sections, null, 2));
    } else if (proposal) {
      setVariables(prev => ({
        ...prev,
        flags: proposal.flags,
      }));
    }
  }, [currentVersion, proposal]);

  // Auto-load maintenance plans from catalog
  useEffect(() => {
    if (!pricingCatalog || !variables.flags?.maintenanceEnabled) return;
    
    const plans = calculateMaintenancePlans(pricingCatalog);
    setVariables((prev: any) => ({
      ...prev,
      manutencao: {
        ...prev.manutencao,
        planos: plans
      }
    }));
  }, [pricingCatalog, variables.flags?.maintenanceEnabled]);

  // Calculate pricing in real-time
  const pricingData = useMemo(() => {
    if (!variables.investimento?.valor || !variables.pagamento?.modelo) return null;
    
    return calculatePaymentSchedule(
      variables.investimento.valor,
      variables.pagamento.modelo,
      variables.pagamento.customPercentages,
      variables.pagamento.vencimentos
    );
  }, [variables.investimento, variables.pagamento]);

  // Generate preview HTML
  const previewHtml = useMemo(() => {
    try {
      const context = {
        ...variables,
        pricing: pricingData,
      };

      // Simple template rendering without Handlebars for now
      return `
        <div style="font-family: 'Inter', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 1em;">${context.projeto?.nome || 'Proposta'}</h1>
          
          <h2 style="font-size: 18px; font-weight: 600; margin-top: 1.5em;">Cliente</h2>
          <p><strong>${context.cliente?.razaoSocial || ''}</strong></p>
          <p>CNPJ: ${context.cliente?.cnpj || ''}</p>
          <p>Contato: ${context.cliente?.contato?.nome || ''} (${context.cliente?.contato?.email || ''})</p>
          
          <h2 style="font-size: 18px; font-weight: 600; margin-top: 1.5em;">Investimento</h2>
          <p>Valor Total: <strong>${formatCurrency(context.investimento?.valor || 0)}</strong></p>
          
          ${context.pricing ? `
          <h3 style="font-size: 16px; font-weight: 600; margin-top: 1em;">Parcelas (${context.pagamento?.modelo})</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 1em 0;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Descrição</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">%</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">Valor</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px;">Vencimento</th>
              </tr>
            </thead>
            <tbody>
              ${context.pricing.parcelas.map((p: any) => `
              <tr>
                <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.descricao}</td>
                <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${p.percentual}%</td>
                <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${formatCurrency(p.valor)}</td>
                <td style="border: 1px solid #e5e7eb; padding: 8px;">${p.vencimento}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          ` : ''}
          
          ${context.prazos?.sprints?.length ? `
          <h2 style="font-size: 18px; font-weight: 600; margin-top: 1.5em;">Sprints</h2>
          <p>Duração: ${context.prazos.diasExecucao} dias úteis</p>
          ${context.prazos.sprints.map((sprint: any) => `
          <div style="margin: 1em 0; padding: 1em; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h4 style="font-weight: 600;">${sprint.nome}</h4>
            <p>Período: ${new Date(sprint.inicio).toLocaleDateString('pt-BR')} a ${new Date(sprint.fim).toLocaleDateString('pt-BR')}</p>
            <ul>
              ${sprint.entregas?.map((e: string) => `<li>${e}</li>`).join('') || ''}
            </ul>
          </div>
          `).join('')}
          ` : ''}
          
          ${context.flags?.maintenanceEnabled && context.manutencao?.planos?.length ? `
          <h2 style="font-size: 18px; font-weight: 600; margin-top: 1.5em;">Planos de Manutenção</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 1em 0;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Plano</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">Valor Mensal</th>
              </tr>
            </thead>
            <tbody>
              ${context.manutencao.planos.map((plan: any) => `
              <tr>
                <td style="border: 1px solid #e5e7eb; padding: 8px;">
                  <strong>${plan.nome}</strong>
                  ${plan.beneficios ? `
                  <ul style="margin: 0.5em 0; font-size: 14px;">
                    ${plan.beneficios.map((b: string) => `<li>${b}</li>`).join('')}
                  </ul>
                  ` : ''}
                </td>
                <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">${formatCurrency(plan.valor)}</td>
              </tr>
              `).join('')}
            </tbody>
          </table>
          <p><em>Plano recomendado: <strong>${context.manutencao?.planoDefault}</strong></em></p>
          ` : ''}
        </div>
      `;
    } catch (error) {
      console.error('Preview error:', error);
      return '<p>Erro ao gerar preview</p>';
    }
  }, [variables, pricingData]);

  const handleSave = async () => {
    if (!id) return;

    setAutoSaving(true);
    try {
      const parsedSections = sections ? JSON.parse(sections) : [];
      const changelog = previousVersion 
        ? generateChangelog(previousVersion.variables, variables)
        : 'Versão inicial';

      const pricing = {
        total: variables.investimento.valor,
        parcelas: pricingData?.parcelas || [],
        manutencao: variables.flags.maintenanceEnabled ? variables.manutencao.planos : null,
        parceria: variables.flags.partnership ? variables.parceria : null,
      };

      await createVersion.mutateAsync({
        proposal_id: id,
        version_number: parseInt(versionNumber || '1'),
        sections: parsedSections,
        variables: variables,
        pricing: pricing,
      });

      toast({
        title: "Versão salva",
        description: "A versão foi salva com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAutoSaving(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (!id || !versionNumber) return;
    
    setIsGeneratingPdf(true);
    try {
      const { error } = await supabase.functions.invoke('proposal-generator', {
        body: { proposalId: id, versionNumber: Number(versionNumber) },
      });

      if (error) throw error;

      toast({
        title: 'PDF gerado com sucesso!',
        description: 'O arquivo está disponível para download.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar PDF',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!proposal) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/propostas/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{proposal.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">Versão {versionNumber}</Badge>
              <span className="text-sm text-muted-foreground">{proposal.proposal_number}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={autoSaving}>
            <Save className="h-4 w-4 mr-2" />
            {autoSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Variables Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Variáveis da Proposta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VariablesEditor variables={variables} onChange={setVariables} />
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          {pricingData && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Investimento Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(pricingData.total)}</span>
                  </div>
                  <Separator />
                  {pricingData.parcelas.map((parcela, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{parcela.descricao} ({parcela.percentual}%)</span>
                      <span>{formatCurrency(parcela.valor)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sections JSON (Advanced) */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seções (JSON)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Estrutura das seções (avançado)</Label>
              <Textarea
                value={sections}
                onChange={(e) => setSections(e.target.value)}
                rows={10}
                className="font-mono text-sm"
                placeholder='[{"key": "intro", "title": "Introdução", "body": "..."}]'
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none overflow-auto max-h-[600px] border rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <PublishProposalModal
        open={publishModalOpen}
        onOpenChange={setPublishModalOpen}
        proposalId={id!}
        versionNumber={Number(versionNumber)}
        onPublished={(url) => {
          toast({ title: 'Link copiado!', description: url });
        }}
      />
    </div>
  );
};
