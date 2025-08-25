import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import guildsLogoShield from '@/assets/guilds-logo-shield.svg';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="container section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={guildsLogoShield} 
                alt="Guilds" 
                className="h-8 w-auto invert"
              />
              <span className="font-sora font-bold text-xl">Guilds</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Sistemas inteligentes, resultados reais. Desenvolvemos soluções digitais sob medida para impulsionar seu negócio.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-brand-accent" />
                <span>gustavo.macedo@guilds.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-brand-accent" />
                <span>+55 (17) 99752-0867</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-brand-accent" />
                <span>São José do Rio Preto, SP</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-sora font-semibold text-lg">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/servicos/sistemas-web" className="text-neutral-400 hover:text-white transition-colors">
                  Sistemas Web
                </Link>
              </li>
              <li>
                <Link to="/servicos/apps-mobile" className="text-neutral-400 hover:text-white transition-colors">
                  Apps Mobile
                </Link>
              </li>
              <li>
                <Link to="/servicos/automacao" className="text-neutral-400 hover:text-white transition-colors">
                  Automação
                </Link>
              </li>
              <li>
                <Link to="/servicos/ia" className="text-neutral-400 hover:text-white transition-colors">
                  Inteligência Artificial
                </Link>
              </li>
              <li>
                <Link to="/servicos/workshops" className="text-neutral-400 hover:text-white transition-colors">
                  Workshops B2B
                </Link>
              </li>
              <li>
                <Link to="/servicos/jogos-corporativos" className="text-neutral-400 hover:text-white transition-colors">
                  Jogos Corporativos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-sora font-semibold text-lg">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sobre" className="text-neutral-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-neutral-400 hover:text-white transition-colors">
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-neutral-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/carreiras" className="text-neutral-400 hover:text-white transition-colors">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-sora font-semibold text-lg">Newsletter</h3>
            <p className="text-neutral-400 text-sm">
              Receba insights sobre tecnologia e inovação direto no seu e-mail.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-brand-accent"
                required
              />
              <Button type="submit" className="btn-accent w-full">
                Inscrever-se
              </Button>
            </form>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Siga-nos</h4>
              <div className="flex space-x-3">
                <a
                  href="https://linkedin.com/company/guilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors"
                  aria-label="LinkedIn da Guilds"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/guilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors"
                  aria-label="Instagram da Guilds"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/@guilds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors"
                  aria-label="YouTube da Guilds"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-neutral-800" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-neutral-400">
            <span>© 2024 Guilds. Todos os direitos reservados.</span>
            <div className="flex space-x-4">
              <Link to="/privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
          <div className="text-sm text-neutral-400">
            Feito com 💜 pela equipe Guilds
          </div>
        </div>
      </div>
    </footer>
  );
}