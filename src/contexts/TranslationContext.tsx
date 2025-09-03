import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'pt-BR' | 'en';

export interface TranslationContextType {
  locale: Locale;
  t: (key: string, variables?: Record<string, string | number>) => string;
  changeLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

// Translation dictionaries type
type TranslationDict = Record<string, any>;

// Cache for loaded translations
const translationCache: Record<Locale, TranslationDict | null> = {
  'pt-BR': null,
  'en': null
};

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ 
  children, 
  initialLocale 
}) => {
  const [locale, setLocale] = useState<Locale>(() => {
    // Detect locale from URL path or use initialLocale or default
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/en')) return 'en';
    }
    return initialLocale || 'pt-BR';
  });

  const [translations, setTranslations] = useState<TranslationDict>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations for a specific locale
  const loadTranslations = async (targetLocale: Locale): Promise<TranslationDict> => {
    // Check cache first
    if (translationCache[targetLocale]) {
      return translationCache[targetLocale]!;
    }

    try {
      // Dynamically import all translation files for the locale
      const [common, pages, components] = await Promise.all([
        import(`../locales/${targetLocale}/common.json`),
        import(`../locales/${targetLocale}/pages.json`),
        import(`../locales/${targetLocale}/components.json`)
      ]);

      const dict = {
        common: common.default,
        pages: pages.default,
        components: components.default
      };

      // Cache the result
      translationCache[targetLocale] = dict;
      return dict;
    } catch (error) {
      console.warn(`Failed to load translations for ${targetLocale}:`, error);
      
      // Fallback to pt-BR if loading en fails
      if (targetLocale === 'en' && translationCache['pt-BR']) {
        return translationCache['pt-BR'];
      }
      
      return {};
    }
  };

  // Translation function with nested key support and interpolation
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    // Navigate through nested object
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    // Fallback to key if translation not found
    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    // Interpolate variables
    if (variables) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, variable: string) => {
        return variables[variable]?.toString() || match;
      });
    }

    return value;
  };

  // Change locale function
  const changeLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setIsLoading(true);
    try {
      const newTranslations = await loadTranslations(newLocale);
      setTranslations(newTranslations);
      setLocale(newLocale);

      // Update localStorage preference
      localStorage.setItem('preferred-locale', newLocale);
    } catch (error) {
      console.error('Failed to change locale:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial translations
  useEffect(() => {
    const loadInitialTranslations = async () => {
      setIsLoading(true);
      try {
        const initialTranslations = await loadTranslations(locale);
        setTranslations(initialTranslations);
      } catch (error) {
        console.error('Failed to load initial translations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialTranslations();
  }, []);

  // Update locale when URL changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const urlLocale: Locale = path.startsWith('/en') ? 'en' : 'pt-BR';
      
      if (urlLocale !== locale) {
        changeLocale(urlLocale);
      }
    };

    // Listen for popstate (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [locale]);

  const contextValue: TranslationContextType = {
    locale,
    t,
    changeLocale,
    isLoading
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};