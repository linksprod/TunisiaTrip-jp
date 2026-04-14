
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutTunisiaHero } from "@/components/about/AboutTunisiaHero";
import { AboutTunisiaContent } from "@/components/about/AboutTunisiaContent";

const AboutTunisiaPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check URL hash for direct tab access
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'location', 'weather', 'languages', 'religions'].includes(hash)) {
      setActiveTab(hash);
    }

    // Listen for tab change events
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);

    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, []);

  return (
    <MainLayout showTagBar={true}>
      {/* Hero Section with Image Slider */}
      <AboutTunisiaHero />
      
      {/* Main Content Section */}
      <AboutTunisiaContent initialTab={activeTab} />
    </MainLayout>
  );
};

export default AboutTunisiaPage;
