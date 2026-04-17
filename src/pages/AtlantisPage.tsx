
import React, { useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { AtlantisHero } from "@/components/atlantis/AtlantisHero";
import { AtlantisContent } from "@/components/atlantis/AtlantisContent";
import { useLocation, useSearchParams } from "react-router-dom";
import { PageSEO } from "@/components/common/PageSEO";

const AtlantisPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Listen for tab change events from the TagBar
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      const { tab, section, message } = event.detail;

      if (tab) {
        console.log("Tab change event received:", tab);
        // Update section parameter in URL without causing a page reload
        setSearchParams(params => {
          params.set('section', tab);

          // Add message parameter if provided
          if (message) {
            params.set('message', encodeURIComponent(message));
          } else if (params.has('message')) {
            params.delete('message');
          }

          return params;
        }, { replace: true });
      }
    };

    // Add event listener for custom tab change events
    window.addEventListener('changeTab', handleTabChange as EventListener);

    // Clean up
    return () => {
      window.removeEventListener('changeTab', handleTabChange as EventListener);
    };
  }, [setSearchParams]);

  return (
    <MainLayout showTagBar={true}>
      <PageSEO
        title="アトランティス航海｜チュニジア旅行の専門家 | TunisiaTrip"
        description="1991年創業のアトランティス航海はチュニジア旅行の専門代理店。ツアー予約、宿泊手配、躪送サービス、パーソナライズされた旅行プラン。チュニジア詪貫の旅行体験を提供。"
        canonicalPath="/company-information"
        keywords="アトランティス航海, チュニジア旅行代理店, チュニジアツアー, チュニジア旅行予約, アトランティスボイヤージュ"
      />
      <AtlantisHero />
      <AtlantisContent />
    </MainLayout>
  );
};

export default AtlantisPage;
