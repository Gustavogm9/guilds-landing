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
import { useTranslation } from "@/contexts/TranslationContext";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import guildsLogoFull from "@/assets/guilds-logo-full.svg";
import guildsLogoShield from "@/assets/guilds-logo-shield.svg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();

  // Clean Funnel Navigation
  const navigation = [
    { name: 'Portfólio & Cases', href: getLocalizedPath('/cases') },
    { name: 'Diagnóstico Raio-X', href: getLocalizedPath('/raio-x') },
    { name: 'Nossa Metodologia', href: getLocalizedPath('/#solucao') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/5">
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
              {/* Regular Navigation Links */}
              {navigation.map((item) => 
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium transition-colors hover:text-blue-400 text-slate-300"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-blue-400",
                      isActive(item.href) 
                        ? "text-blue-400" 
                        : "text-slate-300"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              )}

              {/* Language Selector removed */}
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
                <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-900">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-full sm:w-80 bg-slate-950 border-l border-white/10 text-slate-300">
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5">
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
                    {/* Main Navigation Links */}
                    <div className="space-y-2">
                      {navigation.map((item) => 
                        item.external ? (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className="block py-2 text-sm font-medium transition-colors hover:text-blue-400 text-slate-300"
                          >
                            {item.name}
                          </a>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block py-2 text-sm font-medium transition-colors hover:text-blue-400",
                              isActive(item.href) ? "text-blue-400" : "text-slate-300"
                            )}
                          >
                            {item.name}
                          </Link>
                        )
                      )}
                    </div>

                    {/* Language Selector removed */}
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

      {/* Global Feedback Widget */}
      <FeedbackWidget 
        projectKey="guilds-website"
        moduleKey="general"
        user={{
          id: 'anonymous',
          name: 'Visitor',
          email: '',
          role: 'usuario_final'
        }}
        featureFlags={{
          srs: false,
          nps: true,
          attachments: true,
          ideas: true,
          questions: true
        }}
        position="bottom-right"
      />

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
