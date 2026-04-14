
import React, { useEffect } from 'react';

// Component to handle resource loading optimization
export const ResourceOptimizer: React.FC = () => {
  useEffect(() => {
    // Function to load non-critical CSS
    const loadDeferredStyles = () => {
      const styleLinks = [
        // Add any non-critical CSS that should be loaded after initial render
      ];
      
      styleLinks.forEach(href => {
        if (!href) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.setAttribute('media', 'print');
        link.setAttribute('onload', "this.media='all'");
        document.head.appendChild(link);
      });
    };
    
    // Function to handle third-party scripts with optimized loading
    const loadDeferredScripts = () => {
      // Any third-party scripts that aren't critical for initial render
      const scriptUrls: Array<{url: string, async?: boolean, defer?: boolean, strategy?: 'afterInteractive' | 'lazyOnload'}> = [
        // Add any non-critical scripts here
      ];
      
      scriptUrls.forEach(scriptData => {
        if (!scriptData.url) return;
        
        const script = document.createElement('script');
        script.src = scriptData.url;
        
        // Apply loading strategy
        if (scriptData.async) script.async = true;
        if (scriptData.defer) script.defer = true;
        
        // Use appropriate loading strategy
        if (scriptData.strategy === 'lazyOnload') {
          // Load after everything else
          window.addEventListener('load', () => {
            document.body.appendChild(script);
          });
        } else {
          // Default: load after interactive
          document.body.appendChild(script);
        }
      });
    };
    
    // Track and report performance metrics
    const reportPerformanceMetrics = () => {
      if ('PerformanceObserver' in window) {
        // Create performance observer for LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime, 'ms');
          // Here you would send this to your analytics
        });
        
        // Create performance observer for FCP
        const fcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const firstEntry = entries[0];
          console.log('FCP:', firstEntry.startTime, 'ms');
          // Here you would send this to your analytics
        });
        
        // Observe LCP
        lcpObserver.observe({ 
          type: 'largest-contentful-paint', 
          buffered: true 
        });
        
        // Observe FCP
        fcpObserver.observe({ 
          type: 'paint', 
          buffered: true 
        });
        
        return () => {
          lcpObserver.disconnect();
          fcpObserver.disconnect();
        };
      }
    };
    
    // Cache the loading animation globally so it's immediately available for page transitions
    const cacheLoadingAnimation = () => {
      const loadingGif = new Image();
      loadingGif.src = "https://i.imgur.com/5YtDgG9.gif";
      // Mark as a high priority resource
      loadingGif.fetchPriority = "high";
    };
    
    // Immediately cache the loading animation
    cacheLoadingAnimation();
    
    // Use requestIdleCallback or setTimeout to defer non-critical work
    if ('requestIdleCallback' in window) {
      // @ts-ignore - TypeScript may not recognize requestIdleCallback
      window.requestIdleCallback(() => {
        loadDeferredStyles();
        loadDeferredScripts();
        reportPerformanceMetrics();
      }, { timeout: 5000 });
    } else {
      setTimeout(() => {
        loadDeferredStyles();
        loadDeferredScripts();
        reportPerformanceMetrics();
      }, 2000);
    }
    
    // Clear unused event listeners
    return () => {
      // Any cleanup needed
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
};

export default ResourceOptimizer;
