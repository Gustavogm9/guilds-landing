import { useEffect, useCallback, useMemo } from 'react';
import { useMobilePerformance } from './MobileOptimizations';

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

      // Preload critical images for LCP optimization
      const criticalImages = [
        '/assets/hero-image.jpg',
        '/assets/guilds-logo-full.svg'
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

// Network-aware optimizations
export const useNetworkOptimization = () => {
  const { isMobile } = useMobilePerformance();

  useEffect(() => {
    // Check for Network Information API support
    const navigator = window.navigator as any;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection) {
      const adaptToConnection = () => {
        const { effectiveType, downlink, saveData } = connection;
        
        // Adjust image quality based on connection
        const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g' || downlink < 1.5;
        const shouldOptimizeForData = saveData || isSlowConnection;

        // Set CSS custom properties for adaptive loading
        document.documentElement.style.setProperty(
          '--image-quality', 
          shouldOptimizeForData ? 'low' : 'high'
        );
        
        document.documentElement.style.setProperty(
          '--animation-enabled', 
          shouldOptimizeForData ? '0' : '1'
        );

        // Reduce animations on slow connections
        if (shouldOptimizeForData) {
          document.documentElement.classList.add('reduced-bandwidth');
        } else {
          document.documentElement.classList.remove('reduced-bandwidth');
        }
      };

      adaptToConnection();
      connection.addEventListener('change', adaptToConnection);

      return () => {
        connection.removeEventListener('change', adaptToConnection);
      };
    }
  }, [isMobile]);
};

// Intersection Observer for performance monitoring
export const usePerformanceIntersectionObserver = () => {
  const observeElementPerformance = useCallback((element: Element) => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Mark element as visible for analytics
            const elementId = entry.target.id || entry.target.className;
            performance.mark(`element-visible-${elementId}`);
            
            // Lazy load content if needed
            const lazyElements = entry.target.querySelectorAll('[data-lazy]');
            lazyElements.forEach(el => {
              const src = el.getAttribute('data-lazy');
              if (src && el instanceof HTMLImageElement) {
                el.src = src;
                el.removeAttribute('data-lazy');
              }
            });
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
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