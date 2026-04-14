
import React from "react";
import { UnifiedSearchComponent } from "./UnifiedSearchComponent";
import { useTranslation } from "@/hooks/use-translation";

interface DesktopSearchProps {
  onExpandChange?: (expanded: boolean) => void;
}

export const DesktopSearch: React.FC<DesktopSearchProps> = ({ onExpandChange }) => {
  const { currentLanguage } = useTranslation();

  return (
    <UnifiedSearchComponent
      isMobile={false}
      currentLanguage={currentLanguage}
      onExpandChange={onExpandChange}
    />
  );
};
