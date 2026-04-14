
import React, { useState, useEffect } from "react";
import { TravelTabs, navigationTabs } from "./navigation/TravelTabs";
import { useTranslation } from "@/hooks/use-translation";
import { BreadcrumbNav } from "./navigation/BreadcrumbNav";
import { PageHeader } from "./navigation/PageHeader";
import { TabContentRenderer } from "./navigation/TabContentRenderer";

interface TravelContentProps {
  initialTab?: string;
}

export function TravelContent({ initialTab = "itinerary" }: TravelContentProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [contentReady, setContentReady] = useState(false);
  const { currentLanguage, updateKey } = useTranslation();
  
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      
      const timer = setTimeout(() => {
        const tabIndex = navigationTabs.findIndex(tab => tab.value === initialTab);
        if (tabIndex !== -1) {
          scrollToTab(tabIndex);
        }
        setContentReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [initialTab]);

  const getActiveTabName = () => {
    const activeTabData = navigationTabs.find(tab => tab.value === activeTab);
    return activeTabData ? activeTabData.label : "旅行情報";
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
      const currentIndex = navigationTabs.findIndex(tab => tab.value === activeTab);
      
      if (isLeftSwipe && currentIndex < navigationTabs.length - 1) {
        setActiveTab(navigationTabs[currentIndex + 1].value);
        scrollToTab(currentIndex + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (isRightSwipe && currentIndex > 0) {
        setActiveTab(navigationTabs[currentIndex - 1].value);
        scrollToTab(currentIndex - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const scrollToTab = (index: number) => {
    const tabElements = document.querySelectorAll('[role="tab"]');
    if (tabElements && tabElements[index]) {
      tabElements[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  };

  return (
    <div className="w-full bg-white font-inter">
      <h1 className="sr-only">チュニジア旅行情報 - アクティビティ、観光スポット、さらに探索する</h1>
      <TravelTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scrollToTab={scrollToTab}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        <BreadcrumbNav activeTabName={getActiveTabName()} />
        <PageHeader activeTab={activeTab} />
        <TabContentRenderer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          scrollToTab={scrollToTab}
          currentLanguage={currentLanguage}
          key={`tab-content-${activeTab}-${updateKey}`} // Add key to force re-render on language change
        />
        
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;400;600;700&display=swap" 
          rel="stylesheet"
        />
      </div>
    </div>
  );
}
