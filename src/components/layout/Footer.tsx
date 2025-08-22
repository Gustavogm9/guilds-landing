import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Twitter,
  Instagram,
  Github
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-50 mt-24">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-guild-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="font-sora font-bold text-xl">Guilds</span>
            </div>
            <p className="text-neutral-300 mb-6 text-sm leading-relaxed">
              Construindo o futuro digital através da expertise coletiva. 
              Unimos tecnologia de ponta com a sabedoria das guildas ancestrais.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-neutral-300">
                <Mail className="h-4 w-4 text-brand-accent" />
                <span>contato@guilds.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Phone className="h-4 w-4 text-brand-accent" />
                <span>+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="h-4 w-4 text-brand-accent" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-brand-accent">Serviços</h3>
            <nav className="space-y-3">
              {[
                { name: "Software & Apps", href: "/servicos/software-apps" },
                { name: "Automação & IA", href: "/servicos/automacao-ia" },
                { name: "Jogos & Gamificação", href: "/servicos/jogos-gamificacao" },
                { name: "Consultoria", href: "/servicos/consultoria" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm text-neutral-300 hover:text-brand-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-brand-accent">Empresa</h3>
            <nav className="space-y-3">
              {[
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Equipe", href: "/equipe" },
                { name: "Cases", href: "/cases" },
                { name: "Carreiras", href: "/carreiras" },
                { name: "Guilds Lab", href: "/lab" },
                { name: "Guilds Craft", href: "/craft" },
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-sm text-neutral-300 hover:text-brand-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-6 text-brand-accent">Newsletter</h3>
            <p className="text-sm text-neutral-300 mb-4">
              Receba insights e novidades sobre tecnologia e inovação.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Seu melhor email"
                className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-400"
              />
              <Button className="w-full btn-accent">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-800 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-sm text-neutral-400">
              © 2024 Guilds. Todos os direitos reservados.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Github, href: "#", label: "GitHub" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-brand-accent transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link to="/politica-privacidade" className="text-neutral-400 hover:text-brand-accent transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos-uso" className="text-neutral-400 hover:text-brand-accent transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;