
import React from "react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { currentLanguage } = useTranslation();
  
  const categories = [
    { id: "activities", label: "Activities" },
    { id: "hotels", label: "Hotels" },
    { id: "guesthouses", label: "Guesthouses" }
  ];
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => onCategoryChange(category.id)}
            className="px-4 py-2"
          >
            <TranslateText text={category.label} language={currentLanguage} />
          </Button>
        ))}
      </div>
    </div>
  );
}
