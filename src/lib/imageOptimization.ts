// Image optimization utilities for better Core Web Vitals

export interface ImageOptimizationOptions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

// Generate optimized image sources with modern formats
export const generateImageSources = (options: ImageOptimizationOptions): {
  webp?: string;
  avif?: string;
  fallback: string;
} => {
  const { src, quality = 80, format = 'auto' } = options;
  
  // For now, return the original src as fallback
  // In a production app, you'd integrate with a service like Cloudinary or implement server-side optimization
  const sources: {
    webp?: string;
    avif?: string;
    fallback: string;
  } = {
    fallback: src
  };
  
  // Add modern format support when available
  if (format === 'auto' || format === 'webp') {
    sources.webp = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  if (format === 'auto' || format === 'avif') {
    sources.avif = src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  }
  
  return sources;
};

// Generate responsive sizes attribute
export const generateSizes = (breakpoints: Record<string, string>): string => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => 
      breakpoint === 'default' ? size : `(${breakpoint}) ${size}`
    )
    .join(', ');
};

// Generate responsive srcset for different image sizes
export const generateResponsiveSrcset = (src: string, sizes: number[] = [320, 640, 960, 1280, 1920]): string => {
  // For production, this would integrate with an image CDN or server-side resizing
  // For now, we'll use the original image but specify different sizes in srcset
  return sizes
    .map(size => `${src} ${size}w`)
    .join(', ');
};

// Create optimized image props with responsive sizing and priority hints
export const createOptimizedImageProps = (options: ImageOptimizationOptions) => {
  const { src, alt, width, height, priority = false, loading = 'lazy', sizes } = options;
  const sources = generateImageSources(options);
  
  // Generate srcset for responsive images
  const srcset = generateResponsiveSrcset(src);
  
  return {
    src: sources.fallback,
    srcSet: srcset,
    alt,
    width,
    height,
    loading: priority ? 'eager' : loading,
    decoding: 'async' as const,
    // Add fetchpriority for critical images (LCP optimization)
    ...(priority && { fetchPriority: 'high' as const }),
    ...(sizes && { sizes })
  };
};

// Generate resource hints for preloading critical images
export const generateImagePreloads = (images: ImageOptimizationOptions[]): string[] => {
  return images
    .filter(img => img.priority)
    .map(img => {
      const sources = generateImageSources(img);
      return `<link rel="preload" as="image" href="${sources.fallback}" ${
        sources.webp ? `imagesrcset="${sources.webp}" ` : ''
      }${img.sizes ? `imagesizes="${img.sizes}"` : ''}>`;
    });
};

// Lazy loading intersection observer utility
export const createLazyLoadObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });
};

// Image blur placeholder generator (for better perceived performance)
export const generateBlurDataURL = (width = 10, height = 10): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(var(--neutral-200));stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(var(--neutral-300));stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Core Web Vitals optimization utilities
export const optimizeForCLS = {
  // Ensure images have dimensions to prevent layout shift
  ensureDimensions: (img: HTMLImageElement) => {
    if (!img.width || !img.height) {
      console.warn('Image missing dimensions, this may cause Cumulative Layout Shift:', img.src);
    }
  },
  
  // Add aspect ratio container
  createAspectRatioContainer: (aspectRatio: number) => ({
    position: 'relative' as const,
    paddingBottom: `${(1 / aspectRatio) * 100}%`,
    height: 0,
    overflow: 'hidden' as const
  }),
  
  // Image styles to prevent CLS
  imageStyles: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const
  }
};

// Font optimization utilities
export const fontOptimizations = {
  // Generate font-display: swap CSS
  generateFontFaceCSS: (fontFamily: string, src: string) => `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${src}');
      font-display: swap;
    }
  `,
  
  // Preload critical fonts
  generateFontPreloads: (fonts: Array<{ href: string; type?: string }>) => 
    fonts.map(font => 
      `<link rel="preload" href="${font.href}" as="font" type="${font.type || 'font/woff2'}" crossorigin>`
    ),
  
  // Resource hints for font optimization
  generateFontResourceHints: () => [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  ]
};