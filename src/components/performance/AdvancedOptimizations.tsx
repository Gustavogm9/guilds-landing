import { useEffect, useCallback, useMemo } from 'react';
import { useMobilePerformance } from './MobileOptimizations';
import heroImageUrl from '@/assets/hero-image.jpg';
import logoFullUrl from '@/assets/guilds-logo-full.svg';

// PHASE 4: Advanced performance optimizations

// Resource prefetching based on user behavior
export const useSmartPrefetching = () => {
  const { isMobile, isLowEndDevice } = useMobilePerformance();

  useEffect(() => {
    // Only prefetch on high-end devices to avoid overwhelming low-end devices
    if (isLowEndDevice) return;

    const prefetchOnHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        // Prefetch the page
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
      }
    };

    // Debounced prefetching to avoid too many requests
    let timeoutId: NodeJS.Timeout;
    const debouncedPrefetch = (event: MouseEvent) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => prefetchOnHover(event), 100);
    };

    // Only add hover listeners on desktop
    if (!isMobile) {
      document.addEventListener('mouseover', debouncedPrefetch);
    }

    return () => {
      document.removeEventListener('mouseover', debouncedPrefetch);
      clearTimeout(timeoutId);
    };
  }, [isMobile, isLowEndDevice]);
};

// Critical resource preloading
export const useCriticalResourcePreloader = () => {
  useEffect(() => {
    const preloadCriticalAssets = () => {
      // Preload critical fonts
      const criticalFonts = [
        'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
      ];

      criticalFonts.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = fontUrl;
        document.head.appendChild(link);
      });

      // Preload critical images for LCP optimization (using bundled URLs)
      const criticalImages = [
        heroImageUrl,
        logoFullUrl
      ];

      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Delay preloading slightly to not interfere with initial render
    setTimeout(preloadCriticalAssets, 100);
  }, []);
};

// Network-aware optimizations with batched DOM updates
export const useNetworkOptimization = () => {
  const { isMobile } = useMobilePerformance();

  useEffect(() => {
    // Check for Network Information API support
    const navigator = window.navigator as any;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      // Batch DOM updates to prevent forced reflows
      let rafId: number | null = null;
      let pendingUpdates = false;

      const adaptToConnection = () => {
        if (pendingUpdates) return; // Already scheduled
        
        pendingUpdates = true;
        rafId = requestAnimationFrame(() => {
          const { effectiveType, downlink, saveData } = connection;
          
          // Adjust image quality based on connection
          const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1.5;
          const shouldOptimizeForData = saveData || isSlowConnection;

          // Batch all CSS property updates together
          const docStyle = document.documentElement.style;
          docStyle.setProperty('--image-quality', shouldOptimizeForData ? 'low' : 'high');
          docStyle.setProperty('--animation-enabled', shouldOptimizeForData ? '0' : '1');

          // Update class in the same frame
          if (shouldOptimizeForData) {
            document.documentElement.classList.add('reduced-bandwidth');
          } else {
            document.documentElement.classList.remove('reduced-bandwidth');
          }

          pendingUpdates = false;
          rafId = null;
        });
      };

      adaptToConnection();
      connection.addEventListener('change', adaptToConnection);

      return () => {
        connection.removeEventListener('change', adaptToConnection);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [isMobile]);
};

// Intersection Observer for performance monitoring with RAF batching
export const usePerformanceIntersectionObserver = () => {
  const observeElementPerformance = useCallback((element: Element) => {
    if (!('IntersectionObserver' in window)) return;

    // RAF batching to prevent forced reflows
    let rafId: number | null = null;
    let pendingEntries: IntersectionObserverEntry[] = [];

    const batchedCallback = (entries: IntersectionObserverEntry[]) => {
      pendingEntries.push(...entries);
      
      if (rafId) return; // Already scheduled
      
      rafId = requestAnimationFrame(() => {
        const entriesToProcess = [...pendingEntries];
        pendingEntries = [];
        
        entriesToProcess.forEach(entry => {
          if (entry.isIntersecting) {
            // Mark element as visible for analytics (defer to avoid reflow)
            const elementId = entry.target.id || entry.target.className;
            setTimeout(() => {
              performance.mark(`element-visible-${elementId}`);
            }, 0);
            
            // Lazy load content if needed (batch DOM queries)
            const lazyElements = entry.target.querySelectorAll('[data-lazy]');
            requestIdleCallback ? 
              requestIdleCallback(() => processLazyElements(lazyElements)) :
              setTimeout(() => processLazyElements(lazyElements), 0);
          }
        });
        
        rafId = null;
      });
    };

    const processLazyElements = (lazyElements: NodeListOf<Element>) => {
      lazyElements.forEach(el => {
        const src = el.getAttribute('data-lazy');
        if (src && el instanceof HTMLImageElement) {
          el.src = src;
          el.removeAttribute('data-lazy');
        }
      });
    };

    const observer = new IntersectionObserver(batchedCallback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    observer.observe(element);
    return () => {
      observer.unobserve(element);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return { observeElementPerformance };
};

// Memory cleanup for large datasets
export const useMemoryOptimization = () => {
  const cleanup = useCallback(() => {
    // Force garbage collection if available (Chrome DevTools)
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
    
    // Clear any large cached data structures
    sessionStorage.removeItem('large-dataset-cache');
    
    // Remove unused event listeners
    const elements = document.querySelectorAll('[data-cleanup]');
    elements.forEach(el => {
      const events = el.getAttribute('data-cleanup')?.split(',') || [];
      events.forEach(event => {
        el.removeEventListener(event.trim(), () => {});
      });
    });
  }, []);

  // Cleanup on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [cleanup]);

  return { cleanup };
};

// Combined advanced optimizations hook
export const useAdvancedPerformanceOptimizations = () => {
  useSmartPrefetching();
  useCriticalResourcePreloader();
  useNetworkOptimization();
  const { observeElementPerformance } = usePerformanceIntersectionObserver();
  const { cleanup } = useMemoryOptimization();

  return {
    observeElementPerformance,
    cleanup
  };
};