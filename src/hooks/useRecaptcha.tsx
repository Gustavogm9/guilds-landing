import { useEffect, useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

const log = logger.scope('useRecaptcha');

interface RecaptchaConfig {
  siteKey: string;
  scoreThreshold?: number;
}

interface UseRecaptchaReturn {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  executeRecaptcha: (action?: string) => Promise<string | null>;
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const useRecaptcha = (config?: Partial<RecaptchaConfig>): UseRecaptchaReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const siteKey = config?.siteKey || RECAPTCHA_SITE_KEY;
  const scoreThreshold = config?.scoreThreshold || 0.5;

  useEffect(() => {
    if (!siteKey) {
      setError('reCAPTCHA site key not configured');
      setIsLoading(false);
      return;
    }

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setIsReady(true);
          setIsLoading(false);
        });
      }
    };

    script.onerror = () => {
      setError('Failed to load reCAPTCHA');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [siteKey]);

  const executeRecaptcha = useCallback(async (action: string = 'submit'): Promise<string | null> => {
    if (!isReady || !window.grecaptcha) {
      setError('reCAPTCHA not ready');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });

      // Optional: Verify score on client side (server-side verification is recommended)
      if (scoreThreshold > 0) {
        log.debug('reCAPTCHA token generated', { action: 'execute', metadata: { action } });
      }

      return token;
    } catch (err) {
      log.error(err instanceof Error ? err : new Error('reCAPTCHA execution failed'), { action: 'execute' });
      setError('Failed to execute reCAPTCHA');
      return null;
    }
  }, [isReady, siteKey, scoreThreshold]);

  return {
    isReady,
    isLoading,
    error,
    executeRecaptcha,
  };
};

// Global type definitions for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
