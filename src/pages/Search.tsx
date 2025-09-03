import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchFilters } from "@/components/search/SearchFilters";
import { NoResults } from "@/components/search/NoResults";
import { useSearch } from "@/hooks/useSearch";
import { useTranslation } from "@/contexts/TranslationContext";
import { SEOHead } from "@/components/seo/SEOHead";
import { Section } from "@/components/ui/section";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { 
    results, 
    isLoading, 
    totalResults, 
    currentPage, 
    totalPages,
    executeSearch,
    filters,
    updateFilters
  } = useSearch();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("categoria") || "";

  useEffect(() => {
    if (query) {
      executeSearch(query, { 
        category: category || undefined,
        page: 1 
      });
    }
  }, [query, category, executeSearch]);

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleFilterChange = (newFilters: any) => {
    updateFilters(newFilters);
    const params = new URLSearchParams(searchParams);
    
    if (newFilters.category) {
      params.set("categoria", newFilters.category);
    } else {
      params.delete("categoria");
    }
    
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    executeSearch(query, { 
      category: category || undefined,
      page 
    });
  };

  return (
    <>
      <SEOHead
        title={query ? `${t('search.results.title')} "${query}"` : t('search.page.title')}
        description={query ? 
          `${t('search.results.description')} "${query}" ${t('search.results.count', { count: totalResults })}` :
          t('search.page.description')
        }
        noIndex={!query}
      />

      <Section className="pt-24 pb-16">
        <div className="container">
          {/* Search Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-sora font-bold text-gradient mb-4">
              {query ? t('search.results.heading') : t('search.page.heading')}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {query ? 
                t('search.results.subtitle', { query, count: totalResults }) :
                t('search.page.subtitle')
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <SearchBar 
              initialQuery={query}
              onSearch={handleSearch}
              placeholder={t('search.bar.placeholder')}
              showSuggestions={true}
            />
          </div>

          {/* Search Results */}
          {query && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFilterChange}
                  resultsCount={totalResults}
                />
              </div>

              {/* Results */}
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="space-y-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="card-elevated p-6 animate-pulse">
                        <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
                        <div className="h-3 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded mb-2 w-5/6"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <SearchResults
                    results={results}
                    query={query}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                ) : query ? (
                  <NoResults 
                    query={query}
                    onNewSearch={handleSearch}
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="text-center mt-16">
              <h2 className="text-2xl font-sora font-semibold mb-6">
                {t('search.popular.title')}
              </h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {[
                  'automação',
                  'inteligência artificial',
                  'desenvolvimento de software',
                  'jogos corporativos',
                  'workshops',
                  'consultoria digital'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

export default Search;