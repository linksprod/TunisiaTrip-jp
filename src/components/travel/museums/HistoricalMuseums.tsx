
import React, { useState, useEffect } from 'react';
import { AlertCircle } from "lucide-react";
import { MUSEUMS, MUSEUM_CATEGORIES } from "./constants";
import { FilterButton } from "./FilterButton";
import { MuseumSlider } from "./MuseumSlider";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const HistoricalMuseums = () => {
  const [selectedCategory, setSelectedCategory] = useState(MUSEUM_CATEGORIES[0].id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredMuseums, setFilteredMuseums] = useState(MUSEUMS);
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    setFilteredMuseums(
      MUSEUMS.filter(museum => museum.category.includes(selectedCategory))
    );
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(filteredMuseums.length - 1, prev + 1));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          <TranslateText text="Discover our Historical Museums" language={currentLanguage} />
        </h2>
        <p className="text-gray-600 text-lg mb-6">
          <TranslateText 
            text="Explore Tunisia's rich cultural heritage through our diverse collection of museums."
            language={currentLanguage} 
          />
        </p>
      </div>

      {/* Notice Banner */}
      <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
        <p className="text-gray-700">
          <TranslateText 
            text="Most Tunisian museums are closed on Mondays. Business hours vary depending on the season, so we recommend that you check before visiting."
            language={currentLanguage} 
          />
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {MUSEUM_CATEGORIES.map(category => (
          <FilterButton
            key={category.id}
            isActive={selectedCategory === category.id}
            name={category.name}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </div>

      {/* Museum Slider */}
      {filteredMuseums.length > 0 ? (
        <MuseumSlider
          museums={filteredMuseums}
          currentIndex={currentIndex}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      ) : (
        <p className="text-center text-gray-500 py-8">
          <TranslateText text="No museums found for the selected category." language={currentLanguage} />
        </p>
      )}
    </div>
  );
};
