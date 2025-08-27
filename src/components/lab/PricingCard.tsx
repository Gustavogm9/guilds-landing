import { Check } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QualificationButton } from '@/components/forms/QualificationButton';

interface PricingPlan {
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export const PricingCard = ({ plan, className }: PricingCardProps) => {
  return (
    <Card className={`relative hover:shadow-lg transition-all duration-300 ${plan.highlighted ? 'border-primary shadow-md scale-105' : 'border-muted/30'} ${className}`}>
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default" className="px-3 py-1 bg-gradient-to-r from-primary to-accent">
            {plan.badge}
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
        <div className="pt-2">
          <span className="text-3xl font-bold">Sob consulta</span>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <QualificationButton 
          variant={plan.highlighted ? "default" : "outline"}
          className="w-full"
          size="lg"
        >
          Solicitar Proposta
        </QualificationButton>
      </CardFooter>
    </Card>
  );
};

export const PricingGrid = ({ className }: { className?: string }) => {
  const plans: PricingPlan[] = [
    {
      name: "Bronze",
      description: "Perfeito para equipes pequenas",
      features: [
        "Até 15 participantes",
        "1 workshop por mês",
        "Suporte por email",
        "Certificados digitais",
        "Material didático incluso"
      ]
    },
    {
      name: "Prata",
      description: "Ideal para empresas em crescimento",
      highlighted: true,
      badge: "Mais Popular",
      features: [
        "Até 30 participantes",
        "2 workshops por mês",
        "Suporte prioritário",
        "Certificados digitais",
        "Material didático incluso",
        "Trilhas personalizadas",
        "1 sessão de mentoria mensal"
      ]
    },
    {
      name: "Ouro",
      description: "Solução completa para grandes empresas",
      features: [
        "Participantes ilimitados",
        "Workshops ilimitados",
        "Suporte 24/7",
        "Certificados digitais",
        "Material didático incluso",
        "Trilhas personalizadas",
        "Mentoria semanal",
        "Dashboard de analytics",
        "API de integração",
        "Workshops in-company"
      ]
    }
  ];

  return (
    <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
      {plans.map((plan, index) => (
        <PricingCard key={index} plan={plan} />
      ))}
    </div>
  );
};