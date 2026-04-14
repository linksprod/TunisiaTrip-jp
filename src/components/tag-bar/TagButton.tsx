
import React from "react";
import { Link } from "react-router-dom";
import { TranslateText } from "../translation/TranslateText";

interface TagButtonProps {
  name: string;
  isActive: boolean;
  onClick: () => void;
  path: string;
  currentLanguage: string;
  "data-testid"?: string;
}

export function TagButton({ 
  name, 
  isActive, 
  onClick, 
  path, 
  currentLanguage,
  "data-testid": dataTestId 
}: TagButtonProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        px-2 xs:px-3 sm:px-4 
        py-1.5 xs:py-2
        text-xs xs:text-sm sm:text-sm
        font-medium 
        rounded-full 
        whitespace-nowrap 
        transition-all 
        duration-200 
        ease-in-out
        min-w-fit
        flex-shrink-0
        ${
          isActive
            ? "bg-[#347EFF] text-white shadow-md hover:bg-[#2968E6] active:scale-95"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
        }
      `}
      data-testid={dataTestId}
    >
      <TranslateText text={name} language={currentLanguage} />
    </Link>
  );
}
