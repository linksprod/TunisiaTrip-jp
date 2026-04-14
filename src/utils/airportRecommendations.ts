import { Activity } from '@/data/activities';

export interface AirportRecommendation {
  arrivalAirport: string;
  departureAirport: string;
  reasoning: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ActivityDistribution {
  north: number;
  center: number;
  south: number;
  totalActivities: number;
  primaryRegion: 'north' | 'center' | 'south';
  activityCenters: Array<{ lat: number; lng: number; region: string }>;
}

// Airport definitions with coordinates
const AIRPORTS = {
  'tunis-carthage': {
    id: 'tunis-carthage',
    name: 'Tunis-Carthage International Airport',
    code: 'TUN',
    lat: 36.851,
    lng: 10.227,
    region: 'north'
  },
  'djerba-zarzis': {
    id: 'djerba-zarzis', 
    name: 'Djerba-Zarzis International Airport',
    code: 'DJE',
    lat: 33.875,
    lng: 10.775,
    region: 'south'
  }
};

/**
 * Analyzes the geographical distribution of selected activities
 */
export function analyzeActivityDistribution(activities: Activity[]): ActivityDistribution {
  const distribution = { north: 0, center: 0, south: 0 };
  const activityCenters: Array<{ lat: number; lng: number; region: string }> = [];

  activities.forEach(activity => {
    const lat = activity.coordinates.lat;
    let region: 'north' | 'center' | 'south';

    // Determine region based on latitude
    if (lat > 36.0) {
      region = 'north';
      distribution.north++;
    } else if (lat < 34.0) {
      region = 'south';
      distribution.south++;
    } else {
      region = 'center';
      distribution.center++;
    }

    activityCenters.push({
      lat: activity.coordinates.lat,
      lng: activity.coordinates.lng,
      region
    });
  });

  // Determine primary region
  let primaryRegion: 'north' | 'center' | 'south' = 'center';
  const maxCount = Math.max(distribution.north, distribution.center, distribution.south);
  
  if (distribution.north === maxCount) {
    primaryRegion = 'north';
  } else if (distribution.south === maxCount) {
    primaryRegion = 'south';
  } else {
    primaryRegion = 'center';
  }

  return {
    ...distribution,
    totalActivities: activities.length,
    primaryRegion,
    activityCenters
  };
}

/**
 * Calculates geographical center of activities for each region
 */
function calculateRegionalCenters(activityCenters: Array<{ lat: number; lng: number; region: string }>) {
  const regions = ['north', 'center', 'south'];
  const centers: Record<string, { lat: number; lng: number; count: number }> = {};

  regions.forEach(region => {
    const regionActivities = activityCenters.filter(ac => ac.region === region);
    if (regionActivities.length > 0) {
      const avgLat = regionActivities.reduce((sum, ac) => sum + ac.lat, 0) / regionActivities.length;
      const avgLng = regionActivities.reduce((sum, ac) => sum + ac.lng, 0) / regionActivities.length;
      centers[region] = { lat: avgLat, lng: avgLng, count: regionActivities.length };
    }
  });

  return centers;
}

/**
 * Generates intelligent airport recommendations based on activity distribution
 */
export function generateAirportRecommendations(activities: Activity[]): AirportRecommendation {
  if (activities.length === 0) {
    return {
      arrivalAirport: 'tunis-carthage',
      departureAirport: 'tunis-carthage',
      reasoning: 'Tunis-Carthage is the main international airport with the most connections.',
      confidence: 'medium'
    };
  }

  const distribution = analyzeActivityDistribution(activities);
  const regionalCenters = calculateRegionalCenters(distribution.activityCenters);

  // Case 1: Activities only in the North (lat > 36°)
  if (distribution.north === distribution.totalActivities) {
    return {
      arrivalAirport: 'tunis-carthage',
      departureAirport: 'tunis-carthage',
      reasoning: `Your activities are located in northern Tunisia. For optimal airport selection, Tunis-Carthage Airport is ideal for exploring this region.`,
      confidence: 'high'
    };
  }

  // Case 2: Activities only in the South (lat < 34°)
  if (distribution.south === distribution.totalActivities) {
    return {
      arrivalAirport: 'djerba-zarzis',
      departureAirport: 'djerba-zarzis',
      reasoning: `Your activities are located in southern Tunisia. For your airport selection, Djerba-Zarzis Airport allows you to optimize your travel.`,
      confidence: 'high'
    };
  }

  // Case 3: Activities only in the Center
  if (distribution.center === distribution.totalActivities) {
    return {
      arrivalAirport: 'tunis-carthage',
      departureAirport: 'tunis-carthage',
      reasoning: `Your activities are located in central Tunisia. Regarding airport selection, Tunis-Carthage offers the best international connections and easy access to central Tunisia.`,
      confidence: 'high'
    };
  }

  // Case 4: Mixed distribution - North and South
  if (distribution.north > 0 && distribution.south > 0) {
    if (distribution.north >= distribution.south) {
      return {
        arrivalAirport: 'tunis-carthage',
        departureAirport: 'djerba-zarzis',
        reasoning: `Your activities are distributed between north (${distribution.north} activities) and south (${distribution.south} activities). For your airport selection, start with Tunis-Carthage and finish with Djerba-Zarzis for an optimized itinerary.`,
        confidence: 'high'
      };
    } else {
      return {
        arrivalAirport: 'djerba-zarzis',
        departureAirport: 'tunis-carthage',
        reasoning: `Your activities are mainly in the south (${distribution.south} activities) with some in the north (${distribution.north} activities). For your airport selection, start with Djerba-Zarzis and finish with Tunis-Carthage.`,
        confidence: 'high'
      };
    }
  }

  // Case 5: North and Center
  if (distribution.north > 0 && distribution.center > 0) {
    return {
      arrivalAirport: 'tunis-carthage',
      departureAirport: 'tunis-carthage',
      reasoning: `Your activities are in the north (${distribution.north}) and center (${distribution.center}). For your airport selection, Tunis-Carthage is perfectly positioned for these regions.`,
      confidence: 'high'
    };
  }

  // Case 6: Center and South
  if (distribution.center > 0 && distribution.south > 0) {
    if (distribution.center >= distribution.south) {
      return {
        arrivalAirport: 'tunis-carthage',
        departureAirport: 'djerba-zarzis',
        reasoning: `Your activities cover the center (${distribution.center}) and south (${distribution.south}). For your airport selection, arrive via Tunis-Carthage and depart from Djerba-Zarzis for a north-to-south journey.`,
        confidence: 'medium'
      };
    } else {
      return {
        arrivalAirport: 'djerba-zarzis',
        departureAirport: 'tunis-carthage',
        reasoning: `Your activities are mainly in the south (${distribution.south}) with visits in the center (${distribution.center}). For your airport selection, start with Djerba-Zarzis.`,
        confidence: 'medium'
      };
    }
  }

  // Default fallback
  return {
    arrivalAirport: 'tunis-carthage',
    departureAirport: 'tunis-carthage',
    reasoning: 'For your airport selection, Tunis-Carthage is recommended as the main airport with the best international connections.',
    confidence: 'medium'
  };
}

/**
 * Gets airport data by ID
 */
export function getAirportById(airportId: string) {
  return AIRPORTS[airportId as keyof typeof AIRPORTS] || null;
}

/**
 * Checks if an airport is recommended for a specific type
 */
export function isAirportRecommended(
  airportId: string, 
  type: 'arrival' | 'departure', 
  recommendation: AirportRecommendation
): boolean {
  if (type === 'arrival') {
    return recommendation.arrivalAirport === airportId;
  } else {
    return recommendation.departureAirport === airportId;
  }
}