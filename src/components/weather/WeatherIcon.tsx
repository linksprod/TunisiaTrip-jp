
import React from "react";
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

type WeatherIconProps = {
  condition: string;
  size?: number;
  showLabel?: boolean;
};

export const WeatherIcon = ({ condition, size = 24, showLabel = false }: WeatherIconProps) => {
  const { currentLanguage } = useTranslation();
  
  const getWeatherLabel = () => {
    if (currentLanguage === "JP") {
      switch (condition) {
        case "sunny":
          return "晴れ";
        case "partly-cloudy":
          return "晴れ時々曇り";
        case "cloudy":
          return "曇り";
        case "rainy":
          return "雨";
        case "snowy":
          return "雪";
        default:
          return "晴れ";
      }
    } else {
      switch (condition) {
        case "sunny":
          return "Sunny";
        case "partly-cloudy":
          return "Partly Cloudy";
        case "cloudy":
          return "Cloudy";
        case "rainy":
          return "Rainy";
        case "snowy":
          return "Snowy";
        default:
          return "Sunny";
      }
    }
  };

  const getIcon = () => {
    switch (condition) {
      case "sunny":
        return <Sun size={size} className="text-yellow-500" />;
      case "partly-cloudy":
        return <CloudSun size={size} className="text-blue-400" />;
      case "cloudy":
        return <Cloud size={size} className="text-gray-400" />;
      case "rainy":
        return <CloudRain size={size} className="text-blue-500" />;
      case "snowy":
        return <CloudSnow size={size} className="text-blue-200" />;
      default:
        return <Sun size={size} className="text-yellow-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {getIcon()}
      {showLabel && (
        <span className="mt-1 text-xs">{getWeatherLabel()}</span>
      )}
    </div>
  );
};
