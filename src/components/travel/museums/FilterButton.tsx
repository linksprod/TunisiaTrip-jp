
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface FilterButtonProps {
  isActive: boolean;
  name: string;
  onClick: () => void;
  count?: number;
}

export const FilterButton = ({ isActive, name, onClick, count }: FilterButtonProps) => {
  const { currentLanguage } = useTranslation();
  
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        isActive
          ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
          : "border-blue-500 bg-white text-blue-500 hover:bg-blue-50"
      )}
    >
      <TranslateText text={name} language={currentLanguage} />
      {count !== undefined && ` (${count})`}
    </Button>
  );
};
