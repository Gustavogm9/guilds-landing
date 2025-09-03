import { useState, useEffect } from "react";
import { searchEngine } from "@/lib/searchEngine";

export const useSearchSuggestions = (query: string, enabled: boolean = true) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      try {
        const results = searchEngine.getSuggestions(query, 5);
        setSuggestions(results);
      } catch (error) {
        console.error('Suggestions error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query, enabled]);

  return { suggestions, isLoading };
};