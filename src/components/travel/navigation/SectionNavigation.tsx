
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationTabs } from "./TravelTabs";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface SectionNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollToTab: (index: number) => void;
}

export function SectionNavigation({ activeTab, setActiveTab, scrollToTab }: SectionNavigationProps) {
  const currentIndex = navigationTabs.findIndex(tab => tab.value === activeTab);
  const prevTab = currentIndex > 0 ? navigationTabs[currentIndex - 1] : null;
  const nextTab = currentIndex < navigationTabs.length - 1 ? navigationTabs[currentIndex + 1] : null;
  const { currentLanguage } = useTranslation();

  if (!prevTab && !nextTab) return null;

  return (
    <div className="flex justify-between mt-10">
      {prevTab ? (
        <Button
          variant="outline"
          className="text-blue-500 border-blue-500 gap-2"
          onClick={() => {
            setActiveTab(prevTab.value);
            scrollToTab(navigationTabs.findIndex(tab => tab.value === prevTab.value));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
          onClick={() => {
            setActiveTab(nextTab.value);
            scrollToTab(navigationTabs.findIndex(tab => tab.value === nextTab.value));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
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
