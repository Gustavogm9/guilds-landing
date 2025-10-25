import { useState, useEffect } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TargetValuesBuilderProps {
  fieldName: string;
  fieldType: string;
  value: string; // JSON string
  onChange: (value: string) => void;
}

const FIELD_SUGGESTIONS: Record<string, string[]> = {
  company_size: ["1-10", "11-50", "51-200", "201-500", "500+"],
  industry: ["Tecnologia", "Saúde", "Educação", "Financeiro", "E-commerce", "Indústria", "Serviços", "Varejo"],
  budget_range: ["Até R$ 10k", "R$ 10k - R$ 30k", "R$ 30k - R$ 50k", "R$ 50k - R$ 100k", "R$ 100k+"],
  decision_timeline: ["Imediato", "1-3 meses", "3-6 meses", "6-12 meses", "12+ meses"],
  seniority_level: ["Júnior", "Pleno", "Sênior", "Gerente", "Diretor", "C-Level"],
  lifecycle_stage: ["lead", "mql", "sql", "customer"],
};

export function TargetValuesBuilder({ fieldName, fieldType, value, onChange }: TargetValuesBuilderProps) {
  const [values, setValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(value || "[]");
      setValues(Array.isArray(parsed) ? parsed : []);
    } catch {
      setValues([]);
    }
  }, []);

  useEffect(() => {
    onChange(JSON.stringify(values));
  }, [values]);

  const addValue = (val: string) => {
    if (val && !values.includes(val)) {
      setValues([...values, val]);
      setInputValue("");
    }
  };

  const removeValue = (val: string) => {
    setValues(values.filter(v => v !== val));
  };

  const suggestions = FIELD_SUGGESTIONS[fieldName] || [];
  const showSuggestions = suggestions.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label>Valores-Alvo *</Label>
          <p className="text-xs text-muted-foreground mt-1">
            Defina os valores que caracterizam seu cliente ideal
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowRawJson(!showRawJson)}
        >
          {showRawJson ? "Visual" : "JSON"}
        </Button>
      </div>

      {showRawJson ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='["valor1", "valor2"]'
          rows={4}
          className="font-mono text-sm"
        />
      ) : (
        <>
          {/* Suggestions */}
          {showSuggestions && values.length < 10 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Sugestões para {fieldName}:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions
                  .filter(s => !values.includes(s))
                  .map(suggestion => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                      onClick={() => addValue(suggestion)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  ))}
              </div>
            </div>
          )}

          {/* Current Values */}
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-lg bg-muted/30">
            {values.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                Nenhum valor definido ainda
              </div>
            ) : (
              values.map(val => (
                <Badge key={val} variant="default" className="gap-1 px-3 py-1">
                  {val}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                    onClick={() => removeValue(val)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
          </div>

          {/* Add Custom Value */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addValue(inputValue);
                }
              }}
              placeholder="Digite um valor customizado..."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => addValue(inputValue)}
              disabled={!inputValue}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {/* Preview */}
          <div className="p-2 bg-muted/50 rounded text-xs">
            <span className="text-muted-foreground">JSON Preview:</span>
            <pre className="mt-1 font-mono">{JSON.stringify(values, null, 2)}</pre>
          </div>
        </>
      )}
    </div>
  );
}
