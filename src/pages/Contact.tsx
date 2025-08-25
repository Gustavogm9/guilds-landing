import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { QualificationButton } from "@/components/forms/QualificationButton";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Zap
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui implementaríamos a lógica de envio
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-guild-hero py-16 md:py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-6">
              💬 Fale Conosco
            </Badge>
            <h1 className="text-4xl md:text-5xl font-sora font-bold mb-6">
              Vamos <span className="text-gradient">conversar</span> sobre 
              seu projeto
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Estamos prontos para transformar suas ideias em soluções digitais 
              inovadoras. Entre em contato e vamos construir algo incrível juntos.
            </p>

            {/* Quick CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <QualificationButton className="btn-forge">
                <Zap className="mr-2 h-4 w-4" />
                Solicitar Proposta Rápida
              </QualificationButton>
              <Button variant="outline" asChild>
                <a href="#formulario">Formulário Tradicional</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div id="formulario" className="card-elevated p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Envie sua mensagem</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ou use nossa <QualificationButton className="text-brand-primary hover:underline p-0 h-auto font-normal" variant="ghost">qualificação rápida</QualificationButton>
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Nome da sua empresa"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="service">Serviço de interesse</Label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="">Selecione um serviço</option>
                    <option value="software-apps">Software & Apps</option>
                    <option value="automacao-ia">Automação & IA</option>
                    <option value="jogos-gamificacao">Jogos & Gamificação</option>
                    <option value="consultoria">Consultoria & Discovery</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Conte-nos sobre seu projeto e objetivos..."
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full btn-hero">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="card-elevated p-8">
                <h3 className="text-xl font-semibold mb-6">Informações de Contato</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-muted-foreground">contato@guilds.com.br</p>
                      <p className="text-muted-foreground">comercial@guilds.com.br</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Telefone</h4>
                      <p className="text-muted-foreground">+55 (11) 9999-9999</p>
                      <p className="text-muted-foreground">+55 (11) 8888-8888</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Endereço</h4>
                      <p className="text-muted-foreground">
                        Av. Paulista, 1000<br />
                        Bela Vista, São Paulo - SP<br />
                        01310-100, Brasil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Horário de Atendimento</h4>
                      <p className="text-muted-foreground">
                        Segunda à Sexta: 9h às 18h<br />
                        Sábado: 9h às 12h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button asChild className="w-full btn-accent">
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp Direto
                  </a>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Reunião
                  </a>
                </Button>
              </div>

              {/* Response Time */}
              <div className="card-glass p-6 text-center">
                <h4 className="font-semibold mb-2 text-brand-primary">Tempo de Resposta</h4>
                <p className="text-sm text-muted-foreground">
                  Respondemos todas as mensagens em até <strong>2 horas úteis</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sora font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Algumas dúvidas comuns que recebemos de nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Qual é o prazo médio de um projeto?",
                answer: "O prazo varia conforme a complexidade, mas projetos típicos levam de 2 a 6 meses."
              },
              {
                question: "Vocês oferecem suporte pós-entrega?",
                answer: "Sim, oferecemos suporte contínuo e manutenção para todos os projetos entregues."
              },
              {
                question: "Como funciona o orçamento?",
                answer: "Fazemos uma análise detalhada do projeto e enviamos uma proposta personalizada."
              },
              {
                question: "Trabalham com empresas de que tamanho?",
                answer: "Atendemos desde startups até grandes corporações, adaptando nossa abordagem a cada necessidade."
              }
            ].map((faq, index) => (
              <div key={index} className="card-elevated p-6">
                <h3 className="font-semibold mb-3 text-brand-primary">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;