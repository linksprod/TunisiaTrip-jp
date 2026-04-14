
export interface City {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  position: { lat: number; lng: number };
  type?: 'activity' | 'hotel' | 'guesthouse' | 'airport';
  price?: string;
  rating?: number;
  isSelected?: boolean;
  code?: string;
  isArrival?: boolean;
  isDeparture?: boolean;
}

export interface MapState {
  map: google.maps.Map | null;
  markers: google.maps.Marker[];
  polyline: google.maps.Polyline | null;
}

// Extending Google Maps types to support attaching data to markers
declare global {
  namespace google.maps {
    interface Marker {
      set(key: string, value: any): void;
      get(key: string): any;
    }
  }
}
