import { useEffect, useState } from 'react';
import { PerformanceMonitor, bundleAnalyzer, initPerformanceMonitoring, getPerformanceMonitor } from '@/lib/performanceMonitor';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
}

interface BundleBudgets {
  js: { passes: boolean; actual: string; budget: string };
  css: { passes: boolean; actual: string; budget: string };
  total: { passes: boolean; actual: string; budget: string };
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [budgets, setBudgets] = useState<BundleBudgets | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize performance monitoring
    const monitor = initPerformanceMonitoring();
    
    // Check metrics periodically
    const checkMetrics = () => {
      const currentMetrics = monitor.getMetrics();
      setMetrics(currentMetrics);
    };

    // Check bundle sizes
    const checkBundles = async () => {
      try {
        const analysis = await bundleAnalyzer.analyzeCurrentBundle();
        const budgetCheck = bundleAnalyzer.checkBudgets(analysis);
        setBudgets(budgetCheck);
      } catch (error) {
        console.warn('Could not analyze bundle sizes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial checks
    checkMetrics();
    checkBundles();

    // Check metrics every 2 seconds for the first 10 seconds
    const metricsInterval = setInterval(checkMetrics, 2000);
    
    // Stop checking after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(metricsInterval);
    }, 10000);

    return () => {
      clearInterval(metricsInterval);
      clearTimeout(timeout);
    };
  }, []);

  const getThresholds = () => {
    const monitor = getPerformanceMonitor();
    return monitor ? monitor.checkThresholds() : null;
  };

  const reportMetrics = () => {
    const monitor = getPerformanceMonitor();
    if (monitor) {
      monitor.reportMetrics();
    }
  };

  return {
    metrics,
    budgets,
    isLoading,
    getThresholds,
    reportMetrics
  };
}

// Hook for specific Core Web Vitals monitoring
export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<{
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  } | null>(null);

  useEffect(() => {
    const monitor = getPerformanceMonitor();
    if (!monitor) return;

    const checkVitals = () => {
      const metrics = monitor.getMetrics();
      const thresholds = monitor.checkThresholds();
      
      setVitals({
        lcp: {
          value: metrics.lcp || 0,
          rating: thresholds.lcp
        },
        cls: {
          value: metrics.cls || 0,
          rating: thresholds.cls
        },
        fid: {
          value: metrics.fid || 0,
          rating: thresholds.fid
        }
      });
    };

    // Check immediately and then every 3 seconds
    checkVitals();
    const interval = setInterval(checkVitals, 3000);

    // Stop after 15 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return vitals;
}