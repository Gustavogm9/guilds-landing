import { usePerformanceMonitor, useCoreWebVitals } from '@/hooks/usePerformanceMonitor';
import { useMobilePerformance } from './MobileOptimizations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Gauge, Smartphone, Wifi } from 'lucide-react';

export const PerformanceSummary = () => {
  const { metrics, budgets, isLoading, getThresholds, reportMetrics } = usePerformanceMonitor();
  const vitals = useCoreWebVitals();
  const { isMobile, isLowEndDevice, shouldReduceAnimations, imageQuality } = useMobilePerformance();

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Performance Analysis</h3>
        </div>
        <p className="text-muted-foreground">Analyzing performance metrics...</p>
      </Card>
    );
  }

  const getScoreColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'needs-improvement': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'poor': return 'bg-red-500/10 text-red-600 border-red-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatMs = (value: number) => `${value.toFixed(0)}ms`;
  const formatScore = (value: number) => value.toFixed(3);

  return (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gauge className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Core Web Vitals</h3>
          </div>
          <Button onClick={reportMetrics} variant="outline" size="sm">
            Report Metrics
          </Button>
        </div>
        
        {vitals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold mb-1">
                {formatMs(vitals.lcp.value)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">LCP</div>
              <Badge className={getScoreColor(vitals.lcp.rating)}>
                {vitals.lcp.rating}
              </Badge>
            </div>
            
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold mb-1">
                {formatScore(vitals.cls.value)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">CLS</div>
              <Badge className={getScoreColor(vitals.cls.rating)}>
                {vitals.cls.rating}
              </Badge>
            </div>
            
            <div className="text-center p-4 rounded-lg border">
              <div className="text-2xl font-bold mb-1">
                {formatMs(vitals.fid.value)}
              </div>
              <div className="text-sm text-muted-foreground mb-2">FID</div>
              <Badge className={getScoreColor(vitals.fid.rating)}>
                {vitals.fid.rating}
              </Badge>
            </div>
          </div>
        )}
        
        {/* Additional Metrics */}
        {metrics.fcp && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">First Contentful Paint:</span>
              <span className="ml-2 font-mono">{formatMs(metrics.fcp)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Time to First Byte:</span>
              <span className="ml-2 font-mono">{formatMs(metrics.ttfb || 0)}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Bundle Analysis */}
      {budgets && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wifi className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Bundle Size Analysis</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">JavaScript:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{budgets.js.actual}</span>
                <span className="text-xs text-muted-foreground">/ {budgets.js.budget}</span>
                <Badge variant={budgets.js.passes ? 'secondary' : 'destructive'}>
                  {budgets.js.passes ? 'Pass' : 'Fail'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">CSS:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{budgets.css.actual}</span>
                <span className="text-xs text-muted-foreground">/ {budgets.css.budget}</span>
                <Badge variant={budgets.css.passes ? 'secondary' : 'destructive'}>
                  {budgets.css.passes ? 'Pass' : 'Fail'}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Total:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{budgets.total.actual}</span>
                <span className="text-xs text-muted-foreground">/ {budgets.total.budget}</span>
                <Badge variant={budgets.total.passes ? 'secondary' : 'destructive'}>
                  {budgets.total.passes ? 'Pass' : 'Fail'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Mobile Optimizations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Mobile Optimizations</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Device Type:</span>
            <Badge variant="outline">{isMobile ? 'Mobile' : 'Desktop'}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Device Performance:</span>
            <Badge variant={isLowEndDevice ? 'destructive' : 'secondary'}>
              {isLowEndDevice ? 'Low-End' : 'High-End'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Animations:</span>
            <Badge variant={shouldReduceAnimations ? 'destructive' : 'secondary'}>
              {shouldReduceAnimations ? 'Reduced' : 'Full'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Image Quality:</span>
            <Badge variant="outline">{imageQuality}</Badge>
          </div>
        </div>
      </Card>

      {/* Optimization Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Optimizations</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Bundle size budgets enforced</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Lazy loading implemented</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Mobile-optimized animations</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Critical resource preloading</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Service Worker caching</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Optimized state management</span>
          </div>
        </div>
      </Card>
    </div>
  );
};