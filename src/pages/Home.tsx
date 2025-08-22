import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Code,
  Zap,
  Gamepad2,
  Users,
  Shield,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const services = [
  {
    icon: Code,
    title: "Software & Apps",
    description: "Desenvolvimento completo de soluções digitais escaláveis",
    href: "/servicos/software-apps"
  },
  {
    icon: Zap,
    title: "Automação & IA",
    description: "Inteligência artificial para otimizar seus processos",
    href: "/servicos/automacao-ia"
  },
  {
    icon: Gamepad2,
    title: "Jogos & Gamificação",
    description: "Engajamento através de experiências interativas",
    href: "/servicos/jogos-gamificacao"
  },
  {
    icon: Users,
    title: "Consultoria",
    description: "Estratégia e descoberta de oportunidades de negócio",
    href: "/servicos/consultoria"
  }
];

const stats = [
  { number: "100+", label: "Projetos Entregues" },
  { number: "50+", label: "Empresas Atendidas" },
  { number: "98%", label: "Satisfação dos Clientes" },
  { number: "5+", label: "Anos de Mercado" }
];

const features = [
  {
    icon: Shield,
    title: "Expertise Comprovada",
    description: "Equipe especializada com anos de experiência em tecnologia"
  },
  {
    icon: Sparkles,
    title: "Inovação Constante",
    description: "Sempre utilizando as tecnologias mais avançadas do mercado"
  },
  {
    icon: Target,
    title: "Foco em Resultados",
    description: "Projetos alinhados aos objetivos estratégicos do seu negócio"
  },
  {
    icon: Trophy,
    title: "Qualidade Premium",
    description: "Padrões rigorosos de qualidade em cada entrega"
  }
];

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-guild-hero py-24 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                  🚀 Construindo o futuro digital
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold leading-tight">
                  Tecnologia de{" "}
                  <span className="text-gradient">elite</span>{" "}
                  para sua empresa
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Unimos a sabedoria das guildas ancestrais com tecnologia de ponta 
                  para criar soluções digitais que transformam negócios.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-hero">
                  <Link to="/contato">
                    Iniciar Projeto
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-glass">
                  <Link to="/cases">
                    Ver Cases
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-brand-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="Guilds - Tecnologia do futuro"
                className="relative rounded-3xl shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
              Nossos Serviços
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Soluções completas para levar sua empresa ao próximo nível tecnológico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  to={service.href}
                  className="group card-elevated p-8 hover:scale-105 transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                      <Icon className="h-7 w-7 text-brand-primary group-hover:text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-brand-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center mt-4 text-brand-primary group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Saiba mais</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
                Por que escolher a{" "}
                <span className="text-gradient">Guilds</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Combinamos a tradição de excelência das guildas medievais 
                com as mais avançadas tecnologias do mercado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-brand-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="card-glass p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gradient">
                  Metodologia Ágil
                </h3>
                <p className="text-muted-foreground mb-6">
                  Utilizamos metodologias ágeis para garantir entregas rápidas 
                  e de qualidade, mantendo você sempre informado sobre o progresso.
                </p>
                <Button asChild variant="outline">
                  <Link to="/sobre">
                    Conheça Nossa Metodologia
                  </Link>
                </Button>
              </div>

              <div className="card-glass p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gradient">
                  Suporte Contínuo
                </h3>
                <p className="text-muted-foreground mb-6">
                  Não terminamos nossa parceria na entrega. Oferecemos 
                  suporte contínuo e melhorias para seu projeto.
                </p>
                <Button asChild variant="outline">
                  <Link to="/contato">
                    Falar com Especialista
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-guild-primary opacity-10"></div>
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Pronto para transformar seu negócio?
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Junte-se a mais de 50 empresas que já transformaram 
              seus negócios com nossas soluções tecnológicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-hero">
                <Link to="/contato">
                  Começar Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="btn-glass border-white/20 text-white hover:bg-white/10">
                <Link to="/lab">
                  Explorar Guilds Lab
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;