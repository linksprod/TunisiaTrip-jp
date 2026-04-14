
import React, { useState, useRef, useEffect } from "react";
import { MobileSearchInput } from "./MobileSearchInput";
import { MobileSearchDropdown } from "./MobileSearchDropdown";
import { useUnifiedSearch } from "@/hooks/use-unified-search";
import { useTranslation } from "@/hooks/use-translation";

export const MobileSearch: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    searchValue,
    setSearchValue,
    isSearchFocused,
    setIsSearchFocused,
    combinedResults,
    suggestions,
    searchHistory,
    isLoading,
    handleResultClick,
    clearSearch
  } = useUnifiedSearch(currentLanguage);

  // Handle input focus
  const handleInputFocus = () => {
    setIsSearchFocused(true);
    setShowDropdown(true);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't hide dropdown if clicking within it
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowDropdown(false);
    }, 150);
  };

  // Handle input click
  const handleInputClick = () => {
    setIsSearchFocused(true);
    setShowDropdown(true);
  };

  // Handle key down
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (combinedResults.length > 0) {
        handleResultClick(combinedResults[0]);
      }
      setShowDropdown(false);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setIsSearchFocused(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    clearSearch();
    setShowDropdown(false);
  };

  // Handle history click
  const handleHistoryClick = (historyItem: string) => {
    setSearchValue(historyItem);
    setShowDropdown(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setShowDropdown(true);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as Element)?.closest('input')
      ) {
        setShowDropdown(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show content when dropdown is open and we have something to show
  const showContent = showDropdown && (
    combinedResults.length > 0 || 
    isLoading || 
    suggestions.length > 0 ||
    (!searchValue.trim() && searchHistory.length > 0)
  );

  return (
    <div className="relative w-full">
      <MobileSearchInput
        searchValue={searchValue}
        currentLanguage={currentLanguage}
        isLoading={isLoading}
        onInputChange={setSearchValue}
        onInputClick={handleInputClick}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        onClearSearch={handleClearSearch}
      />

      <MobileSearchDropdown
        showContent={showContent}
        isLoading={isLoading}
        searchValue={searchValue}
        results={combinedResults}
        suggestions={suggestions}
        history={searchHistory}
        currentLanguage={currentLanguage}
        onResultClick={handleResultClick}
        onHistoryClick={handleHistoryClick}
        onSuggestionClick={handleSuggestionClick}
        dropdownRef={dropdownRef}
      />
    </div>
  );
};
