
import React, { useState, useEffect } from "react";
import { categories } from "@/data/blogData";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "../translation/TranslateText";
import { useSearch } from "@/hooks/use-search";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  LandPlot, 
  Hotel,
  Utensils,
  Calendar,
  Globe2,
  History,
  HelpCircle,
  Search
} from "lucide-react";

interface BlogHeroProps {
  onCategorySelect: (category: string | null) => void;
  selectedCategory: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Function to get proper icon color based on background color
const getIconColorFromBg = (bgColor: string): string => {
  const colorMap: Record<string, string> = {
    'bg-blue-50': 'text-blue-600',
    'bg-purple-50': 'text-purple-600',
    'bg-yellow-50': 'text-yellow-600',
    'bg-red-50': 'text-red-600',
    'bg-indigo-50': 'text-indigo-600',
    'bg-emerald-50': 'text-emerald-600',
    'bg-amber-50': 'text-amber-600',
    'bg-teal-50': 'text-teal-600',
    'bg-green-50': 'text-green-600',
  };

  return colorMap[bgColor] || 'text-gray-600';
};

// Function to get the proper icon based on icon type
const getCategoryIcon = (iconType: string, className: string) => {
  switch (iconType) {
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'LandPlot':
      return <LandPlot className={className} />;
    case 'Hotel':
      return <Hotel className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Globe2':
      return <Globe2 className={className} />;
    case 'History':
      return <History className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    default:
      return <BookOpen className={className} />; // Default fallback
  }
};

export function BlogHero({ onCategorySelect, selectedCategory, searchQuery, onSearchChange }: BlogHeroProps) {
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayedCategories = categories;
  const searchPlaceholder = currentLanguage === 'JP' ? '記事を検索...' : 'Search articles...';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
            <div className="flex-grow">
              <button 
                onClick={() => onCategorySelect(null)}
                className="text-[#347EFF] text-base md:text-lg mb-2 hover:underline cursor-pointer transition-all"
              >
                {selectedCategory === null 
                  ? <TranslateText text="Search by Genre" language={currentLanguage} />
                  : <span>{currentLanguage === 'JP' ? '全てのブログ' : 'All blog'}</span>
                }
              </button>
              <h2 className="text-xl md:text-3xl font-bold text-[#303030] mb-0">
                <TranslateText text="Select a Category you would like to explore" language={currentLanguage} />
              </h2>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {displayedCategories.map((category, index) => (
              <button
                key={category.slug}
                onClick={() => onCategorySelect(category.slug === selectedCategory ? null : category.slug)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  selectedCategory === category.slug ? 'bg-gray-100 scale-105' : 'hover:bg-gray-50'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <div className={`p-3 rounded-full ${category.color} mb-2 transition-transform duration-300 ease-in-out`}>
                  {getCategoryIcon(category.iconType, `w-5 h-5 md:w-6 md:h-6 ${getIconColorFromBg(category.color)}`)}
                </div>
                <span className="text-sm font-medium text-center text-gray-800">
                  <TranslateText text={category.name} language={currentLanguage} />
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  <TranslateText text="Article Genre" language={currentLanguage} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
