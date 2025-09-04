import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

// Optimized state hook that prevents unnecessary re-renders
export function useOptimizedState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const stateRef = useRef<T>(state);
  
  // Update ref whenever state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Optimized setter that only updates if value actually changed
  const setOptimizedState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prevState)
        : newValue;
      
      // Only update if value actually changed (shallow comparison)
      if (nextState !== prevState) {
        return nextState;
      }
      return prevState;
    });
  }, []);

  // Get current value without causing re-render
  const getCurrentState = useCallback(() => stateRef.current, []);

  return [state, setOptimizedState, getCurrentState] as const;
}

// Batched state updates for multiple state changes
export function useBatchedState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const updateTimeout = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updates: Partial<T>) => {
    // Merge with pending updates
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };
    
    // Clear existing timeout
    if (updateTimeout.current) {
      clearTimeout(updateTimeout.current);
    }
    
    // Batch updates using requestAnimationFrame for better performance
    updateTimeout.current = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        ...pendingUpdates.current
      }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, []);

  return [state, batchUpdate] as const;
}

// Debounced state for expensive operations
export function useDebouncedState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, setValue, debouncedValue] as const;
}

// Memoized array state to prevent unnecessary re-renders
export function useArrayState<T>(initialArray: T[] = []) {
  const [items, setItems] = useState<T[]>(initialArray);
  
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);
  
  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  const updateItem = useCallback((index: number, newItem: T) => {
    setItems(prev => prev.map((item, i) => i === index ? newItem : item));
  }, []);
  
  const clearItems = useCallback(() => {
    setItems([]);
  }, []);
  
  // Memoize array-based operations
  const itemsLength = useMemo(() => items.length, [items.length]);
  const hasItems = useMemo(() => items.length > 0, [items.length]);
  
  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    clearItems,
    itemsLength,
    hasItems
  };
}