
import { useState, useEffect, useCallback } from "react";
import { 
  enhancedSearch, 
  EnhancedSearchItem,
  saveSearchToHistory,
  getSearchHistory
} from "@/services/enhancedSearchService";

export const useEnhancedSearch = (searchValue: string) => {
  const [enhancedResults, setEnhancedResults] = useState<EnhancedSearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setEnhancedResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await enhancedSearch(query, 8);
        setEnhancedResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setEnhancedResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Effect for search debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debouncedSearch(searchValue);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchValue, debouncedSearch]);

  return {
    enhancedResults,
    isLoading,
    setEnhancedResults
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
