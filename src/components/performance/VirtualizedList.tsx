import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';

// PHASE 3: Virtual scrolling for large lists in Admin

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number;
  height: number;
  width?: string | number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
}

// Fixed height virtual list - optimal for admin tables
export function VirtualizedList<T>({
  items,
  itemHeight = 60,
  height,
  width = '100%',
  renderItem,
  className,
  overscan = 5
}: VirtualizedListProps<T>) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    
    return (
      <div style={style} className={className}>
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem, className]);

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width={width}
      overscanCount={overscan}
    >
      {Row}
    </List>
  );
}

// Variable height virtual list - for content with different sizes
interface VariableVirtualizedListProps<T> extends Omit<VirtualizedListProps<T>, 'itemHeight'> {
  getItemHeight: (index: number) => number;
}

export function VariableVirtualizedList<T>({
  items,
  getItemHeight,
  height,
  width = '100%',
  renderItem,
  className,
  overscan = 5
}: VariableVirtualizedListProps<T>) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    
    return (
      <div style={style} className={className}>
        {renderItem(item, index)}
      </div>
    );
  }, [items, renderItem, className]);

  return (
    <VariableSizeList
      height={height}
      itemCount={items.length}
      itemSize={getItemHeight}
      width={width}
      overscanCount={overscan}
    >
      {Row}
    </VariableSizeList>
  );
}

// Optimized grid virtual list for admin cards/thumbnails
interface VirtualizedGridProps<T> {
  items: T[];
  itemWidth: number;
  itemHeight: number;
  containerWidth: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gap?: number;
}

export function VirtualizedGrid<T>({
  items,
  itemWidth,
  itemHeight,
  containerWidth,
  height,
  renderItem,
  gap = 16
}: VirtualizedGridProps<T>) {
  // Calculate how many items per row
  const itemsPerRow = Math.floor((containerWidth + gap) / (itemWidth + gap));
  const rowCount = Math.ceil(items.length / itemsPerRow);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, items.length);
    const rowItems = items.slice(startIndex, endIndex);

    return (
      <div style={style} className="flex gap-4">
        {rowItems.map((item, itemIndex) => (
          <div
            key={startIndex + itemIndex}
            style={{ width: itemWidth, height: itemHeight }}
          >
            {renderItem(item, startIndex + itemIndex)}
          </div>
        ))}
      </div>
    );
  }, [items, itemsPerRow, itemWidth, itemHeight, renderItem]);

  return (
    <List
      height={height}
      itemCount={rowCount}
      itemSize={itemHeight + gap}
      width={containerWidth}
    >
      {Row}
    </List>
  );
}

// Hook for infinite scrolling with virtual lists
export function useInfiniteVirtualList<T>(
  loadMore: (page: number) => Promise<T[]>,
  pageSize: number = 50
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(0);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasNextPage) return;
    
    setLoading(true);
    try {
      const newItems = await loadMore(page + 1);
      
      if (newItems.length < pageSize) {
        setHasNextPage(false);
      }
      
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [loadMore, loading, hasNextPage, page, pageSize]);

  // Load initial items
  useEffect(() => {
    loadMoreItems();
  }, []); // Only run once

  return {
    items,
    loading,
    hasNextPage,
    loadMoreItems
  };
}