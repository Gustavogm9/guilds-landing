// Service Worker for advanced performance optimizations
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Update available
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available; please refresh
                console.log('New content is available; please refresh.');
              } else {
                // Content is cached for offline use
                console.log('Content is cached for offline use.');
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical images only (fonts are loaded via Google Fonts)
  const criticalImages = [
    '/assets/hero-image.jpg',
    '/assets/guilds-logo-full.svg'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

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
    
    // Preload critical resources after initial paint
    setTimeout(preloadCriticalResources, 100);
    
    // Optimize scrolling performance
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Optimize font loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded');
      });
    }
  }
};