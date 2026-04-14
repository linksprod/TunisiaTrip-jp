
import { useState, useEffect, useCallback } from "react";
import { enhancedFuzzySearch } from "@/utils/search/fuzzySearch";
import { enhancedSearchData } from "@/utils/enhancedSearchData";
import { SearchItem } from "@/utils/search/types";

export const useBasicSearch = (searchValue: string, language: string = 'EN') => {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Enhanced contextual matching
  const performContextualSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Use the enhanced fuzzy search with contextual data
      const searchResults = enhancedFuzzySearch(query, language, enhancedSearchData);
      
      // Generate contextual suggestions based on the query
      const contextualSuggestions = generateContextualSuggestions(query, language);
      
      setResults(searchResults);
      setSuggestions(contextualSuggestions);
    } catch (error) {
      console.error("Basic search error:", error);
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  // Generate contextual suggestions based on query intent
  const generateContextualSuggestions = (query: string, lang: string): string[] => {
    const queryLower = query.toLowerCase();
    const suggestions: string[] = [];

    // Context-aware suggestions
    if (queryLower.includes('beach') || queryLower.includes('ビーチ') || queryLower.includes('sea')) {
      suggestions.push(
        lang === 'JP' ? 'チュニジアのビーチ' : 'Tunisia beaches',
        lang === 'JP' ? 'ハンマメットビーチ' : 'Hammamet beaches',
        lang === 'JP' ? 'ジェルバ島' : 'Djerba island'
      );
    }
    
    if (queryLower.includes('desert') || queryLower.includes('砂漠') || queryLower.includes('sahara')) {
      suggestions.push(
        lang === 'JP' ? 'サハラ砂漠体験' : 'Sahara desert experience',
        lang === 'JP' ? '砂漠ツアー' : 'Desert tours',
        lang === 'JP' ? 'オアシス' : 'Oases'
      );
    }
    
    if (queryLower.includes('star wars') || queryLower.includes('スターウォーズ') || queryLower.includes('tatooine')) {
      suggestions.push(
        lang === 'JP' ? 'スターウォーズ撮影地' : 'Star Wars filming locations',
        lang === 'JP' ? 'タトゥイーン' : 'Tatooine scenes',
        lang === 'JP' ? 'マトマタ' : 'Matmata'
      );
    }
    
    if (queryLower.includes('roman') || queryLower.includes('ローマ') || queryLower.includes('ruins')) {
      suggestions.push(
        lang === 'JP' ? 'ローマ遺跡' : 'Roman ruins',
        lang === 'JP' ? 'エルジェム' : 'El Jem amphitheater',
        lang === 'JP' ? 'カルタゴ' : 'Carthage'
      );
    }
    
    if (queryLower.includes('food') || queryLower.includes('料理') || queryLower.includes('eat')) {
      suggestions.push(
        lang === 'JP' ? 'チュニジア料理' : 'Tunisian cuisine',
        lang === 'JP' ? 'クスクス' : 'Couscous',
        lang === 'JP' ? 'ハリッサ' : 'Harissa'
      );
    }

    // City-based suggestions
    const cities = ['tunis', 'sousse', 'djerba', 'kairouan', 'bizerte', 'sfax'];
    const matchedCity = cities.find(city => queryLower.includes(city));
    if (matchedCity) {
      suggestions.push(
        lang === 'JP' ? `${matchedCity}の観光地` : `${matchedCity} attractions`,
        lang === 'JP' ? `${matchedCity}のホテル` : `${matchedCity} hotels`,
        lang === 'JP' ? `${matchedCity}ツアー` : `${matchedCity} tours`
      );
    }

    return suggestions.slice(0, 5);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performContextualSearch(searchValue);
    }, 100); // Very fast for basic search

    return () => clearTimeout(timeoutId);
  }, [searchValue, performContextualSearch]);

  return {
    results,
    isLoading,
    suggestions
  };
};
