import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface VariablesEditorProps {
  variables: any;
  onChange: (variables: any) => void;
}

export const VariablesEditor = ({ variables, onChange }: VariablesEditorProps) => {
  const updateField = (path: string[], value: any) => {
    const newVars = { ...variables };
    let current = newVars;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    onChange(newVars);
  };

  const addSprint = () => {
    const sprints = variables?.prazos?.sprints || [];
    updateField(['prazos', 'sprints'], [
      ...sprints,
      {
        nome: `Sprint ${sprints.length + 1}`,
        inicio: '',
        fim: '',
        entregas: []
      }
    ]);
  };

  const removeSprint = (index: number) => {
    const sprints = [...(variables?.prazos?.sprints || [])];
    sprints.splice(index, 1);
    updateField(['prazos', 'sprints'], sprints);
  };

  const updateSprint = (index: number, field: string, value: any) => {
    const sprints = [...(variables?.prazos?.sprints || [])];
    sprints[index] = { ...sprints[index], [field]: value };
    updateField(['prazos', 'sprints'], sprints);
  };

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="cliente">
        <AccordionTrigger>Informações do Cliente</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label>Razão Social</Label>
            <Input
              value={variables?.cliente?.razaoSocial || ''}
              onChange={(e) => updateField(['cliente', 'razaoSocial'], e.target.value)}
              placeholder="Nome da Empresa Ltda"
            />
          </div>
          <div>
            <Label>CNPJ</Label>
            <Input
              value={variables?.cliente?.cnpj || ''}
              onChange={(e) => updateField(['cliente', 'cnpj'], e.target.value)}
              placeholder="00.000.000/0000-00"
            />
          </div>
          <div>
            <Label>Endereço</Label>
            <Input
              value={variables?.cliente?.endereco || ''}
              onChange={(e) => updateField(['cliente', 'endereco'], e.target.value)}
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>
          <div>
            <Label>Nome do Contato</Label>
            <Input
              value={variables?.cliente?.contato?.nome || ''}
              onChange={(e) => updateField(['cliente', 'contato', 'nome'], e.target.value)}
              placeholder="João Silva"
            />
          </div>
          <div>
            <Label>E-mail do Contato</Label>
            <Input
              type="email"
              value={variables?.cliente?.contato?.email || ''}
              onChange={(e) => updateField(['cliente', 'contato', 'email'], e.target.value)}
              placeholder="contato@empresa.com"
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="projeto">
        <AccordionTrigger>Informações do Projeto</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label>Nome do Projeto</Label>
            <Input
              value={variables?.projeto?.nome || ''}
              onChange={(e) => updateField(['projeto', 'nome'], e.target.value)}
              placeholder="Sistema de Gestão"
            />
          </div>
          <div>
            <Label>Objetivos (separados por linha)</Label>
            <Textarea
              value={variables?.projeto?.objetivos?.join('\n') || ''}
              onChange={(e) => updateField(['projeto', 'objetivos'], e.target.value.split('\n').filter(Boolean))}
              placeholder="Objetivo 1&#10;Objetivo 2&#10;Objetivo 3"
              rows={4}
            />
          </div>
          <div>
            <Label>Vertical</Label>
            <Select
              value={variables?.projeto?.vertical || ''}
              onValueChange={(value) => updateField(['projeto', 'vertical'], value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a vertical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Saude">Saúde</SelectItem>
                <SelectItem value="Educacao">Educação</SelectItem>
                <SelectItem value="Agro">Agro</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="prazos">
        <AccordionTrigger>Prazos & Sprints</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label>Dias de Execução</Label>
            <Input
              type="number"
              value={variables?.prazos?.diasExecucao || ''}
              onChange={(e) => updateField(['prazos', 'diasExecucao'], parseInt(e.target.value))}
              placeholder="120"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sprints</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSprint}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Sprint
              </Button>
            </div>

            {(variables?.prazos?.sprints || []).map((sprint: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Sprint {idx + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSprint(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    value={sprint.nome || ''}
                    onChange={(e) => updateSprint(idx, 'nome', e.target.value)}
                    placeholder="Nome da sprint"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Início</Label>
                      <Input
                        type="date"
                        value={sprint.inicio || ''}
                        onChange={(e) => updateSprint(idx, 'inicio', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Fim</Label>
                      <Input
                        type="date"
                        value={sprint.fim || ''}
                        onChange={(e) => updateSprint(idx, 'fim', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Entregas (separadas por linha)</Label>
                    <Textarea
                      value={sprint.entregas?.join('\n') || ''}
                      onChange={(e) => updateSprint(idx, 'entregas', e.target.value.split('\n').filter(Boolean))}
                      placeholder="Entrega 1&#10;Entrega 2"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="investimento">
        <AccordionTrigger>Investimento & Pagamento</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <Label>Valor Total (R$)</Label>
            <Input
              type="number"
              step="0.01"
              value={variables?.investimento?.valor || ''}
              onChange={(e) => updateField(['investimento', 'valor'], parseFloat(e.target.value))}
              placeholder="18935.00"
            />
          </div>
          <div>
            <Label>Modelo de Pagamento</Label>
            <Select
              value={variables?.pagamento?.modelo || '30-20-20-30'}
              onValueChange={(value) => updateField(['pagamento', 'modelo'], value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30-20-20-30">30-20-20-30 (4 parcelas)</SelectItem>
                <SelectItem value="50-50">50-50 (2 parcelas)</SelectItem>
                <SelectItem value="100-0">100% antecipado</SelectItem>
                <SelectItem value="custom">Customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vencimentos (separados por linha)</Label>
            <Textarea
              value={variables?.pagamento?.vencimentos?.join('\n') || ''}
              onChange={(e) => updateField(['pagamento', 'vencimentos'], e.target.value.split('\n').filter(Boolean))}
              placeholder="D0 (Assinatura)&#10;S+2 (2 semanas)&#10;S+4 (1 mês)&#10;Entrega Final"
              rows={4}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      {variables?.flags?.maintenanceEnabled && (
        <AccordionItem value="manutencao">
          <AccordionTrigger>Manutenção</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Plano Padrão Recomendado</Label>
              <Select
                value={variables?.manutencao?.planoDefault || 'Steady'}
                onValueChange={(value) => updateField(['manutencao', 'planoDefault'], value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Steady">Steady</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {variables?.flags?.partnership && (
        <AccordionItem value="parceria">
          <AccordionTrigger>Parceria & RevShare</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>% Guilds na Implementação</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={variables?.parceria?.percentualImpl || ''}
                onChange={(e) => updateField(['parceria', 'percentualImpl'], parseInt(e.target.value))}
                placeholder="50"
              />
            </div>
            <div>
              <Label>% Guilds Mensal (RecRev)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={variables?.parceria?.percentualMensal || ''}
                onChange={(e) => updateField(['parceria', 'percentualMensal'], parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
};
