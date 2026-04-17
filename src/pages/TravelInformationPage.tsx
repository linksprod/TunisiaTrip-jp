import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { TravelHero } from "@/components/travel/TravelHero";
import { TravelContent } from "@/components/travel/TravelContent";
import { useLocation, useSearchParams } from "react-router-dom";
import { PageSEO } from "@/components/common/PageSEO";

const TravelInformationPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("itinerary");
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    // Immediately set page as ready to reduce perceived loading time
    setPageReady(true);

    // Check for section parameter first (higher priority)
    const section = searchParams.get('section');
    const tab = searchParams.get('tab');
    const modeIndex = searchParams.get('mode');

    // If we have a tab parameter, use it
    if (tab && ['itinerary', 'departure', 'activities', 'hotels', 'transportation'].includes(tab)) {
      setActiveTab(tab);
    }
    // Otherwise check URL hash for direct tab access
    else {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['itinerary', 'departure', 'activities', 'hotels', 'transportation'].includes(hash)) {
        setActiveTab(hash);
      }
    }

    // Handle scrolling to specific sections after a short delay to ensure content is loaded
    if (section) {
      setTimeout(() => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });

          // If we have a transportation section with mode index, select that transport mode
          if (section === 'transportation' && modeIndex) {
            const transportModeIndex = parseInt(modeIndex);
            if (!isNaN(transportModeIndex) && transportModeIndex >= 1 && transportModeIndex <= 6) {
              // Find the transport mode button and click it (0-indexed array, but 1-indexed parameter)
              setTimeout(() => {
                const transportModeButtons = document.querySelectorAll('.grid.grid-cols-3.sm\\:grid-cols-6 > div');
                if (transportModeButtons && transportModeButtons.length >= transportModeIndex) {
                  (transportModeButtons[transportModeIndex - 1] as HTMLElement).click();
                }
              }, 500);
            }
          }
        } else {
          // Try finding by other means if ID doesn't exist
          const headings = document.querySelectorAll('h2, h3');
          for (const heading of headings) {
            if (heading.textContent?.toLowerCase().includes(section.toLowerCase())) {
              heading.scrollIntoView({ behavior: 'smooth' });
              break;
            }
          }
        }
      }, 800);
    }

    // Listen for tab change events
    const handleTabChange = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);

        // Update URL with new tab parameter
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('tab', event.detail.tab);
        if (event.detail.section) {
          newParams.set('section', event.detail.section);
        }
        if (event.detail.message) {
          newParams.set('mode', event.detail.message);
        }
        window.history.replaceState(null, '', `${location.pathname}?${newParams.toString()}`);
      }
    };

    window.addEventListener('changeTab', handleTabChange as EventListener);

    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, [searchParams, location.pathname]);

  return (
    <MainLayout showTagBar={true}>
      <PageSEO
        title="チュニジア旅行情報｜旅程・アクティビティ・ホテル・交通 | TunisiaTrip"
        description="チュニジア音旅行に役立つ実用情報。カスタム旅程プラン、サハラ砂漠・ビーチなどのアクティビティ、ホテル・ゲストハウス予約、タクシー・バス・鉄道などの交通手段を包抬紹介。"
        canonicalPath="/travel-information"
        keywords="チュニジア旅程, チュニジアアクティビティ, チュニジアホテル, チュニジア交通, サハラ砂漠ツアー, チュニジアゲストハウス, チュニジア出発情報"
      />
      <div className={`transition-opacity duration-200 ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
        <TravelHero />
        <TravelContent initialTab={activeTab} />
      </div>
    </MainLayout>
  );
};

export default TravelInformationPage;
