
import React from "react";
import { Book, MapPin, CloudSun, MessageSquare, Building } from "lucide-react";
import { useDeviceSize } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

export interface NavigationTab {
  icon: React.ReactNode;
  label: string;
  value: string;
  active: boolean;
}

export const navigationTabs: NavigationTab[] = [
  { icon: <Book className="w-5 h-5" />, label: "Overview & Culture", value: "overview", active: true },
  { icon: <MapPin className="w-5 h-5" />, label: "Country Location", value: "location", active: false },
  { icon: <CloudSun className="w-5 h-5" />, label: "Tunisian Weather", value: "weather", active: false },
  { icon: <MessageSquare className="w-5 h-5" />, label: "Spoken Languages", value: "languages", active: false },
  { icon: <Building className="w-5 h-5" />, label: "Practiced Religions", value: "religions", active: false },
];

interface AboutTunisiaNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollToTab: (index: number) => void;
}

export function AboutTunisiaNav({ activeTab, setActiveTab, scrollToTab }: AboutTunisiaNavProps) {
  const { isMobile } = useDeviceSize();
  const { currentLanguage } = useTranslation();
  
  const getTabLabel = (label: string) => {
    if (currentLanguage !== "JP") return label;
    
    const translations: Record<string, string> = {
      "Overview & Culture": "概要と文化",
      "Country Location": "国の位置",
      "Tunisian Weather": "チュニジアの天気",
      "Spoken Languages": "使用言語",
      "Practiced Religions": "宗教"
    };
    
    return translations[label] || label;
  };
  
  return (
    <>
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
          }}
        >
          <span className="text-lg mb-1">{tab.icon}</span>
          <span className={`text-xs ${isMobile ? 'text-center line-clamp-1' : ''}`}>
            {getTabLabel(tab.label)}
          </span>
        </div>
      ))}
    </>
  );
}
