import { useCallback, useEffect } from 'react';
import { analytics, AnalyticsEvent, CTAClickEvent, LeadSubmitEvent, FileDownloadEvent, WhatsAppClickEvent, NewsletterSubscribeEvent } from '@/lib/analytics';
import { useSEO } from './useSEO';

interface UseAnalyticsReturn {
  // Core tracking methods
  track: <T extends AnalyticsEvent>(event: Omit<T, keyof import('@/lib/analytics').BaseAnalyticsEvent> & Partial<import('@/lib/analytics').BaseAnalyticsEvent>) => void;
  
  // Convenience methods
  trackCTAClick: (label: string, options?: Partial<CTAClickEvent>) => void;
  trackLeadSubmit: (interesse: string, options?: Partial<LeadSubmitEvent>) => void;
  trackFileDownload: (fileName: string, fileUrl: string, options?: Partial<FileDownloadEvent>) => void;
  trackWhatsAppClick: (source?: WhatsAppClickEvent['source'], message?: string) => void;
  trackNewsletterSubscribe: (success: boolean, variant?: NewsletterSubscribeEvent['variant']) => void;
  
  // Enhanced ecommerce
  trackServiceView: (serviceName: string, serviceCategory: string) => void;
  trackServiceInquiry: (serviceName: string, serviceCategory: string, estimatedValue?: number) => void;
  
  // Utility methods
  isInitialized: boolean;
  enableDebugMode: () => void;
  disableDebugMode: () => void;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const { seoSettings } = useSEO();

  // Initialize analytics on mount
  useEffect(() => {
    const debugMode = process.env.NODE_ENV === 'development' || 
                     (typeof window !== 'undefined' && window.location.search.includes('debug=analytics'));
    
    analytics.initialize(debugMode);
  }, []);

  // Core tracking method
  const track = useCallback(<T extends AnalyticsEvent>(
    event: Omit<T, keyof import('@/lib/analytics').BaseAnalyticsEvent> & Partial<import('@/lib/analytics').BaseAnalyticsEvent>
  ) => {
    analytics.track(event);
  }, []);

  // Convenience methods
  const trackCTAClick = useCallback((label: string, options: Partial<CTAClickEvent> = {}) => {
    analytics.trackCTAClick(label, options);
  }, []);

  const trackLeadSubmit = useCallback((interesse: string, options: Partial<LeadSubmitEvent> = {}) => {
    analytics.trackLeadSubmit(interesse, options);
  }, []);

  const trackFileDownload = useCallback((fileName: string, fileUrl: string, options: Partial<FileDownloadEvent> = {}) => {
    analytics.trackFileDownload(fileName, fileUrl, options);
  }, []);

  const trackWhatsAppClick = useCallback((source?: WhatsAppClickEvent['source'] | 'admin_test', message?: string) => {
    analytics.trackWhatsAppClick(source, message);
  }, []);

  const trackNewsletterSubscribe = useCallback((success: boolean, variant?: NewsletterSubscribeEvent['variant']) => {
    analytics.trackNewsletterSubscribe(success, variant);
  }, []);

  // Enhanced ecommerce methods
  const trackServiceView = useCallback((serviceName: string, serviceCategory: string) => {
    analytics.trackServiceView(serviceName, serviceCategory);
  }, []);

  const trackServiceInquiry = useCallback((serviceName: string, serviceCategory: string, estimatedValue: number = 0) => {
    analytics.trackServiceInquiry(serviceName, serviceCategory, estimatedValue);
  }, []);

  // Debug methods
  const enableDebugMode = useCallback(() => {
    analytics.initialize(true);
  }, []);

  const disableDebugMode = useCallback(() => {
    analytics.initialize(false);
  }, []);

  return {
    track,
    trackCTAClick,
    trackLeadSubmit,
    trackFileDownload,
    trackWhatsAppClick,
    trackNewsletterSubscribe,
    trackServiceView,
    trackServiceInquiry,
    isInitialized: true, // Will be dynamic later
    enableDebugMode,
    disableDebugMode,
  };
};

// HOC to automatically track CTA clicks
export interface WithAnalyticsProps {
  analyticsLabel?: string;
  analyticsCategory?: string;
  analyticsSection?: string;
}

export const withAnalytics = <P extends object>(
  Component: React.ComponentType<P>,
  defaultLabel?: string
) => {
  return (props: P & WithAnalyticsProps) => {
    const { trackCTAClick } = useAnalytics();
    const { analyticsLabel, analyticsCategory, analyticsSection, ...restProps } = props;

    const handleClick = useCallback((originalClick?: () => void) => {
      return () => {
        // Track the click
        trackCTAClick(analyticsLabel || defaultLabel || 'Unknown CTA', {
          cta_type: analyticsCategory as any,
          section: analyticsSection,
        });

        // Call original click handler if exists
        if (originalClick) {
          originalClick();
        }
      };
    }, [trackCTAClick, analyticsLabel, analyticsCategory, analyticsSection]);

    return <Component {...(restProps as P)} onClick={handleClick()} />;
  };
};