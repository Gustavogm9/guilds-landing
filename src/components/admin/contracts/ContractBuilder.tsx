import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Bot, 
  Eye, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Palette,
  Send,
  Save,
  RotateCcw,
  Loader2,
  Info
} from 'lucide-react';
import { useLegal, LegalContract, LegalClause } from '@/hooks/useLegal';
import { useCRM } from '@/hooks/useCRM';

interface ContractBuilderProps {
  contractId?: string | null;
}

export const ContractBuilder = ({ contractId }: ContractBuilderProps) => {
  const [selectedContract, setSelectedContract] = useState<LegalContract | null>(null);
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [contractData, setContractData] = useState({
    title: '',
    client_contact_id: '',
    deal_id: '',
    template_id: '',
    variables_data: {}
  });
  const [clausesByGroup, setClausesByGroup] = useState<Record<string, LegalClause[]>>({});

  const {
    contracts,
    clauseGroups,
    templates,
    fetchClausesByGroup,
    createContract,
    updateContract,
    generateContractDraft,
    reviewContractWithAI,
    generateLawDesign,
    sendToClicksign,
    isCreatingContract,
    isUpdatingContract,
    isGeneratingDraft,
    isReviewingContract,
    isGeneratingLawDesign,
    isSendingToClicksign
  } = useLegal();

  const { contacts } = useCRM();

  // Load contract if contractId is provided
  useEffect(() => {
    if (contractId && contracts.length > 0) {
      const contract = contracts.find(c => c.id === contractId);
      if (contract) {
        setSelectedContract(contract as any);
        setContractData({
          title: contract.title,
          client_contact_id: contract.client_contact_id,
          deal_id: contract.deal_id || '',
          template_id: contract.template_id,
          variables_data: contract.variables_data
        });
        setSelectedClauses(contract.selected_clauses);
      }
    }
  }, [contractId, contracts]);

  // Load clauses for each group
  useEffect(() => {
    const loadClauses = async () => {
      const clausesData: Record<string, LegalClause[]> = {};
      for (const group of clauseGroups) {
        try {
          const clauses = await fetchClausesByGroup(group.id);
          clausesData[group.id] = clauses;
        } catch (error) {
          console.error('Erro ao carregar cláusulas:', error);
        }
      }
      setClausesByGroup(clausesData);
    };

    if (clauseGroups.length > 0) {
      loadClauses();
    }
  }, [clauseGroups, fetchClausesByGroup]);

  const handleSaveContract = async () => {
    try {
      if (selectedContract) {
        await updateContract.mutateAsync({
          id: selectedContract.id,
          ...contractData,
          selected_clauses: selectedClauses
        });
      } else {
        const result = await createContract.mutateAsync({
          ...contractData,
          selected_clauses: selectedClauses
        });
        setSelectedContract(result as any);
      }
    } catch (error) {
      console.error('Erro ao salvar contrato:', error);
    }
  };

  const handleGenerateDraft = async () => {
    if (!selectedContract) return;
    try {
      await generateContractDraft.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error('Erro ao gerar rascunho:', error);
    }
  };

  const handleReviewContract = async () => {
    if (!selectedContract) return;
    try {
      await reviewContractWithAI.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error('Erro na revisão jurídica:', error);
    }
  };

  const handleGenerateLawDesign = async () => {
    if (!selectedContract) return;
    try {
      await generateLawDesign.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error('Erro ao gerar Law Design:', error);
    }
  };

  const handleSendToClicksign = async () => {
    if (!selectedContract) return;
    try {
      await sendToClicksign.mutateAsync(selectedContract.id);
    } catch (error) {
      console.error('Erro ao enviar para Clicksign:', error);
    }
  };

  const toggleClause = (clauseId: string) => {
    setSelectedClauses(prev => 
      prev.includes(clauseId) 
        ? prev.filter(id => id !== clauseId)
        : [...prev, clauseId]
    );
  };

  const isClauseSelected = (clauseId: string) => selectedClauses.includes(clauseId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Configuração do Contrato */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            {selectedContract ? 'Editar Contrato' : 'Novo Contrato'}
          </CardTitle>
          <CardDescription>
            Configure os dados básicos do contrato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Contrato</Label>
            <Input
              id="title"
              placeholder="Ex: Contrato de Desenvolvimento - Cliente X"
              value={contractData.title}
              onChange={(e) => setContractData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Cliente</Label>
            <Select 
              value={contractData.client_contact_id} 
              onValueChange={(value) => setContractData(prev => ({ ...prev, client_contact_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} {contact.company && `- ${contact.company}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select 
              value={contractData.template_id} 
              onValueChange={(value) => setContractData(prev => ({ ...prev, template_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                    {template.is_default && <Badge variant="secondary" className="ml-2">Padrão</Badge>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleSaveContract}
              disabled={isCreatingContract || isUpdatingContract}
              className="w-full"
            >
              {(isCreatingContract || isUpdatingContract) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Salvar Contrato
            </Button>

            {selectedContract && (
              <>
                <Button 
                  onClick={handleGenerateDraft}
                  disabled={isGeneratingDraft}
                  variant="outline"
                  className="w-full"
                >
                  {isGeneratingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Bot className="mr-2 h-4 w-4" />
                  Gerar com IA
                </Button>

                <Button 
                  onClick={handleReviewContract}
                  disabled={isReviewingContract}
                  variant="outline"
                  className="w-full"
                >
                  {isReviewingContract && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Revisão Jurídica IA
                </Button>

                <Button 
                  onClick={handleGenerateLawDesign}
                  disabled={isGeneratingLawDesign}
                  variant="outline"
                  className="w-full"
                >
                  {isGeneratingLawDesign && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Palette className="mr-2 h-4 w-4" />
                  Law Design
                </Button>

                <Button 
                  onClick={handleSendToClicksign}
                  disabled={isSendingToClicksign}
                  className="w-full"
                >
                  {isSendingToClicksign && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="mr-2 h-4 w-4" />
                  Enviar p/ Clicksign
                </Button>
              </>
            )}
          </div>

          {selectedContract && (
            <>
              <Separator />
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Número:</strong> {selectedContract.contract_number}</p>
                <p><strong>Status:</strong> {selectedContract.status}</p>
                <p><strong>Criado:</strong> {new Date(selectedContract.created_at).toLocaleDateString()}</p>
                {selectedContract.ai_risk_score && (
                  <p><strong>Score de Risco IA:</strong> {selectedContract.ai_risk_score}/100</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seleção de Cláusulas */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Cláusulas do Contrato
            </span>
            <Badge variant="outline">
              {selectedClauses.length} selecionadas
            </Badge>
          </CardTitle>
          <CardDescription>
            Selecione as cláusulas que farão parte do contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Accordion type="multiple" className="w-full">
              {clauseGroups.map((group) => (
                <AccordionItem key={group.id} value={group.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-2">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: group.color }}
                        />
                        <span>{group.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {clausesByGroup[group.id]?.filter(c => isClauseSelected(c.id)).length || 0}/
                        {clausesByGroup[group.id]?.length || 0}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pl-6">
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                      {clausesByGroup[group.id]?.map((clause) => (
                        <div key={clause.id} className="space-y-2">
                          <div className="flex items-start space-x-3">
                            <Switch
                              checked={isClauseSelected(clause.id)}
                              onCheckedChange={() => toggleClause(clause.id)}
                              disabled={clause.is_locked_by_legal}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-sm">{clause.title}</p>
                                {clause.is_locked_by_legal && (
                                  <Badge variant="outline" className="text-xs">
                                    Travado pelo Jurídico
                                  </Badge>
                                )}
                                {clause.tags.length > 0 && (
                                  <div className="flex space-x-1">
                                    {clause.tags.map(tag => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {clause.content_markdown.substring(0, 150)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!clausesByGroup[group.id] || clausesByGroup[group.id].length === 0) && (
                        <p className="text-sm text-muted-foreground italic">
                          Nenhuma cláusula encontrada neste grupo.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};