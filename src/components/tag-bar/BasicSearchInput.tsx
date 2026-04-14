
import React, { useState, useRef, useEffect, useCallback } from "react";
import { SearchInputField } from "./SearchInputField";
import { SearchDropdown } from "./SearchDropdown";
import { getResponsiveSpacing } from "@/utils/responsiveUtils";

interface BasicSearchInputProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  isMobile: boolean;
  onSearch: (value?: string) => void;
  currentLanguage: string;
  clearSearch: () => void;
}

export const BasicSearchInput: React.FC<BasicSearchInputProps> = ({
  searchValue,
  setSearchValue,
  isSearchFocused,
  setIsSearchFocused,
  isMobile,
  onSearch,
  currentLanguage,
  clearSearch
}) => {
  const [suggestions] = useState<string[]>([]);
  const [history] = useState<string[]>([]);
  const [enhancedResults] = useState<any[]>([]);
  const [isLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Responsive width logic
  const getInputWidth = useCallback(() => {
    if (isMobile) {
      return "w-full";
    }
    
    // Desktop responsive width based on focus and content
    const hasContent = searchValue.length > 0 || isSearchFocused;
    return hasContent 
      ? "w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[400px]"
      : "w-48 sm:w-52 md:w-60 lg:w-64 xl:w-72";
  }, [isMobile, searchValue, isSearchFocused]);

  // Get responsive dropdown width
  const getDropdownWidth = useCallback(() => {
    if (isMobile) {
      return "w-full max-w-[calc(100vw-1rem)]";
    }
    return "w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[400px] max-w-[calc(100vw-2rem)]";
  }, [isMobile]);

  const handleInputChange = (value: string) => {
    console.log("Search input changed:", value);
    setSearchValue(value);
  };

  const handleInputClick = () => {
    console.log("Search input clicked");
    setIsSearchFocused(true);
  };

  const handleInputFocus = () => {
    console.log("Search input focused");
    setIsSearchFocused(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Only blur if not clicking inside dropdown
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    console.log("Search input blurred");
    setTimeout(() => setIsSearchFocused(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log("Enter pressed, searching for:", searchValue);
      if (searchValue.trim()) {
        onSearch(searchValue);
      }
      setIsSearchFocused(false);
    } else if (e.key === "Escape") {
      console.log("Escape pressed");
      setIsSearchFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClearSearch = () => {
    console.log("Clearing search");
    clearSearch();
    setIsSearchFocused(false);
  };

  const handleResultClick = (item: any) => {
    console.log("Result clicked:", item);
    setIsSearchFocused(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    console.log("History clicked:", historyItem);
    setSearchValue(historyItem);
    onSearch(historyItem);
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    console.log("Suggestion clicked:", suggestion);
    setSearchValue(suggestion);
    onSearch(suggestion);
    setIsSearchFocused(false);
  };

  // Show dropdown content logic
  const showDropdownContent = isSearchFocused && (
    enhancedResults.length > 0 || 
    suggestions.length > 0 || 
    (!searchValue.trim() && history.length > 0) ||
    isLoading
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchFocused]);

  return (
    <div className={`relative ${getResponsiveSpacing('normal')}`}>
      <SearchInputField
        searchValue={searchValue}
        currentLanguage={currentLanguage}
        inputRef={inputRef}
        onInputChange={handleInputChange}
        onInputClick={handleInputClick}
        onInputFocus={handleInputFocus}
        onInputBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        onClearSearch={handleClearSearch}
        getInputWidth={getInputWidth}
      />

      <SearchDropdown
        showContent={showDropdownContent}
        isLoading={isLoading}
        searchValue={searchValue}
        enhancedResults={enhancedResults}
        suggestions={suggestions}
        history={history}
        currentLanguage={currentLanguage}
        onResultClick={handleResultClick}
        onHistoryClick={handleHistoryClick}
        onSuggestionClick={handleSuggestionClick}
        dropdownRef={dropdownRef}
        inputWidth={getDropdownWidth()}
      />
    </div>
  );
};
