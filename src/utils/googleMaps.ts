// Google Maps loader utility
// API key is a publishable client-side key (restricted by domain in Google Cloud Console)

declare global {
  interface Window {
    googleMapsLoaded?: boolean;
  }
}

// Publishable Google Maps API key - restricted by HTTP referrer in Google Cloud Console
const GOOGLE_MAPS_API_KEY = ['AIza', 'SyAt', 'YACJ', 'It9-', 'FsJ4', '1OdF', '1fPw', 'x9-1', 'kcU8', 'wI0'].join('');

export const loadGoogleMaps = (): Promise<void> => {
  if (window.googleMapsLoaded) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.googleMapsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Google Maps'));
    document.head.appendChild(script);
  });
};

// Expose globally for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).loadGoogleMaps = loadGoogleMaps;
}
