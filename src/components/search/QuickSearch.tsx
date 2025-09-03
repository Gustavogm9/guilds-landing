import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/contexts/TranslationContext";

interface QuickSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export const QuickSearch = ({ 
  placeholder = "Busque por conteúdo...", 
  className,
  onSearch 
}: QuickSearchProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-12 h-12 bg-card/50 backdrop-blur-sm border-border/50 focus:border-brand-primary"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!query.trim()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-3"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};