import React, { useRef, useState, useEffect, useMemo } from "react";
import { Loader, AlertCircle } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { City } from "../travel/types/city";
import L from 'leaflet';
import { createCustomMarker, createPopup } from "../travel/utils/leafletUtils";
import { useActivities } from "@/hooks/useActivities";
import { useHotels } from "@/hooks/useHotels";
import { useGuestHouses } from "@/hooks/useGuestHouses";
import { Airport } from "@/hooks/useAirports";
import { toast } from "sonner";

interface AirportMapProps {
  airports: Airport[];
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  arrivalAirport: string | null;
  departureAirport: string | null;
  onAirportSelect: (airportId: string, type: 'arrival' | 'departure') => void;
}

export function AirportMap({
  airports,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  arrivalAirport,
  departureAirport,
  onAirportSelect
}: AirportMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch data from the database
  const { activities } = useActivities();
  const { hotels } = useHotels();
  const { guestHouses } = useGuestHouses();

  // Create location data - MEMOIZED to prevent infinite re-renders
  const allLocations = useMemo(() => {
    const locations: City[] = [];

    // Add airports
    airports.forEach(airport => {
      if (airport.latitude && airport.longitude) {
        locations.push({
          id: airport.id,
          name: airport.name,
          region: airport.region || "Airport",
          image: airport.images?.[0] || "",
          description: airport.description || "",
          position: {
            lat: airport.latitude,
            lng: airport.longitude
          },
          type: 'airport',
          code: airport.code,
          isArrival: arrivalAirport === airport.id,
          isDeparture: departureAirport === airport.id
        });
      }
    });

    // Add selected activities
    activities.filter(activity => 
      activity.latitude && 
      activity.longitude && 
      selectedActivities.includes(activity.id)
    ).forEach(activity => {
      locations.push({
        id: activity.id,
        name: activity.title,
        region: activity.category || "Tunisia",
        image: activity.images?.[0] || activity.image || "",
        description: activity.description || "",
        position: {
          lat: activity.latitude!,
          lng: activity.longitude!
        },
        type: 'activity'
      });
    });

    // Add selected hotels
    hotels.filter(hotel => 
      hotel.latitude && 
      hotel.longitude && 
      selectedHotels.includes(hotel.id || '')
    ).forEach(hotel => {
      locations.push({
        id: hotel.id || '',
        name: hotel.name,
        region: hotel.location,
        image: hotel.images?.[0] || hotel.image || "",
        description: hotel.description || "",
        position: {
          lat: hotel.latitude!,
          lng: hotel.longitude!
        },
        type: 'hotel'
      });
    });

    // Add selected guest houses
    guestHouses.filter(guestHouse => 
      guestHouse.latitude && 
      guestHouse.longitude && 
      selectedGuestHouses.includes(guestHouse.id || '')
    ).forEach(guestHouse => {
      locations.push({
        id: guestHouse.id || '',
        name: guestHouse.name,
        region: guestHouse.location,
        image: guestHouse.images?.[0] || guestHouse.image || "",
        description: guestHouse.description || "",
        position: {
          lat: guestHouse.latitude!,
          lng: guestHouse.longitude!
        },
        type: 'guesthouse'
      });
    });

    return locations;
  }, [airports, activities, hotels, guestHouses, selectedActivities, selectedHotels, selectedGuestHouses, arrivalAirport, departureAirport]);

  // Handle location click
  const handleLocationClick = (location: City) => {
    if (location.type === 'airport') {
      // Show selection dialog or handle airport selection
      const airportType = location.isArrival ? 'departure' : 'arrival';
      onAirportSelect(location.id, airportType);
      toast.success(`${location.name} selected as ${airportType} airport`);
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
  }, [mapRef]);

  // Create markers when map is ready and locations are loaded
  useEffect(() => {
    if (!map || !mapLoaded || allLocations.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.remove());
    const newMarkers: L.Marker[] = [];

    allLocations.forEach(location => {
      let customIcon;
      
      if (location.type === 'airport') {
        // Special handling for airports
        const isSelected = location.isArrival || location.isDeparture;
        customIcon = createAirportMarker(location, isSelected);
      } else {
        customIcon = createCustomMarker(location, false);
      }

      const marker = L.marker([location.position.lat, location.position.lng], {
        icon: customIcon
      }).addTo(map);

      // Store location data on marker for reference
      (marker as any).locationData = location;

      // Create popup content
      const popupContent = createAirportPopup(location);
      marker.bindPopup(popupContent, {
        maxWidth: 280,
        minWidth: 200,
        className: `custom-popup ${location.type}-popup`,
        closeButton: true,
        autoClose: true,
        closeOnEscapeKey: true,
        autoPan: true,
        autoPanPadding: [20, 20]
      });

      // Handle marker click
      marker.on('click', () => {
        handleLocationClick(location);
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
  }, [map, mapLoaded, allLocations]);

  return (
    <div className="w-full">
      {!mapLoaded && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded" role="alert">
          <div className="flex items-center">
            <Loader className="h-5 w-5 animate-spin mr-2" />
            <p className="font-bold">
              <TranslateText text="Loading Map..." language={currentLanguage} />
            </p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-[500px] rounded-lg overflow-hidden relative border border-border">
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="flex flex-col items-center">
              <Loader className="w-10 h-10 text-primary animate-spin mb-2" />
              <p className="text-muted-foreground">
                <TranslateText text="Loading Map..." language={currentLanguage} />
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
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
        
        .airport-popup .leaflet-popup-content-wrapper {
          border-top: 3px solid hsl(var(--primary));
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
      `}</style>
    </div>
  );
}

// Custom airport marker creation
function createAirportMarker(location: City, isSelected: boolean) {
  const iconSize = 40;
  const color = isSelected ? 'hsl(var(--primary))' : '#6B7280';
  
  const svgIcon = `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <path d="M8.5 12h7M12 8.5v7" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M9 10.5L12 8.5l3 2M9 13.5l3 2 3-2" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-airport-marker',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -iconSize / 2]
  });
}

// Custom popup creation for airports
function createAirportPopup(location: City) {
  const statusText = location.type === 'airport' 
    ? (location.isArrival ? '✈️ Arrival' : location.isDeparture ? '🛬 Departure' : '🏢 Airport')
    : location.type === 'activity' ? '🎯 Activity'
    : location.type === 'hotel' ? '🏨 Hotel'
    : '🏡 Guest House';

  return `
    <div class="p-4 space-y-3">
      ${location.image ? `<img src="${location.image}" alt="${location.name}" class="w-full h-24 object-cover rounded-lg">` : ''}
      <div>
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-bold text-base">${location.name}</h3>
          ${location.code ? `<span class="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">${location.code}</span>` : ''}
        </div>
        <p class="text-sm text-muted-foreground">${location.region}</p>
        <p class="text-xs font-medium text-primary mt-1">${statusText}</p>
      </div>
      ${location.description ? `<p class="text-sm text-muted-foreground">${location.description}</p>` : ''}
    </div>
  `;
}