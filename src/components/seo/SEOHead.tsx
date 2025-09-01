import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { usePageSEODefaults } from '@/lib/seoHelpers';
import { generatePageSchema } from '@/lib/schemaHelpers';
import { getPerformanceHints } from '@/lib/seoHelpers';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  schemaData?: any;
}

export function SEOHead({
  title: propTitle,
  description: propDescription,
  image: propImage,
  type = 'website',
  noIndex,
  noFollow,
  canonicalUrl,
  keywords,
  schemaData
}: SEOHeadProps) {
  const location = useLocation();
  const { seoSettings, getPageSEOByPath, getCustomTagsForPage } = useSEO();
  const pageDefaults = usePageSEODefaults(location.pathname);

  const currentPath = location.pathname;
  const pageSEO = getPageSEOByPath(currentPath);
  const customTags = getCustomTagsForPage(currentPath);

  // Determine final values with enhanced fallback priority
  const finalTitle = propTitle || pageSEO?.title || pageDefaults.title;
  const finalDescription = propDescription || pageSEO?.meta_description || pageDefaults.description;
  const finalImage = propImage || pageSEO?.og_image || seoSettings?.og_image;
  const finalCanonical = canonicalUrl || pageSEO?.canonical_url || `${seoSettings?.canonical_base_url || ''}${currentPath}`;
  const finalKeywords = keywords || pageSEO?.keywords || pageDefaults.keywords || [];
  const shouldNoIndex = noIndex || pageSEO?.no_index || false;
  const shouldNoFollow = noFollow || pageSEO?.no_follow || false;

  // Generate final title with template
  const formattedTitle = seoSettings?.title_template 
    ? seoSettings.title_template.replace('{title}', finalTitle)
    : finalTitle;

  useEffect(() => {
    // Update document title
    document.title = formattedTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      const selector = `meta[${attribute}="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateLinkTag = (rel: string, href: string) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic meta tags
    updateMetaTag('description', finalDescription);
    if (finalKeywords.length > 0) {
      updateMetaTag('keywords', finalKeywords.join(', '));
    }

    // Robots meta tag
    if (shouldNoIndex || shouldNoFollow) {
      const robotsContent = [
        shouldNoIndex ? 'noindex' : 'index',
        shouldNoFollow ? 'nofollow' : 'follow'
      ].join(', ');
      updateMetaTag('robots', robotsContent);
    }

    // Open Graph
    updateMetaTag('og:title', pageSEO?.og_title || finalTitle, true);
    updateMetaTag('og:description', pageSEO?.og_description || finalDescription, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', finalCanonical, true);
    if (finalImage) {
      updateMetaTag('og:image', finalImage, true);
    }
    if (seoSettings?.site_name) {
      updateMetaTag('og:site_name', seoSettings.site_name, true);
    }

    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageSEO?.twitter_title || finalTitle);
    updateMetaTag('twitter:description', pageSEO?.twitter_description || finalDescription);
    if (pageSEO?.twitter_image || finalImage) {
      updateMetaTag('twitter:image', pageSEO?.twitter_image || finalImage);
    }
    if (seoSettings?.twitter_handle) {
      updateMetaTag('twitter:site', seoSettings.twitter_handle);
      updateMetaTag('twitter:creator', seoSettings.twitter_handle);
    }

    // Canonical URL
    updateLinkTag('canonical', finalCanonical);

    // Structured Data (Schema.org) - Enhanced with new helpers
    const removeExistingSchema = () => {
      const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
      existingSchemas.forEach(script => {
        if (script.getAttribute('data-seo-component')) {
          script.remove();
        }
      });
    };

    const addSchemaData = (data: any) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-component', 'true');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    removeExistingSchema();

    // Generate and add comprehensive schemas using new helpers
    const schemas = generatePageSchema(currentPath, seoSettings, { 
      title: finalTitle, 
      description: finalDescription 
    });
    
    schemas.forEach(schema => {
      addSchemaData(schema);
    });

    // Add custom schema from props (legacy support)
    if (schemaData) {
      addSchemaData(schemaData);
    }

    // Add performance hints
    const performanceHints = getPerformanceHints(currentPath);
    
    // Add preconnect hints
    performanceHints.preconnect.forEach(url => {
      let link = document.querySelector(`link[rel="preconnect"][href="${url}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        if (url.includes('fonts.gstatic.com')) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });

    // Add prefetch hints
    performanceHints.prefetch.forEach(url => {
      let link = document.querySelector(`link[rel="prefetch"][href="${url}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // Handle custom tags
    customTags.forEach(tag => {
      if (tag.tag_type === 'head' && tag.is_active) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tag.content;
        const elements = Array.from(tempDiv.children);
        
        elements.forEach(element => {
          element.setAttribute('data-custom-tag', tag.id);
          document.head.appendChild(element);
        });
      }
    });

    // Cleanup function to remove custom tags
    return () => {
      customTags.forEach(tag => {
        const customElements = document.querySelectorAll(`[data-custom-tag="${tag.id}"]`);
        customElements.forEach(el => el.remove());
      });
    };
  }, [
    formattedTitle,
    finalDescription,
    finalImage,
    finalCanonical,
    finalKeywords,
    shouldNoIndex,
    shouldNoFollow,
    type,
    pageSEO,
    seoSettings,
    currentPath,
    schemaData,
    customTags
  ]);

  // Handle Google Analytics
  useEffect(() => {
    if (seoSettings?.google_analytics_id) {
      // Load Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${seoSettings.google_analytics_id}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${seoSettings.google_analytics_id}');
      `;
      document.head.appendChild(script2);

      return () => {
        script1.remove();
        script2.remove();
      };
    }
  }, [seoSettings?.google_analytics_id]);

  // Handle Google Tag Manager
  useEffect(() => {
    if (seoSettings?.google_tag_manager_id) {
      // GTM Head script
      const script = document.createElement('script');
      script.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${seoSettings.google_tag_manager_id}');
      `;
      document.head.appendChild(script);

      // GTM Body noscript
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${seoSettings.google_tag_manager_id}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.insertBefore(noscript, document.body.firstChild);

      return () => {
        script.remove();
        noscript.remove();
      };
    }
  }, [seoSettings?.google_tag_manager_id]);

  return null; // This component only manages head elements
}