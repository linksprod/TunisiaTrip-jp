import { Activity } from '@/hooks/useActivities';
import { Hotel } from '@/data/hotels';
import { GuestHouse } from '@/data/guestHouses';

interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Get average coordinates from a list of activities
 */
function getAverageCoordinates(activities: Activity[]): Coordinates | null {
  const validActivities = activities.filter(a => a.latitude && a.longitude);
  if (validActivities.length === 0) return null;
  
  const sumLat = validActivities.reduce((sum, a) => sum + a.latitude!, 0);
  const sumLng = validActivities.reduce((sum, a) => sum + a.longitude!, 0);
  
  return {
    lat: sumLat / validActivities.length,
    lng: sumLng / validActivities.length
  };
}

/**
 * Filter accommodations based on proximity to activities with a given radius
 */
export function filterAccommodationsByProximity(
  activities: Activity[],
  hotels: Hotel[],
  guestHouses: GuestHouse[],
  maxDistanceKm: number = 60
): { hotels: Hotel[]; guestHouses: GuestHouse[] } {
  const centerCoords = getAverageCoordinates(activities);
  
  if (!centerCoords) {
    return { hotels: [], guestHouses: [] };
  }

  const filteredHotels = hotels.filter(hotel => {
    if (!hotel.coordinates?.lat || !hotel.coordinates?.lng) return false;
    const distance = calculateDistance(
      centerCoords.lat, 
      centerCoords.lng, 
      hotel.coordinates.lat, 
      hotel.coordinates.lng
    );
    return distance <= maxDistanceKm;
  });

  const filteredGuestHouses = guestHouses.filter(guestHouse => {
    if (!guestHouse.coordinates?.lat || !guestHouse.coordinates?.lng) return false;
    const distance = calculateDistance(
      centerCoords.lat, 
      centerCoords.lng, 
      guestHouse.coordinates.lat, 
      guestHouse.coordinates.lng
    );
    return distance <= maxDistanceKm;
  });

  return {
    hotels: filteredHotels.sort((a, b) => {
      const distA = calculateDistance(centerCoords.lat, centerCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistance(centerCoords.lat, centerCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    }),
    guestHouses: filteredGuestHouses.sort((a, b) => {
      const distA = calculateDistance(centerCoords.lat, centerCoords.lng, a.coordinates.lat, a.coordinates.lng);
      const distB = calculateDistance(centerCoords.lat, centerCoords.lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    })
  };
}