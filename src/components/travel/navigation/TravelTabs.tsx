
import React, { useRef } from "react";
import { Book, CloudSun } from "lucide-react";
import { useDeviceSize } from "@/hooks/use-mobile";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const navigationTabs = [
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.4648 20.423L9.46484 18.323L5.50684 19.853C5.25084 19.9484 5.01318 19.9207 4.79384 19.77C4.57451 19.6194 4.46484 19.4074 4.46484 19.134V6.90403C4.46484 6.72536 4.50818 6.56236 4.59484 6.41503C4.68151 6.26769 4.80751 6.16536 4.97284 6.10803L9.46484 4.57703L15.4648 6.67703L19.4228 5.14703C19.6788 5.05169 19.9165 5.06969 20.1358 5.20103C20.3552 5.33236 20.4648 5.52836 20.4648 5.78903V18.173C20.4648 18.3644 20.4118 18.5304 20.3058 18.671C20.2005 18.8124 20.0585 18.9117 19.8798 18.969L15.4648 20.423ZM14.9648 19.203V7.50303L9.96484 5.75803V17.458L14.9648 19.203ZM15.9648 19.203L19.4648 18.05V6.20003L15.9648 7.50403V19.203ZM5.46484 18.8L8.96484 17.458V5.75803L5.46484 6.95003V18.8Z" fill="currentColor"/>
      </svg>
    ), 
    label: "Atlantis Itinerary & Tours", 
    value: "itinerary", 
    active: true 
  },
  { 
    icon: (
      <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.5 24H3.5C2.948 24 2.5 23.552 2.5 23V19C2.5 18.448 2.948 18 3.5 18H5.5V10C5.5 9.448 5.948 9 6.5 9H9.5V7C9.5 6.448 9.948 6 10.5 6H14.5C15.052 6 15.5 6.448 15.5 7V9H18.5C19.052 9 19.5 9.448 19.5 10V18H21.5C22.052 18 22.5 18.448 22.5 19V23C22.5 23.552 22.052 24 21.5 24Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M17.5 6.5C17.5 8.5 15.5 10 12.5 10C9.5 10 7.5 8.5 7.5 6.5C7.5 4 9.5 1 12.5 1C15.5 1 17.5 4 17.5 6.5Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M7.5 18V14H11.5V18H7.5Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M13.5 18V14H17.5V18H13.5Z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ), 
    label: "Pre-Departure Must Know", 
    value: "departure", 
    active: false 
  },
  { 
    icon: <CloudSun className="w-5 h-5" />, 
    label: "Activities in Tunisia", 
    value: "activities", 
    active: false 
  },
];

interface TravelTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollToTab: (index: number) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export function TravelTabs({ 
  activeTab, 
  setActiveTab, 
  scrollToTab, 
  onTouchStart, 
  onTouchMove, 
  onTouchEnd 
}: TravelTabsProps) {
  const { isMobile } = useDeviceSize();
  const { currentLanguage } = useTranslation();
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={tabsContainerRef}
      className="flex w-full border-b border-gray-200 overflow-x-auto hide-scrollbar"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {navigationTabs.map((tab, index) => (
        <div 
          key={index} 
          role="tab"
          className={`flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-2 cursor-pointer transition-colors ${
            tab.value === activeTab ? "bg-blue-500 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
          }`}
          onClick={() => {
            setActiveTab(tab.value);
            scrollToTab(index);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className={`text-lg mb-1 ${tab.value === activeTab ? "text-white" : "text-gray-800"}`}>{tab.icon}</span>
          <span className={`text-xs ${isMobile ? 'text-center line-clamp-1' : ''}`}>
            <TranslateText text={tab.label} language={currentLanguage} />
          </span>
        </div>
      ))}
    </div>
  );
}
