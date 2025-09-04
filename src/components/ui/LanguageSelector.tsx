import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocalizedNavigation } from '@/hooks/useLocalizedNavigation';

interface LanguageSelectorProps {
  variant?: 'default' | 'mobile';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default', 
  className = '' 
}) => {
  const { locale, changeLocale, t } = useTranslation();
  const { getAlternateUrl } = useLocalizedNavigation();

  const handleLanguageChange = (newLocale: 'pt-BR' | 'en') => {
    // Get the URL for the new locale
    const newUrl = getAlternateUrl(newLocale);
    
    // Change locale in context
    changeLocale(newLocale);
    
    // Navigate to the new URL
    window.history.pushState(null, '', newUrl);
  };

  const languages = [
    { code: 'pt-BR' as const, name: t('common.language.portuguese'), flag: '🇧🇷' },
    { code: 'en' as const, name: t('common.language.english'), flag: '🇺🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h3 className="font-semibold text-brand-primary text-sm">
          {t('common.language.switchLanguage')}
        </h3>
        <div className="space-y-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`flex items-center gap-2 w-full py-2 px-3 text-sm rounded-lg transition-colors ${
                locale === language.code 
                  ? 'bg-brand-primary text-white' 
                  : 'hover:bg-accent text-foreground'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 px-2 text-foreground hover:text-brand-primary ${className}`}
          aria-label={`${t('common.language.switchLanguage')} - ${currentLanguage?.flag} ${locale.toUpperCase()}`}
        >
          <Languages className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">
            {currentLanguage?.flag} {locale.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              locale === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-base">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {locale === language.code && (
              <span className="text-xs text-brand-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};