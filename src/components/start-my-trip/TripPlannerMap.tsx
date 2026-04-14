import React, { useEffect, useRef, useState, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TripPlannerMapProps {
  activities: any[];
  hotels: any[];
  guestHouses: any[];
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  activitiesByDay: Record<number, string[]>;
  selectedDay: number;
  currentStep: 'activities' | 'accommodations';
}

export const TripPlannerMap = forwardRef<HTMLDivElement, TripPlannerMapProps>(({
  activities,
  hotels,
  guestHouses,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  activitiesByDay,
  selectedDay,
  currentStep
}, ref) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Function to get route between two points using OSRM
  const getRoute = async (startLat: number, startLng: number, endLat: number, endLng: number): Promise<L.LatLng[]> => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&overview=full`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coordinates = data.routes[0].geometry.coordinates;
        return coordinates.map((coord: [number, number]) => new L.LatLng(coord[1], coord[0]));
      }
      
      // Fallback to direct line if routing fails
      return [new L.LatLng(startLat, startLng), new L.LatLng(endLat, endLng)];
    } catch (error) {
      console.warn('Routing failed, using direct line:', error);
      // Fallback to direct line
      return [new L.LatLng(startLat, startLng), new L.LatLng(endLat, endLng)];
    }
  };

  // Function to create route lines following roads
  const createRouteLines = async (coordinates: L.LatLng[], map: L.Map) => {
    if (coordinates.length < 2) return;

    const allRouteCoordinates: L.LatLng[] = [];
    
    for (let i = 0; i < coordinates.length - 1; i++) {
      const start = coordinates[i];
      const end = coordinates[i + 1];
      
      const routeSegment = await getRoute(start.lat, start.lng, end.lat, end.lng);
      
      // Add all points except the last one (to avoid duplication)
      allRouteCoordinates.push(...routeSegment.slice(0, -1));
    }
    
    // Add the final point
    if (coordinates.length > 0) {
      allRouteCoordinates.push(coordinates[coordinates.length - 1]);
    }

    // Create the route line
    if (allRouteCoordinates.length > 1) {
      const routeLine = L.polyline(allRouteCoordinates, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1
      }).addTo(map);

      routeLineRef.current = routeLine;
    }
  };

  // Initialize map
  useEffect(() => {
    if (!ref || typeof ref === 'function') return;
    
    const mapContainer = ref.current;
    if (!mapContainer || mapRef.current) return;

    // Tunisia coordinates - centered on Tunisia
    const map = L.map(mapContainer, {
      center: [34.0, 9.0], // Tunisia center coordinates
      zoom: 7,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      zoomControl: true,
      touchZoom: true,
      minZoom: 5,
      maxZoom: 18
    });
    
    // Set max bounds to restrict view to Tunisia only
    const tunisiaBounds = L.latLngBounds(
      L.latLng(30.2, 7.5),  // Southwest corner 
      L.latLng(37.5, 11.6)  // Northeast corner 
    );
    map.setMaxBounds(tunisiaBounds);
    
    // Force initial view to fit Tunisia bounds properly centered
    map.fitBounds(tunisiaBounds, { padding: [20, 20] });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>',
      maxZoom: 19
    }).addTo(map);

    mapRef.current = map;
    setMapLoaded(true);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [ref]);

  // Update markers and route
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing markers and route
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const map = mapRef.current;

    if (currentStep === 'activities') {
      // Show ALL selected activities (not just for selected day)
      const allSelectedActivities = activities.filter(activity => 
        selectedActivities.includes(activity.id.toString())
      );
      
      console.log('🗺️ Displaying activities on map:', allSelectedActivities.map(a => ({ id: a.id, name: a.title || a.name })));

      const coordinates: L.LatLng[] = [];

      allSelectedActivities.forEach((activity, index) => {
        if (activity.latitude && activity.longitude) {
          const lat = Number(activity.latitude);
          const lng = Number(activity.longitude);
          const position = new L.LatLng(lat, lng);
          coordinates.push(position);

          // Create blue button with activity image
          const activityImage = activity.images?.[0] || activity.image || 'https://images.unsplash.com/photo-1539650116574-75c0c6d68195?w=60';
          const icon = L.divIcon({
            html: `<div style="
              background: #3b82f6;
              border-radius: 10px;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.15);
              overflow: hidden;
              position: relative;
            ">
              <img src="${activityImage}" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
              " />
              <div style="
                position: absolute;
                bottom: 1px;
                right: 1px;
                background: #3b82f6;
                color: white;
                border-radius: 50%;
                width: 14px;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9px;
                font-weight: bold;
                border: 1px solid white;
              ">${index + 1}</div>
            </div>`,
            className: 'custom-activity-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          const marker = L.marker(position, { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 250px;">
                <div style="text-align: center; margin-bottom: 8px;">
                  <img src="${activityImage}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px;" />
                </div>
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #3b82f6;">${activity.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666; display: flex; align-items: center;">
                  📍 ${activity.location}
                </p>
                ${activity.description ? `<p style="margin: 0; font-size: 12px; line-height: 1.4;">${activity.description.substring(0, 150)}...</p>` : ''}
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #888;">
                  Activity #${index + 1} • Selected for your itinerary
                </div>
              </div>
            `);

          markersRef.current.push(marker);
        }
      });

      // Create route lines following roads only if we have multiple activities
      if (coordinates.length > 1) {
        createRouteLines(coordinates, map);

        // Fit map to show all markers with some padding and reduced zoom
        const group = new L.FeatureGroup(markersRef.current);
        const bounds = group.getBounds().pad(0.3); // Increased padding for more zoom out
        map.fitBounds(bounds);
      } else if (coordinates.length === 1) {
        // If only one activity, center on it with reduced zoom
        map.setView(coordinates[0], 7); // Reduced from 10 to 7 (30% zoom out)
      } else {
        // If no activities selected, show Tunisia overview
        const tunisiaBounds = L.latLngBounds(
          L.latLng(30.2, 7.5),  // Southwest corner 
          L.latLng(37.5, 11.6)  // Northeast corner 
        );
        map.fitBounds(tunisiaBounds, { padding: [20, 20] });
      }

    } else if (currentStep === 'accommodations') {
      // Show selected accommodations
      const allAccommodations = [
        ...hotels.filter(h => selectedHotels.includes(h.id.toString())),
        ...guestHouses.filter(g => selectedGuestHouses.includes(g.id.toString()))
      ];

      allAccommodations.forEach((accommodation) => {
        if (accommodation.latitude && accommodation.longitude) {
          const lat = Number(accommodation.latitude);
          const lng = Number(accommodation.longitude);
          const position = new L.LatLng(lat, lng);

          // Different icon for accommodations
          const icon = L.divIcon({
            html: `<div style="
              background: #10b981;
              color: white;
              border-radius: 50%;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 12px;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            ">🏨</div>`,
            className: 'custom-accommodation-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker(position, { icon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${accommodation.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">📍 ${accommodation.location}</p>
                ${accommodation.description ? `<p style="margin: 0; font-size: 12px;">${accommodation.description.substring(0, 100)}...</p>` : ''}
              </div>
            `);

          markersRef.current.push(marker);
        }
      });

      if (markersRef.current.length > 0) {
        const group = new L.FeatureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    }

  }, [
    activities,
    hotels,
    guestHouses,
    selectedActivities,
    selectedHotels,
    selectedGuestHouses,
    activitiesByDay,
    selectedDay,
    currentStep,
    mapLoaded
  ]);

  return (
    <div className="w-full h-[576px] relative sticky top-0">
      <div 
        ref={ref}
        className="h-full w-full"
        style={{
          position: 'relative',
          zIndex: 1
        }}
      />
      
      {/* Map controls overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-2">
        <div className="text-xs text-gray-600">
          {currentStep === 'activities' 
            ? `${selectedActivities.length} selected activities`
            : `${selectedHotels.length + selectedGuestHouses.length} accommodations`
          }
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold mb-2">Legend</h4>
        <div className="space-y-1">
          {currentStep === 'activities' && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
              <span>Activities</span>
            </div>
          )}
          {currentStep === 'accommodations' && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🏨</div>
              <span>Hotels & Guest Houses</span>
            </div>
          )}
          {currentStep === 'activities' && (activitiesByDay[selectedDay] || []).length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-1 bg-blue-500"></div>
              <span>Route</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-activity-marker {
          background: transparent;
          border: none;
        }
        .custom-accommodation-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
});

TripPlannerMap.displayName = "TripPlannerMap";