import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricBadge } from "@/components/ui/MetricBadge";
import { 
  ArrowRight,
  Code,
  Zap,
  Gamepad2,
  Search,
  TrendingUp,
  Target,
  Users,
  Clock
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Desenvolvimento de Software & Apps",
    description: "Produtos digitais sob medida, do zero ao lançamento.",
    metric: { icon: TrendingUp, value: "85%", label: "redução no time-to-market" },
    benefitBullet: "Desenvolvimento ágil com entregas iterativas e feedback contínuo",
    href: "/servicos/software-apps"
  },
  {
    icon: Zap,
    title: "Automação & IA", 
    description: "Automatize fluxos. Decida melhor com IA.",
    metric: { icon: Target, value: "60%", label: "redução em tarefas manuais" },
    benefitBullet: "Integração com seus sistemas existentes (CRM, ERP, WhatsApp)",
    href: "/servicos/automacao-ia"
  },
  {
    icon: Gamepad2,
    title: "Jogos Corporativos & Gamificação",
    description: "Aprendizado que engaja. Cultura que fica.",
    metric: { icon: Users, value: "90%", label: "aumento no engajamento" },
    benefitBullet: "Treinamentos corporativos com alta retenção e aplicação prática",
    href: "/servicos/jogos-gamificacao"
  },
  {
    icon: Search,
    title: "Consultoria & Discovery", 
    description: "Mapeamento de oportunidades, arquitetura e roadmaps estratégicos.",
    metric: { icon: Clock, value: "30%", label: "aceleração na execução" },
    benefitBullet: "Diagnóstico completo com plano de ação priorizado por impacto",
    href: "/servicos/consultoria"
  }
];


const Services = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Intro Curta */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-6">
              🛠️ Nossos Serviços
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold mb-6">
              Sistemas inteligentes, <span className="text-gradient">resultados reais</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Oferecemos soluções digitais sob medida - software, apps, automação, IA e gamificação - sempre com foco no seu objetivo e ROI.
            </p>
          </div>
        </div>
      </section>

      {/* Grid dos 4 Serviços */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              const MetricIcon = service.metric.icon;
              
              return (
                <div key={index} className="card-elevated p-8 h-full flex flex-col">
                  {/* Header com ícone e título */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-sora font-bold mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mini-métrica */}
                  <div className="mb-6">
                    <MetricBadge
                      icon={MetricIcon}
                      value={service.metric.value}
                      label={service.metric.label}
                      variant="primary"
                      size="sm"
                    />
                  </div>
                  
                  {/* Bullet de benefício */}
                  <div className="mb-8 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.benefitBullet}
                      </p>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <Button asChild className="w-full">
                    <Link to={service.href}>
                      Saiba Mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Agende uma conversa e descubra como nossas soluções podem gerar resultados reais para sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contato">
                  Falar com a Guilds
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/cases">
                  Ver Cases
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;