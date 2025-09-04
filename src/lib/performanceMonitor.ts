// Performance monitoring utilities for Core Web Vitals and bundle optimization

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint  
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

interface BundleAnalysis {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
}

// Core Web Vitals monitoring
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lcpEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // FID Observer
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }

    // FCP from Navigation Timing
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        this.metrics.ttfb = nav.responseStart - nav.fetchStart;
      }

      // FCP from Paint Timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Check if metrics pass Core Web Vitals thresholds
  checkThresholds(): {
    lcp: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    fcp: 'good' | 'needs-improvement' | 'poor';
  } {
    return {
      lcp: this.metrics.lcp ? (this.metrics.lcp <= 2500 ? 'good' : this.metrics.lcp <= 4000 ? 'needs-improvement' : 'poor') : 'good',
      cls: this.metrics.cls ? (this.metrics.cls <= 0.1 ? 'good' : this.metrics.cls <= 0.25 ? 'needs-improvement' : 'poor') : 'good',
      fid: this.metrics.fid ? (this.metrics.fid <= 100 ? 'good' : this.metrics.fid <= 300 ? 'needs-improvement' : 'poor') : 'good',
      fcp: this.metrics.fcp ? (this.metrics.fcp <= 1800 ? 'good' : this.metrics.fcp <= 3000 ? 'needs-improvement' : 'poor') : 'good',
    };
  }

  // Send metrics to analytics (placeholder)
  reportMetrics() {
    const thresholds = this.checkThresholds();
    console.log('Performance Metrics:', this.metrics);
    console.log('Core Web Vitals Status:', thresholds);
    
    // In production, send to analytics service
    // gtag('event', 'web_vitals', { ...this.metrics, ...thresholds });
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Bundle size analysis utilities
export const bundleAnalyzer = {
  // Estimate current bundle sizes from imported modules
  analyzeCurrentBundle(): Promise<BundleAnalysis> {
    return new Promise((resolve) => {
      // In development, this would integrate with webpack-bundle-analyzer or rollup-plugin-visualizer
      const estimatedSizes: BundleAnalysis = {
        totalSize: 0,
        jsSize: 0,
        cssSize: 0,
        chunks: []
      };

      // Mock analysis - in production this would read actual bundle stats
      if (typeof window !== 'undefined' && 'performance' in window) {
        const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        
        let jsTotal = 0;
        let cssTotal = 0;
        
        resourceEntries.forEach(entry => {
          const size = entry.transferSize || 0;
          if (entry.name.includes('.js')) {
            jsTotal += size;
          } else if (entry.name.includes('.css')) {
            cssTotal += size;
          }
        });

        estimatedSizes.jsSize = jsTotal;
        estimatedSizes.cssSize = cssTotal;
        estimatedSizes.totalSize = jsTotal + cssTotal;
      }

      resolve(estimatedSizes);
    });
  },

  // Check if bundle sizes exceed thresholds - STRICTER BUDGETS FOR MOBILE
  checkBudgets(analysis: BundleAnalysis): {
    js: { passes: boolean; actual: string; budget: string };
    css: { passes: boolean; actual: string; budget: string };
    total: { passes: boolean; actual: string; budget: string };
  } {
    const JS_BUDGET = 120 * 1024; // 120KB (reduced from 180KB)
    const CSS_BUDGET = 80 * 1024; // 80KB (reduced from 120KB)
    const TOTAL_BUDGET = 200 * 1024; // 200KB (reduced from 300KB)

    return {
      js: {
        passes: analysis.jsSize <= JS_BUDGET,
        actual: `${(analysis.jsSize / 1024).toFixed(1)}KB`,
        budget: `${JS_BUDGET / 1024}KB`
      },
      css: {
        passes: analysis.cssSize <= CSS_BUDGET,
        actual: `${(analysis.cssSize / 1024).toFixed(1)}KB`,
        budget: `${CSS_BUDGET / 1024}KB`
      },
      total: {
        passes: analysis.totalSize <= TOTAL_BUDGET,
        actual: `${(analysis.totalSize / 1024).toFixed(1)}KB`,
        budget: `${TOTAL_BUDGET / 1024}KB`
      }
    };
  }
};

// Global performance monitor instance
let globalMonitor: PerformanceMonitor | null = null;

export const initPerformanceMonitoring = (): PerformanceMonitor => {
  if (!globalMonitor && typeof window !== 'undefined') {
    globalMonitor = new PerformanceMonitor();
    
    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        globalMonitor?.reportMetrics();
      }, 2000);
    });
  }
  
  return globalMonitor!;
};

export const getPerformanceMonitor = (): PerformanceMonitor | null => globalMonitor;