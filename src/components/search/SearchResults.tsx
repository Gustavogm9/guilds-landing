import { SearchResultCard } from "./SearchResultCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";
import type { SearchResult } from "@/hooks/useSearch";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SearchResults = ({
  results,
  query,
  currentPage,
  totalPages,
  onPageChange
}: SearchResultsProps) => {
  const { t } = useTranslation();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Results Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {t('search.results.showing', { 
            start: (currentPage - 1) * 10 + 1,
            end: Math.min(currentPage * 10, results.length),
            total: results.length 
          })}
        </span>
        {totalPages > 1 && (
          <span>
            {t('search.results.page', { current: currentPage, total: totalPages })}
          </span>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <SearchResultCard
            key={`${result.id}-${index}`}
            result={result}
            query={query}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('search.pagination.previous')}
          </Button>

          <div className="flex items-center gap-1">
            {generatePageNumbers().map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={page === currentPage ? "btn-hero" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            {t('search.pagination.next')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};