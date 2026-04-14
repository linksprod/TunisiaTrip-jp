
import React from "react";
import { Droplet, Wind, Thermometer } from "lucide-react";
import { WeatherIcon } from "./WeatherIcon";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

type ForecastDay = {
  day: string;
  temp: number;
  tempMin?: number;
  condition: string;
  precipProb?: number;
  windSpeed?: number;
};

type CityForecastProps = {
  forecast: ForecastDay[];
};

export const CityForecast = ({ forecast }: CityForecastProps) => {
  const { currentLanguage } = useTranslation();
  
  // Japanese translations for weather conditions
  const getConditionTranslation = (condition: string): string => {
    if (currentLanguage !== "JP") return condition.replace("-", " ");
    
    const translations: Record<string, string> = {
      "sunny": "晴れ",
      "partly-cloudy": "晴れ時々曇り",
      "cloudy": "曇り",
      "rainy": "雨",
      "snowy": "雪"
    };
    
    return translations[condition] || condition;
  };
  
  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-[#1F1F20] mb-4">
        {currentLanguage === "JP" ? "5日間の天気予報" : "5-Day Forecast"}
      </h3>
      <div className="flex flex-col gap-3">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 transition-colors">
            <div className="flex items-center gap-3 w-[20%]">
              <p className="font-medium text-base w-10">{day.day}</p>
              <WeatherIcon condition={day.condition} size={24} />
            </div>
            
            <div className="flex items-center justify-between w-[80%]">
              <span className="text-sm text-gray-600 capitalize w-1/4 truncate">
                {getConditionTranslation(day.condition)}
              </span>
              
              <div className="flex items-center justify-end gap-4 w-3/4">
                <div className="flex items-center gap-1">
                  <Droplet size={16} className="text-blue-500" />
                  <span className="text-sm whitespace-nowrap">
                    {day.precipProb || Math.round(65 - index * 5)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind size={16} className="text-blue-400" />
                  <span className="text-sm whitespace-nowrap">
                    {day.windSpeed || Math.round(12 - index)}
                    {currentLanguage === "JP" ? "km/時" : "km/h"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer size={16} className="text-red-400" />
                  <span className="font-bold text-lg whitespace-nowrap">{day.temp}°</span>
                  <span className="mx-1 text-xs text-gray-400">|</span>
                  <span className="font-semibold text-lg text-blue-600 whitespace-nowrap">
                    {day.tempMin || day.temp - 5}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
