
import { City } from '../types/city';

export const createMarker = (
  map: google.maps.Map,
  city: City,
  selectedCity: City | null
): google.maps.Marker => {
  console.log(`Creating marker for ${city.name} at position:`, city.position);
  
  const isSelected = city.id === selectedCity?.id;
  
  const marker = new google.maps.Marker({
    position: city.position,
    map: map,
    title: city.name,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: isSelected ? 14 : 10,
      fillColor: "#347EFF",
      fillOpacity: 0.9,
      strokeColor: "#FFFFFF",
      strokeWeight: isSelected ? 3 : 2
    },
    opacity: 1,
    animation: isSelected ? google.maps.Animation.BOUNCE : null,
    zIndex: isSelected ? 100 : 50,
    visible: true,
    optimized: false, // Disable marker optimization for better visibility
    cursor: 'pointer' // Add pointer cursor to indicate clickable
  });
  
  // Ensure animation stops after a brief period
  if (isSelected && marker.getAnimation()) {
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500);
  }
  
  console.log(`Marker for ${city.name} created and added to map`);
  return marker;
};

export const createInfoWindow = (city: City): google.maps.InfoWindow => {
  return new google.maps.InfoWindow({
    content: `<div style="font-family: Inter, sans-serif;">
                <div style="font-weight: bold; font-size: 14px;">${city.name}</div>
                <div style="font-size: 12px; color: #666;">${city.region}</div>
              </div>`,
    disableAutoPan: false // Enable auto-pan to ensure info window is visible
  });
};

export const updateMarkerStyles = (
  markers: google.maps.Marker[],
  selectedCityId: string
) => {
  console.log(`Updating marker styles, selected city ID: ${selectedCityId}`);
  
  markers.forEach(marker => {
    const markerCity = marker.get("city") as City;
    if (!markerCity) {
      console.warn("Marker has no associated city data");
      return;
    }
    
    console.log(`Processing marker for ${markerCity.name}, id: ${markerCity.id}`);
    
    // Force marker to be visible
    marker.setVisible(true);
    
    const isSelected = markerCity.id === selectedCityId;
    
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: isSelected ? 14 : 10,
      fillColor: "#347EFF",
      fillOpacity: 0.9,
      strokeColor: "#FFFFFF",
      strokeWeight: isSelected ? 3 : 2
    });
    
    marker.setZIndex(isSelected ? 100 : 50);
    
    // Apply animation only if it's the selected city
    if (isSelected) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      
      // Stop bouncing after 1.5 seconds
      setTimeout(() => {
        if (marker) {
          marker.setAnimation(null);
        }
      }, 1500);
    } else {
      marker.setAnimation(null);
    }
  });
};

// Utility function to prevent marker loss during map events
export const refreshMarkers = (markers: google.maps.Marker[], map: google.maps.Map | null) => {
  if (!map) return;
  
  console.log(`Refreshing ${markers.length} markers`);
  
  markers.forEach(marker => {
    // Check if marker is already on the map
    const currentMap = marker.getMap();
    
    // If marker is not on the map, add it
    if (!currentMap) {
      console.log("Marker not on map, re-adding it");
      marker.setMap(map);
    }
    
    // Also make sure it's visible
    if (!marker.getVisible()) {
      console.log("Marker not visible, making it visible");
      marker.setVisible(true);
    }
  });
};

// Navigate to a city with smooth animation
export const navigateToCity = (map: google.maps.Map | null, city: City, zoom: number = 10) => {
  if (!map) return;
  
  console.log(`Navigating to ${city.name} with zoom level ${zoom}`);
  
  // First zoom out slightly to give context (if current zoom is higher than 7)
  const currentZoom = map.getZoom();
  
  if (currentZoom && currentZoom > 7) {
    map.setZoom(7);
    
    // Brief delay to allow zoom out animation
    setTimeout(() => {
      // Then pan to the city location
      map.panTo(city.position);
      
      // After panning, zoom in to the desired level
      setTimeout(() => {
        map.setZoom(zoom);
      }, 500);
    }, 300);
  } else {
    // If already zoomed out, just pan and zoom in
    map.panTo(city.position);
    
    setTimeout(() => {
      map.setZoom(zoom);
    }, 500);
  }
};

// Find marker by city ID
export const findMarkerByCity = (markers: google.maps.Marker[], cityId: string): google.maps.Marker | null => {
  for (const marker of markers) {
    const city = marker.get("city") as City;
    if (city && city.id === cityId) {
      return marker;
    }
  }
  return null;
};

// Animate a specific marker
export const animateMarker = (marker: google.maps.Marker | null, animation: google.maps.Animation | null = google.maps.Animation.BOUNCE) => {
  if (!marker) return;
  
  // Apply animation
  marker.setAnimation(animation);
  
  // Stop animation after a brief period
  if (animation) {
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500);
  }
};
