import { calculateDistance } from './geographicalHelpers';

export interface ActivityWithDistance {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
  isSelected: boolean;
  isSuggestion: boolean;
}

export interface DayPlan {
  day: number;
  activities: ActivityWithDistance[];
  totalDistance: number;
  estimatedDuration: string;
  isValid: boolean;
  warnings: string[];
}

// Check if two activities can be planned on the same day (within 60km)
export function canActivitiesBeOnSameDay(
  activity1: ActivityWithDistance,
  activity2: ActivityWithDistance
): boolean {
  if (!activity1.coordinates || !activity2.coordinates) return false;
  
  const distance = calculateDistance(
    activity1.coordinates.lat,
    activity1.coordinates.lng,
    activity2.coordinates.lat,
    activity2.coordinates.lng
  );
  
  return distance <= 60;
}

// Get activities within 60km radius of a given activity
export function getActivitiesWithinRadius(
  centerActivity: ActivityWithDistance,
  allActivities: ActivityWithDistance[],
  radiusKm: number = 60
): ActivityWithDistance[] {
  if (!centerActivity.coordinates) return [];
  
  return allActivities
    .filter(activity => {
      if (!activity.coordinates || activity.id === centerActivity.id) return false;
      
      const distance = calculateDistance(
        centerActivity.coordinates!.lat,
        centerActivity.coordinates!.lng,
        activity.coordinates.lat,
        activity.coordinates.lng
      );
      
      return distance <= radiusKm;
    })
    .map(activity => ({
      ...activity,
      distance: activity.coordinates ? calculateDistance(
        centerActivity.coordinates!.lat,
        centerActivity.coordinates!.lng,
        activity.coordinates.lat,
        activity.coordinates.lng
      ) : undefined
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

// Get suggested activities (unselected) within radius
export function getSuggestedActivitiesForDay(
  assignedActivities: ActivityWithDistance[],
  allActivities: ActivityWithDistance[],
  selectedActivityIds: string[]
): ActivityWithDistance[] {
  if (assignedActivities.length === 0) return [];
  
  const suggestions = new Set<ActivityWithDistance>();
  
  assignedActivities.forEach(assignedActivity => {
    const nearbyActivities = getActivitiesWithinRadius(assignedActivity, allActivities, 60);
    
    nearbyActivities.forEach(activity => {
      // Only suggest unselected activities
      if (!selectedActivityIds.includes(activity.id)) {
        suggestions.add({
          ...activity,
          isSuggestion: true,
          isSelected: false
        });
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
}

// Filter available activities based on already assigned activities for a day
export function getFilteredActivitiesForDay(
  day: number,
  activitiesByDay: Record<number, string[]>,
  allActivities: ActivityWithDistance[],
  selectedActivityIds: string[]
): ActivityWithDistance[] {
  const assignedToDay = activitiesByDay[day] || [];
  const allAssignedIds = Object.values(activitiesByDay).flat();
  
  // Get activities assigned to this day
  const assignedActivities = allActivities.filter(activity => 
    assignedToDay.includes(activity.id)
  );
  
  if (assignedActivities.length === 0) {
    // No activities assigned yet - show all unassigned selected activities
    return allActivities.filter(activity => 
      selectedActivityIds.includes(activity.id) && 
      !allAssignedIds.includes(activity.id)
    ).map(activity => ({
      ...activity,
      isSelected: true,
      isSuggestion: false
    }));
  }
  
  // Filter activities within 60km of assigned activities
  const availableActivities = allActivities.filter(activity => 
    selectedActivityIds.includes(activity.id) && 
    !allAssignedIds.includes(activity.id)
  );
  
  const filteredActivities = availableActivities.filter(activity => {
    return assignedActivities.some(assignedActivity => 
      canActivitiesBeOnSameDay(activity, assignedActivity)
    );
  });
  
  return filteredActivities.map(activity => ({
    ...activity,
    isSelected: true,
    isSuggestion: false
  }));
}

// Calculate total distance for activities in a day
export function calculateDayTotalDistance(activities: ActivityWithDistance[]): number {
  if (activities.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < activities.length - 1; i++) {
    const current = activities[i];
    const next = activities[i + 1];
    
    if (current.coordinates && next.coordinates) {
      totalDistance += calculateDistance(
        current.coordinates.lat,
        current.coordinates.lng,
        next.coordinates.lat,
        next.coordinates.lng
      );
    }
  }
  
  return Math.round(totalDistance);
}

// Validate a day plan
export function validateDayPlan(activities: ActivityWithDistance[]): { isValid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  if (activities.length === 0) {
    return { isValid: true, warnings: [] };
  }
  
  if (activities.length === 1) {
    return { isValid: true, warnings: [] };
  }
  
  // Check distances between all activities
  for (let i = 0; i < activities.length - 1; i++) {
    for (let j = i + 1; j < activities.length; j++) {
      const activity1 = activities[i];
      const activity2 = activities[j];
      
      if (activity1.coordinates && activity2.coordinates) {
        const distance = calculateDistance(
          activity1.coordinates.lat,
          activity1.coordinates.lng,
          activity2.coordinates.lat,
          activity2.coordinates.lng
        );
        
        if (distance > 60) {
          warnings.push(`${activity1.name} and ${activity2.name} are ${Math.round(distance)}km apart (>60km limit)`);
        }
      }
    }
  }
  
  const totalDistance = calculateDayTotalDistance(activities);
  if (totalDistance > 200) {
    warnings.push(`Total distance (${totalDistance}km) may be too long for one day`);
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}

// Create a day plan
export function createDayPlan(
  day: number,
  activities: ActivityWithDistance[]
): DayPlan {
  const validation = validateDayPlan(activities);
  const totalDistance = calculateDayTotalDistance(activities);
  const estimatedDuration = `${activities.length * 3}h ${activities.length * 30}m`;
  
  return {
    day,
    activities,
    totalDistance,
    estimatedDuration,
    isValid: validation.isValid,
    warnings: validation.warnings
  };
}

// Auto-distribute activities across days respecting 60km constraint
export function autoDistributeActivities(
  selectedActivityIds: string[],
  allActivities: ActivityWithDistance[],
  numberOfDays: number
): Record<number, string[]> {
  if (selectedActivityIds.length === 0 || numberOfDays === 0) {
    return {};
  }
  
  const selectedActivities = allActivities.filter(activity => 
    selectedActivityIds.includes(activity.id)
  );
  
  const result: Record<number, string[]> = {};
  const unassigned = [...selectedActivities];
  
  for (let day = 1; day <= numberOfDays && unassigned.length > 0; day++) {
    result[day] = [];
    
    // Take the first unassigned activity
    const firstActivity = unassigned.shift();
    if (firstActivity) {
      result[day].push(firstActivity.id);
      
      // Find compatible activities (within 60km)
      const compatibleIndices: number[] = [];
      unassigned.forEach((activity, index) => {
        if (canActivitiesBeOnSameDay(firstActivity, activity)) {
          compatibleIndices.unshift(index); // Add in reverse order for safe removal
        }
      });
      
      // Add up to 2-3 compatible activities per day
      const maxActivitiesPerDay = Math.min(3, compatibleIndices.length);
      for (let i = 0; i < maxActivitiesPerDay; i++) {
        const activityIndex = compatibleIndices[i];
        const activity = unassigned[activityIndex];
        result[day].push(activity.id);
        unassigned.splice(activityIndex, 1);
      }
    }
  }
  
  return result;
}