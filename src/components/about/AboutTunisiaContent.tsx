
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";
import { ContentNavigation } from "./navigation/ContentNavigation";
import { ContentBreadcrumb } from "./navigation/ContentBreadcrumb";
import { OverviewCards } from "./OverviewCards";
import { CultureArticles } from "./CultureArticles";
import { CountryLocationContent } from "./CountryLocationContent";
import { TunisianWeatherContent } from "./TunisianWeatherContent";
import { SpokenLanguagesContent } from "./SpokenLanguagesContent";
import { ReligionsContent } from "./ReligionsContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface AboutTunisiaContentProps {
  initialTab?: string;
}

export function AboutTunisiaContent({ initialTab = "overview" }: AboutTunisiaContentProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { currentLanguage } = useTranslation();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      scrollToTab(getTabIndex(initialTab));
    }
  }, [initialTab]);

  // Helper function to determine column class based on device size
  const getCardColumnClass = () => {
    return isMobile 
      ? "grid-cols-1" 
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };

  const getTabIndex = (tab: string): number => {
    const navigationTabs = ['overview', 'location', 'weather', 'languages', 'religions'];
    return navigationTabs.indexOf(tab);
  };

  const scrollToTab = (index: number) => {
    if (tabsContainerRef.current) {
      const tabElements = tabsContainerRef.current.querySelectorAll('[role="tab"]');
      if (tabElements && tabElements[index]) {
        tabElements[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = getTabIndex(activeTab);
      if (isLeftSwipe && currentIndex < 4) {
        setActiveTab(['overview', 'location', 'weather', 'languages', 'religions'][currentIndex + 1]);
        scrollToTab(currentIndex + 1);
      } else if (isRightSwipe && currentIndex > 0) {
        setActiveTab(['overview', 'location', 'weather', 'languages', 'religions'][currentIndex - 1]);
        scrollToTab(currentIndex - 1);
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const getPageTitle = () => {
    if (currentLanguage === "JP") {
      switch(activeTab) {
        case 'overview': return 'チュニジアについての一般知識';
        case 'location': return '世界地図でチュニジアを特定する';
        case 'weather': return 'チュニジアの地中海性気候';
        case 'languages': return 'チュニジアの言語の多様性';
        default: return 'チュニジアの宗教';
      }
    }

    const titles: Record<string, string> = {
      'overview': 'General Knowledge About Tunisia',
      'location': 'Identify Tunisia in a World Map',
      'weather': 'Mediterranean Climate in Tunisia',
      'languages': 'Linguistic Diversity in Tunisia',
      'religions': 'Religions in Tunisia'
    };

    return titles[activeTab] || titles.overview;
  };

  return (
    <div className="w-full bg-white font-inter">
      <div 
        ref={tabsContainerRef}
        className="flex w-full border-b border-gray-200 overflow-x-auto hide-scrollbar"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ContentNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          scrollToTab={scrollToTab}
        />
      </div>
      
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <ContentBreadcrumb activeTab={activeTab} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            <TranslateText text={getPageTitle()} language={currentLanguage} />
          </h1>
          <button 
            onClick={() => navigate("/blog")}
            className="hidden md:flex items-center gap-3 text-blue-500 mt-4 md:mt-0 cursor-pointer hover:text-blue-600 transition-colors"
          >
            <span>
              <TranslateText text="Find More Articles" language={currentLanguage} />
            </span>
            <svg width="17" height="17" viewBox="0 0 17 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.57295 9.25285L5.06504 7.76217L13.1921 15.8864C13.3231 16.0166 13.4271 16.1714 13.498 16.3419C13.5689 16.5124 13.6055 16.6953 13.6055 16.88C13.6055 17.0646 13.5689 17.2475 13.498 17.418C13.4271 17.5885 13.3231 17.7433 13.1921 17.8735L5.06504 26.002L3.57436 24.5113L11.2022 16.8821L3.57295 9.25285Z" fill="#347EFF"/>
            </svg>
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <OverviewCards getCardColumnClass={getCardColumnClass} />
        )}
        {activeTab === 'location' && (
          <CountryLocationContent />
        )}
        {activeTab === 'weather' && (
          <TunisianWeatherContent />
        )}
        {activeTab === 'languages' && (
          <SpokenLanguagesContent />
        )}
        {activeTab === 'religions' && (
          <ReligionsContent />
        )}
      </div>
    </div>
  );
}
