
import React, { useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDynamicPlaceholder } from "@/hooks/use-dynamic-placeholder";

interface ResponsiveSearchInputProps {
  searchValue: string;
  currentLanguage: string;
  isLoading?: boolean;
  isMobile?: boolean;
  isExpanded?: boolean;
  onInputChange: (value: string) => void;
  onInputClick: () => void;
  onInputFocus: () => void;
  onInputBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
  className?: string;
}

export const ResponsiveSearchInput: React.FC<ResponsiveSearchInputProps> = ({
  searchValue,
  currentLanguage,
  isLoading = false,
  isMobile = false,
  isExpanded = false,
  onInputChange,
  onInputClick,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onClearSearch,
  className
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dynamicPlaceholder = useDynamicPlaceholder(currentLanguage);

  // Auto-focus when expanded (desktop only)
  useEffect(() => {
    if (isExpanded && !isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, isMobile]);

  // Aggressive mobile width classes - use full available space
  const getWidthClasses = () => {
    if (isMobile) {
      return "w-full max-w-none min-w-0"; // Force full width, no max width constraints
    }
    
    if (isExpanded || searchValue) {
      return "w-72 sm:w-80 md:w-96 lg:w-[420px] xl:w-[480px] 2xl:w-[520px]";
    }
    
    return "w-56 sm:w-60 md:w-64 lg:w-72 xl:w-80";
  };

  // Mobile-optimized height classes
  const getHeightClasses = () => {
    if (isMobile) {
      return "h-12"; // Fixed height for consistency on mobile
    }
    return "h-9 sm:h-10 md:h-11";
  };

  // Simplified mobile padding
  const getPaddingClasses = () => {
    if (isMobile) {
      return "pl-10 pr-10"; // Fixed padding for mobile
    }
    return "pl-9 sm:pl-10 md:pl-11 pr-9 sm:pr-10 md:pr-11";
  };

  // Consistent icon sizing
  const getIconSize = () => {
    return "h-5 w-5"; // Fixed size for all breakpoints
  };

  // Simplified icon positioning
  const getIconPosition = () => {
    if (isMobile) {
      return "left-3"; // Fixed position for mobile
    }
    return "left-3 sm:left-3.5 md:left-4";
  };

  const getRightIconPosition = () => {
    if (isMobile) {
      return "right-3"; // Fixed position for mobile
    }
    return "right-3 sm:right-3.5 md:right-4";
  };

  return (
    <div 
      className={cn(
        "relative transition-all duration-300 ease-in-out",
        getWidthClasses(),
        className
      )}
    >
      <div className="relative flex items-center w-full">
        {/* Search Icon */}
        <Search 
          className={cn(
            "absolute text-gray-400 z-10 pointer-events-none transition-all duration-200",
            getIconSize(),
            getIconPosition()
          )} 
        />
        
        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => onInputChange(e.target.value)}
          onClick={onInputClick}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
          placeholder={dynamicPlaceholder}
          className={cn(
            "w-full border border-gray-200 rounded-full",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "text-base", // Fixed text size for mobile
            "bg-white transition-all duration-200",
            "placeholder:text-gray-400",
            "touch-manipulation", // Better mobile touch handling
            getHeightClasses(),
            getPaddingClasses(),
            // Mobile-specific overrides
            isMobile && "!w-full !max-w-none !min-w-0"
          )}
          autoComplete="off"
          spellCheck="false"
          inputMode="search" // Better mobile keyboard
        />

        {/* Loading Spinner or Clear Button */}
        <div className={cn(
          "absolute flex items-center justify-center z-10",
          getRightIconPosition()
        )}>
          {isLoading ? (
            <Loader2 className={cn(
              "animate-spin text-blue-500",
              getIconSize()
            )} />
          ) : searchValue && (
            <button
              onClick={onClearSearch}
              className={cn(
                "text-gray-400 hover:text-gray-600",
                "p-2 rounded-full hover:bg-gray-50", // Larger touch target
                "transition-colors duration-200",
                "touch-manipulation", // Better mobile touch
                "min-h-[44px] min-w-[44px] flex items-center justify-center", // Better touch target
                "z-10"
              )}
              type="button"
              aria-label="Clear search"
            >
              <X className={cn(
                getIconSize()
              )} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
