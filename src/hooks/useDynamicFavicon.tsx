import { useEffect, useRef } from 'react';
import { useLogos } from './useLogos';

export function useDynamicFavicon() {
  const { getLogoByContext, loading } = useLogos();
  const currentFaviconRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (loading) return;

    // Try to get a logo for favicon usage - more flexible search
    const faviconLogo = getLogoByContext('Ícones e favicons') || 
                       getLogoByContext('Headers e navegação', 'symbol');

    console.log('Favicon logo found:', faviconLogo);

    if (faviconLogo?.public_url) {
      // Only remove our previously added favicon to avoid conflicts
      if (currentFaviconRef.current && currentFaviconRef.current.parentNode) {
        currentFaviconRef.current.parentNode.removeChild(currentFaviconRef.current);
      }

      // Add new favicon
      const faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      faviconLink.type = 'image/png';
      faviconLink.href = faviconLogo.public_url;
      document.head.appendChild(faviconLink);
      
      // Store reference for cleanup
      currentFaviconRef.current = faviconLink;
    }

    // Cleanup function
    return () => {
      if (currentFaviconRef.current && currentFaviconRef.current.parentNode) {
        currentFaviconRef.current.parentNode.removeChild(currentFaviconRef.current);
        currentFaviconRef.current = null;
      }
    };
  }, [loading, getLogoByContext]);
}