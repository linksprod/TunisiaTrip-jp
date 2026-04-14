
import { activities } from "@/components/start-my-trip/activities-data";
import { DayItinerary } from "@/components/travel/itinerary/types";
import { toast } from "sonner";

// Color palette for days
const dayColors = [
  "bg-blue-500", "bg-green-500", "bg-amber-500", "bg-rose-500", 
  "bg-purple-500", "bg-teal-500", "bg-orange-500", "bg-cyan-500",
  "bg-indigo-500", "bg-emerald-500", "bg-violet-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-lime-500"
];

// Map activity tags to related locations
const activityTagsToLocations: Record<string, string[]> = {
  "Adventure": ["Douz", "Tozeur", "Matmata"],
  "Nature": ["Tabarka", "Ain Draham", "National Parks"],
  "Cultural": ["Tunis", "Sidi Bou Said", "Kairouan"],
  "Historical": ["Carthage", "El Jem", "Dougga"],
  "UNESCO Site": ["Carthage", "El Jem", "Kairouan"],
  "Architecture": ["Tunis", "Kairouan", "Sidi Bou Said"],
  "Shopping": ["Tunis Medina", "Souks", "Hammamet"],
  "Film Tourism": ["Matmata", "Ksar Hadada", "Ksar Ouled Soltane"]
};

/**
 * Generates a complete itinerary based on selected days and activities
 */
export function generateItinerary(
  selectedDays: number, 
  selectedActivities: string[]
): Promise<DayItinerary[]> {
  return new Promise((resolve) => {
    // Simulating an API call with a slight delay
    setTimeout(() => {
      try {
        // Get selected activity objects
        const chosenActivities = activities.filter(activity => 
          selectedActivities.includes(activity.id.toString())
        );
        
        if (chosenActivities.length === 0) {
          toast.error("Please select at least one activity to generate an itinerary.");
          resolve([]);
          return;
        }

        // Gather unique tags from selected activities to determine regions to visit
        const uniqueActivityTags = Array.from(
          new Set(chosenActivities.flatMap(activity => activity.tags))
        );
        
        // Determine regions to visit based on activity tags
        const regionsToVisit = Array.from(
          new Set(
            uniqueActivityTags.flatMap(tag => 
              activityTagsToLocations[tag] || []
            )
          )
        );
        
        // Create optimized day plan based on geographical proximity
        const itinerary: DayItinerary[] = [];
        
        // Always start from Tunis (capital/arrival point)
        let currentRegion = "Tunis";
        
        // Create first day - arrival
        itinerary.push({
          day: 1,
          title: "Arrival in Tunis",
          activities: [
            "Airport transfer to hotel",
            "Check-in and welcome briefing",
            "Evening orientation walk",
            "Welcome dinner at a local restaurant"
          ],
          description: "Begin your journey in Tunisia's vibrant capital. After settling in, enjoy a gentle orientation walk and your first taste of Tunisian cuisine.",
          additionalInfo: "Tunis",
          image: "/lovable-uploads/31fa750b-9618-4556-9aa2-c9b62cf3b480.png",
          color: dayColors[0]
        });
        
        // Generate main itinerary days
        let remainingDays = selectedDays - 2; // Excluding arrival and departure days
        let dayCount = 2;
        
        // Sort activities by location proximity (simplified version)
        const sortedActivities = [...chosenActivities].sort((a, b) => {
          // Get location names from activity descriptions
          const locA = a.location || "";
          const locB = b.location || "";
          
          // Prioritize activities near the current region
          const distanceA = locA.includes(currentRegion) ? 0 : 1;
          const distanceB = locB.includes(currentRegion) ? 0 : 1;
          
          return distanceA - distanceB;
        });
        
        // Group activities by location to create efficient day plans
        const locationGroups: Record<string, typeof chosenActivities> = {};
        
        sortedActivities.forEach(activity => {
          const location = activity.location?.split(',')[0] || "Tunis";
          if (!locationGroups[location]) {
            locationGroups[location] = [];
          }
          locationGroups[location].push(activity);
        });
        
        // Create days based on grouped activities and available days
        const locations = Object.keys(locationGroups);
        
        let i = 0;
        while (remainingDays > 0 && i < locations.length) {
          const location = locations[i];
          const activitiesInLocation = locationGroups[location] || [];
          
          // Calculate how many days to spend in this location (1-2 based on number of activities)
          const daysNeeded = Math.min(
            Math.ceil(activitiesInLocation.length / 3),
            remainingDays,
            2 // Maximum 2 days per location
          );
          
          for (let j = 0; j < daysNeeded; j++) {
            // Get activities for this day (max 3-4 activities per day)
            const startIdx = j * 3;
            const endIdx = Math.min(startIdx + 3, activitiesInLocation.length);
            const dayActivities = activitiesInLocation
              .slice(startIdx, endIdx)
              .map(a => a.title);
            
            // Add some standard activities
            dayActivities.push(
              j === 0 ? 
                "Morning guided tour with local expert" : 
                "Free time to explore local attractions"
            );
            
            if (dayActivities.length < 4) {
              dayActivities.push("Dinner at recommended local restaurant");
            }
            
            // Add the day to itinerary
            itinerary.push({
              day: dayCount,
              title: `Discover ${location}`,
              activities: dayActivities,
              description: `Explore the wonders of ${location} and immerse yourself in the local culture and attractions.`,
              additionalInfo: location,
              image: activitiesInLocation[0]?.image || "/lovable-uploads/544fbe08-526c-4053-86eb-98b41edea4c8.png",
              color: dayColors[(dayCount - 1) % dayColors.length]
            });
            
            dayCount++;
            remainingDays--;
          }
          
          i++;
        }
        
        // Fill any remaining days with flexible activities
        while (remainingDays > 0) {
          itinerary.push({
            day: dayCount,
            title: "Flexible Exploration Day",
            activities: [
              "Optional excursions of your choice",
              "Relaxation time",
              "Shopping for souvenirs",
              "Experience local cuisine"
            ],
            description: "A free day to explore at your own pace, revisit favorite spots, or discover hidden gems not on the standard tourist trail.",
            additionalInfo: "Your choice",
            image: "/lovable-uploads/544fbe08-526c-4053-86eb-98b41edea4c8.png", // Use an existing image
            color: dayColors[(dayCount - 1) % dayColors.length]
          });
          
          dayCount++;
          remainingDays--;
        }
        
        // Add last day - departure
        itinerary.push({
          day: dayCount,
          title: "Departure Day",
          activities: [
            "Breakfast at hotel",
            "Last-minute shopping (time permitting)",
            "Airport transfer",
            "Departure assistance"
          ],
          description: "Time to say goodbye to beautiful Tunisia. Depending on your flight time, you might have a few hours for last-minute shopping or relaxation.",
          additionalInfo: "Tunis",
          image: "/lovable-uploads/4de6ef16-ca24-431b-899d-e5c7cf11c73c.png",
          color: dayColors[(dayCount - 1) % dayColors.length]
        });
        
        resolve(itinerary);
      } catch (error) {
        console.error("Error generating itinerary:", error);
        toast.error("Failed to generate itinerary. Please try again.");
        resolve([]);
      }
    }, 1500); // Simulated delay for AI processing
  });
}
