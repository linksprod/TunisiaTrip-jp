
import React from "react";
import { Building2, MessageSquare, Users, Server, Handshake, Mail } from "lucide-react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const navigationTabs = [
  { 
    icon: <Building2 className="w-5 h-5" />,
    label: "Atlantis",
    value: "atlantis",
    japaneseLabel: "アトランティス"
  },
  { 
    icon: <MessageSquare className="w-5 h-5" />,
    label: "Message from CEO", 
    value: "ceo",
    japaneseLabel: "CEOからのメッセージ"
  },
  { 
    icon: <Users className="w-5 h-5" />,
    label: "Team Members", 
    value: "team",
    japaneseLabel: "チームメンバー"
  },
  { 
    icon: <Server className="w-5 h-5" />,
    label: "Atlantis Services", 
    value: "services",
    japaneseLabel: "アトランティスサービス"
  },
  { 
    icon: <Handshake className="w-5 h-5" />,
    label: "Our Partners", 
    value: "partners",
    japaneseLabel: "私たちのパートナー"
  },
  { 
    icon: <Mail className="w-5 h-5" />,
    label: "Contact & Inquiry", 
    value: "contact",
    japaneseLabel: "連絡先とお問い合わせ"
  },
];

interface AtlantisNavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function AtlantisNavigation({ activeTab, onTabChange }: AtlantisNavigationProps) {
  const { currentLanguage } = useTranslation();
  
  const handleTabClick = (e: React.MouseEvent, value: string) => {
    // Prevent default browser navigation
    e.preventDefault();
    // Stop event propagation
    e.stopPropagation();
    // Call the parent's onTabChange function
    onTabChange(value);
  };
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex w-full overflow-x-auto hide-scrollbar">
        {navigationTabs.map((tab, index) => (
          <div 
            key={index} 
            role="tab"
            className={`flex-1 min-w-[120px] flex flex-col items-center justify-center py-3 px-2 cursor-pointer transition-colors ${
              tab.value === activeTab ? "bg-blue-500 text-white" : "bg-white text-gray-800 hover:bg-gray-50"
            }`}
            onClick={(e) => handleTabClick(e, tab.value)}
          >
            <span className="text-lg mb-1">{tab.icon}</span>
            <span className="text-xs text-center line-clamp-1">
              <TranslateText text={tab.label} language={currentLanguage} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
