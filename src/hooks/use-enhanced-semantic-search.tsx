
import { useState, useEffect, useCallback } from "react";
import { 
  enhancedSearch, 
  EnhancedSearchItem,
  saveSearchToHistory,
  getSearchHistory
} from "@/services/enhancedSearchService";
import { 
  enhanceSearchQuery, 
  getSearchSuggestions,
  rewriteNaturalLanguageQuery 
} from "@/services/semanticSearchService";

export const useEnhancedSemanticSearch = (searchValue: string, language: string = 'EN') => {
  const [enhancedResults, setEnhancedResults] = useState<EnhancedSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSemanticEnabled, setIsSemanticEnabled] = useState(true);

  // Debounced semantic search function
  const debouncedSemanticSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setEnhancedResults([]);
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        let searchQuery = query;
        let enhancedTerms: string[] = [];

        // Use semantic enhancement if enabled
        if (isSemanticEnabled) {
          // First, rewrite natural language queries
          const rewrittenQuery = await rewriteNaturalLanguageQuery(query, language);
          
          // Then enhance the query with AI
          const semanticResult = await enhanceSearchQuery(rewrittenQuery, language);
          
          if (semanticResult && !semanticResult.fallback) {
            // Collect enhanced terms for better matching
            enhancedTerms = [
              rewrittenQuery,
              semanticResult.enhancedQuery || '',
              ...(semanticResult.keywords || []),
              ...(semanticResult.synonyms || [])
            ].filter(term => term.trim().length > 0);
            
            // Use the enhanced query for primary search
            searchQuery = semanticResult.enhancedQuery || rewrittenQuery;
            
            console.log('Enhanced search query:', searchQuery);
            console.log('Enhanced terms:', enhancedTerms);
            console.log('Search intent:', semanticResult.intent);
          }
        }

        // Perform the actual search with enhanced query and terms
        const results = await enhancedSearch(searchQuery, 12, enhancedTerms);
        
        // Fallback: if AI search returns no results, try original query
        if (results.length === 0 && searchQuery !== query) {
          console.log('No results with enhanced query, trying original query');
          const fallbackResults = await enhancedSearch(query, 12);
          setEnhancedResults(fallbackResults);
        } else {
          setEnhancedResults(results);
        }

        // Get suggestions for current input
        if (query.length >= 2) {
          const searchSuggestions = await getSearchSuggestions(query, language);
          setSuggestions(searchSuggestions);
        }
      } catch (error) {
        console.error("Semantic search error:", error);
        // Fallback to traditional search
        const fallbackResults = await enhancedSearch(query, 8);
        setEnhancedResults(fallbackResults);
      } finally {
        setIsLoading(false);
      }
    },
    [language, isSemanticEnabled]
  );

  // Effect for search debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSemanticSearch(searchValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, debouncedSemanticSearch]);

  // Toggle semantic search on/off
  const toggleSemanticSearch = useCallback(() => {
    setIsSemanticEnabled(prev => !prev);
  }, []);

  return {
    enhancedResults,
    isLoading,
    suggestions,
    setEnhancedResults,
    isSemanticEnabled,
    toggleSemanticSearch
  };
};

export const useSearchHistory = () => {
  const history = getSearchHistory();
  
  const saveToHistory = (query: string) => {
    if (query.trim()) {
      saveSearchToHistory(query);
    }
  };

  return {
    history,
    saveToHistory
  };
};
