/**
 * Utility functions for geographical calculations and activity grouping
 */

import { Activity } from '@/data/activities';
import { Hotel } from '@/data/hotels';
import { GuestHouse } from '@/data/guestHouses';

export interface GeographicalZone {
  id: string;
  name: string;
  centerLat: number;
  centerLng: number;
  activities: Activity[];
  nearbyHotels: Hotel[];
  nearbyGuestHouses: GuestHouse[];
}

/**
 * Calculate distance between two geographical points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
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
 * Find the closest hotel to a given activity
 */
export function findClosestHotel(activity: Activity, hotels: Hotel[]): Hotel | null {
  if (!activity.coordinates || hotels.length === 0) return null;

  let closestHotel = hotels[0];
  let minDistance = Infinity;

  hotels.forEach(hotel => {
    if (hotel.coordinates) {
      const distance = calculateDistance(
        activity.coordinates.lat,
        activity.coordinates.lng,
        hotel.coordinates.lat,
        hotel.coordinates.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestHotel = hotel;
      }
    }
  });

  return closestHotel;
}

/**
 * Find nearby accommodations within a given radius
 */
export function findNearbyAccommodations(
  activity: Activity,
  hotels: Hotel[],
  guestHouses: GuestHouse[],
  radiusKm: number = 25
) {
  if (!activity.coordinates) return { hotels: [], guestHouses: [] };

  const nearbyHotels = hotels.filter(hotel => {
    if (!hotel.coordinates) return false;
    const distance = calculateDistance(
      activity.coordinates.lat,
      activity.coordinates.lng,
      hotel.coordinates.lat,
      hotel.coordinates.lng
    );
    return distance <= radiusKm;
  });

  const nearbyGuestHouses = guestHouses.filter(guestHouse => {
    if (!guestHouse.coordinates) return false;
    const distance = calculateDistance(
      activity.coordinates.lat,
      activity.coordinates.lng,
      guestHouse.coordinates.lat,
      guestHouse.coordinates.lng
    );
    return distance <= radiusKm;
  });

  return { hotels: nearbyHotels, guestHouses: nearbyGuestHouses };
}

/**
 * Group activities by geographical zones
 */
export function groupActivitiesByZones(
  activities: Activity[],
  hotels: Hotel[],
  guestHouses: GuestHouse[],
  radiusKm: number = 30
): GeographicalZone[] {
  const zones: GeographicalZone[] = [];
  const processedActivities = new Set<string>();

  activities.forEach(activity => {
    if (processedActivities.has(activity.id) || !activity.coordinates) return;

    // Find all activities within radius
    const nearbyActivities = activities.filter(otherActivity => {
      if (processedActivities.has(otherActivity.id) || !otherActivity.coordinates) return false;
      
      const distance = calculateDistance(
        activity.coordinates!.lat,
        activity.coordinates!.lng,
        otherActivity.coordinates.lat,
        otherActivity.coordinates.lng
      );
      return distance <= radiusKm;
    });

    if (nearbyActivities.length > 0) {
      // Calculate zone center
      const centerLat = nearbyActivities.reduce((sum, act) => sum + act.coordinates!.lat, 0) / nearbyActivities.length;
      const centerLng = nearbyActivities.reduce((sum, act) => sum + act.coordinates!.lng, 0) / nearbyActivities.length;

      // Find accommodations near the zone center
      const { hotels: nearbyHotels, guestHouses: nearbyGuestHouses } = findNearbyAccommodations(
        { coordinates: { lat: centerLat, lng: centerLng } } as Activity,
        hotels,
        guestHouses,
        radiusKm
      );

      // Determine zone name based on most common location
      const locations = nearbyActivities.map(act => act.location);
      const zoneName = getMostCommonLocation(locations);

      zones.push({
        id: `zone-${zones.length + 1}`,
        name: zoneName,
        centerLat,
        centerLng,
        activities: nearbyActivities,
        nearbyHotels,
        nearbyGuestHouses
      });

      // Mark activities as processed
      nearbyActivities.forEach(act => processedActivities.add(act.id));
    }
  });

  return zones;
}

/**
 * Get the most common location from a list of locations
 */
function getMostCommonLocation(locations: string[]): string {
  const locationCounts = locations.reduce((acc, location) => {
    // Extract main city/region from location string
    const mainLocation = location.split(',')[0].trim();
    acc[mainLocation] = (acc[mainLocation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || locations[0];
}

/**
 * Get activity recommendations based on selected activities
 */
export function getActivityRecommendations(
  selectedActivities: Activity[],
  allActivities: Activity[],
  radiusKm: number = 20
): Activity[] {
  if (selectedActivities.length === 0) return [];

  const recommendations = new Set<Activity>();

  selectedActivities.forEach(selectedActivity => {
    if (!selectedActivity.coordinates) return;

    allActivities.forEach(activity => {
      if (
        !activity.coordinates ||
        selectedActivities.some(sel => sel.id === activity.id) ||
        recommendations.has(activity)
      ) return;

      const distance = calculateDistance(
        selectedActivity.coordinates.lat,
        selectedActivity.coordinates.lng,
        activity.coordinates.lat,
        activity.coordinates.lng
      );

      if (distance <= radiusKm) {
        recommendations.add(activity);
      }
    });
  });

  return Array.from(recommendations);
}