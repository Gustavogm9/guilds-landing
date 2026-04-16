// Service Worker for advanced performance optimizations
import { logger } from './logger';

const log = logger.scope('ServiceWorker');

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      log.info('Service Worker registered successfully', { metadata: { registration } });

      // Update available
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available; please refresh
                log.info('New content is available; please refresh.');
              } else {
                // Content is cached for offline use
                log.info('Content is cached for offline use.');
              }
            }
          });
        }
      });
    } catch (error) {
      log.error('Service Worker registration failed', { metadata: { error } });
    }
  }
};

// Note: Preload of critical resources is now handled by AdvancedOptimizations hook
// to avoid duplication and ensure correct bundled URLs

// Resource hints for better performance
export const addResourceHints = () => {
  // DNS prefetch for external domains
  const domains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];

  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.gstatic.com';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

// Initialize all performance optimizations
export const initializePerformanceOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Register service worker
    registerServiceWorker();

    // Add resource hints immediately
    addResourceHints();

    // Optimize scrolling performance
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Optimize font loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        log.debug('Fonts loaded');
      });
    }
  }
};