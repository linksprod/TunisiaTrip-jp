import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Define tag type for better type safety
export interface Tag {
  name: string;
  active: boolean;
  path: string;
}

// Extract tag data to make it reusable and easier to maintain
export const DEFAULT_TAGS: Tag[] = [
  { name: "Tunisia Tours", active: false, path: "/travel" },
  { name: "Weather in Tunisia", active: false, path: "/about#weather" },
  { name: "Top Tunisian Food", active: false, path: "/blog?category=food" },
  { name: "Hotel Booking", active: false, path: "/atlantis?section=services&scrollTo=hotels" },
  { name: "Transportation", active: false, path: "/travel?tab=departure&section=transportation" }
];

export const useTags = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Check if current location matches any tag path
  useEffect(() => {
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const currentHash = location.hash;
    
    // Check for direct path matches
    const matchingTag = DEFAULT_TAGS.find(tag => {
      const [tagPath, tagParams] = tag.path.split('?');
      const [basePath, tagHash] = tagPath.split('#');
      
      // Special case for transportation - only match when the section parameter is transportation
      if (tag.name === "Transportation") {
        if (currentPath === "/travel" && currentSearch.includes("section=transportation")) {
          return true;
        }
        return false;
      }
      
      // Special case for Hotel Booking - need to check both path and the search parameter
      if (tag.name === "Hotel Booking") {
        if (currentPath === "/atlantis" && currentSearch.includes("section=services")) {
          return true;
        }
        return false;
      }
      
      // For Tunisia Tours, ensure we don't match it when transportation is active
      if (tag.name === "Tunisia Tours") {
        // Don't match if the search includes transportation section
        if (currentPath === "/travel" && currentSearch.includes("section=transportation")) {
          return false;
        }
        // Match for the general travel path without specific sections
        if (currentPath === "/travel") {
          return true;
        }
        return false;
      }
      
      // Direct path match for simple routes
      if (tagPath === currentPath && !tagParams && !tagHash) {
        return true;
      }
      
      // Match with hash
      if (basePath === currentPath && tagHash && currentHash === `#${tagHash}`) {
        return true;
      }
      
      // Match with query parameters
      if (basePath === currentPath && tagParams && currentSearch.includes(tagParams)) {
        return true;
      }
      
      return false;
    });
    
    if (matchingTag) {
      setActiveTag(matchingTag.name);
    } else {
      setActiveTag(null);
    }
  }, [location]);

  // Helper function to handle section scrolling after navigation
  const handleSectionScroll = useCallback((tagName: string, section: string | null, scrollTo: string | null, hash: string | null) => {
    // Handle specific tag cases
    if (tagName === "Top Tunisian Food") {
      const foodCategorySection = document.querySelector(".grid.grid-cols-1.md\\:grid-cols-3.gap-6");
      if (foodCategorySection) {
        foodCategorySection.scrollIntoView({ behavior: 'smooth' });
        toast({
          title: "Food Category",
          description: "Showing top Tunisian food articles",
          duration: 2000
        });
      }
    } else if (tagName === "Hotel Booking") {
      // Wait to ensure services tab content is loaded
      setTimeout(() => {
        const hotelsSection = document.querySelector(".mt-16:has(h2)");
        if (hotelsSection) {
          hotelsSection.scrollIntoView({ behavior: 'smooth' });
          toast({
            title: "Hotels & Guest Houses",
            description: "Scrolled to Hotels & Guest Houses section",
            duration: 2000
          });
        }
      }, 300);
    } else if (tagName === "Transportation") {
      // Find the transportation section by its title or content
      setTimeout(() => {
        // First try to find by ID
        const transportSection = document.getElementById("transportation");
        if (transportSection) {
          transportSection.scrollIntoView({ behavior: 'smooth' });
          toast({
            title: "Transportation",
            description: "Scrolled to Transportation section",
            duration: 2000
          });
          return;
        }
        
        // Try to find the TransportationSection component by its unique class
        const transportComponent = document.querySelector(".max-w-\\[1585px\\].mx-auto.w-full.p-5.sm\\:p-\\[20px\\].bg-white.shadow-\\[0px_0px_0px_1\\.948px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\].rounded-\\[10px\\]");
        if (transportComponent) {
          transportComponent.scrollIntoView({ behavior: 'smooth' });
          toast({
            title: "Transportation",
            description: "Scrolled to Transportation section",
            duration: 2000
          });
          return;
        }
        
        // Try to find by heading text
        const headings = document.querySelectorAll('h2');
        for (const heading of headings) {
          if (heading.textContent && 
              (heading.textContent.includes('Means of Transportation') || 
               heading.textContent.includes('Transportation'))) {
            heading.scrollIntoView({ behavior: 'smooth' });
            toast({
              title: "Transportation",
              description: "Scrolled to Transportation section",
              duration: 2000
            });
            return;
          }
        }
      }, 500);
    } else if (scrollTo === "hotels") {
      // Special case for scrolling to hotels section
      setTimeout(() => {
        const hotelsSection = document.querySelector(".mt-16:has(h2)");
        if (hotelsSection) {
          hotelsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } else if (hash) {
      // Handle general hash navigation
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else if (section) {
      // Handle general section parameter
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // If no specific scroll target, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleTagClick = useCallback((tagName: string, path: string) => {
    setActiveTag(tagName);
    
    // Parse the path to determine navigation strategy
    const [baseRoute, paramString] = path.split('?');
    const [route, hash] = baseRoute.split('#');
    
    // Extract parameters
    const params = new URLSearchParams(paramString || "");
    const tab = params.get('tab');
    const section = params.get('section');
    const scrollTo = params.get('scrollTo');
    
    // Create fade overlay to prevent layout shifts during navigation
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.position = 'fixed';
    fadeOverlay.style.top = '0';
    fadeOverlay.style.left = '0';
    fadeOverlay.style.width = '100%';
    fadeOverlay.style.height = '100%';
    fadeOverlay.style.backgroundColor = 'white';
    fadeOverlay.style.opacity = '0.1';
    fadeOverlay.style.zIndex = '50';
    fadeOverlay.style.pointerEvents = 'none';
    document.body.appendChild(fadeOverlay);
    
    // Handle different navigation scenarios
    const currentLocation = location.pathname;
    
    // Special handling for Transportation tag
    if (tagName === "Transportation") {
      // If we're already on the travel page
      if (currentLocation === "/travel") {
        // Set the active tab to departure
        const tabChangeEvent = new CustomEvent('changeTab', { 
          detail: { tab: 'departure' }
        });
        window.dispatchEvent(tabChangeEvent);
        
        // Update URL to reflect departure section with transportation parameter
        window.history.pushState({}, '', '/travel?tab=departure&section=transportation');
        
        // Scroll to transportation section after a delay
        setTimeout(() => handleSectionScroll(tagName, "transportation", null, null), 500);
      } else {
        // Navigate to Travel page with departure tab and transportation section
        navigate('/travel?tab=departure&section=transportation');
        
        // After navigation completes, set active tab and scroll
        setTimeout(() => {
          const tabChangeEvent = new CustomEvent('changeTab', { 
            detail: { tab: 'departure' }
          });
          window.dispatchEvent(tabChangeEvent);
          
          // Scroll to transportation section
          setTimeout(() => handleSectionScroll(tagName, "transportation", null, null), 800);
        }, 600);
      }
    }
    // Special handling for Hotel Booking tag
    else if (tagName === "Hotel Booking") {
      // If we're already on the Atlantis page
      if (currentLocation === "/atlantis") {
        // Set the active tab to services
        const tabChangeEvent = new CustomEvent('changeTab', { 
          detail: { tab: 'services' }
        });
        window.dispatchEvent(tabChangeEvent);
        
        // Update URL to reflect services section
        window.history.pushState({}, '', '/atlantis?section=services');
        
        // Scroll to hotels section after a delay
        setTimeout(() => {
          const hotelsSection = document.querySelector(".mt-16:has(h2)");
          if (hotelsSection) {
            hotelsSection.scrollIntoView({ behavior: 'smooth' });
            toast({
              title: "Hotels & Guest Houses",
              description: "Scrolled to Hotels & Guest Houses section",
              duration: 2000
            });
          }
        }, 500);
      } else {
        // Navigate to Atlantis page with services section parameter
        navigate('/atlantis?section=services');
        
        // After navigation completes, set active tab and scroll to hotels section
        setTimeout(() => {
          const tabChangeEvent = new CustomEvent('changeTab', { 
            detail: { tab: 'services' }
          });
          window.dispatchEvent(tabChangeEvent);
          
          // Wait additional time for content to load and then scroll
          setTimeout(() => {
            const hotelsSection = document.querySelector(".mt-16:has(h2)");
            if (hotelsSection) {
              hotelsSection.scrollIntoView({ behavior: 'smooth' });
              toast({
                title: "Hotels & Guest Houses",
                description: "Scrolled to Hotels & Guest Houses section",
                duration: 2000
              });
            }
          }, 800);
        }, 600);
      }
    }
    // Handle other regular navigation cases
    else if (currentLocation === route && (tab || section || hash)) {
      // If there's a tab parameter, trigger tab change
      if (tab) {
        const tabChangeEvent = new CustomEvent('changeTab', { 
          detail: { tab: tab }
        });
        window.dispatchEvent(tabChangeEvent);
      }
      
      // Handle specific section scrolling
      setTimeout(() => {
        handleSectionScroll(tagName, section, scrollTo, hash);
      }, 300);
      
      // Update URL without navigation
      if (paramString) {
        window.history.pushState({}, '', `${route}?${paramString}`);
      } else if (hash) {
        window.history.pushState({}, '', `${route}#${hash}`);
      }
    } else {
      // Navigate to a different page
      navigate(path);
      
      // After navigation, handle scrolling with a longer delay
      setTimeout(() => {
        handleSectionScroll(tagName, section, scrollTo, hash);
      }, 800);
    }
    
    // Remove the overlay after a short delay
    setTimeout(() => {
      if (document.body.contains(fadeOverlay)) {
        document.body.removeChild(fadeOverlay);
      }
    }, 600);
  }, [location.pathname, navigate, handleSectionScroll]);

  return {
    tags: DEFAULT_TAGS,
    activeTag,
    handleTagClick
  };
};
