
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface City {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  position: { lat: number; lng: number };
}

interface CityCardProps {
  city: City;
  isSelected: boolean;
  onClick: (city: City) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, isSelected, onClick }) => {
  const { currentLanguage } = useTranslation();
  
  return (
    <Card 
      className={`w-full h-full overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
        isSelected ? "ring-2 ring-blue-500 scale-[1.02]" : ""
      }`}
      onClick={() => onClick(city)}
    >
      <div className="relative w-full h-40 overflow-hidden">
        <img 
          src={city.image} 
          alt={city.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="text-xl font-bold drop-shadow-md">
            <TranslateText text={city.name} language={currentLanguage} />
          </h3>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <MapPin size={14} />
            <span><TranslateText text={city.region} language={currentLanguage} /></span>
          </div>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-sm text-gray-600 line-clamp-3">
          <TranslateText text={city.description} language={currentLanguage} />
        </p>
      </CardContent>
    </Card>
  );
};
