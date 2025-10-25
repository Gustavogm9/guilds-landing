import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ICPGuidedTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  description: string;
  tips: string[];
  action?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "🎯 Bem-vindo ao Sistema ICP",
    description: "O Ideal Customer Profile (ICP) ajuda você a identificar e priorizar leads que melhor se encaixam no seu negócio.",
    tips: [
      "ICP automatiza a qualificação de leads",
      "Scores de 0-100% indicam fit com seu perfil ideal",
      "Critérios ativos determinam o cálculo do score"
    ]
  },
  {
    title: "📋 Criando Critérios",
    description: "Critérios são as características do seu cliente ideal. Cada critério tem um peso que soma 100%.",
    tips: [
      "Clique em 'Novo Critério' para começar",
      "Escolha um campo (ex: company_size, budget_range)",
      "Defina valores-alvo que indicam um bom fit",
      "Atribua peso (critérios importantes têm peso maior)"
    ],
    action: "Criar primeiro critério"
  },
  {
    title: "🎨 Usando Templates",
    description: "Templates pré-configurados aceleram a criação de critérios comuns.",
    tips: [
      "Na aba 'Templates', escolha um template relevante",
      "Templates incluem: Empresa Tech, Startup, Enterprise",
      "Você pode editar o critério após aplicar o template",
      "Templates são apenas pontos de partida"
    ],
    action: "Explorar templates"
  },
  {
    title: "⚖️ Balanceamento de Pesos",
    description: "O peso total dos critérios ativos deve somar 100% para melhor precisão.",
    tips: [
      "Critérios mais importantes = peso maior",
      "Exemplo: Orçamento (30%), Tamanho (25%), Indústria (20%)",
      "O painel de saúde mostra se está balanceado",
      "Você pode ajustar pesos a qualquer momento"
    ]
  },
  {
    title: "🧪 Simulador de Scores",
    description: "Teste seus critérios antes de ativá-los usando o simulador.",
    tips: [
      "Vá para a aba 'Simulador'",
      "Clique em 'Simular Scores' para testar",
      "Veja distribuição de scores nos seus contatos atuais",
      "Ajuste critérios se necessário antes de ativar"
    ],
    action: "Testar no simulador"
  },
  {
    title: "📊 Painel de Saúde",
    description: "Monitore a qualidade da sua configuração ICP em tempo real.",
    tips: [
      "Score de Saúde indica se está bem configurado",
      "Alertas mostram problemas (peso desbalanceado, campos faltantes)",
      "Botão 'Corrigir Problemas' sugere soluções automáticas",
      "Verifique o painel regularmente"
    ]
  },
  {
    title: "🚀 Próximos Passos",
    description: "Seu sistema ICP está quase pronto! Veja como usar no dia a dia.",
    tips: [
      "Scores aparecem automaticamente nos contatos e deals",
      "Use filtros 'High ICP Fit' no CRM Board",
      "Ordene leads por ICP Score para priorizar",
      "Recalcule scores após alterar critérios"
    ],
    action: "Começar a usar"
  }
];

export function ICPGuidedTour({ onComplete, onSkip }: ICPGuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === TOUR_STEPS.length - 1;
  const step = TOUR_STEPS[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onSkip}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <Badge variant="outline">
              Passo {currentStep + 1} de {TOUR_STEPS.length}
            </Badge>
          </div>
          
          <CardTitle className="text-2xl">{step.title}</CardTitle>
          <CardDescription className="text-base">{step.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">Dicas importantes:</div>
            {step.tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{index + 1}</span>
                </div>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {TOUR_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep 
                    ? 'w-2 bg-primary/50' 
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={onSkip}
            size="sm"
          >
            Pular Tour
          </Button>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              size="sm"
            >
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Concluir
                </>
              ) : (
                <>
                  {step.action || 'Próximo'}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}