
import { 
  MapPin, 
  Calendar, 
  Image, 
  FileText, 
  Home, 
  Info, 
  Plane, 
  Building2, 
  Camera, 
  Waves, 
  Mountain, 
  Utensils, 
  Car, 
  Bed,
  Users,
  BookOpen,
  Clock,
  Activity,
  Globe
} from "lucide-react";

export const getResultIcon = (item: any) => {
  // Check context type first for better icons
  switch (item.contextType) {
    case 'city': return MapPin;
    case 'activity': return Activity;
    case 'service': return Building2;
    case 'section': return FileText;
    case 'page': return Globe;
  }

  // Check category
  switch (item.category) {
    case 'home': return Home;
    case 'about': return Info;
    case 'travel': return Plane;
    case 'atlantis': return Building2;
    case 'accommodation': return Bed;
    case 'blog': return BookOpen;
    case 'city': return MapPin;
    case 'activity': return Activity;
  }

  // Check section for more specific icons
  if (item.section) {
    switch (item.section) {
      case 'transportation': return Car;
      case 'beaches': return Waves;
      case 'desert': return Mountain;
      case 'entertainment': return Camera;
      case 'history': return Clock;
      case 'hotels': return Bed;
      case 'weather': return Calendar;
      case 'culture': return Users;
    }
  }

  // Check keywords for context-specific icons
  const title = item.title.toLowerCase();
  const keywords = item.keywords?.join(' ').toLowerCase() || '';
  const searchText = `${title} ${keywords}`;

  if (searchText.includes('beach') || searchText.includes('coast')) return Waves;
  if (searchText.includes('desert') || searchText.includes('sahara')) return Mountain;
  if (searchText.includes('star wars') || searchText.includes('filming')) return Camera;
  if (searchText.includes('food') || searchText.includes('restaurant')) return Utensils;
  if (searchText.includes('transport') || searchText.includes('taxi') || searchText.includes('bus')) return Car;
  if (searchText.includes('hotel') || searchText.includes('accommodation')) return Bed;
  if (searchText.includes('company') || searchText.includes('service')) return Users;
  if (searchText.includes('event') || searchText.includes('festival')) return Calendar;
  if (searchText.includes('weather') || searchText.includes('climate')) return Calendar;

  // Default icons by type
  switch (item.type) {
    case 'location': return MapPin;
    case 'event': return Calendar;
    case 'image': return Image;
    default: return FileText;
  }
};

export const getCategoryBadge = (category: string) => {
  const badges = {
    'home': 'Home',
    'about': 'About',
    'travel': 'Travel',
    'atlantis': 'Services',
    'accommodation': 'Hotels',
    'blog': 'Blog',
    'city': 'City',
    'activity': 'Activity'
  };
  return badges[category as keyof typeof badges] || category;
};

export const getCategoryColor = (category: string) => {
  const colors = {
    'home': 'bg-green-100 text-green-700',
    'about': 'bg-blue-100 text-blue-700',
    'travel': 'bg-purple-100 text-purple-700',
    'atlantis': 'bg-orange-100 text-orange-700',
    'accommodation': 'bg-pink-100 text-pink-700',
    'blog': 'bg-yellow-100 text-yellow-700',
    'city': 'bg-indigo-100 text-indigo-700',
    'activity': 'bg-emerald-100 text-emerald-700'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
};
