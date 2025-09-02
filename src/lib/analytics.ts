// Analytics utilities and event definitions
export interface BaseAnalyticsEvent {
  event: string;
  page?: string;
  timestamp?: number;
  user_agent?: string;
  url?: string;
}

export interface CTAClickEvent extends BaseAnalyticsEvent {
  event: 'cta_click';
  label: string;
  cta_type?: 'primary' | 'secondary' | 'hero' | 'footer';
  section?: string;
}

export interface LeadSubmitEvent extends BaseAnalyticsEvent {
  event: 'lead_submit';
  interesse: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  form_id?: string;
  qualification_score?: number;
}

export interface FileDownloadEvent extends BaseAnalyticsEvent {
  event: 'file_download';
  file_name: string;
  file_type: string;
  file_url: string;
  download_source?: 'cta' | 'inline' | 'popup';
}

export interface WhatsAppClickEvent extends BaseAnalyticsEvent {
  event: 'whatsapp_click';
  source?: 'sticky_mobile' | 'cta_button' | 'thank_you' | 'contact_form';
  message_preset?: string;
}

export interface NewsletterSubscribeEvent extends BaseAnalyticsEvent {
  event: 'newsletter_subscribe';
  variant?: 'footer' | 'inline' | 'modal' | 'popup';
  success: boolean;
}

export type AnalyticsEvent = 
  | CTAClickEvent 
  | LeadSubmitEvent 
  | FileDownloadEvent 
  | WhatsAppClickEvent 
  | NewsletterSubscribeEvent
  | { event: 'view_item'; [key: string]: any }
  | { event: 'add_to_cart'; [key: string]: any };

// GTM DataLayer interface
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    lintrk: (...args: any[]) => void;
  }
}

// Analytics utilities
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private isInitialized = false;
  private debugMode = false;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  initialize(debugMode = false) {
    this.debugMode = debugMode;
    this.isInitialized = true;
    
    // Initialize dataLayer if not exists
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
    }
  }

  // Get UTM parameters from URL
  private getUTMParameters(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || '',
      utm_medium: urlParams.get('utm_medium') || '',
      utm_campaign: urlParams.get('utm_campaign') || '',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
    };
  }

  // Get page context information
  private getPageContext(): Pick<BaseAnalyticsEvent, 'page' | 'url' | 'timestamp' | 'user_agent'> {
    if (typeof window === 'undefined') {
      return {
        page: '',
        url: '',
        timestamp: Date.now(),
        user_agent: '',
      };
    }

    return {
      page: window.location.pathname,
      url: window.location.href,
      timestamp: Date.now(),
      user_agent: navigator.userAgent,
    };
  }

  // Core tracking method
  track<T extends AnalyticsEvent>(event: Omit<T, keyof BaseAnalyticsEvent> & Partial<BaseAnalyticsEvent>): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized. Call initialize() first.');
      return;
    }

    const enrichedEvent = {
      ...event,
      ...this.getPageContext(),
      ...this.getUTMParameters(),
    } as T;

    // Send to GTM DataLayer
    this.pushToDataLayer(enrichedEvent);

    // Debug logging
    if (this.debugMode) {
      console.group('🔍 Analytics Event');
      console.log('Event:', enrichedEvent.event);
      console.table(enrichedEvent);
      console.groupEnd();
    }
  }

  // Push event to GTM DataLayer
  private pushToDataLayer(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(event);
    }
  }

  // Specific event methods for easy usage
  trackCTAClick(label: string, options: Partial<CTAClickEvent> = {}): void {
    this.track<CTAClickEvent>({
      event: 'cta_click',
      label,
      ...options,
    });
  }

  trackLeadSubmit(interesse: string, options: Partial<LeadSubmitEvent> = {}): void {
    this.track<LeadSubmitEvent>({
      event: 'lead_submit',
      interesse,
      ...options,
    });
  }

  trackFileDownload(fileName: string, fileUrl: string, options: Partial<FileDownloadEvent> = {}): void {
    const fileType = fileName.split('.').pop()?.toLowerCase() || 'unknown';
    this.track<FileDownloadEvent>({
      event: 'file_download',
      file_name: fileName,
      file_type: fileType,
      file_url: fileUrl,
      ...options,
    });
  }

  trackWhatsAppClick(source?: WhatsAppClickEvent['source'] | 'admin_test', message?: string): void {
    this.track<WhatsAppClickEvent>({
      event: 'whatsapp_click',
      source: source as WhatsAppClickEvent['source'],
      message_preset: message,
    });
  }

  trackNewsletterSubscribe(success: boolean, variant?: NewsletterSubscribeEvent['variant']): void {
    this.track<NewsletterSubscribeEvent>({
      event: 'newsletter_subscribe',
      success,
      variant,
    });
  }

  // Enhanced ecommerce tracking for services
  trackServiceView(serviceName: string, serviceCategory: string): void {
    this.pushToDataLayer({
      event: 'view_item',
      currency: 'BRL',
      value: 0, // Will be set based on service
      items: [{
        item_id: serviceName.toLowerCase().replace(/\s+/g, '_'),
        item_name: serviceName,
        item_category: serviceCategory,
        item_brand: 'Guilds',
      }]
    } as any);
  }

  trackServiceInquiry(serviceName: string, serviceCategory: string, estimatedValue: number = 0): void {
    this.pushToDataLayer({
      event: 'add_to_cart',
      currency: 'BRL',
      value: estimatedValue,
      items: [{
        item_id: serviceName.toLowerCase().replace(/\s+/g, '_'),
        item_name: serviceName,
        item_category: serviceCategory,
        item_brand: 'Guilds',
        quantity: 1,
      }]
    } as any);
  }
}

// Singleton instance
export const analytics = AnalyticsManager.getInstance();