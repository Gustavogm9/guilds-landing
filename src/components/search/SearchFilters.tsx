import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Filter, 
  X, 
  Calendar,
  Tag,
  FileText,
  Briefcase,
  GraduationCap,
  Trophy,
  Globe
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface SearchFiltersProps {
  filters: {
    category?: string;
    type?: string;
    dateRange?: string;
  };
  onFiltersChange: (filters: any) => void;
  resultsCount: number;
}

export const SearchFilters = ({ filters, onFiltersChange, resultsCount }: SearchFiltersProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);

  const categories = [
    { id: 'servicos', label: t('search.filters.categories.services'), icon: Briefcase },
    { id: 'workshops', label: t('search.filters.categories.workshops'), icon: GraduationCap },
    { id: 'cases', label: t('search.filters.categories.cases'), icon: Trophy },
    { id: 'sobre', label: t('search.filters.categories.about'), icon: Globe },
    { id: 'conteudo', label: t('search.filters.categories.content'), icon: FileText }
  ];

  const types = [
    { id: 'page', label: t('search.types.page') },
    { id: 'service', label: t('search.types.service') },
    { id: 'workshop', label: t('search.types.workshop') },
    { id: 'case', label: t('search.types.case') },
    { id: 'content', label: t('search.types.content') }
  ];

  const dateRanges = [
    { id: 'week', label: t('search.filters.date.week') },
    { id: 'month', label: t('search.filters.date.month') },
    { id: 'year', label: t('search.filters.date.year') },
    { id: 'all', label: t('search.filters.date.all') }
  ];

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters };
    
    if (newFilters[filterType as keyof typeof newFilters] === value) {
      // Remove filter if already selected
      delete newFilters[filterType as keyof typeof newFilters];
    } else {
      // Set new filter
      (newFilters as any)[filterType] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card className="card-elevated p-6 sticky top-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-brand-primary" />
            <h3 className="font-sora font-semibold text-lg">
              {t('search.filters.title')}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden"
          >
            {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          {t('search.filters.results', { count: resultsCount })}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('search.filters.active')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-auto p-1 text-muted-foreground hover:text-foreground"
              >
                {t('search.filters.clear')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {value}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleFilterChange(key, value)}
                  />
                </Badge>
              ))}
            </div>
            <Separator />
          </div>
        )}

        {/* Filters Content */}
        <div className={`space-y-6 ${!isExpanded ? 'hidden md:block' : ''}`}>
          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {t('search.filters.category')}
              </span>
            </div>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = filters.category === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleFilterChange('category', category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Type Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {t('search.filters.type')}
              </span>
            </div>
            <div className="space-y-2">
              {types.map((type) => {
                const isActive = filters.type === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleFilterChange('type', type.id)}
                    className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-brand-accent/10 text-brand-accent' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">
                {t('search.filters.date.title')}
              </span>
            </div>
            <div className="space-y-2">
              {dateRanges.map((range) => {
                const isActive = filters.dateRange === range.id;
                return (
                  <button
                    key={range.id}
                    onClick={() => handleFilterChange('dateRange', range.id)}
                    className={`w-full flex items-center p-2 rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'bg-success/10 text-success' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-sm">{range.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};