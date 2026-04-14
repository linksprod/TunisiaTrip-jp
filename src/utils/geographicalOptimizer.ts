
export interface GeographicalRoute {
  region: string;
  order: number;
  activities: string[];
  accommodations: string[];
}

export interface OptimizedRoute {
  routes: GeographicalRoute[];
  totalDistance: number;
  reasoning: string;
}

// Geographical regions of Tunisia with their main cities/areas
const TUNISIA_REGIONS = {
  north: ['tunis', 'carthage', 'sidi-bou-said', 'bizerte', 'tabarka', 'ain-draham'],
  center: ['kairouan', 'sousse', 'monastir', 'mahdia', 'el-jem', 'sfax'],
  south: ['tozeur', 'douz', 'tataouine', 'matmata', 'chenini', 'ksar-ghilane', 'chott-el-jerid']
};

export function getActivityRegion(activityId: string): string {
  const activityLower = activityId.toLowerCase();
  
  for (const [region, cities] of Object.entries(TUNISIA_REGIONS)) {
    if (cities.some(city => activityLower.includes(city))) {
      return region;
    }
  }
  
  // Default to center if no specific region found
  return 'center';
}

export function optimizeGeographicalRoute(
  activities: string[],
  hotels: string[],
  guestHouses: string[],
  days: number
): OptimizedRoute {
  // Group activities by region
  const regionGroups: Record<string, string[]> = {
    north: [],
    center: [],
    south: []
  };

  activities.forEach(activity => {
    const region = getActivityRegion(activity);
    regionGroups[region].push(activity);
  });

  // Group accommodations by region
  const accommodationGroups: Record<string, string[]> = {
    north: [],
    center: [],
    south: []
  };

  [...hotels, ...guestHouses].forEach(accommodation => {
    const region = getActivityRegion(accommodation);
    accommodationGroups[region].push(accommodation);
  });

  // Create optimized route: North -> Center -> South
  const routes: GeographicalRoute[] = [];
  let order = 1;

  ['north', 'center', 'south'].forEach(region => {
    if (regionGroups[region].length > 0 || accommodationGroups[region].length > 0) {
      routes.push({
        region,
        order: order++,
        activities: regionGroups[region],
        accommodations: accommodationGroups[region]
      });
    }
  });

  return {
    routes,
    totalDistance: routes.length * 200, // Estimated km between regions
    reasoning: `Optimized route follows geographical flow: ${routes.map(r => r.region).join(' → ')}`
  };
}
