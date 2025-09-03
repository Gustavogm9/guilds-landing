import { useMemo } from "react";

interface HighlightedTextProps {
  text: string;
  highlight: string;
  className?: string;
}

export const HighlightedText = ({ text, highlight, className }: HighlightedTextProps) => {
  const highlightedText = useMemo(() => {
    if (!highlight || !text) return text;

    // Clean and prepare the search terms
    const searchTerms = highlight
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 1); // Only highlight terms with 2+ characters

    if (searchTerms.length === 0) return text;

    // Create a regex pattern for all search terms
    const pattern = new RegExp(
      `(${searchTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'gi'
    );

    // Split text and wrap matches
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      // Check if this part matches any search term
      const isMatch = searchTerms.some(term => 
        part.toLowerCase() === term.toLowerCase()
      );

      if (isMatch) {
        return (
          <mark
            key={index}
            className="bg-brand-primary/20 text-brand-primary font-medium px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      
      return part;
    });
  }, [text, highlight]);

  return (
    <span className={className}>
      {highlightedText}
    </span>
  );
};