// Performance batching utilities to prevent forced reflows

interface DOMOperation {
  read?: () => void;
  write?: () => void;
}

class PerformanceBatcher {
  private readOperations: Array<() => void> = [];
  private writeOperations: Array<() => void> = [];
  private rafId: number | null = null;

  // Add a read operation (like reading offsetWidth, scrollTop, etc.)
  read(operation: () => void) {
    this.readOperations.push(operation);
    this.schedule();
  }

  // Add a write operation (like setting styles, adding classes, etc.)
  write(operation: () => void) {
    this.writeOperations.push(operation);
    this.schedule();
  }

  // Add both read and write operations
  batch(operations: DOMOperation) {
    if (operations.read) {
      this.readOperations.push(operations.read);
    }
    if (operations.write) {
      this.writeOperations.push(operations.write);
    }
    this.schedule();
  }

  private schedule() {
    if (this.rafId) return; // Already scheduled

    this.rafId = requestAnimationFrame(() => {
      // Execute all reads first (batched)
      const reads = [...this.readOperations];
      this.readOperations = [];
      reads.forEach(read => read());

      // Then execute all writes (batched)
      const writes = [...this.writeOperations];
      this.writeOperations = [];
      writes.forEach(write => write());

      this.rafId = null;
    });
  }

  // Cancel pending operations
  cancel() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.readOperations = [];
    this.writeOperations = [];
  }

  // Clear all pending operations
  clear() {
    this.readOperations = [];
    this.writeOperations = [];
  }
}

// Global performance batcher instance
const performanceBatcher = new PerformanceBatcher();

// Utility functions for common operations
export const batchDOMRead = (operation: () => void) => {
  performanceBatcher.read(operation);
};

export const batchDOMWrite = (operation: () => void) => {
  performanceBatcher.write(operation);
};

export const batchDOMOperations = (operations: DOMOperation) => {
  performanceBatcher.batch(operations);
};

// Helper for debounced operations
export const createDebouncedRAF = (callback: () => void) => {
  let rafId: number | null = null;
  
  return () => {
    if (rafId) return; // Already scheduled
    
    rafId = requestAnimationFrame(() => {
      callback();
      rafId = null;
    });
  };
};

// Helper for throttled scroll events
export const createThrottledScroll = (callback: (scrollY: number) => void, threshold = 10) => {
  let lastScrollY = window.scrollY;
  let rafId: number | null = null;
  
  return () => {
    if (rafId) return; // Already scheduled
    
    rafId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      
      if (Math.abs(currentScrollY - lastScrollY) >= threshold) {
        callback(currentScrollY);
        lastScrollY = currentScrollY;
      }
      
      rafId = null;
    });
  };
};

// Helper for intersection observer with batching
export const createBatchedIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  let pendingEntries: IntersectionObserverEntry[] = [];
  let rafId: number | null = null;

  const batchedCallback = (entries: IntersectionObserverEntry[]) => {
    pendingEntries.push(...entries);
    
    if (rafId) return; // Already scheduled
    
    rafId = requestAnimationFrame(() => {
      const entriesToProcess = [...pendingEntries];
      pendingEntries = [];
      
      callback(entriesToProcess);
      rafId = null;
    });
  };

  return new IntersectionObserver(batchedCallback, {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options
  });
};

// Export the main batcher for advanced use cases
export { performanceBatcher };