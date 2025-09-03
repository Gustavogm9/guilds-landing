import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, Locale } from '@/contexts/TranslationContext';

export const useLocalizedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { locale } = useTranslation();

  // Generate localized path
  const getLocalizedPath = (path: string, targetLocale?: Locale): string => {
    const currentLocale = targetLocale || locale;
    
    // Remove any existing locale prefix
    const cleanPath = path.replace(/^\/en\//, '/').replace(/^\/pt-BR\//, '/');
    
    // Add locale prefix for English
    if (currentLocale === 'en') {
      return `/en${cleanPath === '/' ? '' : cleanPath}`;
    }
    
    // No prefix for Portuguese (default)
    return cleanPath;
  };

  // Navigate to localized path
  const navigateLocalized = (path: string, options?: { replace?: boolean }) => {
    const localizedPath = getLocalizedPath(path);
    navigate(localizedPath, options);
  };

  // Get current path without locale prefix
  const getCurrentPath = (): string => {
    return location.pathname.replace(/^\/en\//, '/').replace(/^\/pt-BR\//, '/');
  };

  // Get alternate URL for language switching
  const getAlternateUrl = (targetLocale: Locale): string => {
    const currentPath = getCurrentPath();
    return getLocalizedPath(currentPath, targetLocale);
  };

  // Get full URL with domain (for SEO hreflang)
  const getFullAlternateUrl = (targetLocale: Locale): string => {
    const alternateUrl = getAlternateUrl(targetLocale);
    return `${window.location.origin}${alternateUrl}`;
  };

  return {
    getLocalizedPath,
    navigateLocalized,
    getCurrentPath,
    getAlternateUrl,
    getFullAlternateUrl
  };
};