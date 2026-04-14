
import React from "react";
import { SearchHistory } from "./SearchHistory";
import { SearchSuggestions } from "./SearchSuggestions";
import { EnhancedSearchResults } from "./EnhancedSearchResults";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  showContent: boolean;
  isLoading: boolean;
  searchValue: string;
  enhancedResults: any[];
  suggestions: string[];
  history: string[];
  currentLanguage: string;
  onResultClick: (item: any) => void;
  onHistoryClick: (historyItem: string) => void;
  onSuggestionClick: (suggestion: string) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
  inputWidth: string;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  showContent,
  isLoading,
  searchValue,
  enhancedResults,
  suggestions,
  history,
  currentLanguage,
  onResultClick,
  onHistoryClick,
  onSuggestionClick,
  dropdownRef,
  inputWidth
}) => {
  if (!showContent) return null;

  return (
    <div 
      ref={dropdownRef}
      className={cn(
        "absolute top-full left-0 right-0 mt-1 xs:mt-2",
        "bg-white border border-gray-200 rounded-lg shadow-xl",
        "max-h-[300px] xs:max-h-[400px] overflow-y-auto",
        "z-[60]",
        inputWidth,
        // Ensure dropdown doesn't overflow viewport
        "max-w-[calc(100vw-1rem)] xs:max-w-[calc(100vw-2rem)]"
      )}
      style={{ 
        zIndex: 60,
        // Prevent horizontal overflow on very small screens
        minWidth: '280px'
      }}
    >
      {isLoading ? (
        <div className="p-3 xs:p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 xs:h-6 xs:w-6 border-b-2 border-blue-500 mx-auto"></div>
          <span className="mt-2 block text-xs xs:text-sm">
            {currentLanguage === 'JP' ? '検索中...' : 'Searching...'}
          </span>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {/* Search Results */}
          {enhancedResults.length > 0 && (
            <EnhancedSearchResults
              results={enhancedResults}
              onResultClick={onResultClick}
              currentLanguage={currentLanguage}
            />
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <SearchSuggestions
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
              currentLanguage={currentLanguage}
            />
          )}

          {/* Search History - only show when no search value */}
          {!searchValue.trim() && history.length > 0 && (
            <SearchHistory
              history={history}
              onHistoryClick={onHistoryClick}
              currentLanguage={currentLanguage}
            />
          )}

          {/* No results message */}
          {searchValue.trim() && enhancedResults.length === 0 && !isLoading && (
            <div className="p-3 xs:p-4 text-center text-gray-500">
              <span className="text-xs xs:text-sm">
                {currentLanguage === 'JP' ? '結果が見つかりませんでした' : 'No results found'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
