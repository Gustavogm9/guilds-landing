import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Code,
  Zap,
  Gamepad2,
  Users,
  Smartphone,
  Brain,
  Rocket,
  Settings
} from "lucide-react";

const services = [
  {
    icon: Code,
    title: "Desenvolvimento de Software & Apps",
    description: "Criamos soluções digitais completas, desde aplicações web até apps mobile nativos, sempre com foco na experiência do usuário e performance.",
    features: [
      "Aplicações Web Responsivas",
      "Apps Mobile (iOS/Android)",
      "Sistemas Corporativos",
      "APIs e Integrações",
      "E-commerce Avançado"
    ],
    technologies: ["React", "React Native", "Node.js", "Python", "PostgreSQL"],
    href: "/servicos/software-apps",
    gradient: "from-blue-500 to-purple-600"
  },
  {
    icon: Zap,
    title: "Automação & IA",
    description: "Implementamos inteligência artificial e automação para otimizar processos, reduzir custos e aumentar a eficiência operacional da sua empresa.",
    features: [
      "Chatbots Inteligentes",
      "Análise Preditiva",
      "Automação de Processos",
      "Machine Learning",
      "Visão Computacional"
    ],
    technologies: ["Python", "TensorFlow", "OpenAI", "AWS", "Azure"],
    href: "/servicos/automacao-ia",
    gradient: "from-emerald-500 to-teal-600"
  },
  {
    icon: Gamepad2,
    title: "Jogos Corporativos & Gamificação",
    description: "Desenvolvemos jogos corporativos e estratégias de gamificação para aumentar engajamento, treinamento e produtividade das equipes.",
    features: [
      "Jogos de Treinamento",
      "Plataformas Gamificadas",
      "Simuladores Corporativos",
      "Realidade Virtual/AR",
      "Sistemas de Pontuação"
    ],
    technologies: ["Unity", "Unreal Engine", "WebGL", "AR/VR", "Blockchain"],
    href: "/servicos/jogos-gamificacao",
    gradient: "from-orange-500 to-red-600"
  },
  {
    icon: Users,
    title: "Consultoria & Discovery",
    description: "Oferecemos consultoria estratégica para identificar oportunidades de digitalização e descobrir as melhores soluções para seu negócio.",
    features: [
      "Auditoria Tecnológica",
      "Estratégia Digital",
      "Design Thinking",
      "Prototipagem Rápida",
      "Roadmap de Inovação"
    ],
    technologies: ["Metodologias Ágeis", "Design Sprint", "Lean Startup", "OKRs"],
    href: "/servicos/consultoria",
    gradient: "from-purple-500 to-pink-600"
  }
];

const additionalServices = [
  {
    icon: Smartphone,
    title: "UX/UI Design",
    description: "Design centrado no usuário para criar experiências memoráveis"
  },
  {
    icon: Brain,
    title: "Data Science",
    description: "Análise de dados para insights estratégicos de negócio"
  },
  {
    icon: Rocket,
    title: "DevOps",
    description: "Infraestrutura e deploy automatizado para máxima performance"
  },
  {
    icon: Settings,
    title: "Integração",
    description: "Conectamos seus sistemas existentes de forma eficiente"
  }
];

const Services = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-guild-hero py-24">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-6">
              🛠️ Nossos Serviços
            </Badge>
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              Soluções <span className="text-gradient">completas</span> para 
              seu negócio digital
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Oferecemos um portfólio abrangente de serviços tecnológicos, 
              desde desenvolvimento até consultoria estratégica, sempre com 
              foco na excelência e inovação.
            </p>
            <Button asChild className="btn-hero">
              <Link to="/contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24">
        <div className="container">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${!isEven ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={!isEven ? 'lg:col-start-2' : ''}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-sora font-bold">
                            {service.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      <div>
                        <h3 className="font-semibold mb-4 text-brand-primary">
                          O que incluímos:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3 text-brand-primary">
                          Tecnologias:
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button asChild className="btn-hero">
                        <Link to={service.href}>
                          Saiba Mais
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={!isEven ? 'lg:col-start-1' : ''}>
                    <div className={`relative p-8 bg-gradient-to-br ${service.gradient} rounded-3xl`}>
                      <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
                      <div className="relative text-white">
                        <Icon className="h-24 w-24 mb-6 opacity-80" />
                        <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                        <p className="text-white/90 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
              Serviços Complementares
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos também serviços especializados para complementar 
              sua estratégia digital
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="card-elevated p-8 text-center">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Vamos construir algo incrível juntos?
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Entre em contato conosco e descubra como podemos 
              transformar suas ideias em realidade digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero">
                <Link to="/contato">
                  Iniciar Conversa
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-glass border-white/20 text-white hover:bg-white/10">
                <Link to="/cases">
                  Ver Nossos Cases
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