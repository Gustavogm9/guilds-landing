import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { 
  ImageOptimizationOptions, 
  createOptimizedImageProps, 
  generateBlurDataURL, 
  optimizeForCLS,
  createLazyLoadObserver
} from '@/lib/imageOptimization';

interface OptimizedImageProps extends Omit<ImageOptimizationOptions, 'src'> {
  src: string;
  className?: string;
  aspectRatio?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  quality = 80,
  format = 'auto',
  loading = 'lazy',
  sizes,
  className,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(priority); // Load immediately if priority
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageProps = createOptimizedImageProps({
    src,
    alt,
    width,
    height,
    priority,
    quality,
    format,
    loading,
    sizes
  });

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || inView) return;

    const observer = createLazyLoadObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer?.unobserve(entry.target);
        }
      });
    });

    if (observer && containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer && containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [priority, inView]);

  useEffect(() => {
    if (imgRef.current) {
      optimizeForCLS.ensureDimensions(imgRef.current);
    }
  }, [src, width, height]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate container styles for aspect ratio if needed
  const containerStyles = aspectRatio ? optimizeForCLS.createAspectRatioContainer(aspectRatio) : {};
  const imageStyles = aspectRatio ? optimizeForCLS.imageStyles : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        aspectRatio && 'bg-neutral-200 dark:bg-neutral-800',
        className
      )}
      style={containerStyles}
    >
      {/* Blur placeholder for better loading experience */}
      {!isLoaded && !hasError && (
        <img
          src={generateBlurDataURL(width || 10, height || 10)}
          alt=""
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            aspectRatio ? 'absolute' : 'w-full h-full'
          )}
          style={aspectRatio ? imageStyles : {}}
          aria-hidden="true"
        />
      )}
      
      {/* Main image - only render when in view or priority */}
      {(inView || priority) && (
        <img
          ref={imgRef}
          {...imageProps}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            aspectRatio ? 'absolute inset-0 w-full h-full object-cover' : 'w-full h-auto',
            hasError && 'hidden'
          )}
          style={aspectRatio ? imageStyles : {}}
          onLoad={handleLoad}
          onError={handleError}
          // Accessibility improvements
          {...(!alt && { 'aria-hidden': 'true', role: 'presentation' })}
          {...(alt && { role: 'img' })}
        />
      )}
      
      {/* Error fallback */}
      {hasError && (
        <div 
          className={cn(
            'flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-500',
            aspectRatio ? 'absolute inset-0' : 'w-full h-40'
          )}
          style={aspectRatio ? imageStyles : {}}
        >
          <div className="text-center">
            <svg 
              className="mx-auto h-8 w-8 mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm">Imagem não encontrada</p>
          </div>
        </div>
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && inView && (
        <div 
          className={cn(
            'animate-pulse bg-neutral-200 dark:bg-neutral-700',
            aspectRatio ? 'absolute inset-0' : 'w-full h-40'
          )}
          style={aspectRatio ? imageStyles : {}}
          aria-label="Carregando imagem..."
          role="status"
        />
      )}
    </div>
  );
}

// Specialized components for common use cases
export function HeroImage(props: Omit<OptimizedImageProps, 'priority'>) {
  return (
    <OptimizedImage
      {...props}
      priority={true}
      sizes={props.sizes || "100vw"}
      className={cn('w-full h-full object-cover', props.className)}
    />
  );
}

export function ThumbnailImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={cn('rounded-lg', props.className)}
    />
  );
}

export function AvatarImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      aspectRatio={1}
      sizes="(max-width: 768px) 80px, 120px"
      className={cn('rounded-full', props.className)}
    />
  );
}