
import React, { useRef, useEffect } from 'react';
import { City } from '../types/city';
import { TranslateText } from '../../translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';

interface CityTagsProps {
  cities: City[];
  selectedCity: City | null;
  onCityClick: (city: City) => void;
  onCityDoubleClick: (city: City) => void;
  scrollIntoViewRef?: React.RefObject<HTMLDivElement>;
}

export const CityTags: React.FC<CityTagsProps> = ({
  cities,
  selectedCity,
  onCityClick,
  onCityDoubleClick,
  scrollIntoViewRef
}) => {
  const { currentLanguage } = useTranslation();
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Effect to scroll the selected city tag into view when it changes
  useEffect(() => {
    if (selectedCity) {
      const tagElement = tagRefs.current.get(selectedCity.id);
      if (tagElement) {
        // Smooth scroll the tag into view with a small delay to ensure animation is visible
        setTimeout(() => {
          tagElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }, 100);
      }
    }
  }, [selectedCity]);

  return (
    <div 
      ref={tagsContainerRef}
      className="flex overflow-x-auto pb-3 mb-6 gap-2 hide-scrollbar"
      style={{ scrollbarWidth: 'none' }}
    >
      {cities.map((city) => (
        <button
          key={city.id}
          data-city-id={city.id}
          ref={(el) => {
            if (el) tagRefs.current.set(city.id, el);
          }}
          onClick={() => onCityClick(city)}
          onDoubleClick={() => onCityDoubleClick(city)}
          className={`inline-flex px-5 py-2 items-center rounded-full border flex-shrink-0 transition-all duration-300 ease-in-out transform ${
            selectedCity?.id === city.id
              ? "bg-[#AEC3F2] text-[#1653BE] font-bold scale-105"
              : "border-[#347EFF] bg-white text-[#347EFF] hover:bg-[#EEF2FD] font-semibold"
          }`}
        >
          <span className="text-xl whitespace-nowrap">
            <TranslateText text={city.name} language={currentLanguage} />
          </span>
        </button>
      ))}
    </div>
  );
};
