import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations = ({ children }: MobileOptimizationsProps) => {
  const isMobile = useIsMobile();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile) {
      // Batch DOM updates to prevent forced reflows
      const updateStyles = () => {
        const docStyle = document.documentElement.style;
        docStyle.setProperty('--animation-duration', reducedMotion ? '0s' : '0.2s');
        docStyle.setProperty('--transition-duration', reducedMotion ? '0s' : '0.15s');
        docStyle.setProperty('scroll-behavior', 'auto');
        document.documentElement.classList.add('mobile-optimized');
      };
      
      // Use RAF to batch style updates
      requestAnimationFrame(updateStyles);
    } else {
      const updateStyles = () => {
        const docStyle = document.documentElement.style;
        docStyle.setProperty('--animation-duration', reducedMotion ? '0s' : '0.3s');
        docStyle.setProperty('--transition-duration', reducedMotion ? '0s' : '0.3s');
        document.documentElement.classList.remove('mobile-optimized');
      };
      
      requestAnimationFrame(updateStyles);
    }
  }, [isMobile, reducedMotion]);

  return <>{children}</>;
};

// Hook for mobile-specific performance optimizations
export const useMobilePerformance = () => {
  const isMobile = useIsMobile();
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    // Detect low-end devices based on hardware concurrency and memory
    const navigator = window.navigator as any;
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = navigator.deviceMemory || 4;
    
    // Consider it low-end if less than 4 cores or less than 4GB RAM
    setIsLowEndDevice(hardwareConcurrency < 4 || deviceMemory < 4);
  }, []);

  return {
    isMobile,
    isLowEndDevice,
    // Reduced animation settings for low-end devices
    shouldReduceAnimations: isMobile || isLowEndDevice,
    // Lower quality settings for images on low-end devices
    imageQuality: isLowEndDevice ? 'low' : 'high',
    // Disable non-critical features on low-end devices
    enableAdvancedFeatures: !isLowEndDevice
  };
};