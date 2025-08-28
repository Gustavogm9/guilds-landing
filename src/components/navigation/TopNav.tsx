import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const services = [
  {
    category: 'Desenvolvimento',
    items: [
      { name: 'Sistemas Web', href: '/servicos/sistemas-web', description: 'Aplicações web modernas e escaláveis' },
      { name: 'Apps Mobile', href: '/servicos/apps-mobile', description: 'Aplicativos nativos e híbridos' },
      { name: 'Automação', href: '/servicos/automacao', description: 'Processos automatizados inteligentes' },
      { name: 'Inteligência Artificial', href: '/servicos/ia', description: 'Soluções com IA e machine learning' },
    ]
  },
  {
    category: 'Educação',
    items: [
      { name: 'Workshops B2B', href: '/servicos/workshops', description: 'Treinamentos práticos para equipes' },
      { name: 'Consultorias', href: '/servicos/consultorias', description: 'Orientação estratégica especializada' },
    ]
  },
  {
    category: 'Gamificação',
    items: [
      { name: 'Jogos Corporativos', href: '/servicos/jogos-corporativos', description: 'Engajamento através de gamificação' },
      { name: 'Treinamentos Interativos', href: '/servicos/treinamentos-interativos', description: 'Educação através de jogos' },
    ]
  }
];

export function TopNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/src/assets/guilds-logo-shield.png" 
            alt="Guilds" 
            className="h-8 w-auto"
          />
          <span className="font-sora font-bold text-xl text-foreground">Guilds</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium">
                  Serviços
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-3 gap-6 p-6">
                    {services.map((category) => (
                      <div key={category.category} className="space-y-3">
                        <h4 className="font-sora font-semibold text-sm text-brand-primary">
                          {category.category}
                        </h4>
                        <ul className="space-y-2">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className="block p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                              >
                                <div className="font-medium text-sm text-foreground">
                                  {item.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/sobre" className="font-medium text-foreground hover:text-brand-primary transition-colors">
            Sobre
          </Link>
          <Link to="/lab" className="font-medium text-foreground hover:text-brand-primary transition-colors">
            Lab
          </Link>
          <Link to="/craft" className="font-medium text-foreground hover:text-brand-primary transition-colors">
            Craft
          </Link>
          <Link to="/cases" className="font-medium text-foreground hover:text-brand-primary transition-colors">
            Cases
          </Link>
          <Link to="/blog" className="font-medium text-foreground hover:text-brand-primary transition-colors">
            Blog
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button asChild className="btn-hero">
            <Link to="/contato">
              Falar com a Guilds
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-6 mt-6">
              {/* Mobile Services Menu */}
              <div className="space-y-4">
                <h3 className="font-sora font-semibold text-lg">Serviços</h3>
                {services.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <h4 className="font-medium text-sm text-brand-primary">
                      {category.category}
                    </h4>
                    <ul className="space-y-1 ml-4">
                      {category.items.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <Link 
                  to="/sobre" 
                  className="block font-medium text-foreground hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Sobre
                </Link>
                <Link 
                  to="/lab" 
                  className="block font-medium text-foreground hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Lab
                </Link>
                <Link 
                  to="/cases" 
                  className="block font-medium text-foreground hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Cases
                </Link>
                <Link 
                  to="/blog" 
                  className="block font-medium text-foreground hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
              </div>

              {/* Mobile CTA */}
              <Button asChild className="btn-hero w-full">
                <Link to="/contato" onClick={() => setIsOpen(false)}>
                  Falar com a Guilds
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}