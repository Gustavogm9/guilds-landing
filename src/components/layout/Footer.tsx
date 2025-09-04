import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { DynamicLogo } from '@/components/ui/DynamicLogo';
import { Newsletter } from '@/components/ui/Newsletter';
import { usePublicContactInfo } from '@/hooks/usePublicContactInfo';
import { usePublicCompanySettings } from '@/hooks/usePublicCompanySettings';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocalizedNavigation } from '@/hooks/useLocalizedNavigation';
export function Footer() {
  const { getPublicEmail, getPublicPhone, getPublicAddress } = usePublicContactInfo();
  const { getCompanyName, getSocialMediaLinks } = usePublicCompanySettings();
  const { t } = useTranslation();
  const { getLocalizedPath } = useLocalizedNavigation();
  
  const email = getPublicEmail() || 'contato@guilds.com.br';
  const phone = getPublicPhone() || '+55 (17) 99999-9999';
  const socialLinks = getSocialMediaLinks();
  const address = getPublicAddress();
  return <footer className="bg-neutral-900 text-neutral-100">
      <div className="container section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <DynamicLogo 
                usageContext="Footers e rodapés" 
                type="symbol" 
                variant="light" 
                className="h-8 w-auto" 
                alt="Guilds"
                width={32}
                height={32}
                fallback={<div className="w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>} 
              />
              <span className="font-sora font-bold text-xl">{getCompanyName()}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {t('components.footer.description')}
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-brand-accent" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-brand-accent" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-brand-accent" />
                <span>
                  {address?.city ? `${address.city}` : 'São José do Rio Preto'}
                  {address?.state ? `, ${address.state}` : ', SP'}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-sora font-semibold text-lg">{t('components.footer.services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={getLocalizedPath('/servicos/sistemas-web')} className="text-neutral-400 hover:text-white transition-colors">
                  Sistemas Web
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/servicos/apps-mobile')} className="text-neutral-400 hover:text-white transition-colors">
                  Apps Mobile
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/servicos/automacao')} className="text-neutral-400 hover:text-white transition-colors">
                  Automação
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/servicos/ia')} className="text-neutral-400 hover:text-white transition-colors">
                  Inteligência Artificial
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/servicos/workshops')} className="text-neutral-400 hover:text-white transition-colors">
                  Workshops B2B
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/servicos/jogos-corporativos')} className="text-neutral-400 hover:text-white transition-colors">
                  Jogos Corporativos
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-sora font-semibold text-lg">{t('components.footer.company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={getLocalizedPath('/sobre')} className="text-neutral-400 hover:text-white transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/cases')} className="text-neutral-400 hover:text-white transition-colors">
                  Cases de Sucesso
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/contato')} className="text-neutral-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link to={getLocalizedPath('/carreiras')} className="text-neutral-400 hover:text-white transition-colors">
                  Carreiras
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <Newsletter 
              title={t('forms.newsletter.title')} 
              description={t('forms.newsletter.subtitle')} 
              variant="footer" 
              buttonText={t('forms.newsletter.button')} 
            />
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">{t('components.footer.followUs')}</h4>
               <div className="flex space-x-3">
                <a href={socialLinks?.linkedin || "https://www.linkedin.com/company/guilds-oficial"} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors" aria-label="LinkedIn da Guilds">
                  <Linkedin className="h-4 w-4" />
                </a>
                <a href={socialLinks?.instagram || "https://www.instagram.com/guilds.oficial/"} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors" aria-label="Instagram da Guilds">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={socialLinks?.youtube || "https://youtube.com/@guilds"} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-800 rounded-lg hover:bg-brand-accent transition-colors" aria-label="YouTube da Guilds">
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
            <span>© 2025 {getCompanyName()}. {t('components.footer.allRightsReserved')}</span>
            <div className="flex space-x-4">
              <Link to={getLocalizedPath('/privacidade')} className="hover:text-white transition-colors">
                {t('common.legal.privacyPolicy')}
              </Link>
              <Link to={getLocalizedPath('/termos')} className="hover:text-white transition-colors">
                {t('common.legal.termsOfService')}
              </Link>
            </div>
          </div>
          <div className="text-sm text-neutral-400">
            {t('components.footer.madeWithLove')}
          </div>
        </div>
      </div>
    </footer>;
}