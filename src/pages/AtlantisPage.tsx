
import React, { useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AtlantisHero } from "@/components/atlantis/AtlantisHero";
import { AtlantisContent } from "@/components/atlantis/AtlantisContent";
import { useLocation, useSearchParams } from "react-router-dom";

const AtlantisPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Listen for tab change events from the TagBar
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const { tab, section, message } = event.detail;
      
      if (tab) {
        console.log("Tab change event received:", tab);
        // Update section parameter in URL without causing a page reload
        setSearchParams(params => {
          params.set('section', tab);
          
          // Add message parameter if provided
          if (message) {
            params.set('message', encodeURIComponent(message));
          } else if (params.has('message')) {
            params.delete('message');
          }
          
          return params;
        }, { replace: true });
      }
    };

    // Add event listener for custom tab change events
    window.addEventListener('changeTab', handleTabChange as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, [setSearchParams]);

  return (
    <MainLayout showTagBar={true}>
      <AtlantisHero />
      <AtlantisContent />
    </MainLayout>
  );
};

export default AtlantisPage;
