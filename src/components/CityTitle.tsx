
import React from "react";
import { MapPin } from "lucide-react";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface CityTitleProps {
  cityName: string;
  region: string;
  isActive?: boolean;
}

export const CityTitle: React.FC<CityTitleProps> = ({ 
  cityName, 
  region, 
  isActive = false 
}) => {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <MapPin 
        size={18} 
        className={`${isActive ? "text-blue-500" : "text-gray-500"}`} 
      />
      <div>
        <h3 className="text-lg font-semibold capitalize">
          <TranslateText text={cityName} language={currentLanguage} />
        </h3>
        <p className="text-sm text-gray-500">
          (<TranslateText text={region} language={currentLanguage} />)
        </p>
      </div>
    </div>
  );
};
