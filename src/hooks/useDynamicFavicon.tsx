import { useEffect, useMemo } from 'react';
import { useLogos } from './useLogos';
import { logger } from '@/lib/logger';

const log = logger.scope('useDynamicFavicon');

export function useDynamicFavicon() {
  const { logos, loading } = useLogos();

  // Memoize the favicon logo to prevent unnecessary effects
  const faviconLogo = useMemo(() => {
    if (loading || !logos.length) return null;

    // Try to get a logo for favicon usage - flexible search
    return logos.find(logo => {
      if (!logo.usage_context) return false;
      const contexts = logo.usage_context.split(',').map(ctx => ctx.trim()).filter(ctx => ctx.length > 0);
      return contexts.some(ctx => ctx.includes('Ícones e favicons'));
    }) || logos.find(logo => {
      if (!logo.usage_context) return false;
      const contexts = logo.usage_context.split(',').map(ctx => ctx.trim()).filter(ctx => ctx.length > 0);
      return contexts.some(ctx => ctx.includes('Headers e navegação')) && logo.type === 'symbol';
    });
  }, [logos, loading]);

  useEffect(() => {
    if (!faviconLogo?.public_url) return;

    log.debug('Updating favicon', { action: 'update', metadata: { url: faviconLogo.public_url } });

    // Simple favicon update without complex DOM manipulation
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

    if (existingFavicon) {
      existingFavicon.href = faviconLogo.public_url;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/png';
      newFavicon.href = faviconLogo.public_url;
      document.head.appendChild(newFavicon);
    }
  }, [faviconLogo]);
}
