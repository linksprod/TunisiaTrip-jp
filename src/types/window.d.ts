
declare global {
  interface Window {
    updateOGImage?: () => void;
    googleMapsLoaded?: boolean;
  }
}

export {};
