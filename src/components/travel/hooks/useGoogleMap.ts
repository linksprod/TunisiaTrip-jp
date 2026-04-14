import { useState, useEffect, useCallback } from 'react';
import { City, MapState } from '../types/city';
import { createMarker, createInfoWindow, refreshMarkers, navigateToCity } from '../utils/mapUtils';

// Extend Window interface to include initMap property
declare global {
  interface Window {
    initMap: () => void;
  }
  
  namespace google.maps {
    // Add missing event interface
    interface MapsEventListener {
      remove(): void;
    }
  }
}

export const useGoogleMap = (
  mapRef: React.RefObject<HTMLDivElement>,
  selectedCity: City | null,
  cities: City[],
  routePath: string[],
  handleCityClick: (city: City) => void
) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapState, setMapState] = useState<MapState>({
    map: null,
    markers: [],
    polyline: null
  });
  const [mapInitialized, setMapInitialized] = useState(false);

  // Effect to check if Google Maps is loaded
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps API already loaded");
      setMapLoaded(true);
    } else {
      // Set up callback for when Google Maps loads
      window.initMap = () => {
        console.log("Google Maps API loaded via callback");
        setMapLoaded(true);
      };
    }
    
    return () => {
      // Clean up but preserve the type safety
      if (window.initMap === (() => setMapLoaded(true))) {
        delete window.initMap;
      }
    };
  }, []);

  // Keep markers visible and properly styled
  const ensureMarkersVisible = useCallback(() => {
    if (!mapState.map || !mapState.markers.length) return;
    
    refreshMarkers(mapState.markers, mapState.map);
    console.log("Refreshed markers visibility");
  }, [mapState.map, mapState.markers]);

  // Effect to create the map once Google Maps is loaded
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInitialized) {
      console.log("Map initialization skipped", { mapLoaded, refExists: !!mapRef.current, mapInitialized });
      return;
    }
    
    console.log("Initializing map with cities:", cities.length);

    // Create map with custom styling
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 34.5, lng: 9.5 }, // Center on Tunisia
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: google.maps.ControlPosition.TOP_RIGHT
      },
      fullscreenControl: true,
      streetViewControl: false,
      styles: [
        {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#444444"}]
        },
        {
          "featureType": "landscape",
          "elementType": "all",
          "stylers": [{"color": "#f2f2f2"}]
        },
        {
          "featureType": "poi",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "road",
          "elementType": "all",
          "stylers": [{"saturation": -100}, {"lightness": 45}]
        },
        {
          "featureType": "road.highway",
          "elementType": "all",
          "stylers": [{"visibility": "simplified"}]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "transit",
          "elementType": "all",
          "stylers": [{"visibility": "off"}]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [{"color": "#c4e0f2"}, {"visibility": "on"}]
        }
      ]
    };

    try {
      console.log("Creating new map");
      const newMap = new google.maps.Map(mapRef.current, mapOptions);
      const cityMarkers: google.maps.Marker[] = [];
      
      console.log("Map created successfully");

      // Use standard event listener with a flag to track when tiles are loaded
      let tilesLoaded = false;
      const tilesLoadedListener = google.maps.event.addListener(newMap, 'tilesloaded', () => {
        if (tilesLoaded) return; // Prevent multiple executions
        tilesLoaded = true;
        
        console.log("Map tiles loaded, adding markers and routes");
        
        // Create markers for each city
        cities.forEach((city) => {
          console.log(`Creating marker for ${city.name}`, city.position);
          try {
            const marker = createMarker(newMap, city, selectedCity);
            
            // Attach the city object to the marker for reference
            marker.set("city", city);
            
            // Update marker click event to properly call handleCityClick which triggers all UI updates
            google.maps.event.addListener(marker, "click", () => {
              console.log(`Marker clicked for city: ${city.name}`);
              // Call the city click handler to update selected state and UI
              handleCityClick(city);
            });
            
            // Add double click event to zoom in closer
            google.maps.event.addListener(marker, "dblclick", () => {
              navigateToCity(newMap, city, 14);
              // Prevent the single-click event from also firing
              return false;
            });
            
            const infoWindow = createInfoWindow(city);
            google.maps.event.addListener(marker, "mouseover", () => infoWindow.open(newMap, marker));
            google.maps.event.addListener(marker, "mouseout", () => infoWindow.close());
            
            cityMarkers.push(marker);
          } catch (err) {
            console.error(`Error creating marker for ${city.name}:`, err);
          }
        });

        // Create route path using the routePath array
        const routeCoordinates = routePath
          .map(cityId => {
            const city = cities.find(c => c.id === cityId);
            if (!city) {
              console.warn(`City with ID ${cityId} not found for route path`);
              return null;
            }
            return city.position;
          })
          .filter((pos): pos is google.maps.LatLngLiteral => pos !== null);

        console.log("Route coordinates:", routeCoordinates);

        // Create a polyline with proper arrow symbols and make it more visible
        const routeLine = new google.maps.Polyline({
          path: routeCoordinates,
          geodesic: true,
          strokeColor: "#347EFF",
          strokeOpacity: 1.0, // Increase opacity for visibility
          strokeWeight: 4, // Increase weight for visibility
          icons: [{
            icon: {
              path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
              scale: 1.5, // Adjusted scale for visibility
              strokeColor: "#347EFF",
              fillColor: "#347EFF",
              fillOpacity: 1
            },
            offset: '0',
            repeat: '150px'
          }]
        });

        routeLine.setMap(newMap);
        console.log("Route line added to map");

        // Animate the arrows along the polyline
        let count = 0;
        const animateArrows = () => {
          count = (count + 1) % 200;
          
          const icons = routeLine.get('icons');
          icons[0].offset = (count / 2) + '%';
          routeLine.set('icons', icons);
          
          requestAnimationFrame(animateArrows);
        };
        
        // Start the animation
        animateArrows();
        
        // Fit the map bounds to show all markers
        const bounds = new google.maps.LatLngBounds();
        routeCoordinates.forEach(coord => {
          bounds.extend(coord);
        });
        
        // Add a bit of padding to the bounds
        newMap.fitBounds(bounds);
        
        // Create legend with Atlantis Route and city markers
        const legendControlDiv = document.createElement('div');
        legendControlDiv.className = 'map-legend';
        legendControlDiv.innerHTML = `
          <div style="background-color: white; border-radius: 4px; margin: 10px; padding: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-family: Inter, sans-serif;">
            <div style="font-weight: bold; margin-bottom: 8px;">Atlantis Route</div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
              <div style="width: 20px; height: 3px; background-color: #347EFF; margin-right: 8px;"></div>
              <span>Tour Route</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #347EFF; margin-right: 8px;"></div>
              <span>Featured City</span>
            </div>
          </div>
        `;
        newMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendControlDiv);

        // Adjust zoom level slightly to ensure the entire route is visible
        let zoomAdjusted = false;
        const handleIdle = () => {
          if (!zoomAdjusted) {
            zoomAdjusted = true;
            if (newMap.getZoom() > 7) {
              newMap.setZoom(7);
            }
          }
          
          // Refresh markers on idle to ensure they stay visible
          refreshMarkers(cityMarkers, newMap);
        };
        
        // Use the properly typed event listener
        const idleListener = google.maps.event.addListener(newMap, 'idle', handleIdle);
        
        // Store event listeners for cleanup
        const cleanupListeners = () => {
          google.maps.event.clearListeners(newMap, 'idle');
          google.maps.event.clearListeners(newMap, 'tilesloaded');
        };
      
        setMapState({
          map: newMap,
          markers: cityMarkers,
          polyline: routeLine
        });
        
        // Setup additional event listeners to ensure markers stay visible
        const centerChangedListener = google.maps.event.addListener(newMap, 'center_changed', () => {
          setTimeout(() => refreshMarkers(cityMarkers, newMap), 100);
        });
        
        const zoomChangedListener = google.maps.event.addListener(newMap, 'zoom_changed', () => {
          setTimeout(() => refreshMarkers(cityMarkers, newMap), 100);
        });
        
        // Refresh markers periodically
        const markerRefreshInterval = setInterval(() => {
          refreshMarkers(cityMarkers, newMap);
        }, 5000);
        
        // Cleanup function to remove event listeners
        const mapCleanup = () => {
          clearInterval(markerRefreshInterval);
          google.maps.event.clearListeners(newMap, 'center_changed');
          google.maps.event.clearListeners(newMap, 'zoom_changed');
          cleanupListeners();
        };
        
        // Attach the cleanup function to the map for later use
        newMap.cleanup = mapCleanup;
      });

      setMapInitialized(true);
      
    } catch (err) {
      console.error("Error initializing map:", err);
    }

    return () => {
      // Clean up map resources
      if (mapState.polyline) {
        mapState.polyline.setMap(null);
      }
      
      mapState.markers.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      
      // Clean up event listeners if any
      if (mapState.map) {
        if (mapState.map.cleanup) {
          mapState.map.cleanup();
        }
      }
    };
  }, [mapLoaded, selectedCity, mapInitialized, cities, routePath, handleCityClick]);

  // Effect to update markers when selected city changes
  useEffect(() => {
    if (mapState.map && mapState.markers.length > 0 && selectedCity) {
      console.log("Selected city changed, updating markers");
      
      // Set a small timeout to ensure the map is ready
      setTimeout(() => {
        refreshMarkers(mapState.markers, mapState.map);
      }, 100);
    }
  }, [selectedCity, mapState.map, mapState.markers]);

  // Add an additional effect to ensure markers stay visible after map changes
  useEffect(() => {
    if (!mapState.map || !mapState.markers.length) return;
    
    // Refresh markers after initial render
    const initialRefresh = setTimeout(() => {
      ensureMarkersVisible();
    }, 2000);
    
    return () => clearTimeout(initialRefresh);
  }, [mapState.map, mapState.markers, ensureMarkersVisible]);

  return { mapLoaded, mapState };
};

// Add cleanup function to Map type
declare global {
  namespace google.maps {
    interface Map {
      cleanup?: () => void;
    }
  }
}
