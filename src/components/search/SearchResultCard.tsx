import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Calendar, Tag } from "lucide-react";
import { HighlightedText } from "./HighlightedText";
import { useTranslation } from "@/contexts/TranslationContext";
import type { SearchResult } from "@/hooks/useSearch";

interface SearchResultCardProps {
  result: SearchResult;
  query: string;
}

export const SearchResultCard = ({ result, query }: SearchResultCardProps) => {
  const { t } = useTranslation();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'page': return t('search.types.page');
      case 'service': return t('search.types.service');
      case 'workshop': return t('search.types.workshop');
      case 'case': return t('search.types.case');
      case 'content': return t('search.types.content');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-neutral-100 text-neutral-800';
      case 'service': return 'bg-brand-primary/10 text-brand-primary';
      case 'workshop': return 'bg-brand-accent/10 text-brand-accent';
      case 'case': return 'bg-success/10 text-success';
      case 'content': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isExternal = result.url.startsWith('http');

  return (
    <Card className="card-elevated p-6 hover:shadow-guild transition-all duration-300 group">
      <div className="space-y-4">
        {/* Type and Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={getTypeColor(result.type)}>
            {getTypeLabel(result.type)}
          </Badge>
          {result.category && (
            <Badge variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {result.category}
            </Badge>
          )}
          {result.date && (
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(result.date).toLocaleDateString('pt-BR')}
            </Badge>
          )}
        </div>

        {/* Title */}
        <div>
          {isExternal ? (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link"
            >
              <h3 className="text-xl font-sora font-semibold text-foreground group-hover:text-brand-primary transition-colors flex items-center gap-2">
                <HighlightedText text={result.title} highlight={query} />
                <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </h3>
            </a>
          ) : (
            <Link to={result.url} className="group/link">
              <h3 className="text-xl font-sora font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                <HighlightedText text={result.title} highlight={query} />
              </h3>
            </Link>
          )}
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          <HighlightedText text={result.description} highlight={query} />
        </p>

        {/* Content Snippet */}
        {result.snippet && (
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <HighlightedText text={result.snippet} highlight={query} />
          </div>
        )}

        {/* Tags */}
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {result.tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{result.tags.length - 5} mais
              </Badge>
            )}
          </div>
        )}

        {/* URL Preview */}
        <div className="text-xs text-brand-primary font-mono bg-brand-primary/5 rounded px-2 py-1 inline-block">
          {isExternal ? result.url : `${window.location.origin}${result.url}`}
        </div>
      </div>
    </Card>
  );
};