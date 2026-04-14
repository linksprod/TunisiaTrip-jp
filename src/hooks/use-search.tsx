
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchContext } from "./use-search-context";

export const useSearch = () => {
  // For components that are not within the SearchProvider context
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback((value: string) => {
    if (value.trim()) {
      navigate(`/blog?search=${encodeURIComponent(value)}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [navigate]);

  // Try to use the context if available, otherwise fall back to local state
  try {
    const context = useSearchContext();
    return context;
  } catch (error) {
    // If context is not available, return the local state
    return {
      searchValue,
      setSearchValue,
      isSearchFocused,
      setIsSearchFocused,
      handleSearch,
      searchResults: [],
      handleResultClick: () => {},
      clearSearch: () => setSearchValue("")
    };
  }
};
