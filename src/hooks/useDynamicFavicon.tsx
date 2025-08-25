import { useEffect } from 'react';
import { useLogos } from './useLogos';

export function useDynamicFavicon() {
  const { getLogoByContext, loading } = useLogos();

  useEffect(() => {
    if (loading) return;

    // Try to get a logo for favicon usage - more flexible search
    const faviconLogo = getLogoByContext('Ícones e favicons') || 
                       getLogoByContext('Headers e navegação', 'symbol');

    console.log('Favicon logo found:', faviconLogo);

    if (faviconLogo?.public_url) {
      // Remove existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(link => link.remove());

      // Add new favicon
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      faviconLink.href = faviconLogo.public_url;
      document.head.appendChild(faviconLink);
    }
  }, [loading, getLogoByContext]);
}