
import { useState, useEffect } from "react";
import { fetchWeatherForLocation, tunisianCities } from "@/utils/weatherService";

export function useWeatherData() {
  const [activeLocation, setActiveLocation] = useState("tunis");
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fallback weather data in case API fails
  const fallbackWeatherData = {
    tunis: {
      current: {
        temp: 28,
        condition: "sunny",
        humidity: 65,
        wind: 12,
        feelsLike: 30,
        description: "Clear skies with abundant sunshine throughout the day"
      },
      forecast: [
        { day: "MON", temp: 28, condition: "sunny" },
        { day: "TUE", temp: 27, condition: "partly-cloudy" },
        { day: "WED", temp: 26, condition: "cloudy" },
        { day: "THU", temp: 25, condition: "rainy" },
        { day: "FRI", temp: 27, condition: "sunny" },
      ]
    },
    bizerte: {
      current: {
        temp: 26,
        condition: "partly-cloudy",
        humidity: 70,
        wind: 16,
        feelsLike: 27,
        description: "Partly cloudy with occasional sun breaks and mild sea breeze"
      },
      forecast: [
        { day: "MON", temp: 26, condition: "partly-cloudy" },
        { day: "TUE", temp: 25, condition: "partly-cloudy" },
        { day: "WED", temp: 24, condition: "rainy" },
        { day: "THU", temp: 26, condition: "partly-cloudy" },
        { day: "FRI", temp: 27, condition: "sunny" },
      ]
    },
    kairouan: {
      current: {
        temp: 32,
        condition: "sunny",
        humidity: 50,
        wind: 10,
        feelsLike: 33,
        description: "Hot and dry with intense sunshine and clear blue skies"
      },
      forecast: [
        { day: "MON", temp: 32, condition: "sunny" },
        { day: "TUE", temp: 31, condition: "sunny" },
        { day: "WED", temp: 30, condition: "sunny" },
        { day: "THU", temp: 29, condition: "partly-cloudy" },
        { day: "FRI", temp: 30, condition: "sunny" },
      ]
    },
    tozeur: {
      current: {
        temp: 36,
        condition: "sunny",
        humidity: 35,
        wind: 8,
        feelsLike: 38,
        description: "Extremely hot desert conditions with intense sun and dry air"
      },
      forecast: [
        { day: "MON", temp: 36, condition: "sunny" },
        { day: "TUE", temp: 37, condition: "sunny" },
        { day: "WED", temp: 38, condition: "sunny" },
        { day: "THU", temp: 35, condition: "sunny" },
        { day: "FRI", temp: 34, condition: "partly-cloudy" },
      ]
    },
    sousse: {
      current: {
        temp: 29,
        condition: "partly-cloudy",
        humidity: 62,
        wind: 14,
        feelsLike: 31,
        description: "Pleasant coastal weather with scattered clouds and refreshing sea breezes"
      },
      forecast: [
        { day: "MON", temp: 29, condition: "partly-cloudy" },
        { day: "TUE", temp: 28, condition: "sunny" },
        { day: "WED", temp: 27, condition: "sunny" },
        { day: "THU", temp: 26, condition: "partly-cloudy" },
        { day: "FRI", temp: 28, condition: "partly-cloudy" },
      ]
    },
    djerba: {
      current: {
        temp: 30,
        condition: "sunny",
        humidity: 68,
        wind: 15,
        feelsLike: 32,
        description: "Beautiful island weather with gentle sea breezes and clear blue skies"
      },
      forecast: [
        { day: "MON", temp: 30, condition: "sunny" },
        { day: "TUE", temp: 29, condition: "sunny" },
        { day: "WED", temp: 30, condition: "partly-cloudy" },
        { day: "THU", temp: 28, condition: "cloudy" },
        { day: "FRI", temp: 29, condition: "partly-cloudy" },
      ]
    }
  };

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      setIsLoading(true);
      const data: Record<string, any> = {};
      
      try {
        await Promise.all(
          Object.entries(tunisianCities).map(async ([key, location]) => {
            const cityData = await fetchWeatherForLocation(location);
            if (cityData) {
              data[key] = cityData;
            } else {
              // Use fallback data if API fails
              data[key] = fallbackWeatherData[key as keyof typeof fallbackWeatherData];
            }
          })
        );
        
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        // Use fallback data if anything fails
        setWeatherData(fallbackWeatherData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllWeatherData();
  }, []);

  return {
    weatherData,
    isLoading,
    activeLocation,
    setActiveLocation,
    getRegionName: (cityName: string): string => {
      return tunisianCities[cityName]?.region || "";
    }
  };
}
