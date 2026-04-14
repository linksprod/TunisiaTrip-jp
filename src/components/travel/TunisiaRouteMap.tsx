
import React, { useRef, useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { City } from "./types/city";
import { useLeafletMap } from "./hooks/useLeafletMap";
import { navigateToCity, findMarkerByCity, animateMarker } from "./utils/leafletUtils";
import { CityTags } from "./components/CityTags";
import { CityDetails } from "./components/CityDetails";
import { cities, northToSouthSortedCities, routePath } from "./data/citiesData";

export const TunisiaRouteMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
  const mapRef = useRef<HTMLDivElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();
  const [mapKey, setMapKey] = useState<number>(0);
  
  const { mapLoaded, mapState } = useLeafletMap(
    mapRef,
    selectedCity,
    cities,
    routePath,
    handleCityClick,
    currentLanguage
  );

  function handleCityClick(city: City) {
    if (selectedCity?.id === city.id) {
      // If clicking the already selected city, zoom in closer
      if (mapState.map) {
        navigateToCity(mapState.map, city, 13);
      }
      return;
    }
    
    console.log(`City clicked: ${city.name}`);
    setSelectedCity(city);
    
    if (mapState.map && city) {
      // Navigate to the city with smooth animation
      navigateToCity(mapState.map, city);
    }
  }

  const handleTagClick = (city: City) => {
    // Set the selected city
    setSelectedCity(city);
    
    if (mapState.map) {
      // Navigate to the city on the map
      navigateToCity(mapState.map, city);
      
      // Find and animate the marker
      const marker = findMarkerByCity(mapState.markers, city.id);
      animateMarker(marker, city);
    }
  };

  const handleCityDoubleClick = (city: City) => {
    if (mapState.map) {
      // Zoom in closer on double click
      navigateToCity(mapState.map, city, 14);
    }
  };

  return (
    <div className="w-full font-inter" key={`map-${mapKey}`}>
      {!mapLoaded && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
          <p className="font-bold">
            <TranslateText text="Loading Map..." language={currentLanguage} />
          </p>
          <p>
            <TranslateText 
              text="Please wait while we initialize the map with Leaflet." 
              language={currentLanguage} 
            />
          </p>
        </div>
      )}

      <CityTags
        cities={northToSouthSortedCities}
        selectedCity={selectedCity}
        onCityClick={handleTagClick}
        onCityDoubleClick={handleCityDoubleClick}
        scrollIntoViewRef={tagsContainerRef}
      />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <div 
            ref={mapRef} 
            className="w-full h-[500px] rounded-[10px] overflow-hidden relative border border-gray-300"
            id="tunisia-map-container"
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center">
                  <Loader className="w-10 h-10 text-blue-500 animate-spin mb-2" />
                  <p className="text-gray-700">
                    <TranslateText text="Loading Map..." language={currentLanguage} />
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:w-1/2">
          {selectedCity && <CityDetails city={selectedCity} />}
        </div>
      </div>
      
      <style>
        {`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        
        .custom-marker {
          border: none !important;
          background: transparent !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .leaflet-popup-tip {
          background: white;
        }
        
        .map-legend {
          pointer-events: none;
        }
        `}
      </style>
      
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};
