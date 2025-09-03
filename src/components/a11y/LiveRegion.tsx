import { useEffect, useRef } from 'react';
import { screenReader } from '@/lib/accessibilityHelpers';

interface LiveRegionProps {
  message?: string;
  priority?: 'polite' | 'assertive';
  clearOnUpdate?: boolean;
  id?: string;
}

export function LiveRegion({ 
  message, 
  priority = 'polite', 
  clearOnUpdate = true,
  id = 'live-region'
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && regionRef.current) {
      if (clearOnUpdate) {
        // Clear and then set message to ensure screen reader picks it up
        regionRef.current.textContent = '';
        setTimeout(() => {
          if (regionRef.current) {
            regionRef.current.textContent = message;
          }
        }, 10);
      } else {
        regionRef.current.textContent = message;
      }
    }
  }, [message, clearOnUpdate]);

  return (
    <div
      ref={regionRef}
      id={id}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    />
  );
}

// Hook for programmatic announcements
export function useAnnounce() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReader.announce(message, priority);
  };

  return announce;
}