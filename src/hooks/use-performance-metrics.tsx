
import { useState, useEffect } from "react";

export interface PerformanceMetrics {
  pageLoadTime: number;
  fcpTime: number;
  lcpTime: number;
  resourceLoadTimes: {
    js: number;
    css: number;
    img: number;
    other: number;
  };
  memoryUsage: number | null;
}

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    fcpTime: 0,
    lcpTime: 0,
    resourceLoadTimes: {
      js: 0,
      css: 0,
      img: 0,
      other: 0
    },
    memoryUsage: null
  });

  useEffect(() => {
    // Collect actual performance metrics from the browser
    const collectMetrics = () => {
      if (typeof window !== 'undefined' && window.performance) {
        // Get navigation timing data
        const perfEntries = performance.getEntriesByType('navigation');
        const navEntry = perfEntries.length > 0 ? 
          perfEntries[0] as PerformanceNavigationTiming : null;
        
        let pageLoadTime = 0;
        
        if (navEntry) {
          pageLoadTime = Math.round(navEntry.loadEventEnd - navEntry.startTime);
        } else {
          // Fallback if PerformanceNavigationTiming is not available
          pageLoadTime = Math.round(performance.now());
        }
        
        // Get resource timing data
        const resources = performance.getEntriesByType('resource');
        
        let jsTime = 0;
        let cssTime = 0;
        let imgTime = 0;
        let otherTime = 0;
        
        resources.forEach(resource => {
          const { duration, initiatorType } = resource as PerformanceResourceTiming;
          
          switch (initiatorType) {
            case 'script':
              jsTime += duration;
              break;
            case 'link':
            case 'css':
              cssTime += duration;
              break;
            case 'img':
              imgTime += duration;
              break;
            default:
              otherTime += duration;
          }
        });
        
        // Get First Contentful Paint metrics
        let fcpTime = 0;
        
        const paintMetrics = performance.getEntriesByType('paint');
        paintMetrics.forEach(metric => {
          const { name, startTime } = metric;
          if (name === 'first-contentful-paint') {
            fcpTime = Math.round(startTime);
          }
        });
        
        // Get LCP using PerformanceObserver API
        let lcpTime = 0;
        try {
          const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
          if (lcpEntries.length > 0) {
            const lastEntry = lcpEntries[lcpEntries.length - 1];
            lcpTime = Math.round((lastEntry as any).startTime);
          }
        } catch (e) {
          console.log('LCP measurement not supported');
        }
        
        // Memory usage if available (Chrome only)
        let memoryUsage = null;
        if (window.performance && (performance as any).memory) {
          memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
        }
        
        setMetrics({
          pageLoadTime: Math.round(pageLoadTime),
          fcpTime: Math.round(fcpTime),
          lcpTime: Math.round(lcpTime),
          resourceLoadTimes: {
            js: Math.round(jsTime),
            css: Math.round(cssTime),
            img: Math.round(imgTime),
            other: Math.round(otherTime)
          },
          memoryUsage
        });

        // Log performance metrics for debugging
        console.log('Collected real performance metrics:', {
          pageLoadTime: Math.round(pageLoadTime),
          fcpTime: Math.round(fcpTime),
          lcpTime: Math.round(lcpTime),
          jsTime: Math.round(jsTime),
          cssTime: Math.round(cssTime),
          imgTime: Math.round(imgTime),
          memoryUsage
        });
      }
    };

    // Use setTimeout to ensure we capture complete page load data
    setTimeout(collectMetrics, 0);
    
    // Set up observer for Largest Contentful Paint
    let lcpObserver: PerformanceObserver | null = null;
    
    try {
      lcpObserver = new PerformanceObserver((entries) => {
        const lcpEntry = entries.getEntries().at(-1);
        if (lcpEntry) {
          setMetrics(prev => ({
            ...prev,
            lcpTime: Math.round((lcpEntry as any).startTime)
          }));
        }
      });
      
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.log('LCP observation not supported');
    }
    
    return () => {
      if (lcpObserver) {
        try {
          lcpObserver.disconnect();
        } catch (e) {
          // Ignore errors when disconnecting
        }
      }
    };
  }, []);

  return metrics;
};
