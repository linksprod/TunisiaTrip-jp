
import { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { City, MapState } from '../types/city';
import { 
  createCustomMarker, 
  createPopup, 
  updateMarkerStyle,
  createAnimatedPolyline,
  createMapLegend
} from '../utils/leafletUtils';
import { FullscreenControl } from '../utils/leafletFullscreen';
import { travelGeneralTranslations } from '../../../translations/japanese/travel-general';

// Extend MapState for Leaflet
interface LeafletMapState {
  map: L.Map | null;
  markers: L.Marker[];
  polyline: L.Polyline | null;
}

export const useLeafletMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  selectedCity: City | null,
  cities: City[],
  routePath: string[],
  handleCityClick: (city: City) => void,
  currentLanguage: string = 'EN'
) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapState, setMapState] = useState<LeafletMapState>({
    map: null,
    markers: [],
    polyline: null
  });
  const [mapInitialized, setMapInitialized] = useState(false);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;

    console.log("Initializing Leaflet map with cities:", cities.length);

    try {
      // Create map
      const map = L.map(mapRef.current, {
        center: [34.5, 9.5], // Tunisia center
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
      });

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add custom controls
      const fullscreenControl = new FullscreenControl({ position: 'topright' });
      map.addControl(fullscreenControl);
      
      // Get translated legend texts
      const atlantisRouteText = currentLanguage === 'JP' 
        ? travelGeneralTranslations["Atlantis Route"] 
        : "Atlantis Route";
      const tourRouteText = currentLanguage === 'JP' 
        ? travelGeneralTranslations["Tour Route"] 
        : "Tour Route";
      const featuredCityText = currentLanguage === 'JP' 
        ? travelGeneralTranslations["Featured City"] 
        : "Featured City";
      
      // Add legend with translations
      const legend = createMapLegend(atlantisRouteText, tourRouteText, featuredCityText);
      legend.addTo(map);

      const cityMarkers: L.Marker[] = [];

      // Create markers for each city
      cities.forEach((city) => {
        console.log(`Creating marker for ${city.name}`, city.position);
        
        const isSelected = selectedCity?.id === city.id;
        const customIcon = createCustomMarker(city, isSelected);
        
        const marker = L.marker([city.position.lat, city.position.lng], {
          icon: customIcon,
        });

        // Store city data in marker
        (marker as any).cityData = city;

        // Add popup
        marker.bindPopup(createPopup(city));

        // Add click handler
        marker.on('click', () => {
          console.log(`Marker clicked for city: ${city.name}`);
          handleCityClick(city);
        });

        // Add double click handler
        marker.on('dblclick', () => {
          map.setView([city.position.lat, city.position.lng], 14, {
            animate: true,
            duration: 0.5
          });
        });

        // Add hover handlers
        marker.on('mouseover', () => {
          marker.openPopup();
        });

        marker.on('mouseout', () => {
          marker.closePopup();
        });

        marker.addTo(map);
        cityMarkers.push(marker);
      });

      markersRef.current = cityMarkers;

      // Create route path only if routePath has items
      let routeLine: L.Polyline | null = null;
      if (routePath.length > 0) {
        const routeCoordinates: L.LatLngExpression[] = routePath
          .map(cityId => {
            const city = cities.find(c => c.id === cityId);
            if (!city) {
              console.warn(`City with ID ${cityId} not found for route path`);
              return null;
            }
            return [city.position.lat, city.position.lng] as L.LatLngExpression;
          })
          .filter((pos): pos is L.LatLngExpression => pos !== null);

        console.log("Route coordinates:", routeCoordinates);

        // Create polyline with animation
        routeLine = createAnimatedPolyline(routeCoordinates, map);
      }

      // Fit bounds to show all cities
      if (cityMarkers.length > 0) {
        const group = new L.FeatureGroup(cityMarkers);
        map.fitBounds(group.getBounds(), { padding: [20, 20] });
        
        // Adjust zoom if too high
        if (map.getZoom() > 7) {
          map.setZoom(7);
        }
      }

      setMapState({
        map,
        markers: cityMarkers,
        polyline: routeLine
      });

      setMapLoaded(true);
      setMapInitialized(true);

    } catch (err) {
      console.error("Error initializing Leaflet map:", err);
    }

    // Cleanup function
    return () => {
      if (mapState.map) {
        mapState.map.remove();
      }
    };
  }, [mapRef, mapInitialized, cities, routePath, handleCityClick, selectedCity]);

  // Update markers when selected city changes
  useEffect(() => {
    if (!mapState.map || !markersRef.current.length || !selectedCity) return;

    console.log("Selected city changed, updating markers");

    markersRef.current.forEach(marker => {
      const markerCity = (marker as any).cityData as City;
      if (markerCity) {
        const isSelected = markerCity.id === selectedCity.id;
        updateMarkerStyle(marker, markerCity, isSelected);
      }
    });
  }, [selectedCity, mapState.map]);

  return { mapLoaded, mapState };
};
