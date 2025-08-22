import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight,
  Shield,
  Sparkles,
  Target,
  Trophy
} from "lucide-react";
import { GuildShield, GuildHammer, GuildCrest } from "@/components/icons";
import heroImage from "@/assets/hero-image.jpg";

const services = [
  {
    icon: GuildHammer,
    title: "Software & Apps",
    description: "Desenvolvemos soluções digitais sob medida para sua empresa",
    href: "/servicos/software-apps"
  },
  {
    icon: GuildCrest,
    title: "Automação & IA",
    description: "Forjamos sistemas inteligentes para otimizar seus processos",
    href: "/servicos/automacao-ia"
  },
  {
    icon: GuildShield,
    title: "Jogos & Gamificação",
    description: "Criamos experiências que engajam e transformam equipes",
    href: "/servicos/jogos-gamificacao"
  },
  {
    icon: GuildCrest,
    title: "Consultoria",
    description: "Estratégia e descoberta de oportunidades digitais",
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
      <section className="relative overflow-hidden bg-gradient-forge py-24 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-guild-gold/10 text-guild-gold border-guild-gold/20 animate-glow">
                  ⚡ Forjando o futuro digital
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-sora font-bold leading-tight text-white">
                  Sistemas{" "}
                  <span className="text-gradient bg-gradient-to-r from-guild-gold to-guild-silver bg-clip-text text-transparent">inteligentes</span>{", "}
                  resultados reais
                </h1>
                <p className="text-lg text-neutral-300 max-w-lg">
                  Como uma guilda medieval, unimos maestria artesanal com tecnologia de ponta 
                  para forjar soluções digitais que transformam negócios.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="btn-forge shadow-guild hover:shadow-forge">
                  <Link to="/contato">
                    <GuildHammer className="mr-2 h-4 w-4" variant="forge" />
                    Forjar Meu Projeto
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild className="btn-shield hover:btn-heraldic">
                  <Link to="/cases">
                    <GuildShield className="mr-2 h-4 w-4" variant="outline" />
                    Ver Cases
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center card-shield p-4 animate-float">
                    <div className="text-2xl font-bold text-guild-gold animate-glow">
                      {stat.number}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-guild-gold/20 to-guild-silver/20 rounded-3xl blur-3xl animate-shield-pulse"></div>
              <img
                src={heroImage}
                alt="Guilds - Forjando o futuro digital"
                className="relative rounded-3xl shadow-forge animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background relative">
        <div className="absolute inset-0 guild-border opacity-20"></div>
        <div className="container relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
              Arsenal de <span className="text-gradient bg-gradient-to-r from-guild-gold to-brand-primary bg-clip-text text-transparent">Serviços</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada solução é forjada com precisão medieval e tecnologia de ponta
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  to={service.href}
                  className="group card-heraldic p-8 hover:card-shield transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-guild-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-guild-gold group-hover:text-black transition-all duration-300 animate-glow">
                      <Icon className="h-7 w-7 text-guild-gold group-hover:text-black" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-guild-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center mt-4 text-guild-gold group-hover:translate-x-2 transition-transform">
                    <span className="text-sm font-medium">Descobrir</span>
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
      <section className="py-24 bg-gradient-forge text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-guild-primary opacity-10 animate-shield-pulse"></div>
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <GuildCrest className="h-16 w-16 mx-auto mb-6 text-guild-gold animate-glow" variant="crown" />
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
              Pronto para forjar seu <span className="text-guild-gold">futuro digital</span>?
            </h2>
            <p className="text-lg text-neutral-300 mb-8">
              Junte-se às mais de 50 empresas que já transformaram 
              seus negócios com nossa maestria tecnológica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-forge shadow-guild hover:shadow-forge">
                <Link to="/contato">
                  <GuildHammer className="mr-2 h-4 w-4" variant="forge" />
                  Iniciar Forja
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild className="btn-shield border-guild-silver/20 text-white hover:bg-guild-silver/10">
                <Link to="/lab">
                  <GuildShield className="mr-2 h-4 w-4" variant="outline" />
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