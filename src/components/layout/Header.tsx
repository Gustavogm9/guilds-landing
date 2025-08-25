import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Menu,
  X,
  Code,
  Zap,
  Gamepad2,
  Users,
  Lightbulb,
  FileText,
  Palette,
  BookOpen,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

import { GuildShield } from "@/components/icons";
import { DynamicLogo } from "@/components/ui/DynamicLogo";
import { QualificationButton } from "@/components/forms/QualificationButton";
import guildsLogoFull from "@/assets/guilds-logo-full.svg";
import guildsLogoShield from "@/assets/guilds-logo-shield.svg";

const services = [
  {
    title: "Desenvolvimento de Software & Apps",
    href: "/servicos/software-apps",
    description: "Soluções digitais completas para sua empresa",
    icon: Code
  },
  {
    title: "Automação & IA",
    href: "/servicos/automacao-ia", 
    description: "Inteligência artificial e automação de processos",
    icon: Zap
  },
  {
    title: "Jogos Corporativos & Gamificação",
    href: "/servicos/jogos-gamificacao",
    description: "Engajamento através de experiências lúdicas",
    icon: Gamepad2
  },
  {
    title: "Consultoria & Discovery",
    href: "/servicos/consultoria",
    description: "Estratégia e descoberta de oportunidades",
    icon: Users
  }
];

const navigation = [
  { name: "Cases", href: "/cases" },
  { name: "Guilds Lab", href: "/lab" },
  { name: "Guilds Craft", href: "/craft" },
  { name: "Conteúdo", href: "https://blog.guilds.com.br", external: true },
  { name: "Sobre", href: "/sobre" },
  { name: "Contato", href: "/contato" }
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <DynamicLogo 
                type="full"
                variant="color"
                usageContext="Headers e navegação"
                alt="Guilds - Sistemas inteligentes, resultados reais" 
                className="h-8 md:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                fallback={
                  <img 
                    src={guildsLogoFull} 
                    alt="Guilds - Sistemas inteligentes, resultados reais" 
                    className="h-8 md:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                  />
                }
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* Services Mega Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      Serviços
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                        {services.map((service) => {
                          const Icon = service.icon;
                          return (
                            <NavigationMenuLink key={service.href} asChild>
                              <Link
                                to={service.href}
                                className={cn(
                                  "group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <Icon className="h-5 w-5 text-brand-primary mt-1" />
                                  <div>
                                    <div className="text-sm font-medium leading-none">
                                      {service.title}
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground mt-1">
                                      {service.description}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Regular Navigation Links */}
              {navigation.map((item) => 
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors hover:text-brand-primary text-foreground"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-brand-primary",
                      isActive(item.href) 
                        ? "text-brand-primary" 
                        : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <QualificationButton 
                className="btn-forge group relative overflow-hidden shadow-guild hover:shadow-forge"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <GuildShield className="h-4 w-4" />
                  Forjar Projeto
                </span>
              </QualificationButton>
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-full sm:w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center justify-between pb-4 border-b">
                    <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                      <DynamicLogo 
                        type="symbol"
                        variant="color"
                        usageContext="Headers e navegação"
                        alt="Guilds" 
                        className="h-8 w-auto"
                        fallback={
                          <img 
                            src={guildsLogoShield} 
                            alt="Guilds" 
                            className="h-8 w-auto"
                          />
                        }
                      />
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col py-6 space-y-4 flex-1">
                    {/* Services */}
                    <div>
                      <h3 className="font-semibold text-brand-primary mb-3">Serviços</h3>
                      <div className="space-y-2 pl-4">
                        {services.map((service) => {
                          const Icon = service.icon;
                          return (
                            <Link
                              key={service.href}
                              to={service.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 py-2 text-sm hover:text-brand-primary transition-colors"
                            >
                              <Icon className="h-4 w-4" />
                              {service.title}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                    {/* Other Navigation */}
                    <div className="space-y-2">
                      {navigation.map((item) => 
                        item.external ? (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-sm font-medium transition-colors hover:text-brand-primary text-foreground"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block py-2 text-sm font-medium transition-colors hover:text-brand-primary",
                              isActive(item.href) ? "text-brand-primary" : "text-foreground"
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      )}
                    </div>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="pt-4 border-t">
                    <QualificationButton className="w-full btn-forge">
                      Forjar Projeto
                    </QualificationButton>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Persistent CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-gradient-forge p-4">
        <QualificationButton className="w-full btn-forge shadow-forge group animate-glow">
          <span className="flex items-center justify-center gap-2">
            <GuildShield className="h-5 w-5" />
            Forjar Soluções Digitais
          </span>
        </QualificationButton>
      </div>
    </>
  );
};

export default Header;
