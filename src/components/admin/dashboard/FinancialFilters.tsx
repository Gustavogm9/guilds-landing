import { useState } from 'react';
import { Calendar, Filter, Search, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface FilterState {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  status: string;
  type: string;
  amountRange: {
    min: string;
    max: string;
  };
  search: string;
}

interface FinancialFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onExportData: () => void;
}

export function FinancialFilters({ onFiltersChange, onExportData }: FinancialFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    status: 'all',
    type: 'all',
    amountRange: { min: '', max: '' },
    search: '',
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      dateRange: { from: null, to: null },
      status: 'all',
      type: 'all',
      amountRange: { min: '', max: '' },
      search: '',
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    if (filters.search) count++;
    return count;
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseInt(numericValue || '0') / 100);
    return formattedValue;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros e Busca
          </CardTitle>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()} filtro(s) ativo(s)
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={onExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca rápida */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por descrição, fornecedor, cliente..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtros avançados */}
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-4" align="start">
            {/* Período */}
            <div className="space-y-2">
              <Label>Período</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">De</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.from?.toISOString().split('T')[0] || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      from: e.target.value ? new Date(e.target.value) : null
                    })}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Até</Label>
                  <Input
                    type="date"
                    value={filters.dateRange.to?.toISOString().split('T')[0] || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      to: e.target.value ? new Date(e.target.value) : null
                    })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="receivable">Contas a Receber</SelectItem>
                  <SelectItem value="payable">Contas a Pagar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Faixa de valores */}
            <div className="space-y-2">
              <Label>Valor</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Mínimo</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={filters.amountRange.min}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      updateFilter('amountRange', {
                        ...filters.amountRange,
                        min: formatted
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Máximo</Label>
                  <Input
                    placeholder="R$ 0,00"
                    value={filters.amountRange.max}
                    onChange={(e) => {
                      const formatted = formatCurrency(e.target.value);
                      updateFilter('amountRange', {
                        ...filters.amountRange,
                        max: formatted
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Ações */}
            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={clearFilters} className="flex-1">
                Limpar
              </Button>
              <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Filtros ativos */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Busca: "{filters.search}"
                <button
                  onClick={() => updateFilter('search', '')}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Status: {filters.status}
                <button
                  onClick={() => updateFilter('status', 'all')}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {filters.type !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Tipo: {filters.type}
                <button
                  onClick={() => updateFilter('type', 'all')}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="gap-1">
                Período: {filters.dateRange.from?.toLocaleDateString('pt-BR')} - {filters.dateRange.to?.toLocaleDateString('pt-BR')}
                <button
                  onClick={() => updateFilter('dateRange', { from: null, to: null })}
                  className="ml-1 text-xs hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}