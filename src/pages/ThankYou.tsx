import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Calendar,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useQualificationForm } from '@/hooks/useQualificationForm';
import { usePublicCompanySettings } from '@/hooks/usePublicCompanySettings';
import { useConfetti } from '@/hooks/useConfetti';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

const ThankYou = () => {
  const { activeForm } = useQualificationForm();
  const { publicSettings } = usePublicCompanySettings();
  const { celebrateSuccess } = useConfetti();
  const [countdown, setCountdown] = useState(10);
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    // Fire confetti on page load
    const timer = setTimeout(() => {
      celebrateSuccess();
    }, 500);

    return () => clearTimeout(timer);
  }, [celebrateSuccess]);

  useEffect(() => {
    // Countdown for home redirect
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowRedirect(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const whatsappMessage = publicSettings 
    ? `Olá! Acabei de preencher o formulário de qualificação no site da ${publicSettings.company_name}. Gostaria de conversar sobre meu projeto.`
    : "Olá! Acabei de preencher o formulário de qualificação no site. Gostaria de conversar sobre meu projeto.";

  const whatsappUrl = publicSettings?.public_whatsapp_number
    ? `https://wa.me/${publicSettings.public_whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Obrigado pelo interesse!"
        description="Recebemos seu interesse e nossa equipe entrará em contato em breve. Conheça também outras formas de entrar em contato conosco."
        noIndex={true}
      />

      {/* Hero Success Section */}
      <section className="py-20 md:py-32 bg-guild-hero">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <CheckCircle className="w-12 h-12 text-brand-primary" />
            </div>

            {/* Success Message */}
            <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-6 animate-fade-in">
              ✓ Formulário enviado com sucesso!
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
              {activeForm?.thank_you_title || 'Obrigado pelo interesse!'}
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in">
              {activeForm?.thank_you_message || 'Nossa equipe entrará em contato em breve para discutir seu projeto.'}
            </p>

            {/* Main CTA */}
            {publicSettings?.public_whatsapp_number && (
              <div className="animate-fade-in">
                <Button 
                  asChild
                  className="btn-forge text-lg px-8 py-4"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Falar no WhatsApp Agora
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Resposta imediata garantida
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              O que acontece <span className="text-gradient">agora?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nosso processo estruturado para transformar sua ideia em realidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Análise do Projeto",
                description: "Nossa equipe analisa suas necessidades e prepara uma proposta personalizada.",
                time: "24-48 horas",
                icon: Clock
              },
              {
                step: "2", 
                title: "Primeira Conversa",
                description: "Agendamos uma reunião para alinhar expectativas e esclarecer dúvidas.",
                time: "2-3 dias úteis",
                icon: MessageCircle
              },
              {
                step: "3",
                title: "Início do Projeto",
                description: "Com tudo alinhado, iniciamos o desenvolvimento com entregas semanais.",
                time: "1 semana",
                icon: ArrowRight
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {item.time}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Outras formas de <span className="text-gradient">contato</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha a forma que preferir para entrar em contato
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {publicSettings?.public_support_email || 'contato@guilds.com.br'}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${publicSettings?.public_support_email || 'contato@guilds.com.br'}`}>
                  Enviar E-mail
                </a>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {publicSettings?.public_whatsapp_number || '+55 (11) 99999-9999'}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${publicSettings?.public_whatsapp_number || '+5511999999999'}`}>
                  Ligar Agora
                </a>
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="font-semibold mb-2">Agendar Reunião</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Calendário online disponível
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Agendar Horário
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Auto Redirect Section */}
      {showRedirect ? (
        <section className="py-12 bg-muted/30">
          <div className="container text-center">
            <Card className="max-w-md mx-auto p-6">
              <h3 className="font-semibold mb-4">Redirecionamento automático</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Você será redirecionado para a página inicial em instantes
              </p>
              <Button asChild variant="outline">
                <Link to="/">Ir para Página Inicial</Link>
              </Button>
            </Card>
          </div>
        </section>
      ) : (
        <section className="py-12 bg-muted/30">
          <div className="container text-center">
            <Card className="max-w-md mx-auto p-6">
              <Clock className="w-8 h-8 text-brand-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Redirecionamento automático em <strong>{countdown}</strong> segundos
              </p>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default ThankYou;