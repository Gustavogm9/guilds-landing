import { useState } from "react";
import { Search, Database, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FieldOption {
  name: string;
  category: string;
  type: string;
  example: string;
  inForm: boolean;
  inUse?: boolean;
}

interface FieldSelectorProps {
  value: string;
  onChange: (value: string) => void;
  usedFields?: string[];
}

const CRM_FIELDS: FieldOption[] = [
  // Dados Básicos
  { name: "name", category: "Dados Básicos", type: "text", example: "João Silva", inForm: true },
  { name: "email", category: "Dados Básicos", type: "email", example: "joao@empresa.com", inForm: true },
  { name: "phone", category: "Dados Básicos", type: "text", example: "(11) 99999-9999", inForm: true },
  { name: "job_title", category: "Dados Básicos", type: "text", example: "Diretor de TI", inForm: true },
  
  // Empresa
  { name: "company", category: "Empresa", type: "text", example: "Tech Corp LTDA", inForm: true },
  { name: "company_size", category: "Empresa", type: "select", example: "51-200", inForm: true },
  { name: "industry", category: "Empresa", type: "select", example: "Tecnologia", inForm: true },
  
  // Qualificação
  { name: "budget_range", category: "Qualificação", type: "select", example: "R$ 50k - R$ 100k", inForm: true },
  { name: "decision_timeline", category: "Qualificação", type: "select", example: "1-3 meses", inForm: true },
  { name: "seniority_level", category: "Qualificação", type: "text", example: "C-Level", inForm: false },
  { name: "decision_authority", category: "Qualificação", type: "boolean", example: "true", inForm: false },
  
  // Engajamento
  { name: "lead_score", category: "Engajamento", type: "number", example: "75", inForm: false },
  { name: "engagement_score", category: "Engajamento", type: "number", example: "45", inForm: false },
  { name: "lifecycle_stage", category: "Engajamento", type: "select", example: "mql", inForm: false },
  { name: "source", category: "Engajamento", type: "text", example: "website", inForm: true },
  
  // Produto/Interesse
  { name: "products_interest", category: "Produto", type: "array", example: '["software_apps"]', inForm: false },
  { name: "pain_points", category: "Produto", type: "array", example: '["processos manuais"]', inForm: false },
];

export function FieldSelector({ value, onChange, usedFields = [] }: FieldSelectorProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(CRM_FIELDS.map(f => f.category)));
  
  const filteredFields = CRM_FIELDS.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(search.toLowerCase()) ||
                         field.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || field.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).map(field => ({
    ...field,
    inUse: usedFields.includes(field.name)
  }));

  return (
    <div className="space-y-3">
      <div>
        <Label>Campo do CRM *</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Selecione o campo que será usado para avaliar este critério
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar campo..."
          className="pl-9"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!selectedCategory ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedCategory(null)}
        >
          Todos
        </Badge>
        {categories.map(cat => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Field List */}
      <ScrollArea className="h-[300px] border rounded-lg">
        <div className="p-2 space-y-1">
          {filteredFields.map(field => (
            <Card
              key={field.name}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                value === field.name ? 'border-primary bg-primary/5' : ''
              }`}
              onClick={() => onChange(field.name)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm font-medium">{field.name}</span>
                    <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Exemplo: <span className="font-mono">{field.example}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {field.inForm ? (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      No formulário
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      Automático
                    </Badge>
                  )}
                  {field.inUse && (
                    <Badge variant="secondary" className="text-xs">
                      Em uso
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Selected Field Display */}
      {value && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs font-medium text-muted-foreground mb-1">Campo Selecionado:</div>
          <div className="font-mono text-sm">{value}</div>
        </div>
      )}
    </div>
  );
}
