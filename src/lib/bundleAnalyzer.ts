// Bundle analysis utilities for performance monitoring
import { logger } from './logger';

const log = logger.scope('BundleAnalyzer');

export interface BundleStats {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
  treemapData?: any;
}

export interface BundleBudgets {
  js: { passes: boolean; actual: string; budget: string; percentage: number };
  css: { passes: boolean; actual: string; budget: string; percentage: number };
  total: { passes: boolean; actual: string; budget: string; percentage: number };
}

// Performance budgets in bytes
export const PERFORMANCE_BUDGETS = {
  JS_BUDGET: 180 * 1024, // 180KB
  CSS_BUDGET: 120 * 1024, // 120KB
  TOTAL_BUDGET: 300 * 1024, // 300KB
  CHUNK_WARNING: 100 * 1024, // 100KB per chunk
} as const;

// Analyze bundle from build stats
export function analyzeBundleStats(stats?: any): BundleStats {
  if (!stats) {
    // Fallback analysis using performance API
    return analyzeBundleFromPerformance();
  }

  // Parse webpack/vite bundle stats
  const chunks = stats.chunks || [];
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;

  const chunkData = chunks.map((chunk: any) => {
    const size = chunk.size || 0;
    totalSize += size;

    if (chunk.files) {
      chunk.files.forEach((file: string) => {
        if (file.endsWith('.js')) jsSize += size;
        if (file.endsWith('.css')) cssSize += size;
      });
    }

    return {
      name: chunk.names?.[0] || chunk.id || 'unknown',
      size,
      modules: chunk.modules?.map((m: any) => m.name || m.id) || []
    };
  });

  return {
    totalSize,
    jsSize,
    cssSize,
    chunks: chunkData,
    treemapData: stats.modules
  };
}

// Fallback analysis using Performance API
function analyzeBundleFromPerformance(): BundleStats {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return {
      totalSize: 0,
      jsSize: 0,
      cssSize: 0,
      chunks: []
    };
  }

  const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  let jsTotal = 0;
  let cssTotal = 0;
  const chunks: Array<{ name: string; size: number; modules: string[] }> = [];

  resourceEntries.forEach(entry => {
    const size = entry.transferSize || entry.decodedBodySize || 0;
    const url = new URL(entry.name);
    const filename = url.pathname.split('/').pop() || '';

    if (filename.includes('.js')) {
      jsTotal += size;
      chunks.push({
        name: filename,
        size,
        modules: []
      });
    } else if (filename.includes('.css')) {
      cssTotal += size;
      chunks.push({
        name: filename,
        size,
        modules: []
      });
    }
  });

  return {
    totalSize: jsTotal + cssTotal,
    jsSize: jsTotal,
    cssSize: cssTotal,
    chunks
  };
}

// Check if bundle sizes meet performance budgets
export function checkBundleBudgets(stats: BundleStats): BundleBudgets {
  const { JS_BUDGET, CSS_BUDGET, TOTAL_BUDGET } = PERFORMANCE_BUDGETS;

  return {
    js: {
      passes: stats.jsSize <= JS_BUDGET,
      actual: formatBytes(stats.jsSize),
      budget: formatBytes(JS_BUDGET),
      percentage: Math.round((stats.jsSize / JS_BUDGET) * 100)
    },
    css: {
      passes: stats.cssSize <= CSS_BUDGET,
      actual: formatBytes(stats.cssSize),
      budget: formatBytes(CSS_BUDGET),
      percentage: Math.round((stats.cssSize / CSS_BUDGET) * 100)
    },
    total: {
      passes: stats.totalSize <= TOTAL_BUDGET,
      actual: formatBytes(stats.totalSize),
      budget: formatBytes(TOTAL_BUDGET),
      percentage: Math.round((stats.totalSize / TOTAL_BUDGET) * 100)
    }
  };
}

// Generate performance report
export function generatePerformanceReport(stats: BundleStats): {
  summary: string;
  recommendations: string[];
  criticalIssues: string[];
  warnings: string[];
} {
  const budgets = checkBundleBudgets(stats);
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check critical issues
  if (!budgets.js.passes && budgets.js.percentage > 120) {
    criticalIssues.push(`JavaScript bundle exceeds budget by ${budgets.js.percentage - 100}% (${budgets.js.actual} vs ${budgets.js.budget})`);
  }

  if (!budgets.css.passes && budgets.css.percentage > 120) {
    criticalIssues.push(`CSS bundle exceeds budget by ${budgets.css.percentage - 100}% (${budgets.css.actual} vs ${budgets.css.budget})`);
  }

  // Check warnings
  if (!budgets.js.passes && budgets.js.percentage <= 120) {
    warnings.push(`JavaScript bundle approaching limit: ${budgets.js.actual} / ${budgets.js.budget} (${budgets.js.percentage}%)`);
  }

  if (!budgets.css.passes && budgets.css.percentage <= 120) {
    warnings.push(`CSS bundle approaching limit: ${budgets.css.actual} / ${budgets.css.budget} (${budgets.css.percentage}%)`);
  }

  // Large chunks warning
  stats.chunks.forEach(chunk => {
    if (chunk.size > PERFORMANCE_BUDGETS.CHUNK_WARNING) {
      warnings.push(`Large chunk detected: ${chunk.name} (${formatBytes(chunk.size)})`);
    }
  });

  // Generate recommendations
  if (stats.jsSize > PERFORMANCE_BUDGETS.JS_BUDGET * 0.8) {
    recommendations.push('Consider code splitting and lazy loading for non-critical modules');
    recommendations.push('Review and optimize third-party dependencies');
    recommendations.push('Enable tree shaking and dead code elimination');
  }

  if (stats.cssSize > PERFORMANCE_BUDGETS.CSS_BUDGET * 0.8) {
    recommendations.push('Implement critical CSS optimization');
    recommendations.push('Use PurgeCSS to remove unused styles');
    recommendations.push('Consider CSS-in-JS for better code splitting');
  }

  if (stats.chunks.length > 10) {
    recommendations.push('Consider consolidating small chunks to reduce HTTP requests');
  }

  const summary = `Bundle Analysis: ${formatBytes(stats.totalSize)} total (${formatBytes(stats.jsSize)} JS, ${formatBytes(stats.cssSize)} CSS) - ${criticalIssues.length} critical, ${warnings.length} warnings`;

  return {
    summary,
    recommendations,
    criticalIssues,
    warnings
  };
}

// Utility to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Development helper to log bundle analysis
export function logBundleAnalysis(stats: BundleStats): void {
  const budgets = checkBundleBudgets(stats);
  const report = generatePerformanceReport(stats);

  log.debug('Bundle Analysis Report', {
    action: 'analyze',
    metadata: {
      summary: report.summary,
      budgets,
      criticalIssues: report.criticalIssues,
      warnings: report.warnings,
      recommendations: report.recommendations
    }
  });
}

// Performance budget enforcement for CI/CD
export function enforceBudgets(stats: BundleStats): {
  passed: boolean;
  errors: string[];
  exitCode: number;
} {
  const budgets = checkBundleBudgets(stats);
  const errors: string[] = [];

  if (!budgets.js.passes) {
    errors.push(`JavaScript budget exceeded: ${budgets.js.actual} > ${budgets.js.budget}`);
  }

  if (!budgets.css.passes) {
    errors.push(`CSS budget exceeded: ${budgets.css.actual} > ${budgets.css.budget}`);
  }

  if (!budgets.total.passes) {
    errors.push(`Total bundle budget exceeded: ${budgets.total.actual} > ${budgets.total.budget}`);
  }

  return {
    passed: errors.length === 0,
    errors,
    exitCode: errors.length > 0 ? 1 : 0
  };
}