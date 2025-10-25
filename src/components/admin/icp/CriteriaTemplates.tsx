import { Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CriteriaTemplate {
  name: string;
  description: string;
  criteria: {
    criterion_name: string;
    criterion_type: string;
    criterion_field: string;
    target_values: any[];
    weight: number;
    description: string;
  };
}

const TEMPLATES: CriteriaTemplate[] = [
  {
    name: "Empresas de Médio Porte",
    description: "Foco em empresas entre 51 e 500 funcionários",
    criteria: {
      criterion_name: "Empresas de Médio Porte",
      criterion_type: "company_size",
      criterion_field: "company_size",
      target_values: ["51-200", "201-500"],
      weight: 20,
      description: "Empresas com estrutura suficiente para adotar soluções complexas"
    }
  },
  {
    name: "Indústrias Tech",
    description: "Segmentos de tecnologia e inovação",
    criteria: {
      criterion_name: "Indústrias Tech",
      criterion_type: "industry",
      criterion_field: "industry",
      target_values: ["Tecnologia", "SaaS", "Fintech", "E-commerce"],
      weight: 15,
      description: "Empresas que valorizam transformação digital"
    }
  },
  {
    name: "Decisores C-Level",
    description: "Contatos com poder de decisão executivo",
    criteria: {
      criterion_name: "Decisores C-Level",
      criterion_type: "job_title",
      criterion_field: "seniority_level",
      target_values: ["C-Level", "Diretor"],
      weight: 25,
      description: "Contatos que podem aprovar investimentos significativos"
    }
  },
  {
    name: "Orçamento Premium",
    description: "Budget acima de R$ 50k",
    criteria: {
      criterion_name: "Orçamento Premium",
      criterion_type: "budget",
      criterion_field: "budget_range",
      target_values: ["R$ 50k - R$ 100k", "R$ 100k+"],
      weight: 20,
      description: "Orçamento alinhado com projetos enterprise"
    }
  },
  {
    name: "Timeline Curto",
    description: "Urgência em implementar solução",
    criteria: {
      criterion_name: "Timeline Curto",
      criterion_type: "timeline",
      criterion_field: "decision_timeline",
      target_values: ["Imediato", "1-3 meses"],
      weight: 10,
      description: "Leads com necessidade urgente têm maior propensão a fechar"
    }
  },
  {
    name: "Alto Engajamento",
    description: "Leads que interagem frequentemente",
    criteria: {
      criterion_name: "Alto Engajamento",
      criterion_type: "custom",
      criterion_field: "engagement_score",
      target_values: ["40", "50", "60", "70", "80", "90", "100"],
      weight: 10,
      description: "Leads engajados convertem melhor"
    }
  }
];

interface CriteriaTemplatesProps {
  onApplyTemplate: (template: CriteriaTemplate['criteria']) => void;
}

export function CriteriaTemplates({ onApplyTemplate }: CriteriaTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Templates de Critérios</CardTitle>
        </div>
        <CardDescription>
          Use templates prontos para acelerar a configuração do seu ICP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {TEMPLATES.map((template, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApplyTemplate(template.criteria)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Usar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Campo:</span>
                      <Badge variant="outline" className="font-mono">
                        {template.criteria.criterion_field}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Valores:</span>
                      <div className="flex flex-wrap gap-1">
                        {template.criteria.target_values.slice(0, 3).map((val, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {val}
                          </Badge>
                        ))}
                        {template.criteria.target_values.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.criteria.target_values.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Peso:</span>
                      <Badge className="bg-primary">{template.criteria.weight}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
