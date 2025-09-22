import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export interface FinancialFiltersType {
  dateRange: 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'custom';
  customStartDate?: Date;
  customEndDate?: Date;
  status: 'all' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  category: 'all' | 'receitas' | 'despesas_operacionais' | 'investimentos' | 'financeiro' | 'impostos' | 'folha_pagamento';
  accountType: 'all' | 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  amountRange: {
    min?: number;
    max?: number;
  };
  searchTerm: string;
}

interface FinancialFiltersProps {
  filters: FinancialFiltersType;
  onFiltersChange: (filters: FinancialFiltersType) => void;
  onReset: () => void;
}

export function FinancialFilters({ filters, onFiltersChange, onReset }: FinancialFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FinancialFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.dateRange !== 'last_30_days') count++;
    if (filters.status !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.accountType !== 'all') count++;
    if (filters.amountRange.min || filters.amountRange.max) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const getDateRangeLabel = () => {
    switch (filters.dateRange) {
      case 'last_7_days': return 'Últimos 7 dias';
      case 'last_30_days': return 'Últimos 30 dias';
      case 'last_3_months': return 'Últimos 3 meses';
      case 'last_6_months': return 'Últimos 6 meses';
      case 'custom': return 'Período personalizado';
      default: return 'Últimos 30 dias';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filtros básicos - sempre visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Período</Label>
            <Select
              value={filters.dateRange}
              onValueChange={(value: FinancialFiltersType['dateRange']) =>
                updateFilter('dateRange', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Últimos 7 dias</SelectItem>
                <SelectItem value="last_30_days">Últimos 30 dias</SelectItem>
                <SelectItem value="last_3_months">Últimos 3 meses</SelectItem>
                <SelectItem value="last_6_months">Últimos 6 meses</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value: FinancialFiltersType['status']) =>
                updateFilter('status', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="overdue">Em atraso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Categoria</Label>
            <Select
              value={filters.category}
              onValueChange={(value: FinancialFiltersType['category']) =>
                updateFilter('category', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="despesas_operacionais">Despesas Operacionais</SelectItem>
                <SelectItem value="investimentos">Investimentos</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="impostos">Impostos</SelectItem>
                <SelectItem value="folha_pagamento">Folha de Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Buscar</Label>
            <Input
              placeholder="Digite para buscar..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </div>
        </div>

        {/* Filtros avançados - apenas quando expandido */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            {filters.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Data Inicial</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.customStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.customStartDate ? (
                          format(filters.customStartDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data inicial</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.customStartDate}
                        onSelect={(date) => updateFilter('customStartDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data Final</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !filters.customEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.customEndDate ? (
                          format(filters.customEndDate, "dd/MM/yyyy", { locale: ptBR })
                        ) : (
                          <span>Selecione a data final</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.customEndDate}
                        onSelect={(date) => updateFilter('customEndDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de Conta</Label>
                <Select
                  value={filters.accountType}
                  onValueChange={(value: FinancialFiltersType['accountType']) =>
                    updateFilter('accountType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="asset">Ativo</SelectItem>
                    <SelectItem value="liability">Passivo</SelectItem>
                    <SelectItem value="equity">Patrimônio Líquido</SelectItem>
                    <SelectItem value="revenue">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Valor Mínimo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filters.amountRange.min || ''}
                  onChange={(e) =>
                    updateFilter('amountRange', {
                      ...filters.amountRange,
                      min: e.target.value ? parseFloat(e.target.value) : undefined
                    })
                  }
                />
              </div>

              <div>
                <Label>Valor Máximo (R$)</Label>
                <Input
                  type="number"
                  placeholder="99999,00"
                  value={filters.amountRange.max || ''}
                  onChange={(e) =>
                    updateFilter('amountRange', {
                      ...filters.amountRange,
                      max: e.target.value ? parseFloat(e.target.value) : undefined
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumo dos filtros ativos */}
        {getActiveFiltersCount() > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.dateRange !== 'last_30_days' && (
              <Badge variant="outline">{getDateRangeLabel()}</Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="outline">Status: {filters.status}</Badge>
            )}
            {filters.category !== 'all' && (
              <Badge variant="outline">Categoria: {filters.category}</Badge>
            )}
            {filters.accountType !== 'all' && (
              <Badge variant="outline">Tipo: {filters.accountType}</Badge>
            )}
            {(filters.amountRange.min || filters.amountRange.max) && (
              <Badge variant="outline">
                Valor: R$ {filters.amountRange.min || 0} - R$ {filters.amountRange.max || '∞'}
              </Badge>
            )}
            {filters.searchTerm && (
              <Badge variant="outline">Busca: "{filters.searchTerm}"</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}