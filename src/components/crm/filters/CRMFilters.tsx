import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, TrendingUp, Users, Target, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface CRMFilters {
  source?: string;
  leadScoreRange?: [number, number];
  productInterests?: string[];
  assignedTo?: string;
  valueRange?: [number, number];
  dateRange?: [Date | null, Date | null];
  lifecycleStage?: string;
  quickView?: 'hot' | 'cold' | 'my_leads' | 'follow_ups' | null;
  searchTerm?: string;
}

interface CRMFiltersProps {
  filters: CRMFilters;
  onFiltersChange: (filters: CRMFilters) => void;
  onClearFilters: () => void;
  totalDeals: number;
  filteredDeals: number;
}

const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Indicação' },
  { value: 'networking', label: 'Rede de Networking' },
  { value: 'social_media', label: 'Redes Sociais' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'email_marketing', label: 'Email Marketing' },
  { value: 'event', label: 'Evento' },
  { value: 'other', label: 'Outros' }
];

const PRODUCT_INTERESTS = [
  { value: 'software_apps', label: 'Software & Apps' },
  { value: 'automacao_ia', label: 'Automação & IA' },
  { value: 'jogos_gamificacao', label: 'Jogos & Gamificação' },
  { value: 'consultoria', label: 'Consultoria' },
  { value: 'workshops', label: 'Workshops' }
];

const LIFECYCLE_STAGES = [
  { value: 'lead', label: 'Lead' },
  { value: 'mql', label: 'MQL' },
  { value: 'sql', label: 'SQL' },
  { value: 'opportunity', label: 'Oportunidade' },
  { value: 'customer', label: 'Cliente' }
];

const QUICK_VIEWS = [
  { 
    value: 'hot', 
    label: 'Leads Quentes', 
    icon: TrendingUp, 
    description: 'Score alto e engajamento recente',
    color: 'hsl(var(--destructive))'
  },
  { 
    value: 'cold', 
    label: 'Leads Frios', 
    icon: Clock, 
    description: 'Sem interação há 30+ dias',
    color: 'hsl(var(--muted-foreground))'
  },
  { 
    value: 'my_leads', 
    label: 'Meus Leads', 
    icon: Users, 
    description: 'Atribuídos a mim',
    color: 'hsl(var(--primary))'
  },
  { 
    value: 'follow_ups', 
    label: 'Próximas Ações', 
    icon: Target, 
    description: 'Com follow-ups agendados',
    color: 'hsl(var(--warning))'
  }
];

export function CRMFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  totalDeals = 0,
  filteredDeals = 0
}: CRMFiltersProps) {
  // Validação de segurança
  if (!onFiltersChange || !onClearFilters) {
    console.error('CRMFilters: onFiltersChange ou onClearFilters não fornecidos');
    return null;
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && 
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const updateFilter = (key: keyof CRMFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Quick Views */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Visualizações Rápidas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_VIEWS.map(view => {
              const Icon = view.icon;
              const isActive = filters.quickView === view.value;
              
              return (
                <Button
                  key={view.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-start gap-1"
                  onClick={() => updateFilter('quickView', isActive ? null : view.value)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" style={{ color: isActive ? 'currentColor' : view.color }} />
                    <span className="text-xs font-medium">{view.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">{view.description}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Filtros Avançados</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {filteredDeals} de {totalDeals} oportunidades
              </span>
              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="h-7 px-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Buscar</label>
              <Input
                placeholder="Nome, empresa, email..."
                value={filters.searchTerm || ''}
                onChange={(e) => updateFilter('searchTerm', e.target.value || undefined)}
                className="h-9"
              />
            </div>

            {/* Lead Source */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Fonte do Lead</label>
              <Select
                value={filters.source}
                onValueChange={(value) => updateFilter('source', value || undefined)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todas as fontes" />
                </SelectTrigger>
                <SelectContent>
                  
                  {LEAD_SOURCES.map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lifecycle Stage */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Estágio do Lead</label>
              <Select
                value={filters.lifecycleStage}
                onValueChange={(value) => updateFilter('lifecycleStage', value || undefined)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Todos os estágios" />
                </SelectTrigger>
                <SelectContent>
                  
                  {LIFECYCLE_STAGES.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second Row - Date and Value Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Período</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.[0] ? (
                      filters.dateRange[1] ? (
                        <>
                          {format(filters.dateRange[0], "dd/MM", { locale: ptBR })} -{" "}
                          {format(filters.dateRange[1], "dd/MM", { locale: ptBR })}
                        </>
                      ) : (
                        format(filters.dateRange[0], "dd/MM/yyyy", { locale: ptBR })
                      )
                    ) : (
                      <span>Selecionar período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    {/* Quick Presets */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          updateFilter('dateRange', [today, today]);
                        }}
                        className="text-xs h-7"
                      >
                        Hoje
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          const weekAgo = new Date();
                          weekAgo.setDate(today.getDate() - 7);
                          updateFilter('dateRange', [weekAgo, today]);
                        }}
                        className="text-xs h-7"
                      >
                        7 dias
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const today = new Date();
                          const monthAgo = new Date();
                          monthAgo.setMonth(today.getMonth() - 1);
                          updateFilter('dateRange', [monthAgo, today]);
                        }}
                        className="text-xs h-7"
                      >
                        30 dias
                      </Button>
                    </div>
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={filters.dateRange?.[0] || undefined}
                      selected={{
                        from: filters.dateRange?.[0] || undefined,
                        to: filters.dateRange?.[1] || undefined,
                      }}
                      onSelect={(range) => {
                        updateFilter('dateRange', range ? [range.from || null, range.to || null] : undefined);
                      }}
                      numberOfMonths={2}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Value Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Potencial de Venda (R$)</label>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Mín."
                    value={filters.valueRange?.[0] || ''}
                    onChange={(e) => {
                      const min = e.target.value ? parseFloat(e.target.value) : undefined;
                      const max = filters.valueRange?.[1];
                      updateFilter('valueRange', min !== undefined || max !== undefined ? [min || 0, max || 999999] : undefined);
                    }}
                    className="h-9 text-xs"
                  />
                  <Input
                    type="number"
                    placeholder="Máx."
                    value={filters.valueRange?.[1] || ''}
                    onChange={(e) => {
                      const max = e.target.value ? parseFloat(e.target.value) : undefined;
                      const min = filters.valueRange?.[0];
                      updateFilter('valueRange', min !== undefined || max !== undefined ? [min || 0, max || 999999] : undefined);
                    }}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter('valueRange', [5000, 25000])}
                    className="text-xs h-6"
                  >
                    R$ 5-25K
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter('valueRange', [25000, 100000])}
                    className="text-xs h-6"
                  >
                    R$ 25-100K
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => updateFilter('valueRange', [100000, 999999])}
                    className="text-xs h-6"
                  >
                    R$ 100K+
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Interests */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Produtos de Interesse</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_INTERESTS.map(product => {
                const isSelected = filters.productInterests?.includes(product.value);
                return (
                  <Button
                    key={product.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      const current = filters.productInterests || [];
                      const updated = isSelected
                        ? current.filter(p => p !== product.value)
                        : [...current, product.value];
                      updateFilter('productInterests', updated.length > 0 ? updated : undefined);
                    }}
                  >
                    {product.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                {filters.source && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Fonte: {LEAD_SOURCES.find(s => s.value === filters.source)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('source', undefined)} 
                    />
                  </Badge>
                )}
                {filters.lifecycleStage && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Estágio: {LIFECYCLE_STAGES.find(s => s.value === filters.lifecycleStage)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('lifecycleStage', undefined)} 
                    />
                  </Badge>
                )}
                {filters.quickView && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {QUICK_VIEWS.find(v => v.value === filters.quickView)?.label}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('quickView', null)} 
                    />
                  </Badge>
                )}
                {filters.dateRange && filters.dateRange[0] && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.dateRange[1] 
                      ? `${format(filters.dateRange[0], 'dd/MM')} - ${format(filters.dateRange[1], 'dd/MM')}`
                      : format(filters.dateRange[0], 'dd/MM/yyyy')
                    }
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('dateRange', undefined)} 
                    />
                  </Badge>
                )}
                {filters.valueRange && (filters.valueRange[0] || filters.valueRange[1]) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    R$ {filters.valueRange[0] ? `${filters.valueRange[0].toLocaleString()}` : '0'} - 
                    {filters.valueRange[1] && filters.valueRange[1] < 999999 
                      ? ` R$ ${filters.valueRange[1].toLocaleString()}`
                      : '+'
                    }
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('valueRange', undefined)} 
                    />
                  </Badge>
                )}
                {filters.productInterests && filters.productInterests.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {filters.productInterests.length} produto(s)
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter('productInterests', undefined)} 
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}