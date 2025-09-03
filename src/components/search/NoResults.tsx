import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  MessageSquare, 
  ArrowRight,
  Lightbulb,
  HelpCircle
} from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

interface NoResultsProps {
  query: string;
  onNewSearch: (query: string) => void;
}

export const NoResults = ({ query, onNewSearch }: NoResultsProps) => {
  const { t } = useTranslation();

  const suggestions = [
    'automação de processos',
    'desenvolvimento de software',
    'inteligência artificial',
    'jogos corporativos',
    'workshops de tecnologia',
    'consultoria digital'
  ];

  const similarTerms = [
    { original: 'app', suggestion: 'aplicativo ou desenvolvimento' },
    { original: 'AI', suggestion: 'inteligência artificial' },
    { original: 'bot', suggestion: 'automação ou chatbot' },
    { original: 'game', suggestion: 'jogos corporativos' },
    { original: 'curso', suggestion: 'workshop ou treinamento' }
  ];

  const getSimilarTerm = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase();
    return similarTerms.find(term => 
      lowerQuery.includes(term.original.toLowerCase())
    );
  };

  const similarTerm = getSimilarTerm(query);

  return (
    <div className="space-y-6">
      {/* No Results Message */}
      <Card className="card-elevated p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <h2 className="text-2xl font-sora font-semibold mb-3">
          {t('search.noResults.title')}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          {t('search.noResults.message', { query })}
        </p>

        {/* Did you mean */}
        {similarTerm && (
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-brand-primary mb-2">
              <Lightbulb className="h-4 w-4 inline mr-1" />
              {t('search.noResults.didYouMean')}
            </p>
            <Button
              variant="link"
              onClick={() => onNewSearch(similarTerm.suggestion)}
              className="text-brand-primary font-medium h-auto p-0"
            >
              {similarTerm.suggestion}
            </Button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="btn-hero">
            <Link to="/contato">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t('search.noResults.contact')}
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/servicos">
              <ArrowRight className="mr-2 h-4 w-4" />
              {t('search.noResults.services')}
            </Link>
          </Button>
        </div>
      </Card>

      {/* Search Suggestions */}
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-brand-accent" />
          <h3 className="font-sora font-semibold">
            {t('search.noResults.suggestions.title')}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onNewSearch(suggestion)}
              className="text-left p-3 rounded-lg hover:bg-muted transition-colors flex items-center gap-2 group"
            >
              <Search className="h-4 w-4 text-muted-foreground group-hover:text-brand-primary transition-colors" />
              <span className="text-sm group-hover:text-brand-primary transition-colors">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Search Tips */}
      <Card className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-warning" />
          <h3 className="font-sora font-semibold">
            {t('search.noResults.tips.title')}
          </h3>
        </div>
        
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-brand-primary mt-1">•</span>
            {t('search.noResults.tips.spelling')}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary mt-1">•</span>
            {t('search.noResults.tips.keywords')}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary mt-1">•</span>
            {t('search.noResults.tips.synonyms')}
          </li>
          <li className="flex items-start gap-2">
            <span className="text-brand-primary mt-1">•</span>
            {t('search.noResults.tips.specific')}
          </li>
        </ul>
      </Card>
    </div>
  );
};