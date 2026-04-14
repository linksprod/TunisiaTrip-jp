
import React from "react";
import { CityTitle } from "../CityTitle";
import { WeatherIcon } from "./WeatherIcon";
import { WeatherStat } from "./WeatherStat";
import { truncateText } from "@/utils/responsiveUtils";
import { useTranslation } from "@/hooks/use-translation";

type MobileWeatherCardProps = {
  locationKey: string;
  region: string;
  cityData: {
    current: {
      temp: number;
      condition: string;
      humidity: number;
      wind: number;
      feelsLike: number;
      description: string;
    };
    forecast: Array<{
      day: string;
      temp: number;
      condition: string;
    }>;
  };
};

export const MobileWeatherCard = ({ locationKey, region, cityData }: MobileWeatherCardProps) => {
  const { currentLanguage } = useTranslation();

  // Japanese translations for weather descriptions
  const getJapaneseDescription = (condition: string): string => {
    if (currentLanguage !== "JP") return cityData.current.description;
    
    const descriptions: Record<string, string> = {
      "sunny": "一日中豊かな日差しと青空が広がります",
      "partly-cloudy": "部分的に曇り空で時折日差しが見え、穏やかな風が吹いています",
      "cloudy": "雲が多く、日光が限られています",
      "rainy": "一日を通して雨が降るでしょう、傘をお持ちください",
      "snowy": "雪が降る予報です、寒さに備えて暖かい服装をしてください"
    };
    
    return descriptions[condition] || cityData.current.description;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-4 shadow-md h-full">
      <div className="bg-white rounded-2xl p-4 shadow-md h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <CityTitle 
              cityName={locationKey} 
              region={region} 
              isActive={true}
            />
          </div>
          <div className="text-4xl font-bold text-[#1F1F20] flex items-center">
            {cityData.current.temp}°
            <span className="text-sm ml-1 text-gray-500">C</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <p className="text-[#347EFF] text-base font-medium mb-2">
            {currentLanguage === "JP" ? "今日の天気" : "Today's Weather"}
          </p>
          <div className="flex flex-col items-center justify-center my-2">
            <WeatherIcon condition={cityData.current.condition} size={50} />
            <div className="h-12 mt-2 w-full">
              <p className="text-sm text-center text-gray-700 line-clamp-2">
                {currentLanguage === "JP" ? 
                  getJapaneseDescription(cityData.current.condition) : 
                  truncateText(cityData.current.description, 70)
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-2">
          {currentLanguage === "JP" ? (
            <>
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xs mb-1">湿度</p>
                <p className="text-xs font-semibold">{`${cityData.current.humidity}%`}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xs mb-1">風速</p>
                <p className="text-xs font-semibold">{`${cityData.current.wind} km/時`}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-xs mb-1">体感温度</p>
                <p className="text-xs font-semibold">{`${cityData.current.feelsLike}°`}</p>
              </div>
            </>
          ) : (
            <>
              <WeatherStat 
                label="Humidity" 
                value={`${cityData.current.humidity}%`} 
              />
              <WeatherStat 
                label="Wind" 
                value={`${cityData.current.wind} km/h`} 
              />
              <WeatherStat 
                label="Feels Like" 
                value={`${cityData.current.feelsLike}°`} 
              />
            </>
          )}
        </div>

        <div className="mt-3 border-t pt-3 flex-grow">
          <h4 className="text-sm font-bold mb-2">
            {currentLanguage === "JP" ? "5日間の天気予報" : "5-Day Forecast"}
          </h4>
          <div className="flex justify-between">
            {cityData.forecast.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-xs font-medium">{day.day}</span>
                <div className="my-1"><WeatherIcon condition={day.condition} size={18} /></div>
                <span className="text-xs font-bold">{day.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
