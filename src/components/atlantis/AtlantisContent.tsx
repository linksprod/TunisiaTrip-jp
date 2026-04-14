
import React, { useEffect, useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "../translation/TranslateText";
import { MessageFromCeoContent } from "./MessageFromCeoContent";
import { TeamMembersContent } from "./TeamMembersContent";
import { AtlantisServicesContent } from "./AtlantisServicesContent";
import { HotelsServicesContent } from "./HotelsServicesContent";
import { GuestHousesContent } from "./GuestHousesContent";
import { PartnersContent } from "./PartnersContent";
import { ContactForm } from "./ContactForm";
import { AtlantisNavigation, navigationTabs } from "./AtlantisNavigation";
import { AboutAtlantisContent } from "./AboutAtlantisContent";
import { AtlantisSectionNavigation } from "./AtlantisSectionNavigation";
import { toast } from "@/components/ui/use-toast";

export function AtlantisContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = React.useState('atlantis');
  const { currentLanguage, updateKey } = useTranslation();

  // Effect runs once on mount to initialize activeTab from URL
  useLayoutEffect(() => {
    const section = searchParams.get('section');
    if (section && navigationTabs.some(tab => tab.value === section)) {
      setActiveTab(section);
    }
  }, []); // Empty dependency array means this only runs once

  // Effect to handle any subsequent URL changes
  useEffect(() => {
    const section = searchParams.get('section');
    if (section && navigationTabs.some(tab => tab.value === section)) {
      setActiveTab(section);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    if (activeTab === value) return; // Don't do anything if the tab is already active
    
    console.log(`Changing tab to: ${value}`);
    setActiveTab(value);
    
    // Update URL without triggering page reload
    setSearchParams(params => {
      params.set('section', value);
      return params;
    }, { replace: true });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveTabName = () => {
    const activeTabData = navigationTabs.find(tab => tab.value === activeTab);
    return activeTabData ? activeTabData.label : "About Us";
  };

  // Create a key for each content component to force re-render on language change or tab change
  const contentKey = `atlantis-content-${activeTab}-${updateKey}`;

  return (
    <div className="w-full bg-white font-inter">
      <AtlantisNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="w-full max-w-[1400px] mx-auto py-6 px-4 sm:px-6 md:px-8">
        <div className="hidden md:block mb-4 sm:mb-6 overflow-x-auto">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-500 hover:text-blue-500 transition-colors text-sm md:text-base">
                  <TranslateText text="Home" language={currentLanguage} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="mx-2 text-gray-400">&gt;</span>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/atlantis" className="text-gray-500 hover:text-blue-500 transition-colors text-sm md:text-base">
                  <TranslateText text="Company Information" language={currentLanguage} />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="mx-2 text-gray-400">&gt;</span>
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-blue-500 text-sm md:text-base">
                  <TranslateText text="Atlantis" language={currentLanguage} />
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="space-y-6" key={contentKey}>
          {activeTab === 'ceo' && <div id="ceo-content"><MessageFromCeoContent /></div>}
          {activeTab === 'team' && <div id="team-content"><TeamMembersContent /></div>}
          {activeTab === 'services' && (
            <div id="services-content">
              <AtlantisServicesContent />
              <div className="mt-16">
                <HotelsServicesContent />
              </div>
              <div className="mt-16">
                <GuestHousesContent />
              </div>
            </div>
          )}
          {activeTab === 'partners' && <div id="partners-content"><PartnersContent /></div>}
          {activeTab === 'contact' && <div id="contact-content"><ContactForm /></div>}
          {activeTab === 'atlantis' && <AboutAtlantisContent />}
          
          {/* Add navigation buttons at the bottom */}
          <div className="mt-10">
            <AtlantisSectionNavigation 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
