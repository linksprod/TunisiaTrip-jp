export interface TimelineActivity {
  id: string;
  time: string; // Format HH:MM
  activity: string;
  location: string;
  duration: string; // Ex: "2h", "3h30"
  description?: string;
  transport?: string;
  distance?: string;
  type: 'breakfast' | 'activity' | 'lunch' | 'dinner' | 'departure' | 'arrival' | 'free-time' | 'custom';
  images: string[]; // URLs des images
}

export interface DetailedDayPlan {
  day: number;
  title: string;
  description?: string;
  timeline: TimelineActivity[];
  mainActivityId?: string; // Référence à l'activité principale du jour
  accommodationId?: string;
  accommodationType: 'none' | 'hotel' | 'guesthouse';
}

export interface PredefinedTripDetailed {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  target_airport_id?: string;
  price_estimate?: string;
  difficulty_level: string;
  theme?: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  detailed_days: DetailedDayPlan[];
  created_at: string;
  updated_at: string;
}