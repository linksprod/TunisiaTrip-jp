
import React from "react";
import { TranslateText } from "@/components/translation/TranslateText";
import { Lightbulb, MapPin, Camera, Building, Utensils, Compass, Info, Plane } from "lucide-react";

interface SearchSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  currentLanguage: string;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  currentLanguage
}) => {
  if (suggestions.length === 0) return null;

  // Get appropriate icon for suggestion with better categorization
  const getSuggestionIcon = (suggestion: string) => {
    const lower = suggestion.toLowerCase();
    
    // Location and city-based suggestions
    if (lower.includes('attractions') || lower.includes('visit') || lower.includes('explore')) return MapPin;
    
    // Accommodation
    if (lower.includes('hotel') || lower.includes('accommodation') || lower.includes('guest house') || lower.includes('stay')) return Building;
    
    // Food and dining
    if (lower.includes('food') || lower.includes('restaurant') || lower.includes('cuisine') || lower.includes('dish')) return Utensils;
    
    // Entertainment and activities
    if (lower.includes('star wars') || lower.includes('filming') || lower.includes('movie')) return Camera;
    
    // Travel and transportation
    if (lower.includes('travel') || lower.includes('transport') || lower.includes('getting around') || lower.includes('tour')) return Plane;
    
    // General information
    if (lower.includes('about') || lower.includes('information') || lower.includes('culture') || lower.includes('weather')) return Info;
    
    // Default for activities and general suggestions
    return Compass;
  };

  return (
    <div className="border-b border-gray-100">
      <div className="px-4 py-3 text-xs text-gray-500 bg-blue-50/50 font-medium flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5" />
        <TranslateText
          text="Smart Suggestions"
          language={currentLanguage}
        />
      </div>
      
      <div className="py-1">
        {suggestions.map((suggestion, index) => {
          const IconComponent = getSuggestionIcon(suggestion);
          return (
            <button
              key={`suggestion-${index}`}
              className="w-full text-left px-4 py-3 hover:bg-blue-50/50 flex items-center gap-3 cursor-pointer transition-colors duration-150 text-sm group"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <IconComponent className="w-4 h-4 text-blue-500 flex-shrink-0 group-hover:text-blue-600 transition-colors" />
              <span className="text-gray-700 truncate group-hover:text-gray-900 transition-colors font-medium">
                {suggestion}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
