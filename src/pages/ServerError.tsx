import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle,
  Home as HomeIcon,
  MessageSquare,
  RefreshCw,
  Mail,
  Phone
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import { SEOHead } from "@/components/seo/SEOHead";

const ServerError = () => {
  const { t } = useTranslation();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    const subject = encodeURIComponent("Erro 500 - Relatório de Problema");
    const body = encodeURIComponent(
      `Olá equipe Guilds,\n\nEncontrei um erro 500 na aplicação:\n\nURL: ${window.location.href}\nHorário: ${new Date().toLocaleString()}\nNavigador: ${navigator.userAgent}\n\nDescrição do problema:\n[Descreva o que estava fazendo quando o erro ocorreu]\n\nObrigado!`
    );
    window.open(`mailto:contato@guilds.com.br?subject=${subject}&body=${body}`);
  };

  return (
    <>
      <SEOHead
        title="Erro interno do servidor"
        description="Algo deu errado em nossos servidores. Nossa equipe foi notificada."
        noIndex={true}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-guild-hero relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-danger/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-warning/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* 500 Visual */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-danger/10 rounded-3xl mb-6">
                <AlertTriangle className="h-12 w-12 text-danger" />
              </div>
              <h1 className="text-8xl md:text-9xl font-sora font-bold text-danger mb-4">
                500
              </h1>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-sora font-semibold">
                Ops! Algo deu errado
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Nossos ferreiros estão trabalhando para resolver este problema. Tente novamente em alguns momentos ou entre em contato conosco.
              </p>
              
              <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
                <strong>Erro técnico:</strong> 
                <span className="font-mono text-danger ml-2">Internal Server Error</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                onClick={handleRetry}
                className="btn-hero"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar Novamente
              </Button>
              
              <Button asChild variant="outline" className="btn-glass">
                <Link to="/">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Voltar ao Início
                </Link>
              </Button>
            </div>

            {/* Contact Options */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-6">
                Precisa de ajuda? Entre em contato:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleReportError}
                  variant="outline"
                  size="sm"
                  className="btn-glass"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reportar Erro
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="btn-glass"
                >
                  <a 
                    href="https://wa.me/5511999999999?text=Olá! Encontrei um erro 500 no site da Guilds."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="btn-glass"
                >
                  <a href="tel:+5511999999999">
                    <Phone className="mr-2 h-4 w-4" />
                    Telefone
                  </a>
                </Button>
              </div>
            </div>

            {/* Help Links */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Enquanto isso, você pode:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { name: "Ver Nossos Serviços", href: "/servicos" },
                  { name: "Conhecer a Guilds", href: "/sobre" },
                  { name: "Guilds Lab", href: "/lab" },
                  { name: "Falar Conosco", href: "/contato" }
                ].map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm text-brand-primary hover:text-brand-primary/80 underline underline-offset-4 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServerError;