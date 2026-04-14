
import React from "react";
import { CityTitle } from "../CityTitle";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherStat } from "./WeatherStat";
import { truncateText } from "@/utils/responsiveUtils";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

type CurrentWeatherProps = {
  cityKey: string;
  region: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    feelsLike: number;
    description: string;
  };
};

export const CurrentWeather = ({ cityKey, region, current }: CurrentWeatherProps) => {
  const { currentLanguage } = useTranslation();
  const shouldTranslate = currentLanguage !== 'EN';
  
  // Japanese translations for weather descriptions
  const getJapaneseDescription = (condition: string): string => {
    if (currentLanguage !== "JP") return current.description;
    
    const descriptions: Record<string, string> = {
      "sunny": "一日中豊かな日差しと青空が広がります",
      "partly-cloudy": "部分的に曇り空で時折日差しが見え、穏やかな風が吹いています",
      "cloudy": "雲が多く、日光が限られています",
      "rainy": "一日を通して雨が降るでしょう、傘をお持ちください",
      "snowy": "雪が降る予報です、寒さに備えて暖かい服装をしてください"
    };
    
    return descriptions[condition] || current.description;
  };
  
  return (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <CityTitle 
          cityName={cityKey} 
          region={region}
          isActive={true}
        />
        
        <div className="text-6xl font-bold text-[#1F1F20] flex items-center">
          {current.temp}°
          <span className="text-base ml-1 text-gray-500">C</span>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <p className="text-[#347EFF] text-lg font-medium mb-2">
          {currentLanguage === "JP" ? "今日の天気" : "Today's Weather"}
        </p>
        <div className="flex flex-col items-center justify-center my-4">
          <WeatherIcon condition={current.condition} size={100} />
          <div className="h-16 mt-3 w-full overflow-hidden">
            <p className="text-base text-center text-gray-700 line-clamp-2">
              {currentLanguage === "JP" ? 
                getJapaneseDescription(current.condition) : 
                truncateText(current.description, 70)
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {currentLanguage === "JP" ? (
          <>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-xs mb-1">湿度</p>
              <p className="font-semibold">{`${current.humidity}%`}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-xs mb-1">風速</p>
              <p className="font-semibold">{`${current.wind} km/時`}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 text-xs mb-1">体感温度</p>
              <p className="font-semibold">{`${current.feelsLike}°`}</p>
            </div>
          </>
        ) : (
          <>
            <WeatherStat label="Humidity" value={`${current.humidity}%`} />
            <WeatherStat label="Wind" value={`${current.wind} km/h`} />
            <WeatherStat label="Feels Like" value={`${current.feelsLike}°`} />
          </>
        )}
      </div>
    </div>
  );
};
