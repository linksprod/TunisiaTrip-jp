
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationTabs } from "./AtlantisNavigation";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface AtlantisSectionNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AtlantisSectionNavigation({ activeTab, onTabChange }: AtlantisSectionNavigationProps) {
  const { currentLanguage } = useTranslation();
  const currentIndex = navigationTabs.findIndex(tab => tab.value === activeTab);
  const prevTab = currentIndex > 0 ? navigationTabs[currentIndex - 1] : null;
  const nextTab = currentIndex < navigationTabs.length - 1 ? navigationTabs[currentIndex + 1] : null;

  if (!prevTab && !nextTab) return null;

  const handleTabClick = (e: React.MouseEvent, tabValue: string) => {
    e.preventDefault();
    e.stopPropagation();
    onTabChange(tabValue);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex justify-between mt-10">
      {prevTab ? (
        <Button
          variant="outline"
          className="text-blue-500 border-blue-500 gap-2"
          onClick={(e) => handleTabClick(e, prevTab.value)}
        >
          <ArrowLeft className="h-5 w-5" />
          <TranslateText text={prevTab.label} language={currentLanguage} />
        </Button>
      ) : (
        <div className="invisible">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            <TranslateText text="Previous" language={currentLanguage} />
          </Button>
        </div>
      )}

      {nextTab ? (
        <Button
          variant="outline"
          className="text-blue-500 border-blue-500 gap-2"
          onClick={(e) => handleTabClick(e, nextTab.value)}
        >
          <TranslateText text={nextTab.label} language={currentLanguage} />
          <ArrowRight className="h-5 w-5" />
        </Button>
      ) : (
        <div className="invisible">
          <Button variant="outline" className="gap-2">
            <TranslateText text="Next" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
