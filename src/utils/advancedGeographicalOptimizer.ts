import { Activity } from '../data/activities';

export interface OptimizedCluster {
  region: string;
  activities: Activity[];
  accommodations: any[];
  centerLat: number;
  centerLng: number;
  dailyDistance: number;
  order: number;
}

export interface SmartOptimizedRoute {
  clusters: OptimizedCluster[];
  totalDistance: number;
  dailyDistances: number[];
  reasoning: string;
  estimatedTravelTimes: string[];
}

// Enhanced distance calculation with real-world travel considerations
function calculateRealDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Apply road factor (roads are not straight lines)
  return R * c * 1.3; // 30% increase for actual road distances
}

// Enhanced region determination with sub-regions
function getEnhancedRegion(lat: number, lng: number): string {
  if (lat > 36.5) return 'north-coastal';
  if (lat > 35.5 && lat <= 36.5) return 'north-inland';
  if (lat > 34.5 && lat <= 35.5) return 'center-coastal';
  if (lat > 33.5 && lat <= 34.5) return 'center-inland';
  if (lat > 32.5 && lat <= 33.5) return 'south-oasis';
  return 'south-desert';
}

// Smart clustering that considers both distance and regional logic
function createSmartClusters(activities: Activity[], days: number, maxClusterDistance: number = 80): OptimizedCluster[] {
  if (activities.length === 0) return [];

  const clusters: OptimizedCluster[] = [];
  const used = new Set<string>();
  
  // Sort activities by latitude (north to south) for logical flow
  const sortedActivities = [...activities].sort((a, b) => b.coordinates.lat - a.coordinates.lat);
  
  const maxClusters = Math.max(1, days - 2); // Exclude arrival and departure days
  
  sortedActivities.forEach((activity, index) => {
    if (used.has(activity.id)) return;
    
    const cluster: OptimizedCluster = {
      region: getEnhancedRegion(activity.coordinates.lat, activity.coordinates.lng),
      activities: [activity],
      accommodations: [],
      centerLat: activity.coordinates.lat,
      centerLng: activity.coordinates.lng,
      dailyDistance: 0,
      order: clusters.length + 1
    };

    used.add(activity.id);

    // Find nearby activities for this cluster
    sortedActivities.forEach(otherActivity => {
      if (used.has(otherActivity.id) || clusters.length >= maxClusters) return;

      const distance = calculateRealDistance(
        cluster.centerLat,
        cluster.centerLng,
        otherActivity.coordinates.lat,
        otherActivity.coordinates.lng
      );

      // More restrictive clustering for better daily planning
      if (distance <= maxClusterDistance && cluster.activities.length < 3) {
        cluster.activities.push(otherActivity);
        used.add(otherActivity.id);
        
        // Recalculate cluster center
        const totalLat = cluster.activities.reduce((sum, act) => sum + act.coordinates.lat, 0);
        const totalLng = cluster.activities.reduce((sum, act) => sum + act.coordinates.lng, 0);
        cluster.centerLat = totalLat / cluster.activities.length;
        cluster.centerLng = totalLng / cluster.activities.length;
      }
    });

    // Calculate internal cluster distance
    let internalDistance = 0;
    for (let i = 0; i < cluster.activities.length - 1; i++) {
      const current = cluster.activities[i];
      const next = cluster.activities[i + 1];
      internalDistance += calculateRealDistance(
        current.coordinates.lat,
        current.coordinates.lng,
        next.coordinates.lat,
        next.coordinates.lng
      );
    }
    cluster.dailyDistance = Math.round(internalDistance);

    clusters.push(cluster);
  });

  return clusters;
}

// Assign accommodations to clusters based on proximity and logic
function assignAccommodationsSmartly(clusters: OptimizedCluster[], accommodations: any[]): void {
  accommodations.forEach(accommodation => {
    let bestCluster = clusters[0];
    let minDistance = Infinity;

    clusters.forEach(cluster => {
      const distance = calculateRealDistance(
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

    if (bestCluster && minDistance < 100) { // Only assign if reasonably close
      bestCluster.accommodations.push(accommodation);
    }
  });
}

// Optimize cluster order for minimal travel
function optimizeClusterOrder(clusters: OptimizedCluster[]): OptimizedCluster[] {
  if (clusters.length <= 1) return clusters;

  // Start from northernmost cluster (logical for arrival in Tunis)
  const sorted = [...clusters].sort((a, b) => b.centerLat - a.centerLat);
  const optimized = [sorted[0]];
  const remaining = sorted.slice(1);

  // Use nearest neighbor algorithm with regional preference
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    remaining.forEach((cluster, index) => {
      const distance = calculateRealDistance(
        current.centerLat,
        current.centerLng,
        cluster.centerLat,
        cluster.centerLng
      );

      // Prefer south-bound travel (bonus for southern clusters)
      const regionBonus = cluster.centerLat < current.centerLat ? 0.8 : 1.2;
      const adjustedDistance = distance * regionBonus;

      if (adjustedDistance < minDistance) {
        minDistance = adjustedDistance;
        nearestIndex = index;
      }
    });

    const nearestCluster = remaining[nearestIndex];
    nearestCluster.order = optimized.length + 1;
    optimized.push(nearestCluster);
    remaining.splice(nearestIndex, 1);
  }

  return optimized;
}

// Calculate estimated travel times
function calculateTravelTimes(clusters: OptimizedCluster[]): string[] {
  const times: string[] = [];
  
  for (let i = 0; i < clusters.length - 1; i++) {
    const current = clusters[i];
    const next = clusters[i + 1];
    const distance = calculateRealDistance(
      current.centerLat,
      current.centerLng,
      next.centerLat,
      next.centerLng
    );
    
    // Estimate travel time: 60 km/h average + stops
    const hours = Math.round((distance / 60) * 1.5 * 10) / 10;
    times.push(`${hours}h`);
  }
  
  return times;
}

export function optimizeSmartGeographicalRoute(
  activities: Activity[],
  accommodations: any[],
  days: number
): SmartOptimizedRoute {
  console.log('🚀 Advanced geographical optimization starting...');
  console.log(`Activities: ${activities.length}, Days: ${days}`);

  // Create intelligent clusters
  const clusters = createSmartClusters(activities, days);
  
  // Assign accommodations
  assignAccommodationsSmartly(clusters, accommodations);
  
  // Optimize travel order
  const optimizedClusters = optimizeClusterOrder(clusters);
  
  // Calculate distances and travel times
  let totalDistance = 0;
  const dailyDistances: number[] = [];
  
  for (let i = 0; i < optimizedClusters.length - 1; i++) {
    const current = optimizedClusters[i];
    const next = optimizedClusters[i + 1];
    const distance = calculateRealDistance(
      current.centerLat,
      current.centerLng,
      next.centerLat,
      next.centerLng
    );
    totalDistance += distance;
    dailyDistances.push(Math.round(distance));
  }

  // Add daily internal distances
  optimizedClusters.forEach(cluster => {
    dailyDistances.push(cluster.dailyDistance);
  });

  const travelTimes = calculateTravelTimes(optimizedClusters);
  
  const reasoning = `Smart route optimized for ${days} days: ${optimizedClusters.map(c => c.region).join(' → ')}. ` +
    `Total travel: ${Math.round(totalDistance)}km with ${optimizedClusters.length} regional clusters.`;

  console.log('✅ Optimization complete:', reasoning);

  return {
    clusters: optimizedClusters,
    totalDistance: Math.round(totalDistance),
    dailyDistances,
    reasoning,
    estimatedTravelTimes: travelTimes
  };
}