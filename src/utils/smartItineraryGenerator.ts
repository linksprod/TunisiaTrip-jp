
import { EnhancedDayItinerary, ScheduleItem, AccommodationDetails } from '../components/travel/itinerary/enhancedTypes';
import { Activity } from '../data/activities';
import { getSelectedActivities, getAllSelectedAccommodations } from './dataAccess';
import { optimizeGeographicalRoute } from './improvedGeographicalOptimizer';
import { getCulturalTips } from './culturalGuide';
import { getTunisAccommodation, getAccommodationForActivities } from './geographicalMatching';

// Helper function to convert accommodation data to AccommodationDetails
function convertToAccommodationDetails(accommodation: any): AccommodationDetails {
  return {
    id: accommodation.id,
    name: accommodation.name,
    type: accommodation.style ? 'hotel' : 'guesthouse',
    image: accommodation.image,
    description: accommodation.description || `${accommodation.name} in ${accommodation.location}`,
    amenities: accommodation.amenities || [],
    breakfast: accommodation.breakfast !== undefined ? accommodation.breakfast : true,
    location: accommodation.location,
    coordinates: accommodation.coordinates
  };
}

// Function to create a schedule item
function createScheduleItem(
  time: string,
  activity: string,
  location: string,
  duration: string,
  type: ScheduleItem['type'],
  distance?: string,
  transport?: string,
  image?: string
): ScheduleItem {
  return {
    time,
    activity,
    location,
    duration,
    type,
    ...(distance && { distance }),
    ...(transport && { transport }),
    ...(image && { image })
  };
}

// Distribute activities across days with intelligent geographical accommodation assignment
function distributeActivitiesAcrossDays(
  activities: Activity[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[],
  days: number
): Array<{ activities: Activity[]; accommodation: any | null }> {
  console.log('Distributing activities across', days, 'days with geographical matching');

  const optimizedRoute = optimizeGeographicalRoute(activities, []);
  console.log('Optimized route clusters:', optimizedRoute.clusters.length);

  const dailyPlan: Array<{ activities: Activity[]; accommodation: any | null }> = [];
  const availableDays = Math.max(1, days - 2);
  let activityIndex = 0;

  for (let day = 1; day <= days; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === days;
    const isSecondToLastDay = day === days - 1;

    let dayActivities: Activity[] = [];
    let dayAccommodation: any | null = null;

    if (isFirstDay) {
      // First day: arrival in Tunis
      dayActivities = [];
      dayAccommodation = getTunisAccommodation(selectedHotelIds, selectedGuestHouseIds);
    } else if (isLastDay) {
      // Last day: departure from Tunis
      dayActivities = [];
      dayAccommodation = getTunisAccommodation(selectedHotelIds, selectedGuestHouseIds);
    } else if (isSecondToLastDay) {
      // Second to last day: return to Tunis
      dayActivities = [];
      dayAccommodation = getTunisAccommodation(selectedHotelIds, selectedGuestHouseIds);
    } else {
      // Regular days with activities
      const activitiesPerDay = Math.ceil(activities.length / availableDays);
      const endIndex = Math.min(activityIndex + activitiesPerDay, activities.length);
      
      dayActivities = activities.slice(activityIndex, endIndex);
      activityIndex = endIndex;

      if (dayActivities.length > 0) {
        dayAccommodation = getAccommodationForActivities(
          dayActivities,
          selectedHotelIds,
          selectedGuestHouseIds
        );
      }
    }

    dailyPlan.push({
      activities: dayActivities,
      accommodation: dayAccommodation
    });
  }

  return dailyPlan;
}

export async function generateSmartItinerary(
  days: number,
  selectedActivityIds: string[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[]
): Promise<EnhancedDayItinerary[]> {
  console.log('=== Smart Itinerary Generation ===');
  console.log('Days:', days);
  console.log('Selected activity IDs:', selectedActivityIds);
  console.log('Selected hotel IDs:', selectedHotelIds);
  console.log('Selected guest house IDs:', selectedGuestHouseIds);

  const selectedActivities = getSelectedActivities(selectedActivityIds);
  const selectedAccommodations = getAllSelectedAccommodations(selectedHotelIds, selectedGuestHouseIds);

  console.log('Retrieved activities:', selectedActivities.map(a => a.name));
  console.log('Retrieved accommodations:', selectedAccommodations.map(a => a.name));

  const dailyPlan = distributeActivitiesAcrossDays(
    selectedActivities, 
    selectedHotelIds, 
    selectedGuestHouseIds, 
    days
  );

  const itinerary: EnhancedDayItinerary[] = [];
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'];

  for (let day = 1; day <= days; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === days;
    const isSecondToLastDay = day === days - 1;
    const dayPlan = dailyPlan[day - 1];

    const currentRegion = dayPlan.activities.length > 0 
      ? (dayPlan.activities[0].coordinates.lat > 36 ? 'north' : 
         dayPlan.activities[0].coordinates.lat < 34 ? 'south' : 'center')
      : 'center';

    const culturalTips = getCulturalTips(currentRegion);
    const accommodation = dayPlan.accommodation ? convertToAccommodationDetails(dayPlan.accommodation) : null;

    const schedule: ScheduleItem[] = [];

    if (isFirstDay) {
      schedule.push(
        createScheduleItem('09:00', 'Arrival at Tunis-Carthage Airport', 'Tunis-Carthage Airport', '1 hour', 'arrival'),
        createScheduleItem('10:30', 'Transfer to hotel and check-in', accommodation?.name || 'Hotel in Tunis', '1.5 hours', 'activity', '35km', 'taxi'),
        createScheduleItem('12:30', 'Welcome lunch', 'Local restaurant', '1.5 hours', 'lunch'),
        createScheduleItem('14:30', 'Rest and orientation', accommodation?.name || 'Hotel', '2 hours', 'free-time'),
        createScheduleItem('16:30', 'Guided walk in Tunis Medina', 'Tunis Medina', '2.5 hours', 'activity', '5km', 'taxi'),
        createScheduleItem('19:30', 'Traditional dinner', 'Restaurant in Medina', '2 hours', 'dinner')
      );
    } else if (isLastDay) {
      schedule.push(
        createScheduleItem('08:00', 'Breakfast and check-out', accommodation?.name || 'Hotel', '1 hour', 'breakfast'),
        createScheduleItem('09:30', 'Last-minute shopping', 'Local market', '2 hours', 'activity'),
        createScheduleItem('12:00', 'Farewell lunch', 'Airport restaurant', '1 hour', 'lunch'),
        createScheduleItem('14:00', 'Transfer to airport', 'Tunis-Carthage Airport', '1 hour', 'departure', '35km', 'taxi'),
        createScheduleItem('16:00', 'Departure', 'Tunis-Carthage Airport', '2 hours', 'departure')
      );
    } else if (isSecondToLastDay) {
      schedule.push(
        createScheduleItem('08:00', 'Breakfast', accommodation?.name || 'Hotel', '1 hour', 'breakfast'),
        createScheduleItem('09:30', 'Return to Tunis', 'Tunis', '3 hours', 'activity', '150km', 'bus'),
        createScheduleItem('13:00', 'Lunch in Tunis', 'Local restaurant', '1.5 hours', 'lunch'),
        createScheduleItem('15:00', 'Check-in at hotel', accommodation?.name || 'Hotel in Tunis', '1 hour', 'activity'),
        createScheduleItem('16:30', 'Free time for shopping', 'Tunis center', '2.5 hours', 'free-time'),
        createScheduleItem('19:30', 'Farewell dinner', 'Restaurant in Tunis', '2 hours', 'dinner')
      );
    } else {
      schedule.push(
        createScheduleItem('08:00', 'Breakfast', accommodation?.name || 'Hotel', '1 hour', 'breakfast')
      );

      dayPlan.activities.forEach((activity, index) => {
        const startTime = index === 0 ? '09:30' : '15:00';
        const duration = index === 0 ? '3 hours' : '2.5 hours';
        
        schedule.push(
          createScheduleItem(startTime, activity.name, activity.location, duration, 'activity', '45km', 'bus', activity.image)
        );

        if (index === 0) {
          schedule.push(
            createScheduleItem('13:00', 'Lunch', `Restaurant near ${activity.location}`, '1.5 hours', 'lunch')
          );
        }
      });

      if (dayPlan.activities.length === 1) {
        schedule.push(
          createScheduleItem('15:00', 'Free time', 'Local area', '2.5 hours', 'free-time')
        );
      }

      schedule.push(
        createScheduleItem('18:30', 'Return to accommodation', accommodation?.name || 'Hotel', '1 hour', 'activity', '25km', 'taxi'),
        createScheduleItem('20:00', 'Dinner', 'Local restaurant', '2 hours', 'dinner')
      );
    }

    let dayImage = accommodation?.image || '/lovable-uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png';
    
    if (dayPlan.activities.length > 0) {
      dayImage = dayPlan.activities[0].image;
    }

    const dayItinerary: EnhancedDayItinerary = {
      day,
      title: isFirstDay 
        ? 'Arrival in Tunisia - Welcome to Tunis' 
        : isLastDay 
        ? 'Departure Day - Safe Travels' 
        : isSecondToLastDay
        ? 'Return to Tunis - Preparation for departure'
        : dayPlan.activities.length > 0
        ? `Day ${day} - ${dayPlan.activities.map(a => a.name).join(' & ')}`
        : `Day ${day} - Exploring Tunisia`,
      description: isFirstDay
        ? 'Welcome to Tunisia! Your journey begins in the historic capital.'
        : isLastDay
        ? 'Time to say goodbye to beautiful Tunisia.'
        : isSecondToLastDay
        ? 'Return to Tunis for your final night before departure.'
        : dayPlan.activities.length > 0
        ? `Today, you will discover: ${dayPlan.activities.map(a => a.name).join(', ')}`
        : `Discover the wonders of Tunisia.`,
      color: colors[(day - 1) % colors.length],
      schedule,
      accommodation,
      culturalTips: culturalTips.map(tip => tip.tip).slice(0, 3),
      weatherAlternatives: [
        'Indoor cultural sites and museums available',
        'Covered markets and traditional hammams',
        'Local cooking classes and craft workshops'
      ],
      totalDistance: Math.floor(Math.random() * 50) + 30,
      additionalInfo: isFirstDay 
        ? 'All international flights arrive at Tunis-Carthage Airport'
        : `Optimized activities for the region`,
      image: dayImage
    };

    itinerary.push(dayItinerary);
  }

  console.log('Generated smart itinerary:', itinerary.map(day => ({ day: day.day, title: day.title })));
  return itinerary;
}
