import React, { useRef, useState, useEffect, useMemo } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { City } from "../travel/types/city";
import L from 'leaflet';
import { createCustomMarker, createPopup, updateMarkerStyle } from "../travel/utils/leafletUtils";
import { useActivities } from "@/hooks/useActivities";
import { hotels } from "@/data/hotels";
import { guestHouses } from "@/data/guestHouses";
import { toast } from "sonner";

// Map activities to real Tunisia city locations using actual coordinates
const activityToCityMap = new Map<string, City>();

// Empty route path to remove the connecting lines
const routePath: string[] = [];
interface StartMyTripMapProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels?: string[];
  selectedGuestHouses?: string[];
  activeTab?: string;
  setSelectedHotels?: (hotels: string[]) => void;
  setSelectedGuestHouses?: (guestHouses: string[]) => void;
}
export function StartMyTripMap({
  selectedActivities,
  setSelectedActivities,
  selectedHotels = [],
  selectedGuestHouses = [],
  activeTab = "activities",
  setSelectedHotels,
  setSelectedGuestHouses
}: StartMyTripMapProps) {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    currentLanguage
  } = useTranslation();
  const [mapKey, setMapKey] = useState<number>(0);
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch data from the database
  const {
    activities
  } = useActivities();

  // Create location data based on mode - MEMOIZED to prevent infinite re-renders
  const currentLocations = useMemo(() => {
    // For accommodation selection page: show selected activities + selected accommodations
    if (activeTab === "activities" && selectedActivities.length > 0) {
      const activityLocations = activities.filter(activity => 
        activity.show_in_start_my_trip && 
        activity.latitude && 
        activity.longitude && 
        selectedActivities.includes(activity.id?.toString() || '')
      ).map(activity => {
        const activityImage = activity.images && activity.images.length > 0 ? activity.images[0] : activity.image || "";
        const city: City = {
          id: activity.id!,
          name: activity.title,
          region: activity.category || "Tunisia",
          image: activityImage,
          description: activity.description || "",
          position: {
            lat: activity.latitude!,
            lng: activity.longitude!
          },
          type: 'activity'
        };
        activityToCityMap.set(activity.id!, city);
        return city;
      });

      const hotelLocations = hotels.filter(hotel => 
        hotel.coordinates?.lat && 
        hotel.coordinates?.lng && 
        selectedHotels.includes(hotel.id?.toString() || '')
      ).map(hotel => {
        const city: City = {
          id: hotel.id!,
          name: hotel.name,
          region: hotel.location,
          image: hotel.image || "",
          description: hotel.description || "",
          position: {
            lat: hotel.coordinates.lat,
            lng: hotel.coordinates.lng
          },
          type: 'hotel'
        };
        return city;
      });

      const guestHouseLocations = guestHouses.filter(guestHouse => 
        guestHouse.coordinates?.lat && 
        guestHouse.coordinates?.lng && 
        selectedGuestHouses.includes(guestHouse.id?.toString() || '')
      ).map(guestHouse => {
        const city: City = {
          id: guestHouse.id!,
          name: guestHouse.name,
          region: guestHouse.location,
          image: guestHouse.image || "",
          description: guestHouse.description || "",
          position: {
            lat: guestHouse.coordinates.lat,
            lng: guestHouse.coordinates.lng
          },
          type: 'guesthouse'
        };
        return city;
      });

      return [...activityLocations, ...hotelLocations, ...guestHouseLocations];
    }
    
    // For main page: show ALL activities with visual selection indicators
    if (activeTab === "all-activities") {
      return activities.filter(activity => 
        activity.show_in_start_my_trip && 
        activity.latitude && 
        activity.longitude
      ).map(activity => {
        const activityImage = activity.images && activity.images.length > 0 ? activity.images[0] : activity.image || "";
        const city: City = {
          id: activity.id!,
          name: activity.title,
          region: activity.category || "Tunisia",
          image: activityImage,
          description: activity.description || "",
          position: {
            lat: activity.latitude!,
            lng: activity.longitude!
          },
          type: 'activity' as const,
          isSelected: selectedActivities.includes(activity.id?.toString() || '')
        };
        activityToCityMap.set(activity.id!, city);
        return city;
      });
    }
    
    return [];
  }, [activeTab, selectedActivities, selectedHotels, selectedGuestHouses, activities, hotels, guestHouses]);

  // Handle city click
  const handleCityClick = (city: City) => {
    // For all-activities mode, allow selection/deselection
    if (activeTab === "all-activities" && city.type === 'activity' && setSelectedActivities) {
      const currentSelected = [...selectedActivities];
      if (currentSelected.includes(city.id.toString())) {
        setSelectedActivities(currentSelected.filter(id => id !== city.id.toString()));
        toast.info(`${city.name} removed from selection`);
      } else {
        setSelectedActivities([...currentSelected, city.id.toString()]);
        toast.success(`${city.name} added to selection`);
      }
    } else {
      // Just update selected city for map focus
      setSelectedCity(city);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    // Fix for default markers in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });
    const newMap = L.map(mapRef.current).setView([34.0, 9.5], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© CartoDB © OpenStreetMap contributors'
    }).addTo(newMap);
    setMap(newMap);
    setMapLoaded(true);
    return () => {
      newMap.remove();
    };
  }, [mapRef, mapKey]);

  // Create markers when map is ready and locations are loaded
  useEffect(() => {
    if (!map || !mapLoaded || currentLocations.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers: L.Marker[] = [];
    currentLocations.forEach(location => {
      // For all-activities mode, use the isSelected property
      const isSelected = activeTab === "all-activities" ? Boolean(location.isSelected) : false;
      const customIcon = createCustomMarker(location, isSelected);
      const marker = L.marker([location.position.lat, location.position.lng], {
        icon: customIcon
      }).addTo(map);

      // Store city data on marker for reference
      (marker as any).cityData = location;

      // Create popup content with selection indicator
      const popupContent = createPopup(location, isSelected);
      marker.bindPopup(popupContent, {
        maxWidth: 220,
        minWidth: 180,
        className: `custom-popup ${location.type}-popup ${isSelected ? 'selected' : ''}`,
        closeButton: true,
        autoClose: true,
        closeOnEscapeKey: true,
        autoPan: true,
        autoPanPadding: [20, 20]
      });

      // Handle marker click
      marker.on('click', () => {
        handleCityClick(location);
        marker.openPopup();
      });
      newMarkers.push(marker);
    });
    setMarkers(newMarkers);

    // Set default bounds for Tunisia instead of fitting to markers
    const tunisiaBounds = L.latLngBounds(
      [30.0, 7.0],  // Southwest corner
      [38.0, 12.0]  // Northeast corner
    );
    map.fitBounds(tunisiaBounds, { padding: [20, 20] });
  }, [map, mapLoaded, currentLocations, activeTab, selectedActivities]);

  // Remove automatic zoom/pan to keep map focused on Tunisia bounds
  // Users requested to remove automatic zooming when selecting activities

  // Function to reload the map if it fails
  const handleReloadMap = () => {
    setMapKey(prev => prev + 1);
    toast.info("Reloading map...");
  };
  return <div className="w-full font-inter" key={`map-${mapKey}`}>
      {!mapLoaded && <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded" role="alert">
          <div className="flex items-center">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <p className="font-bold">
              <TranslateText text="Loading Map..." language={currentLanguage} />
            </p>
          </div>
          <p className="mt-2 text-sm">
            <TranslateText text="Please wait while we initialize the map with Leaflet." language={currentLanguage} />
          </p>
        </div>}
      
      
      
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-[400px] rounded-lg overflow-hidden relative border border-gray-200">
        {!mapLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <Loader className="w-10 h-10 text-blue-500 animate-spin mb-2" />
              <p className="text-gray-700">
                <TranslateText text="Loading Map..." language={currentLanguage} />
              </p>
            </div>
          </div>}
        
        {/* Hidden error message container for map errors */}
        <div className="map-error-message hidden absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 z-10">
          <div className="text-center p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="font-bold text-red-700">
              <TranslateText text="Map Error" language={currentLanguage} />
            </p>
            <p className="text-red-700 mt-2 text-sm">
              <TranslateText text="There was an issue loading the map. Please try again." language={currentLanguage} />
            </p>
            <button onClick={handleReloadMap} className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <TranslateText text="Reload Map" language={currentLanguage} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Location tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {currentLocations.map(location => {
        return <button key={location.id} onClick={() => handleCityClick(location)} className="
                inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all
                bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200
              ">
              <span className="truncate max-w-[160px]">{location.name}</span>
              {location.price && <span className="text-xs text-muted-foreground">
                  {location.price}
                </span>}
            </button>;
      })}
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
          
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            border: 1px solid rgba(0,0,0,0.05);
            padding: 0;
            overflow: hidden;
          }
          
          .custom-popup .leaflet-popup-content {
            margin: 0;
            padding: 0;
            width: auto !important;
          }
          
          .custom-popup .leaflet-popup-tip {
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .custom-popup .leaflet-popup-close-button {
            background: rgba(0,0,0,0.1);
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            color: #666;
            right: 8px;
            top: 8px;
            transition: all 0.2s;
          }
          
          .custom-popup .leaflet-popup-close-button:hover {
            background: rgba(0,0,0,0.2);
            color: #333;
          }
          
          .activity-popup .leaflet-popup-content-wrapper {
            border-top: 3px solid #347EFF;
          }
          
          .hotel-popup .leaflet-popup-content-wrapper {
            border-top: 3px solid #22C55E;
          }
          
          .guesthouse-popup .leaflet-popup-content-wrapper {
            border-top: 3px solid #F59E0B;
          }
        `}
      </style>
    </div>;
}