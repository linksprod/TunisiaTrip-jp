
import React, { useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useDynamicPlaceholder } from "@/hooks/use-dynamic-placeholder";

interface MobileSearchInputProps {
  searchValue: string;
  currentLanguage: string;
  isLoading?: boolean;
  onInputChange: (value: string) => void;
  onInputClick: () => void;
  onInputFocus: () => void;
  onInputBlur: (e: React.FocusEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClearSearch: () => void;
}

export const MobileSearchInput: React.FC<MobileSearchInputProps> = ({
  searchValue,
  currentLanguage,
  isLoading = false,
  onInputChange,
  onInputClick,
  onInputFocus,
  onInputBlur,
  onKeyDown,
  onClearSearch,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dynamicPlaceholder = useDynamicPlaceholder(currentLanguage);

  return (
    <div className="relative w-full max-w-full">
      <div className="relative flex items-center w-full">
        {/* Search Icon - Responsive sizing with clamp */}
        <Search 
          className="absolute left-2 text-gray-400 z-10 pointer-events-none flex-shrink-0" 
          style={{ 
            width: 'clamp(16px, 4vw, 20px)', 
            height: 'clamp(16px, 4vw, 20px)' 
          }}
        />
        
        {/* Input Field - Fluid responsive design */}
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
          className="w-full border border-gray-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 touch-manipulation"
          style={{
            height: 'clamp(40px, 10vw, 44px)',
            paddingLeft: 'clamp(32px, 8vw, 36px)',
            paddingRight: 'clamp(32px, 8vw, 36px)',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            minHeight: '40px',
            maxHeight: '44px'
          }}
          autoComplete="off"
          spellCheck="false"
          inputMode="search"
        />

        {/* Loading Spinner or Clear Button - Responsive */}
        <div 
          className="absolute right-2 flex items-center justify-center z-10"
          style={{
            right: 'clamp(8px, 2vw, 12px)'
          }}
        >
          {isLoading ? (
            <Loader2 
              className="animate-spin text-blue-500" 
              style={{ 
                width: 'clamp(16px, 4vw, 20px)', 
                height: 'clamp(16px, 4vw, 20px)' 
              }}
            />
          ) : searchValue && (
            <button
              onClick={onClearSearch}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors duration-200 touch-manipulation flex items-center justify-center"
              style={{
                minHeight: 'clamp(32px, 8vw, 36px)',
                minWidth: 'clamp(32px, 8vw, 36px)',
                padding: 'clamp(4px, 1vw, 6px)'
              }}
              type="button"
              aria-label="Clear search"
            >
              <X 
                style={{ 
                  width: 'clamp(16px, 4vw, 20px)', 
                  height: 'clamp(16px, 4vw, 20px)' 
                }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
