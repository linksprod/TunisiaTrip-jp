import React, { lazy, Suspense } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { TravelIconsSection } from "@/components/TravelIconsSection";
import { QuestionBanner } from "@/components/QuestionBanner";
import { ContactBanner } from "@/components/ContactBanner";
import { HomeHero } from "@/components/home/HomeHero";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { WebsiteSchema, TourismDestinationSchema } from "@/utils/schemaUtils";
import { PageSEO } from "@/components/common/PageSEO";
import { useTranslation } from "@/hooks/use-translation";
import { LazySection } from "@/components/common/LazySection";

// Lazy load non-critical sections that are below the fold
const JapaneseCreatorsSection = lazy(() => import("@/components/JapaneseCreatorsSection"));
const WeatherSection = lazy(() => import("@/components/WeatherSection"));
const StatisticsSection = lazy(() => import("@/components/StatisticsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));

// Fallback component for lazy sections
const SectionFallback = () => (
  <div className="w-full min-h-[300px] bg-muted/10 animate-pulse rounded-xl" />
);

// Use named export for better compatibility with dynamic imports
export const HomePage: React.FC = () => {
  const { currentLanguage } = useTranslation();

  // Dynamic image selection based on language
  const getOGImage = () => {
    return currentLanguage === 'EN'
      ? "/uploads/f4547708-3e81-4d1e-b626-844cc888dabd.png"
      : "/uploads/0c1b3cad-b8c4-4e02-a789-e700a147f440.png";
  };

  return (
    <MainLayout showTagBar={true}>
      {/* Per-page SEO — Japanese-first */}
      <PageSEO
        title="チュニジア旅行ガイド｜アクティビティ・観光スポット・天気情報 | TunisiaTrip"
        description="チュニジアの旅行情報を日本語で。カルタゴ遺跡、サハラ砂漠ツアー、シディ・ブ・サイドなど人気観光スポット、ホテル・ゲストハウス、天気情報を網羅。アトランティス航海が提供する信頼の旅行ガイド。"
        canonicalPath="/"
        keywords="チュニジア旅行, チュニジア観光, チュニジアツアー, サハラ砂漠, カルタゴ, シディブサイド, チュニス, アトランティス航海"
      />

      {/* SEO Schema Markup */}
      <WebsiteSchema
        name="TunisiaTrip - チュニジア旅行ガイド｜アクティビティ・観光スポット・天気情報"
        url="https://tunisiatrip.jp"
        description="チュニジアの旅行情報を日本語で。カルタゴ遺跡、サハラ砂漠ツアー、シディ・ブ・サイドなど人気観光スポット、ホテル・ゲストハウス、天気情報を網羅。"
        inLanguage={['ja']}
      />

      <TourismDestinationSchema
        name="チュニジア (Tunisia)"
        description="チュニジアの旅行情報、アクティビティ、天気情報。さらに探索する、もっと詳しく知るためのチュニジア観光ガイド。"
        url="https://tunisiatrip.jp"
        image={getOGImage()}
        touristType={["Beach", "Cultural", "Historical", "Adventure"]}
        touristTags={["Mediterranean", "North Africa", "Ancient Ruins", "Beaches", "Desert"]}
      />

      {/* Main Content Container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Hero Section - Critical for LCP */}
        <HomeHero />

        {/* Travel Icons Section - Above fold on most screens */}
        <section className="mt-8 md:mt-12 lg:mt-16">
          <TravelIconsSection />
        </section>

        {/* Features Section */}
        <section className="mt-10 md:mt-14 lg:mt-20">
          <FeaturesGrid />
        </section>

        {/* Japanese Creators Section - Lazy loaded */}
        <section className="mt-12 md:mt-16 lg:mt-20 flex justify-center">
          <LazySection>
            <Suspense fallback={<SectionFallback />}>
              <JapaneseCreatorsSection />
            </Suspense>
          </LazySection>
        </section>

        {/* Statistics Section - Lazy loaded */}
        <section className="mt-12 md:mt-16 lg:mt-20 flex justify-center">
          <LazySection>
            <Suspense fallback={<SectionFallback />}>
              <StatisticsSection />
            </Suspense>
          </LazySection>
        </section>

        {/* Testimonials Section - Lazy loaded */}
        <section className="mt-12 md:mt-16 lg:mt-20 flex justify-center">
          <LazySection>
            <Suspense fallback={<SectionFallback />}>
              <TestimonialsSection />
            </Suspense>
          </LazySection>
        </section>

        {/* Question Banner */}
        <section className="mt-12 md:mt-16 lg:mt-20">
          <QuestionBanner />
        </section>

        {/* Weather Section - Lazy loaded (API call heavy) */}
        <section className="mt-12 md:mt-16 lg:mt-20 flex justify-center">
          <LazySection>
            <Suspense fallback={<SectionFallback />}>
              <WeatherSection />
            </Suspense>
          </LazySection>
        </section>
      </div>

      {/* Contact Banner - full width */}
      <section className="mt-12 md:mt-16 lg:mt-20">
        <ContactBanner />
      </section>
    </MainLayout>
  );
};

// Also provide default export for compatibility with both import styles
export default HomePage;
