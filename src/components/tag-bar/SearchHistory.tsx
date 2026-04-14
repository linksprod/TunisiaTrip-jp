
import React from "react";
import { Clock } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";

interface SearchHistoryProps {
  history: string[];
  onHistoryClick: (item: string) => void;
  currentLanguage: string;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onHistoryClick,
  currentLanguage
}) => {
  if (history.length === 0) return null;

  return (
    <div className="py-2 border-b border-gray-100">
      <div className="px-3 py-1.5 text-xs text-gray-500 bg-gray-50 font-medium flex items-center gap-2">
        <Clock className="w-3 h-3" />
        <TranslateText text="Recent Searches" language={currentLanguage} />
      </div>
      {history.slice(0, 3).map((item, index) => (
        <button
          key={index}
          className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center gap-2 text-sm cursor-pointer"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onHistoryClick(item)}
        >
          <Clock className="w-3 h-3 text-gray-400" />
          <span>{item}</span>
        </button>
      ))}
    </div>
  );
};
