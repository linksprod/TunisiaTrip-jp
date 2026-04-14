
import React from "react";
import { useTranslation } from "@/hooks/use-translation";

type WeatherStatProps = {
  label: string;
  value: string;
};

export const WeatherStat = ({ label, value }: WeatherStatProps) => {
  const { currentLanguage } = useTranslation();
  
  // Translate label to Japanese if needed
  const getTranslatedLabel = () => {
    if (currentLanguage !== "JP") return label;
    
    const translations: Record<string, string> = {
      "Humidity": "湿度",
      "Wind": "風速",
      "Feels Like": "体感温度"
    };
    
    return translations[label] || label;
  };
  
  // Translate value to Japanese format if needed
  const getTranslatedValue = () => {
    if (currentLanguage !== "JP" || !value.includes("km/h")) return value;
    return value.replace("km/h", "km/時");
  };
  
  return (
    <div className="flex flex-col items-center">
      <p className="text-gray-500 text-xs mb-1">{getTranslatedLabel()}</p>
      <p className="font-semibold">{getTranslatedValue()}</p>
    </div>
  );
};
