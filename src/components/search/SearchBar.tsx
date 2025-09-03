import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  className?: string;
}

export const SearchBar = ({
  initialQuery = "",
  onSearch,
  placeholder = "Buscar...",
  showSuggestions = false,
  className
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isLoading } = useSearchSuggestions(query, showSuggestions && isFocused);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const showSuggestionsList = showSuggestions && isFocused && suggestions.length > 0 && query.length > 2;

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              // Delay to allow suggestion clicks
              setTimeout(() => setIsFocused(false), 200);
            }}
            placeholder={placeholder}
            className="pl-12 pr-20 h-14 text-lg bg-card border-2 border-border hover:border-brand-primary/50 focus:border-brand-primary transition-colors"
          />
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            size="sm"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-4 btn-hero"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestionsList && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Buscando sugestões...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
              >
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};