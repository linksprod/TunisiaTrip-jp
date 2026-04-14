
import React, { lazy, Suspense } from "react";
import { SectionNavigation } from "./SectionNavigation";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { ItineraryContent } from "../ItineraryContent";

// Change from dynamic import to regular import for ItineraryContent
const DepartureContent = lazy(() => import("../DepartureContent").then(module => ({ default: module.DepartureContent })));
const ActivitiesContent = lazy(() => import("../ActivitiesContent").then(module => ({ default: module.ActivitiesContent })));

const ContentLoader = () => (
  <div className="py-8 animate-pulse space-y-4">
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="h-32 bg-gray-200 rounded mb-4"></div>
    <div className="h-32 bg-gray-200 rounded mb-4"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

interface TabContentRendererProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollToTab: (index: number) => void;
  currentLanguage: string;
}

export function TabContentRenderer({ 
  activeTab, 
  setActiveTab, 
  scrollToTab,
  currentLanguage
}: TabContentRendererProps) {
  return (
    <Suspense fallback={<ContentLoader />}>
      {activeTab === 'itinerary' && (
        <>
          <h2 className="sr-only">チュニジア旅行のアクティビティとイチネラリー - さらに探索する</h2>
          <ItineraryContent />
          <SectionNavigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            scrollToTab={scrollToTab}
          />
        </>
      )}
      {activeTab === 'departure' && (
        <>
          <h2 className="sr-only">チュニジア旅行情報 - 晴れ時々曇りの気候を楽しむ旅</h2>
          <DepartureContent />
        </>
      )}
      {activeTab === 'activities' && (
        <>
          <h2 className="sr-only">チュニジアのアクティビティ - もっと詳しく知る</h2>
          <ActivitiesContent />
        </>
      )}
      {!['itinerary', 'departure', 'activities'].includes(activeTab) && (
        <div className="py-8 flex flex-col items-center justify-center text-gray-600">
          <h2 className="text-lg mb-8">
            <TranslateText 
              text={`Content for ${activeTab} will be available soon.`} 
              language={currentLanguage} 
            />
          </h2>
        </div>
      )}
    </Suspense>
  );
}
