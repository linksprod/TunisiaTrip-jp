import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SearchInputField } from "./SearchInputField";
import { SearchDropdown } from "./SearchDropdown";
import { useEnhancedSemanticSearch, useSearchHistory } from "@/hooks/use-enhanced-semantic-search";
import { useBasicSearch } from "@/hooks/use-basic-search";
import { EnhancedSearchItem } from "@/services/enhancedSearchService";

interface SearchInputProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  isMobile: boolean;
  onSearch: (value: string) => void;
  currentLanguage: string;
  searchResults: any[];
  handleResultClick: (item: any) => void;
  clearSearch: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  searchValue, 
  setSearchValue, 
  isSearchFocused, 
  setIsSearchFocused,
  isMobile,
  onSearch,
  currentLanguage,
  clearSearch
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayResults, setDisplayResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fast contextual basic search
  const { 
    results: basicResults, 
    isLoading: isBasicLoading, 
    suggestions: basicSuggestions 
  } = useBasicSearch(searchValue, currentLanguage);
  
  // Enhanced AI search for complex queries
  const { 
    enhancedResults, 
    isLoading: isEnhancedLoading, 
    suggestions: enhancedSuggestions,
    setEnhancedResults,
    isSemanticEnabled 
  } = useEnhancedSemanticSearch(searchValue, currentLanguage);
  
  const { history, saveToHistory } = useSearchHistory();

  // Prioritize contextual basic results for instant feedback
  useEffect(() => {
    if (!searchValue.trim()) {
      setDisplayResults([]);
      return;
    }

    // Show basic contextual results immediately
    if (basicResults.length > 0) {
      const basicWithSource = basicResults.map(item => ({
        ...item,
        source: 'basic',
        relevanceScore: item.score || 0
      }));
      setDisplayResults(basicWithSource);
    } else if (!isBasicLoading) {
      // If no basic results and not loading, show empty for now
      setDisplayResults([]);
    }
  }, [basicResults, searchValue, isBasicLoading]);

  // Merge with enhanced results when available (background enhancement)
  useEffect(() => {
    if (!searchValue.trim() || !isSemanticEnabled || enhancedResults.length === 0) {
      return;
    }

    // Enhance existing results with AI results
    setDisplayResults(current => {
      const enhanced: any[] = [];
      const seenPaths = new Set<string>();

      // Add enhanced results first (higher priority)
      enhancedResults.forEach((item: EnhancedSearchItem) => {
        enhanced.push({
          ...item,
          source: 'enhanced',
          relevanceScore: (item.relevanceScore || 0) + 20 // Boost AI results
        });
        seenPaths.add(item.path);
      });

      // Add basic results that don't conflict
      current.forEach(item => {
        if (item.source === 'basic' && !seenPaths.has(item.path)) {
          enhanced.push(item);
        }
      });

      // Sort by relevance and limit
      return enhanced
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 8);
    });
  }, [enhancedResults, isSemanticEnabled, searchValue]);

  // Contextual suggestions - prioritize basic contextual suggestions
  const combinedSuggestions = React.useMemo(() => {
    if (basicSuggestions.length > 0) {
      return basicSuggestions.slice(0, 4);
    }
    return enhancedSuggestions.slice(0, 3);
  }, [basicSuggestions, enhancedSuggestions]);

  // Show loading only when basic search is loading and we have no results
  const isLoading = isBasicLoading && displayResults.length === 0;

  // Handle input click - ensure expansion and show dropdown
  const handleInputClick = () => {
    console.log("Input clicked - expanding");
    setIsSearchFocused(true);
    setShowDropdown(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    console.log("Input focused");
    setIsSearchFocused(true);
    setShowDropdown(true);
  };

  // Handle input blur
  const handleInputBlur = (e: React.FocusEvent) => {
    // Don't hide dropdown if clicking within it
    if (dropdownRef.current && dropdownRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    console.log("Input blur");
    setTimeout(() => {
      setIsSearchFocused(false);
      setShowDropdown(false);
    }, 150);
  };

  // Handle result click
  const handleCombinedResultClick = (item: any) => {
    console.log("Result clicked:", item.title, "Source:", item.source);
    saveToHistory(searchValue);
    setSearchValue("");
    setIsSearchFocused(false);
    setShowDropdown(false);
    setDisplayResults([]);
    setEnhancedResults([]);
    
    if (item.path) {
      navigate(item.path);
    }
  };

  // Handle history click
  const handleHistoryClick = (historyItem: string) => {
    console.log("History clicked:", historyItem);
    setSearchValue(historyItem);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    console.log("Suggestion clicked:", suggestion);
    setSearchValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    console.log("Clearing search");
    setSearchValue("");
    setDisplayResults([]);
    setEnhancedResults([]);
    setShowDropdown(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchValue.trim()) {
        saveToHistory(searchValue);
        onSearch(searchValue);
      }
      setShowDropdown(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
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
    displayResults.length > 0 || 
    isLoading || 
    combinedSuggestions.length > 0 ||
    (!searchValue.trim() && history.length > 0)
  );

  // Dynamic width based on focus and mobile
  const getInputWidth = () => {
    if (isMobile) return "w-full";
    if (isSearchFocused || searchValue) return "w-[500px] lg:w-[600px]";
    return "w-[300px]";
  };

  return (
    <>
      <div className="relative flex justify-center">
        <SearchInputField
          searchValue={searchValue}
          currentLanguage={currentLanguage}
          inputRef={inputRef}
          onInputChange={setSearchValue}
          onInputClick={handleInputClick}
          onInputFocus={handleInputFocus}
          onInputBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          onClearSearch={handleClearSearch}
          getInputWidth={getInputWidth}
        />
      </div>

      <SearchDropdown
        showContent={showContent}
        isLoading={isLoading}
        searchValue={searchValue}
        enhancedResults={displayResults}
        suggestions={combinedSuggestions}
        history={history}
        currentLanguage={currentLanguage}
        onResultClick={handleCombinedResultClick}
        onHistoryClick={handleHistoryClick}
        onSuggestionClick={handleSuggestionClick}
        dropdownRef={dropdownRef}
        inputWidth={getInputWidth()}
      />
    </>
  );
};
