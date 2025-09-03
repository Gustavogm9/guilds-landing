import { useEffect, useRef } from 'react';
import { focusManager } from '@/lib/accessibilityHelpers';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export function FocusTrap({ 
  children, 
  active = true, 
  restoreFocus = true, 
  autoFocus = true 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Store current focus if we should restore it later
    if (restoreFocus) {
      focusManager.storeFocus();
    }

    // Set up focus trap
    cleanup.current = focusManager.trapFocus(containerRef.current);

    // Auto-focus first element
    if (autoFocus) {
      focusManager.focusFirst(containerRef.current);
    }

    return () => {
      // Clean up focus trap
      if (cleanup.current) {
        cleanup.current();
        cleanup.current = null;
      }

      // Restore focus if requested
      if (restoreFocus) {
        focusManager.restoreFocus();
      }
    };
  }, [active, restoreFocus, autoFocus]);

  return (
    <div ref={containerRef} className="focus-trap">
      {children}
    </div>
  );
}

// Hook version for more flexibility
export function useFocusTrap(
  active: boolean, 
  options: { restoreFocus?: boolean; autoFocus?: boolean } = {}
) {
  const containerRef = useRef<HTMLElement>(null);
  const { restoreFocus = true, autoFocus = true } = options;

  useEffect(() => {
    if (!active || !containerRef.current) return;

    if (restoreFocus) {
      focusManager.storeFocus();
    }

    const cleanup = focusManager.trapFocus(containerRef.current);

    if (autoFocus) {
      focusManager.focusFirst(containerRef.current);
    }

    return () => {
      cleanup();
      if (restoreFocus) {
        focusManager.restoreFocus();
      }
    };
  }, [active, restoreFocus, autoFocus]);

  return containerRef;
}