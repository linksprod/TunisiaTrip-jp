
import { fetchWeatherApi } from 'openmeteo';

// Weather condition mapping based on WMO codes
// https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
export function getWeatherCondition(weatherCode: number): string {
  // Clear
  if (weatherCode === 0 || weatherCode === 1) {
    return "sunny";
  }
  // Partly cloudy
  else if (weatherCode === 2 || weatherCode === 3) {
    return "partly-cloudy";
  }
  // Cloudy
  else if (weatherCode >= 4 && weatherCode <= 9) {
    return "cloudy";
  }
  // Rain
  else if (
    (weatherCode >= 50 && weatherCode <= 69) ||
    (weatherCode >= 80 && weatherCode <= 82)
  ) {
    return "rainy";
  }
  // Snow
  else if ((weatherCode >= 70 && weatherCode <= 79) || (weatherCode >= 85 && weatherCode <= 86)) {
    return "snowy";
  }
  // Default
  return "partly-cloudy";
}

export interface LocationCoordinates {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export const tunisianCities: Record<string, LocationCoordinates> = {
  tunis: {
    name: "Tunis",
    region: "Capital",
    latitude: 36.8065,
    longitude: 10.1815
  },
  bizerte: {
    name: "Bizerte",
    region: "North",
    latitude: 37.2746,
    longitude: 9.8714
  },
  kairouan: {
    name: "Kairouan",
    region: "Center",
    latitude: 35.6781,
    longitude: 10.0957
  },
  tozeur: {
    name: "Tozeur",
    region: "South",
    latitude: 33.9196,
    longitude: 8.1335
  },
  sousse: {
    name: "Sousse",
    region: "East Coast",
    latitude: 35.8245, 
    longitude: 10.6346
  },
  djerba: {
    name: "Djerba",
    region: "Island",
    latitude: 33.8075,
    longitude: 10.8451
  }
};

// Helper function to get day of week abbreviation
export function getDayAbbreviation(date: Date): string {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
}

// Function to fetch weather data for a specific location
export async function fetchWeatherForLocation(location: LocationCoordinates) {
  const params = {
    latitude: location.latitude,
    longitude: location.longitude,
    daily: ["temperature_2m_max", "temperature_2m_min", "weather_code", "wind_speed_10m_max", "precipitation_probability_max", "precipitation_sum"],
    hourly: ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "weather_code", "wind_speed_10m", "precipitation_probability"],
    timezone: "auto",
    forecast_days: 7
  };

  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    
    // Process daily data for forecast
    const daily = response.daily();
    const dailyTemp = daily?.variables(0)?.valuesArray();
    const dailyTempMin = daily?.variables(1)?.valuesArray();
    const dailyWeatherCode = daily?.variables(2)?.valuesArray();
    const dailyWindSpeed = daily?.variables(3)?.valuesArray();
    const dailyPrecipProb = daily?.variables(4)?.valuesArray();
    const dailyPrecipSum = daily?.variables(5)?.valuesArray();
    const dailyTime = daily?.time();
    
    // Process hourly data for current conditions
    const hourly = response.hourly();
    const hourlyTime = hourly?.time();
    const hourlyTemp = hourly?.variables(0)?.valuesArray();
    const hourlyHumidity = hourly?.variables(1)?.valuesArray();
    const hourlyFeelsLike = hourly?.variables(2)?.valuesArray();
    const hourlyWeatherCode = hourly?.variables(3)?.valuesArray();
    const hourlyWindSpeed = hourly?.variables(4)?.valuesArray();
    const hourlyPrecipProb = hourly?.variables(5)?.valuesArray();
    
    if (!dailyTemp || !dailyTempMin || !dailyWeatherCode || !dailyTime || 
        !hourlyTemp || !hourlyHumidity || !hourlyFeelsLike || !hourlyWeatherCode || 
        !hourlyWindSpeed || !hourlyPrecipProb || !hourlyTime) {
      throw new Error("Missing data in API response");
    }
    
    // Current conditions (first hourly entry)
    const currentIndex = 0;
    const currentTemp = Math.round(hourlyTemp[currentIndex]);
    const currentHumidity = Math.round(hourlyHumidity[currentIndex]);
    const currentFeelsLike = Math.round(hourlyFeelsLike[currentIndex]);
    const currentWindSpeed = Math.round(hourlyWindSpeed[currentIndex]);
    const currentWeatherCode = hourlyWeatherCode[currentIndex];
    const currentCondition = getWeatherCondition(currentWeatherCode);
    
    // Weather description based on condition
    const weatherDescriptions = {
      "sunny": "Clear skies with abundant sunshine throughout the day",
      "partly-cloudy": "Partly cloudy with occasional sun breaks and mild breeze",
      "cloudy": "Mostly cloudy conditions with limited sunlight",
      "rainy": "Periods of rain throughout the day, keep an umbrella handy",
      "snowy": "Snow showers expected, bundle up for cold temperatures"
    };
    
    // Forecast for next 5 days
    const forecast = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date((Number(dailyTime[i]) + response.utcOffsetSeconds()) * 1000);
      forecast.push({
        day: getDayAbbreviation(date),
        temp: Math.round(dailyTemp[i]),
        condition: getWeatherCondition(dailyWeatherCode[i]),
        tempMin: Math.round(dailyTempMin[i]),
        windSpeed: Math.round(dailyWindSpeed[i] || 0),
        precipProb: Math.round(dailyPrecipProb[i] || 0)
      });
    }
    
    return {
      current: {
        temp: currentTemp,
        condition: currentCondition,
        humidity: currentHumidity,
        wind: currentWindSpeed,
        feelsLike: currentFeelsLike,
        description: weatherDescriptions[currentCondition as keyof typeof weatherDescriptions]
      },
      forecast
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return fallback data
    return null;
  }
}
