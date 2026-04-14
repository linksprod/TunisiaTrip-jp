
// Note: This file is maintained for backward compatibility
// The new enhanced search system is in src/services/enhancedSearchService.ts
// which provides more comprehensive search across all website sections

import { enhancedSearchData, enhancedFuzzySearch, SearchItem } from "./enhancedSearchData";
import { getTrendingSearches } from "./search/trending";

// Use enhanced search data as the main source
export const searchData: SearchItem[] = enhancedSearchData;

/**
 * Enhanced search function with better contextual matching
 * @param query - The search query string
 * @param language - Current language (EN or JP)
 * @returns Array of matching search items
 */
export function searchItems(query: string, language: string): SearchItem[] {
  if (!query || query.trim() === '') return [];
  
  // Use the enhanced fuzzy search for better results
  return enhancedFuzzySearch(query, language, enhancedSearchData);
}

/**
 * Get display title based on the current language
 * @param item - The search item
 * @param language - Current language code
 */
export function getSearchItemTitle(item: SearchItem, language: string): string {
  if (language === 'JP' && item.titleJP) {
    return item.titleJP;
  }
  return item.title;
}

// Re-export trending searches
export { getTrendingSearches };
