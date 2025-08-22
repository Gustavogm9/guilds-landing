import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home as HomeIcon,
  ArrowLeft,
  Shield,
  Search
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-guild-hero relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-brand-primary/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-brand-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* 404 Visual */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-primary/10 rounded-3xl mb-6">
              <Shield className="h-12 w-12 text-brand-primary" />
            </div>
            <h1 className="text-8xl md:text-9xl font-sora font-bold text-gradient mb-4">
              404
            </h1>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-sora font-semibold">
              Página não encontrada
            </h2>
            
            <p className="text-lg text-muted-foreground">
              Parece que esta página se perdeu nas brumas do tempo. 
              Nossa guilda de desenvolvedores está sempre explorando novos territórios, 
              mas esta rota ainda não foi mapeada.
            </p>
            
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
              <strong>Rota tentativa:</strong> <code className="font-mono text-brand-primary">{location.pathname}</code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="btn-hero">
              <Link to="/">
                <HomeIcon className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="btn-glass">
              <Link to="/servicos">
                <Search className="mr-2 h-4 w-4" />
                Explorar Serviços
              </Link>
            </Button>
          </div>

          {/* Help Links */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Talvez você esteja procurando por:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: "Nossos Serviços", href: "/servicos" },
                { name: "Cases de Sucesso", href: "/cases" },
                { name: "Guilds Lab", href: "/lab" },
                { name: "Falar Conosco", href: "/contato" }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-brand-primary hover:text-brand-primary-dark underline underline-offset-4 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
