import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

// Enhanced lazy loading with intersection observer for sections
export const LazySection = ({ 
  children, 
  fallback,
  threshold = 0.1,
  rootMargin = '100px 0px'
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Disconnect after first load to prevent re-triggering
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  const defaultFallback = (
    <div className="space-y-4 p-8">
      <Skeleton className="h-8 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="min-h-[200px]">
      {isVisible ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};

// Create lazy-loaded components for heavy sections
export const LazyTestimonialCarousel = lazy(() => 
  import('@/components/ui/TestimonialCarousel').then(module => ({
    default: module.TestimonialCarousel
  }))
);