
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AboutTunisiaHero } from "@/components/about/AboutTunisiaHero";
import { AboutTunisiaContent } from "@/components/about/AboutTunisiaContent";
import { PageSEO } from "@/components/common/PageSEO";

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
      <PageSEO
        title="チュニジアについて｜文化・歴史・地理・天気 | TunisiaTrip"
        description="チュニジアの文化、歴史、地理、言語、宗教を日本語で学びましょう。フェニキア文明から現代までの豊かな歴史、季節ごとの天気、アラビア語・フランス語の文化を包括的に紹介。"
        canonicalPath="/about-tunisia"
        keywords="チュニジア文化, チュニジア歴史, チュニジア地理, チュニジア天気, チュニジア言語, フェニキア, カルタゴ, 北アフリカ"
      />
      {/* Hero Section with Image Slider */}
      <AboutTunisiaHero />

      {/* Main Content Section */}
      <AboutTunisiaContent initialTab={activeTab} />
    </MainLayout>
  );
};

export default AboutTunisiaPage;
