import { useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';

interface SitemapRoute {
  path: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const defaultRoutes: SitemapRoute[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/sobre', changefreq: 'monthly', priority: 0.8 },
  { path: '/equipe', changefreq: 'monthly', priority: 0.7 },
  { path: '/carreiras', changefreq: 'weekly', priority: 0.7 },
  { path: '/servicos', changefreq: 'weekly', priority: 0.9 },
  { path: '/servicos/software-apps', changefreq: 'monthly', priority: 0.8 },
  { path: '/servicos/automacao-ia', changefreq: 'monthly', priority: 0.8 },
  { path: '/servicos/jogos-gamificacao', changefreq: 'monthly', priority: 0.8 },
  { path: '/servicos/consultoria', changefreq: 'monthly', priority: 0.8 },
  { path: '/lab', changefreq: 'weekly', priority: 0.8 },
  { path: '/craft', changefreq: 'monthly', priority: 0.8 },
  { path: '/contato', changefreq: 'monthly', priority: 0.7 }
];

export function generateSitemap(baseUrl: string, routes: SitemapRoute[] = defaultRoutes): string {
  const currentDate = new Date().toISOString().split('T')[0];

  const urlEntries = routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod || currentDate}</lastmod>
    <changefreq>${route.changefreq || 'monthly'}</changefreq>
    <priority>${route.priority || 0.5}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export function SitemapGenerator() {
  const { seoSettings } = useSEO();

  useEffect(() => {
    if (!seoSettings?.canonical_base_url) return;

    // Generate sitemap and make it available for download
    const sitemap = generateSitemap(seoSettings.canonical_base_url);
    
    // Create a downloadable blob
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Store in sessionStorage for access via /sitemap.xml route
    sessionStorage.setItem('generated_sitemap', sitemap);
    
    // Cleanup
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [seoSettings?.canonical_base_url]);

  return null; // This component only generates the sitemap
}

// Hook to get sitemap content
export function useSitemap() {
  const { seoSettings } = useSEO();

  const getSitemap = (): string | null => {
    if (!seoSettings?.canonical_base_url) return null;
    
    // Try to get from sessionStorage first
    const stored = sessionStorage.getItem('generated_sitemap');
    if (stored) return stored;
    
    // Generate on-demand
    return generateSitemap(seoSettings.canonical_base_url);
  };

  const getRobotsTxt = (): string => {
    const sitemapUrl = seoSettings?.canonical_base_url 
      ? `${seoSettings.canonical_base_url}/sitemap.xml`
      : 'https://guilds.com.br/sitemap.xml';

    return seoSettings?.robots_txt_content || `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`;
  };

  return {
    getSitemap,
    getRobotsTxt
  };
}