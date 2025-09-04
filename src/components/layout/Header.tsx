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
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { useTranslation } from "@/contexts/TranslationContext";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import guildsLogoFull from "@/assets/guilds-logo-full.svg";
import guildsLogoShield from "@/assets/guilds-logo-shield.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  // Generate services with localized paths and translations
  const services = [
    {
      title: t('common.services.softwareApps.title'),
      href: getLocalizedPath('/servicos/software-apps'),
      description: t('common.services.softwareApps.description'),
      icon: Code
    },
    {
      title: t('common.services.automationAi.title'),
      href: getLocalizedPath('/servicos/automacao-ia'), 
      description: t('common.services.automationAi.description'),
      icon: Zap
    },
    {
      title: t('common.services.gamesGamification.title'),
      href: getLocalizedPath('/servicos/jogos-gamificacao'),
      description: t('common.services.gamesGamification.description'),
      icon: Gamepad2
    },
    {
      title: t('common.services.consulting.title'),
      href: getLocalizedPath('/servicos/consultoria'),
      description: t('common.services.consulting.description'),
      icon: Users
    }
  ];

  // Generate navigation with localized paths and translations
  const navigation = [
    { name: t('common.navigation.cases'), href: getLocalizedPath('/cases') },
    { name: t('common.navigation.lab'), href: getLocalizedPath('/lab') },
    { name: t('common.navigation.craft'), href: getLocalizedPath('/craft') },
    { name: t('common.navigation.content'), href: "https://blog.guilds.com.br", external: true },
    { name: t('common.navigation.about'), href: getLocalizedPath('/sobre') },
    { name: t('common.navigation.team'), href: getLocalizedPath('/equipe') },
    { name: t('common.navigation.careers'), href: getLocalizedPath('/carreiras') },
    { name: t('common.navigation.contact'), href: getLocalizedPath('/contato') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={getLocalizedPath('/')} className="flex items-center group">
              <DynamicLogo 
                type="full"
                variant="color"
                usageContext="Headers e navegação"
                alt="Guilds - Sistemas inteligentes, resultados reais" 
                className="h-8 md:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                width={120}
                height={32}
                fallback={
                  <img 
                    src={guildsLogoFull} 
                    alt="Guilds - Sistemas inteligentes, resultados reais" 
                    className="h-8 md:h-10 w-auto transition-transform duration-200 group-hover:scale-105"
                    width="120"
                    height="32"
                    style={{ width: 'auto', height: '32px' }}
                  />
                }
              />
            </Link>

            {/* Desktop Navigation */}
            <nav id="main-navigation" className="hidden md:flex items-center space-x-6">
              {/* Services Mega Menu */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">
                      {t('common.navigation.services')}
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

              {/* Language Selector */}
              <LanguageSelector />
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <QualificationButton 
                className="btn-forge group relative overflow-hidden shadow-guild hover:shadow-forge"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <GuildShield className="h-4 w-4" />
                  {t('common.buttons.forgeProject')}
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
                    <Link to={getLocalizedPath('/')} className="flex items-center" onClick={() => setIsOpen(false)}>
                      <DynamicLogo 
                        type="symbol"
                        variant="color"
                        usageContext="Headers e navegação"
                        alt="Guilds" 
                        className="h-8 w-auto"
                        width={32}
                        height={32}
                        fallback={
                          <img 
                            src={guildsLogoShield} 
                            alt="Guilds" 
                            className="h-8 w-auto"
                            width="32"
                            height="32"
                            style={{ width: 'auto', height: '32px' }}
                          />
                        }
                      />
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col py-6 space-y-4 flex-1">
                    {/* Services */}
                    <div>
                      <h3 className="font-semibold text-brand-primary mb-3">{t('common.navigation.services')}</h3>
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

                    {/* Language Selector */}
                    <div className="pt-4 border-t">
                      <LanguageSelector variant="mobile" />
                    </div>
                  </nav>

                  {/* Mobile CTA */}
                  <div className="pt-4 border-t">
                    <QualificationButton className="w-full btn-forge">
                      {t('common.buttons.forgeProject')}
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
            {t('common.buttons.forgeDigitalSolutions')}
          </span>
        </QualificationButton>
      </div>
    </>
  );
};

export default Header;
