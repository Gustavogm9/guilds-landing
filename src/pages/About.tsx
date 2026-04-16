
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Target } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { aboutValues, aboutStats, aboutTimeline } from "@/data/defaultContent";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

const About = () => {
  const { getContent } = useContent();
  const values = getContent('page_about_values', aboutValues);
  const stats = getContent('page_about_stats', aboutStats);
  const timeline = getContent('page_about_timeline', aboutTimeline);

  return <div className="min-h-screen">
    {/* Hero Section */}
    <section className="bg-guild-hero py-16 md:py-20">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-6">
            🏰 Nossa História
          </Badge>
          <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
            A <span className="text-gradient">tradição</span> das guildas
            encontra a <span className="text-gradient">inovação</span> tecnológica
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Somos uma empresa de tecnologia que combina a sabedoria e excelência
            das antigas guildas medievais com as mais avançadas tecnologias do século XXI.
            Nossa missão é transformar negócios através de soluções digitais inovadoras.
          </p>
        </div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-8">
              Nossa Missão
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Democratizar o acesso à tecnologia de ponta, ajudando empresas de todos
              os tamanhos a se transformarem digitalmente e alcançarem seu máximo potencial
              através de soluções inovadoras e personalizadas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Acreditamos que a tecnologia deve ser uma ferramenta de empoderamento,
              não de complicação. Por isso, focamos em criar soluções que são ao mesmo
              tempo poderosas e intuitivas.
            </p>
          </div>

          <div className="card-glass p-8">
            <Target className="h-12 w-12 text-brand-primary mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Nossa Visão</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ser reconhecida como a principal referência em soluções tecnológicas
              inovadoras no Brasil, criando um ecossistema onde tradição e inovação
              se encontram para gerar valor excepcional para nossos clientes e sociedade.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Nossos Valores
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Os princípios que guiam nossa conduta e definem nossa identidade como guilda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value: any, index: number) => {
            return <div key={index} className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DynamicIcon name={value.icon} className="h-8 w-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>;
          })}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Números que Falam
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Resultados concretos da nossa dedicação à excelência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat: any, index: number) => <div key={index} className="text-center">
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <h3 className="text-lg font-semibold">{stat.label}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>)}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
            Nossa Jornada
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A evolução da Guilds ao longo dos anos
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-brand-primary to-brand-accent"></div>

          <div className="space-y-16">
            {timeline.map((item: any, index: number) => <div key={index} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                <div className="card-elevated p-6">
                  <div className="text-2xl font-bold text-brand-primary mb-2">
                    {item.year}
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="w-4 h-4 bg-brand-primary rounded-full border-4 border-background relative z-10"></div>

              <div className="w-1/2"></div>
            </div>)}
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-12 md:py-16 bg-neutral-900 text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-sora font-bold mb-6">
            Pronto para se juntar à nossa guilda?
          </h2>
          <p className="text-lg text-neutral-300 mb-8">
            Descubra como nossa experiência e paixão por tecnologia
            podem transformar seu negócio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-hero">
              <Link to="/contato">
                Falar Conosco
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="btn-glass border-white/20 text-white hover:bg-white/10">

            </Button>
          </div>
        </div>
      </div>
    </section>
  </div>;
};
export default About;