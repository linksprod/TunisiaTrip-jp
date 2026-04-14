
import { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";
import { TranslateText } from "@/components/translation/TranslateText";

interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearch: (value?: string) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { currentLanguage } = useTranslation();
  const navigate = useNavigate();
  
  // Basic search function (no AI, no API calls)
  const handleSearch = useCallback(async (value?: string) => {
    const query = value !== undefined ? value : searchValue;
    
    if (!query.trim()) {
      return;
    }
    
    // Navigate to blog page with search parameter for traditional search
    navigate(`/blog?search=${encodeURIComponent(query)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show success toast
    toast.success(
      <TranslateText 
        text="Search completed" 
        language={currentLanguage}
      />,
      { duration: 2000 }
    );
  }, [searchValue, currentLanguage, navigate]);

  // Clear search and results
  const clearSearch = useCallback(() => {
    setSearchValue("");
  }, []);

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        setSearchValue,
        isSearchFocused,
        setIsSearchFocused,
        handleSearch,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
