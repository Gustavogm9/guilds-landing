// Accessibility utilities for WCAG 2.1 AA compliance

// Focus management utilities
export const focusManager = {
  // Store the last focused element before opening modal/dialog
  lastFocusedElement: null as HTMLElement | null,

  // Trap focus within a container
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Store focus before opening modal
  storeFocus() {
    this.lastFocusedElement = document.activeElement as HTMLElement;
  },

  // Restore focus after closing modal
  restoreFocus() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  },

  // Focus first element in container
  focusFirst(container: HTMLElement) {
    const firstFocusable = container.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable?.focus();
  }
};

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create live region element
  createLiveRegion(id: string, priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
    let region = document.getElementById(id);
    
    if (!region) {
      region = document.createElement('div');
      region.id = id;
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }

    return region;
  },

  // Update live region content
  updateLiveRegion(id: string, message: string) {
    const region = document.getElementById(id);
    if (region) {
      region.textContent = message;
    }
  }
};

// Keyboard navigation utilities
export const keyboardNav = {
  // Handle escape key for closing modals/dropdowns
  handleEscape(callback: () => void) {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  },

  // Handle arrow key navigation in lists/menus
  handleArrowNavigation(
    container: HTMLElement,
    options: {
      selector?: string;
      orientation?: 'horizontal' | 'vertical' | 'both';
      loop?: boolean;
    } = {}
  ) {
    const {
      selector = '[role="menuitem"], button, a[href]',
      orientation = 'vertical',
      loop = true
    } = options;

    const handler = (e: KeyboardEvent) => {
      const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
      const currentIndex = items.indexOf(e.target as HTMLElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= items.length && loop) nextIndex = 0;
            if (nextIndex < items.length) items[nextIndex].focus();
          }
          break;

        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0 && loop) nextIndex = items.length - 1;
            if (nextIndex >= 0) items[nextIndex].focus();
          }
          break;

        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= items.length && loop) nextIndex = 0;
            if (nextIndex < items.length) items[nextIndex].focus();
          }
          break;

        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0 && loop) nextIndex = items.length - 1;
            if (nextIndex >= 0) items[nextIndex].focus();
          }
          break;

        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;

        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
      }
    };

    container.addEventListener('keydown', handler);
    return () => container.removeEventListener('keydown', handler);
  }
};

// Color contrast utilities
export const colorContrast = {
  // Convert hex to RGB
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Calculate relative luminance
  getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if contrast ratio meets WCAG guidelines
  checkContrast(
    foreground: string,
    background: string,
    level: 'AA' | 'AAA' = 'AA',
    size: 'normal' | 'large' = 'normal'
  ): {
    ratio: number;
    passes: boolean;
    requiredRatio: number;
  } {
    const ratio = this.getContrastRatio(foreground, background);
    
    let requiredRatio = 4.5; // AA normal text
    if (level === 'AAA' && size === 'normal') requiredRatio = 7;
    if (level === 'AA' && size === 'large') requiredRatio = 3;
    if (level === 'AAA' && size === 'large') requiredRatio = 4.5;

    return {
      ratio: Math.round(ratio * 100) / 100,
      passes: ratio >= requiredRatio,
      requiredRatio
    };
  }
};

// Form accessibility utilities
export const formHelpers = {
  // Associate label with input if not already associated
  associateLabel(input: HTMLInputElement, labelText: string): HTMLLabelElement {
    let label = document.querySelector<HTMLLabelElement>(`label[for="${input.id}"]`);
    
    if (!label) {
      label = document.createElement('label');
      label.setAttribute('for', input.id);
      label.textContent = labelText;
      input.parentNode?.insertBefore(label, input);
    }

    return label;
  },

  // Add error message with proper ARIA attributes
  addErrorMessage(input: HTMLInputElement, message: string): HTMLElement {
    const errorId = `${input.id}-error`;
    let errorElement = document.getElementById(errorId);

    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.setAttribute('role', 'alert');
      errorElement.className = 'text-destructive text-sm mt-1';
      input.parentNode?.insertBefore(errorElement, input.nextSibling);
    }

    errorElement.textContent = message;
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');

    return errorElement;
  },

  // Remove error message and reset ARIA attributes
  removeErrorMessage(input: HTMLInputElement): void {
    const errorId = `${input.id}-error`;
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
      errorElement.remove();
    }

    input.removeAttribute('aria-describedby');
    input.removeAttribute('aria-invalid');
  },

  // Validate form accessibility
  validateFormA11y(form: HTMLFormElement): {
    issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: 'error' | 'warning';
    }>;
    passed: boolean;
  } {
    const issues: Array<{
      element: HTMLElement;
      issue: string;
      severity: 'error' | 'warning';
    }> = [];

    // Check all form controls
    const controls = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    );

    controls.forEach(control => {
      // Check for labels
      const hasLabel = control.labels && control.labels.length > 0;
      const hasAriaLabel = control.getAttribute('aria-label');
      const hasAriaLabelledBy = control.getAttribute('aria-labelledby');

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push({
          element: control,
          issue: 'Form control missing accessible label',
          severity: 'error'
        });
      }

      // Check required fields have aria-required or required attribute
      const isRequired = control.hasAttribute('required') || control.getAttribute('aria-required') === 'true';
      if (!isRequired && control.dataset.required === 'true') {
        issues.push({
          element: control,
          issue: 'Required field missing required attribute',
          severity: 'warning'
        });
      }
    });

    return {
      issues,
      passed: issues.filter(i => i.severity === 'error').length === 0
    };
  }
};

// Skip link utility
export const skipLink = {
  // Create skip link for keyboard navigation
  create(targetId: string, text: string = 'Pular para o conteúdo principal'): HTMLAnchorElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = text;
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:no-underline';
    
    return skipLink;
  },

  // Add skip link to page
  addToPage(targetId: string, text?: string): HTMLAnchorElement {
    const skipLink = this.create(targetId, text);
    document.body.insertBefore(skipLink, document.body.firstChild);
    return skipLink;
  }
};

// ARIA utilities
export const aria = {
  // Manage expanded state for collapsible elements
  toggleExpanded(trigger: HTMLElement, panel: HTMLElement): void {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', (!isExpanded).toString());
    
    if (!isExpanded) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', 'true');
    }
  },

  // Set up proper ARIA relationships for dropdown/combobox
  setupDropdown(trigger: HTMLElement, menu: HTMLElement): void {
    const menuId = menu.id || `menu-${Date.now()}`;
    menu.id = menuId;
    
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', menuId);
    
    menu.setAttribute('role', 'menu');
    menu.setAttribute('hidden', 'true');
  },

  // Create ARIA live region for dynamic content
  createLiveRegion(container: HTMLElement, priority: 'polite' | 'assertive' = 'polite'): HTMLElement {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    container.appendChild(liveRegion);
    
    return liveRegion;
  }
};