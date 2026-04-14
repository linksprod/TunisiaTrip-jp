
import { useDeviceSize } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";

interface ContentNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollToTab: (index: number) => void;
}

export function ContentNavigation({ activeTab, setActiveTab, scrollToTab }: ContentNavigationProps) {
  const { isMobile } = useDeviceSize();
  const { currentLanguage } = useTranslation();

  const navigationTabs = [
    { icon: "📖", label: "Overview & Culture", value: "overview" },
    { icon: "📍", label: "Country Location", value: "location" },
    { icon: "🌤️", label: "Tunisian Weather", value: "weather" },
    { icon: "💬", label: "Spoken Languages", value: "languages" },
    { icon: "🕌", label: "Practiced Religions", value: "religions" }
  ];

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
    <div className="flex w-full border-b border-gray-200">
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
            <TranslateText text={getTabLabel(tab.label)} language={currentLanguage} />
          </span>
        </div>
      ))}
    </div>
  );
}
