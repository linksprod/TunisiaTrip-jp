
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useWeatherData } from "@/hooks/use-weather-data";
import { LocationTab } from "./weather/LocationTab";
import { MobileWeatherCard } from "./weather/MobileWeatherCard";
import { CurrentWeather } from "./weather/CurrentWeather";
import { CityForecast } from "./weather/CityForecast";
import { LoadingWeatherCard } from "./weather/LoadingWeatherCard";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function WeatherSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { weatherData, isLoading, activeLocation, setActiveLocation, getRegionName } = useWeatherData();
  const { currentLanguage } = useTranslation();

  const renderMobileWeatherCity = (locationKey: string) => {
    const cityData = weatherData[locationKey as keyof typeof weatherData];
    return (
      <MobileWeatherCard 
        locationKey={locationKey} 
        region={getRegionName(locationKey)} 
        cityData={cityData} 
      />
    );
  };

  const renderWeatherDisplay = () => {
    if (isLoading) {
      return <LoadingWeatherCard />;
    }

    if (isMobile) {
      return (
        <Carousel 
          className="w-full" 
          opts={{ 
            align: "start",
            loop: true
          }}
          setActiveIndex={(index) => {
            const cities = Object.keys(weatherData);
            if (cities[index]) {
              setActiveLocation(cities[index]);
            }
          }}
        >
          <CarouselContent>
            {Object.keys(weatherData).map((locationKey) => (
              <CarouselItem key={locationKey} className="h-full">
                {renderMobileWeatherCity(locationKey)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-7 w-7 -left-1 bg-white/80 border border-gray-200" />
          <CarouselNext className="h-7 w-7 -right-1 bg-white/80 border border-gray-200" />
        </Carousel>
      );
    }
    
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-[16px] p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <CurrentWeather 
            cityKey={activeLocation}
            region={getRegionName(activeLocation)}
            current={weatherData[activeLocation]?.current}
          />
          
          <CityForecast 
            forecast={weatherData[activeLocation]?.forecast} 
          />
        </div>
      </div>
    );
  };

  const getTranslatedRegionName = (region: string) => {
    if (currentLanguage !== 'JP') return region;
    
    const translations: Record<string, string> = {
      "Capital": "首都圏",
      "North": "北部",
      "Center": "中央",
      "South": "南部",
      "East Coast": "東海岸",
      "Island": "島"
    };
    
    return translations[region] || region;
  };

  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[15px] md:p-[28px] lg:p-[36px]">
        <div className="flex flex-col mb-3 md:mb-6">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            {currentLanguage === 'JP' ? '天気' : 'Weather'}
          </div>
          <div className="text-[#1F1F20] text-[20px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            {currentLanguage === 'JP' ? 'チュニジアの天気情報' : 'Tunisia Live Weather'}
          </div>
        </div>
        
        <div className="flex flex-col gap-4 md:gap-5 mt-2 md:mt-4">
          <div>
            <p className="text-[#1F1F20] font-inter text-[15px] md:text-[18px] leading-[26px] md:leading-[30px]">
              {currentLanguage === 'JP' ? 
                'チュニジアは暑く乾燥した夏と穏やかな雨の多い冬を特徴とする地中海性気候を持っています。沿岸地域は海風の恩恵を受け、南部地域は砂漠のような環境です。訪問に最適な時期は、国全体で気温が快適な春（4月〜6月）と秋（9月〜10月）です。' : 
                'Tunisia enjoys a Mediterranean climate with hot, dry summers and mild, rainy winters. Coastal areas benefit from sea breezes, while southern regions experience desert-like conditions. The best time to visit is during spring (April-June) and autumn (September-October) when temperatures are pleasant across the country.'}
            </p>
          </div>
          
          <div className="flex-1">
            {isMobile ? (
              <div className="mb-4 relative px-1">
                <div className="text-center text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
                  <ChevronLeft size={14} className="animate-pulse" />
                  <span>
                    {currentLanguage === 'JP' ? '他の都市を見るにはスワイプしてください' : 'Swipe to see other cities'}
                  </span>
                  <ChevronRight size={14} className="animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-5 justify-center">
                <LocationTab 
                  name="Tunis" 
                  region={currentLanguage === 'JP' ? "首都圏" : "Capital"} 
                  isActive={activeLocation === "tunis"} 
                  onClick={() => setActiveLocation("tunis")} 
                />
                
                <LocationTab 
                  name="Bizerte" 
                  region={currentLanguage === 'JP' ? "北部" : "North"} 
                  isActive={activeLocation === "bizerte"} 
                  onClick={() => setActiveLocation("bizerte")} 
                />
                
                <LocationTab 
                  name="Kairouan" 
                  region={currentLanguage === 'JP' ? "中央" : "Center"} 
                  isActive={activeLocation === "kairouan"} 
                  onClick={() => setActiveLocation("kairouan")} 
                />

                <LocationTab 
                  name="Tozeur" 
                  region={currentLanguage === 'JP' ? "南部" : "South"} 
                  isActive={activeLocation === "tozeur"} 
                  onClick={() => setActiveLocation("tozeur")} 
                />
                
                <LocationTab 
                  name="Sousse" 
                  region={currentLanguage === 'JP' ? "東海岸" : "East Coast"} 
                  isActive={activeLocation === "sousse"} 
                  onClick={() => setActiveLocation("sousse")} 
                />
                
                <LocationTab 
                  name="Djerba" 
                  region={currentLanguage === 'JP' ? "島" : "Island"} 
                  isActive={activeLocation === "djerba"} 
                  onClick={() => setActiveLocation("djerba")} 
                />
              </div>
            )}
            
            {renderWeatherDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherSection;
