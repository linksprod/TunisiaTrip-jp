import { Activity } from '../data/activities';

export interface GeographicalCluster {
  region: string;
  activities: Activity[];
  accommodations: any[];
  centerLat: number;
  centerLng: number;
}

export interface OptimizedRoute {
  clusters: GeographicalCluster[];
  totalDistance: number;
  reasoning: string;
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Determine region based on GPS coordinates
function getRegionFromCoordinates(lat: number, lng: number): string {
  // Northern Tunisia (above 36.0°N)
  if (lat > 36.0) return 'north';
  
  // Southern Tunisia (below 34.0°N)
  if (lat < 34.0) return 'south';
  
  // Central Tunisia (between 34.0°N and 36.0°N)
  return 'center';
}

// Group activities by geographical proximity
function clusterActivitiesByProximity(activities: Activity[], maxDistance: number = 150): GeographicalCluster[] {
  const clusters: GeographicalCluster[] = [];
  const used = new Set<string>();

  activities.forEach(activity => {
    if (used.has(activity.id)) return;

    const cluster: GeographicalCluster = {
      region: getRegionFromCoordinates(activity.coordinates.lat, activity.coordinates.lng),
      activities: [activity],
      accommodations: [],
      centerLat: activity.coordinates.lat,
      centerLng: activity.coordinates.lng
    };

    used.add(activity.id);

    // Find nearby activities
    activities.forEach(otherActivity => {
      if (used.has(otherActivity.id)) return;

      const distance = calculateDistance(
        activity.coordinates.lat,
        activity.coordinates.lng,
        otherActivity.coordinates.lat,
        otherActivity.coordinates.lng
      );

      if (distance <= maxDistance) {
        cluster.activities.push(otherActivity);
        used.add(otherActivity.id);
        
        // Update cluster center
        const totalActivities = cluster.activities.length;
        cluster.centerLat = cluster.activities.reduce((sum, act) => sum + act.coordinates.lat, 0) / totalActivities;
        cluster.centerLng = cluster.activities.reduce((sum, act) => sum + act.coordinates.lng, 0) / totalActivities;
      }
    });

    clusters.push(cluster);
  });

  return clusters;
}

// Assign accommodations to clusters based on proximity
function assignAccommodationsToCluster(clusters: GeographicalCluster[], accommodations: any[]): void {
  accommodations.forEach(accommodation => {
    let bestCluster = clusters[0];
    let minDistance = Infinity;

    clusters.forEach(cluster => {
      const distance = calculateDistance(
        accommodation.coordinates.lat,
        accommodation.coordinates.lng,
        cluster.centerLat,
        cluster.centerLng
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestCluster = cluster;
      }
    });

    if (bestCluster) {
      bestCluster.accommodations.push(accommodation);
    }
  });
}

// Optimize route order to minimize travel distance
function optimizeRouteOrder(clusters: GeographicalCluster[]): GeographicalCluster[] {
  if (clusters.length <= 1) return clusters;

  // Start from northernmost cluster (closest to Tunis airport)
  const sorted = [...clusters].sort((a, b) => b.centerLat - a.centerLat);
  const optimized = [sorted[0]];
  const remaining = sorted.slice(1);

  // Greedy approach: always go to the nearest unvisited cluster
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    remaining.forEach((cluster, index) => {
      const distance = calculateDistance(
        current.centerLat,
        current.centerLng,
        cluster.centerLat,
        cluster.centerLng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimized;
}

export function optimizeGeographicalRoute(
  activities: Activity[],
  accommodations: any[]
): OptimizedRoute {
  console.log('Optimizing route for activities:', activities.map(a => a.name));
  console.log('Optimizing route for accommodations:', accommodations.map(a => a.name));

  // Create geographical clusters
  const clusters = clusterActivitiesByProximity(activities);
  
  // Assign accommodations to clusters
  assignAccommodationsToCluster(clusters, accommodations);
  
  // Optimize cluster order
  const optimizedClusters = optimizeRouteOrder(clusters);
  
  // Calculate total distance
  let totalDistance = 0;
  for (let i = 0; i < optimizedClusters.length - 1; i++) {
    const current = optimizedClusters[i];
    const next = optimizedClusters[i + 1];
    totalDistance += calculateDistance(
      current.centerLat,
      current.centerLng,
      next.centerLat,
      next.centerLng
    );
  }

  return {
    clusters: optimizedClusters,
    totalDistance: Math.round(totalDistance),
    reasoning: `Optimized route through ${optimizedClusters.length} geographical clusters: ${optimizedClusters.map(c => c.region).join(' → ')}`
  };
}
