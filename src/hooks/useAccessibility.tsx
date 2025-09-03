import { useEffect, useRef, useCallback } from 'react';
import { focusManager, keyboardNav, screenReader, formHelpers } from '@/lib/accessibilityHelpers';

// Focus management hook
export function useFocusManagement() {
  const trapFocus = useCallback((container: HTMLElement) => {
    return focusManager.trapFocus(container);
  }, []);

  const storeFocus = useCallback(() => {
    focusManager.storeFocus();
  }, []);

  const restoreFocus = useCallback(() => {
    focusManager.restoreFocus();
  }, []);

  const focusFirst = useCallback((container: HTMLElement) => {
    focusManager.focusFirst(container);
  }, []);

  return {
    trapFocus,
    storeFocus,
    restoreFocus,
    focusFirst
  };
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    selector?: string;
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
    onEscape?: () => void;
  } = {}
) {
  const { onEscape } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set up arrow key navigation
    const cleanupArrows = keyboardNav.handleArrowNavigation(container, options);

    // Set up escape key handling
    let cleanupEscape: (() => void) | undefined;
    if (onEscape) {
      cleanupEscape = keyboardNav.handleEscape(onEscape);
    }

    return () => {
      cleanupArrows();
      cleanupEscape?.();
    };
  }, [containerRef, options, onEscape]);
}

// Screen reader announcements hook
export function useScreenReader() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReader.announce(message, priority);
  }, []);

  const createLiveRegion = useCallback((id: string, priority: 'polite' | 'assertive' = 'polite') => {
    return screenReader.createLiveRegion(id, priority);
  }, []);

  const updateLiveRegion = useCallback((id: string, message: string) => {
    screenReader.updateLiveRegion(id, message);
  }, []);

  return {
    announce,
    createLiveRegion,
    updateLiveRegion
  };
}

// Form accessibility validation hook
export function useFormAccessibility(formRef: React.RefObject<HTMLFormElement>) {
  const validateForm = useCallback(() => {
    if (!formRef.current) return null;
    return formHelpers.validateFormA11y(formRef.current);
  }, [formRef]);

  const addErrorMessage = useCallback((input: HTMLInputElement, message: string) => {
    return formHelpers.addErrorMessage(input, message);
  }, []);

  const removeErrorMessage = useCallback((input: HTMLInputElement) => {
    formHelpers.removeErrorMessage(input);
  }, []);

  const associateLabel = useCallback((input: HTMLInputElement, labelText: string) => {
    return formHelpers.associateLabel(input, labelText);
  }, []);

  return {
    validateForm,
    addErrorMessage,
    removeErrorMessage,
    associateLabel
  };
}

// Modal accessibility hook
export function useModalAccessibility(isOpen: boolean) {
  const modalRef = useRef<HTMLElement>(null);
  const { trapFocus, storeFocus, restoreFocus } = useFocusManagement();

  useEffect(() => {
    if (!isOpen) return;

    // Store focus when modal opens
    storeFocus();

    // Trap focus in modal
    const modal = modalRef.current;
    if (modal) {
      const cleanup = trapFocus(modal);
      
      return () => {
        cleanup();
        // Restore focus when modal closes
        restoreFocus();
      };
    }
  }, [isOpen, trapFocus, storeFocus, restoreFocus]);

  return modalRef;
}

// Dropdown accessibility hook
export function useDropdownAccessibility() {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const setupDropdown = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    
    if (trigger && menu) {
      const menuId = menu.id || `dropdown-${Date.now()}`;
      menu.id = menuId;
      
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', menuId);
      
      menu.setAttribute('role', 'menu');
      menu.setAttribute('hidden', 'true');
    }
  }, []);

  const toggleDropdown = useCallback((open: boolean) => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    
    if (trigger && menu) {
      trigger.setAttribute('aria-expanded', open.toString());
      
      if (open) {
        menu.removeAttribute('hidden');
        // Focus first item
        const firstItem = menu.querySelector<HTMLElement>('[role="menuitem"], button, a[href]');
        firstItem?.focus();
      } else {
        menu.setAttribute('hidden', 'true');
        trigger.focus();
      }
    }
  }, []);

  useEffect(() => {
    setupDropdown();
  }, [setupDropdown]);

  useKeyboardNavigation(menuRef, {
    selector: '[role="menuitem"], button, a[href]',
    orientation: 'vertical',
    onEscape: () => toggleDropdown(false)
  });

  return {
    triggerRef,
    menuRef,
    toggleDropdown
  };
}