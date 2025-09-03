import { useState, useCallback } from "react";
import { searchEngine, SearchResult } from "@/lib/searchEngine";

export interface SearchFilters {
  category?: string;
  type?: string;
  dateRange?: string;
}

export interface SearchOptions extends SearchFilters {
  page?: number;
  limit?: number;
}

export { type SearchResult };

export const useSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({});

  const executeSearch = useCallback(async (query: string, options: SearchOptions = {}) => {
    setIsLoading(true);
    
    try {
      const searchResults = searchEngine.search(query, options);
      
      setResults(searchResults.results);
      setTotalResults(searchResults.totalResults);
      setCurrentPage(searchResults.currentPage);
      setTotalPages(searchResults.totalPages);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
      setCurrentPage(1);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    results,
    isLoading,
    totalResults,
    currentPage,
    totalPages,
    filters,
    executeSearch,
    updateFilters
  };
};