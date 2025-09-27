import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMultiProduct, ProductLine } from '@/contexts/MultiProductContext';

interface ProductFilterProps {
  compact?: boolean;
  showDateRange?: boolean;
  showAdvanced?: boolean;
}

export function ProductFilter({ 
  compact = false, 
  showDateRange = true, 
  showAdvanced = false 
}: ProductFilterProps) {
  const { 
    currentFilter, 
    setCurrentFilter, 
    products, 
    activeProduct, 
    setActiveProduct 
  } = useMultiProduct();

  const handleProductChange = (product: ProductLine) => {
    setActiveProduct(product);
    setCurrentFilter({
      ...currentFilter,
      product
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setCurrentFilter({
      ...currentFilter,
      dateRange: { start, end }
    });
  };

  const clearFilters = () => {
    setCurrentFilter({
      product: 'all',
      dateRange: { start: null, end: null }
    });
    setActiveProduct('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilter.product !== 'all') count++;
    if (currentFilter.dateRange.start || currentFilter.dateRange.end) count++;
    if (currentFilter.source?.length) count += currentFilter.source.length;
    if (currentFilter.tags?.length) count += currentFilter.tags.length;
    return count;
  };

  const getProductColor = (product: ProductLine) => {
    if (product === 'all') return 'hsl(var(--muted))';
    const config = products.find(p => p.slug === product);
    return config?.color || 'hsl(var(--primary))';
  };

  const getProductName = (product: ProductLine) => {
    if (product === 'all') return 'Todos os Produtos';
    const config = products.find(p => p.slug === product);
    return config?.name || product;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Select value={activeProduct} onValueChange={handleProductChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {products.map(product => (
              <SelectItem key={product.id} value={product.slug}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.color }}
                  />
                  {product.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="gap-1">
            <Filter className="w-3 h-3" />
            {getActiveFiltersCount()}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros Multi-Produto
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="gap-1"
            >
              <X className="w-3 h-3" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Product Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Linha de Produto</label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeProduct === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleProductChange('all')}
              className="gap-2"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getProductColor('all') }}
              />
              Todos
            </Button>
            {products.map(product => (
              <Button
                key={product.id}
                variant={activeProduct === product.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleProductChange(product.slug)}
                className="gap-2"
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: product.color }}
                />
                {product.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        {showDateRange && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFilter.dateRange.start ? (
                      format(currentFilter.dateRange.start, "PPP", { locale: ptBR })
                    ) : (
                      "Data inicial"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentFilter.dateRange.start || undefined}
                    onSelect={(date) => handleDateRangeChange(date || null, currentFilter.dateRange.end)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentFilter.dateRange.end ? (
                      format(currentFilter.dateRange.end, "PPP", { locale: ptBR })
                    ) : (
                      "Data final"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentFilter.dateRange.end || undefined}
                    onSelect={(date) => handleDateRangeChange(currentFilter.dateRange.start, date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Filtros ativos:</span>
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}