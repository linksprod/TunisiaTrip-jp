
import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated to prevent SSR mismatch
    setIsHydrated(true);
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Use matchMedia for better performance
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Return mobile-first during SSR/hydration
  return isHydrated ? isMobile : true;
}

export function useDeviceSize() {
  const [deviceSize, setDeviceSize] = useState({
    isMobile: true, // Default to mobile-first
    isTablet: false,
    isDesktop: false
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const checkDeviceSize = () => {
      const width = window.innerWidth;
      setDeviceSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    
    // Initial check
    checkDeviceSize();
    
    // Use multiple media queries for precise detection
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    
    const handleResize = () => checkDeviceSize();
    
    mobileQuery.addEventListener('change', handleResize);
    tabletQuery.addEventListener('change', handleResize);
    desktopQuery.addEventListener('change', handleResize);
    
    // Cleanup
    return () => {
      mobileQuery.removeEventListener('change', handleResize);
      tabletQuery.removeEventListener('change', handleResize);
      desktopQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return isHydrated ? deviceSize : { isMobile: true, isTablet: false, isDesktop: false };
}
