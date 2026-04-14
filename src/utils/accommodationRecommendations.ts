
import { activities } from "@/components/start-my-trip/activities-data";
import { hotels, Hotel } from "@/components/start-my-trip/hotels-data";
import { guestHouses, GuestHouse } from "@/components/start-my-trip/guesthouses-data";

export interface AccommodationRecommendation {
  type: 'hotel' | 'guesthouse';
  accommodation: Hotel | GuestHouse;
  score: number;
  reasons: string[];
  nearbyActivities: Array<{
    id: string;
    title: string;
    distance: number;
  }>;
  daysRecommended: number;
  japaneseAppeal: string[];
}

export interface RegionCluster {
  region: string;
  activities: Array<{
    id: string;
    title: string;
    coordinates: { lat: number; lng: number };
  }>;
  center: { lat: number; lng: number };
  daysNeeded: number;
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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

// Get coordinates for activities
function getActivityCoordinates(activityId: string): { lat: number; lng: number } | null {
  // Mapping activity IDs to approximate coordinates based on locations
  const activityCoords: Record<string, { lat: number; lng: number }> = {
    "1": { lat: 33.9197, lng: 8.1335 }, // Desert Safari - Douz
    "2": { lat: 36.8506, lng: 10.3230 }, // Carthage
    "3": { lat: 36.8706, lng: 10.3472 }, // Sidi Bou Said
    "4": { lat: 35.2989, lng: 10.7069 }, // El Jem
    "6": { lat: 36.7981, lng: 10.1731 }, // Souks - Tunis Medina
    "9": { lat: 33.0167, lng: 9.8167 }   // Star Wars locations - South
  };
  
  return activityCoords[activityId] || null;
}

// Cluster activities by geographic proximity
export function clusterActivitiesByRegion(selectedActivityIds: string[], totalDays: number): RegionCluster[] {
  const selectedActivities = activities.filter(activity => 
    selectedActivityIds.includes(activity.id.toString())
  );

  const clusters: RegionCluster[] = [];
  const processedActivities = new Set<string>();

  selectedActivities.forEach(activity => {
    if (processedActivities.has(activity.id.toString())) return;

    const coords = getActivityCoordinates(activity.id.toString());
    if (!coords) return;

    // Find nearby activities (within 100km)
    const nearbyActivities = selectedActivities.filter(otherActivity => {
      if (otherActivity.id === activity.id) return true;
      if (processedActivities.has(otherActivity.id.toString())) return false;

      const otherCoords = getActivityCoordinates(otherActivity.id.toString());
      if (!otherCoords) return false;

      const distance = calculateDistance(coords.lat, coords.lng, otherCoords.lat, otherCoords.lng);
      return distance <= 100; // 100km radius
    });

    // Calculate cluster center
    const centerLat = nearbyActivities.reduce((sum, act) => {
      const actCoords = getActivityCoordinates(act.id.toString());
      return sum + (actCoords?.lat || 0);
    }, 0) / nearbyActivities.length;

    const centerLng = nearbyActivities.reduce((sum, act) => {
      const actCoords = getActivityCoordinates(act.id.toString());
      return sum + (actCoords?.lng || 0);
    }, 0) / nearbyActivities.length;

    // Determine region name based on center coordinates
    let regionName = "Central";
    if (centerLat > 36.5) regionName = "Tunis";
    else if (centerLat < 34) regionName = "Sahara";
    else if (centerLng > 10.5) regionName = "Central Coast";

    // Calculate days needed (minimum 1, maximum 3 per cluster)
    const daysNeeded = Math.min(Math.max(1, Math.ceil(nearbyActivities.length / 2)), 3);

    clusters.push({
      region: regionName,
      activities: nearbyActivities.map(act => ({
        id: act.id.toString(),
        title: act.title,
        coordinates: getActivityCoordinates(act.id.toString()) || { lat: 0, lng: 0 }
      })),
      center: { lat: centerLat, lng: centerLng },
      daysNeeded
    });

    // Mark activities as processed
    nearbyActivities.forEach(act => processedActivities.add(act.id.toString()));
  });

  return clusters;
}

// Generate accommodation recommendations based on clusters
export function generateAccommodationRecommendations(
  clusters: RegionCluster[],
  totalDays: number,
  preferenceType: 'luxury' | 'authentic' | 'mixed' = 'mixed'
): AccommodationRecommendation[] {
  const recommendations: AccommodationRecommendation[] = [];

  clusters.forEach(cluster => {
    // Find best hotels for this cluster
    const hotelRecommendations = hotels
      .filter(hotel => {
        // Filter by region or proximity
        if (hotel.region === cluster.region) return true;
        
        // Check distance to cluster center
        const distance = calculateDistance(
          hotel.coordinates.lat, hotel.coordinates.lng,
          cluster.center.lat, cluster.center.lng
        );
        return distance <= 50; // 50km radius
      })
      .map(hotel => {
        let score = 0;
        const reasons: string[] = [];
        const japaneseAppeal: string[] = [];

        // Distance scoring (closer is better)
        const avgDistance = cluster.activities.reduce((sum, activity) => {
          return sum + calculateDistance(
            hotel.coordinates.lat, hotel.coordinates.lng,
            activity.coordinates.lat, activity.coordinates.lng
          );
        }, 0) / cluster.activities.length;

        if (avgDistance <= 10) {
          score += 40;
          reasons.push("Excellent proximity to your selected activities");
        } else if (avgDistance <= 25) {
          score += 25;
          reasons.push("Good proximity to your selected activities");
        } else {
          score += 10;
          reasons.push("Reasonable distance to your activities");
        }

        // Style preference scoring
        if (preferenceType === 'luxury' && hotel.style === 'luxury') {
          score += 25;
          reasons.push("Matches your luxury preference");
        } else if (preferenceType === 'authentic' && hotel.style === 'boutique') {
          score += 20;
          reasons.push("Offers authentic local experience");
        }

        // Japanese features scoring
        if (hotel.japaneseFeatures.length > 0) {
          score += 20;
          japaneseAppeal.push(...hotel.japaneseFeatures);
          reasons.push("Features that appeal to Japanese travelers");
        }

        // Nearby activities bonus
        const nearbyActivityData = cluster.activities.map(activity => ({
          id: activity.id,
          title: activity.title,
          distance: calculateDistance(
            hotel.coordinates.lat, hotel.coordinates.lng,
            activity.coordinates.lat, activity.coordinates.lng
          )
        }));

        if (hotel.nearbyActivities.some(actId => cluster.activities.some(act => act.id === actId))) {
          score += 15;
          reasons.push("Strategically located for your itinerary");
        }

        return {
          type: 'hotel' as const,
          accommodation: hotel,
          score,
          reasons,
          nearbyActivities: nearbyActivityData,
          daysRecommended: cluster.daysNeeded,
          japaneseAppeal
        };
      });

    // Find best guesthouses for this cluster
    const guesthouseRecommendations = guestHouses
      .filter(guesthouse => {
        if (guesthouse.region === cluster.region) return true;
        
        const distance = calculateDistance(
          guesthouse.coordinates.lat, guesthouse.coordinates.lng,
          cluster.center.lat, cluster.center.lng
        );
        return distance <= 30; // Smaller radius for guesthouses
      })
      .map(guesthouse => {
        let score = 0;
        const reasons: string[] = [];
        const japaneseAppeal: string[] = [];

        // Distance scoring
        const avgDistance = cluster.activities.reduce((sum, activity) => {
          return sum + calculateDistance(
            guesthouse.coordinates.lat, guesthouse.coordinates.lng,
            activity.coordinates.lat, activity.coordinates.lng
          );
        }, 0) / cluster.activities.length;

        if (avgDistance <= 5) {
          score += 35;
          reasons.push("Walking distance to your activities");
        } else if (avgDistance <= 15) {
          score += 25;
          reasons.push("Very close to your selected activities");
        } else {
          score += 10;
        }

        // Authentic experience bonus
        if (preferenceType === 'authentic' || preferenceType === 'mixed') {
          score += 30;
          reasons.push("Authentic Tunisian cultural experience");
        }

        // Japanese cultural appeal
        if (guesthouse.japaneseFeatures.length > 0) {
          score += 25;
          japaneseAppeal.push(...guesthouse.japaneseFeatures);
          reasons.push("Cultural features appreciated by Japanese guests");
        }

        // Cultural experience bonus
        if (guesthouse.culturalExperience.length > 0) {
          score += 20;
          japaneseAppeal.push(...guesthouse.culturalExperience);
          reasons.push("Rich cultural immersion opportunities");
        }

        const nearbyActivityData = cluster.activities.map(activity => ({
          id: activity.id,
          title: activity.title,
          distance: calculateDistance(
            guesthouse.coordinates.lat, guesthouse.coordinates.lng,
            activity.coordinates.lat, activity.coordinates.lng
          )
        }));

        return {
          type: 'guesthouse' as const,
          accommodation: guesthouse,
          score,
          reasons,
          nearbyActivities: nearbyActivityData,
          daysRecommended: cluster.daysNeeded,
          japaneseAppeal
        };
      });

    // Combine and sort by score
    const clusterRecommendations = [...hotelRecommendations, ...guesthouseRecommendations]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 recommendations per cluster

    recommendations.push(...clusterRecommendations);
  });

  return recommendations.sort((a, b) => b.score - a.score);
}

// Main function to get recommendations
export function getSmartAccommodationRecommendations(
  selectedActivityIds: string[],
  totalDays: number,
  preferenceType: 'luxury' | 'authentic' | 'mixed' = 'mixed'
): {
  clusters: RegionCluster[];
  recommendations: AccommodationRecommendation[];
  summary: {
    totalRegions: number;
    recommendedHotels: number;
    recommendedGuesthouses: number;
    averageDistance: number;
  };
} {
  const clusters = clusterActivitiesByRegion(selectedActivityIds, totalDays);
  const recommendations = generateAccommodationRecommendations(clusters, totalDays, preferenceType);

  const summary = {
    totalRegions: clusters.length,
    recommendedHotels: recommendations.filter(r => r.type === 'hotel').length,
    recommendedGuesthouses: recommendations.filter(r => r.type === 'guesthouse').length,
    averageDistance: recommendations.reduce((sum, rec) => {
      const avgDist = rec.nearbyActivities.reduce((s, act) => s + act.distance, 0) / rec.nearbyActivities.length;
      return sum + avgDist;
    }, 0) / recommendations.length
  };

  return {
    clusters,
    recommendations,
    summary
  };
}
