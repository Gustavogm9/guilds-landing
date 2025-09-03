import { searchableContent } from "@/data/searchableContent";

export interface SearchableContent {
  id: string;
  type: 'page' | 'service' | 'workshop' | 'case' | 'content';
  title: string;
  description: string;
  content: string;
  snippet?: string;
  url: string;
  tags: string[];
  category: string;
  locale: 'pt-BR' | 'en';
  date?: string;
  priority: number; // 1-10, higher = more important
}

export interface SearchFilters {
  category?: string;
  type?: string;
  dateRange?: string;
  locale?: 'pt-BR' | 'en';
}

export interface SearchOptions extends SearchFilters {
  page?: number;
  limit?: number;
}

export interface SearchResult extends SearchableContent {
  score: number;
  snippet: string;
}

export class SearchEngine {
  private content: SearchableContent[] = [];
  private index: Map<string, Set<string>> = new Map();

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.content = searchableContent;
    this.buildIndex();
  }

  private buildIndex() {
    this.content.forEach(item => {
      const tokens = this.tokenize(
        `${item.title} ${item.description} ${item.content} ${item.tags.join(' ')}`
      );
      
      tokens.forEach(token => {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(item.id);
      });
    });
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\sáéíóúàèìòùâêîôûãõç]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
      .map(token => this.normalizeToken(token));
  }

  private normalizeToken(token: string): string {
    return token
      .replace(/[áàâã]/g, 'a')
      .replace(/[éèê]/g, 'e')
      .replace(/[íì]/g, 'i')
      .replace(/[óòôõ]/g, 'o')
      .replace(/[úù]/g, 'u')
      .replace(/ç/g, 'c');
  }

  private calculateScore(item: SearchableContent, query: string): number {
    const queryTokens = this.tokenize(query);
    let score = 0;

    // Title matches (highest weight)
    const titleTokens = this.tokenize(item.title);
    queryTokens.forEach(token => {
      if (titleTokens.some(t => t.includes(token) || token.includes(t))) {
        score += 10;
      }
    });

    // Exact title phrase match
    if (item.title.toLowerCase().includes(query.toLowerCase())) {
      score += 20;
    }

    // Description matches
    const descTokens = this.tokenize(item.description);
    queryTokens.forEach(token => {
      if (descTokens.some(t => t.includes(token) || token.includes(t))) {
        score += 5;
      }
    });

    // Content matches
    const contentTokens = this.tokenize(item.content);
    queryTokens.forEach(token => {
      const matches = contentTokens.filter(t => t.includes(token) || token.includes(t));
      score += matches.length * 1;
    });

    // Tag matches
    queryTokens.forEach(token => {
      if (item.tags.some(tag => 
        this.normalizeToken(tag.toLowerCase()).includes(token) || 
        token.includes(this.normalizeToken(tag.toLowerCase()))
      )) {
        score += 8;
      }
    });

    // Category matches
    if (this.normalizeToken(item.category.toLowerCase()).includes(
      this.normalizeToken(query.toLowerCase())
    )) {
      score += 6;
    }

    // Priority boost
    score += item.priority;

    // Type-based scoring
    switch (item.type) {
      case 'service':
        score += 3;
        break;
      case 'page':
        score += 2;
        break;
      default:
        score += 1;
    }

    return score;
  }

  private generateSnippet(item: SearchableContent, query: string): string {
    const queryTokens = this.tokenize(query);
    const content = `${item.description} ${item.content}`;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Find sentence with most query matches
    let bestSentence = sentences[0] || item.description;
    let maxMatches = 0;

    sentences.forEach(sentence => {
      const sentenceTokens = this.tokenize(sentence);
      const matches = queryTokens.filter(token => 
        sentenceTokens.some(t => t.includes(token) || token.includes(t))
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    });

    // Truncate if too long
    const maxLength = 200;
    if (bestSentence.length > maxLength) {
      bestSentence = bestSentence.substring(0, maxLength).trim() + '...';
    }

    return bestSentence.trim();
  }

  private applyFilters(items: SearchableContent[], filters: SearchFilters): SearchableContent[] {
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.locale && item.locale !== filters.locale) return false;
      
      if (filters.dateRange && item.date) {
        const itemDate = new Date(item.date);
        const now = new Date();
        
        switch (filters.dateRange) {
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (itemDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (itemDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (itemDate < yearAgo) return false;
            break;
        }
      }
      
      return true;
    });
  }

  search(query: string, options: SearchOptions = {}): {
    results: SearchResult[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
  } {
    if (!query.trim()) {
      return {
        results: [],
        totalResults: 0,
        currentPage: 1,
        totalPages: 0
      };
    }

    const { page = 1, limit = 10, ...filters } = options;

    // Get relevant items using index
    const queryTokens = this.tokenize(query);
    const relevantIds = new Set<string>();

    queryTokens.forEach(token => {
      // Exact matches
      if (this.index.has(token)) {
        this.index.get(token)!.forEach(id => relevantIds.add(id));
      }

      // Partial matches
      this.index.forEach((ids, indexToken) => {
        if (indexToken.includes(token) || token.includes(indexToken)) {
          ids.forEach(id => relevantIds.add(id));
        }
      });
    });

    // Get items and calculate scores
    let results = Array.from(relevantIds)
      .map(id => this.content.find(item => item.id === id)!)
      .filter(Boolean)
      .map(item => ({
        ...item,
        score: this.calculateScore(item, query),
        snippet: this.generateSnippet(item, query)
      }))
      .filter(result => result.score > 0);

    // Apply filters
    results = this.applyFilters(results, filters) as SearchResult[];

    // Sort by score (descending)
    results.sort((a, b) => b.score - a.score);

    // Pagination
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / limit);
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return {
      results: paginatedResults,
      totalResults,
      currentPage: page,
      totalPages
    };
  }

  getSuggestions(query: string, limit: number = 5): string[] {
    if (query.length < 2) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    // Get suggestions from titles
    this.content.forEach(item => {
      const title = item.title.toLowerCase();
      if (title.includes(queryLower) && title !== queryLower) {
        suggestions.add(item.title);
      }
    });

    // Get suggestions from tags
    this.content.forEach(item => {
      item.tags.forEach(tag => {
        const tagLower = tag.toLowerCase();
        if (tagLower.includes(queryLower) && tagLower !== queryLower) {
          suggestions.add(tag);
        }
      });
    });

    // Get suggestions from categories
    this.content.forEach(item => {
      const categoryLower = item.category.toLowerCase();
      if (categoryLower.includes(queryLower) && categoryLower !== queryLower) {
        suggestions.add(item.category);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  getPopularSearches(): string[] {
    // In a real app, this would come from analytics
    return [
      'automação de processos',
      'inteligência artificial',
      'desenvolvimento de software',
      'jogos corporativos',
      'workshops de tecnologia',
      'consultoria digital'
    ];
  }
}

// Singleton instance
export const searchEngine = new SearchEngine();