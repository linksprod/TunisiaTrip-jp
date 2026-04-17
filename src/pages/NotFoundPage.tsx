
import React from 'react';
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useTranslation } from "@/hooks/use-translation";
import { PageSEO } from "@/components/common/PageSEO";

export default function NotFoundPage(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <MainLayout showTagBar={false}>
      <PageSEO
        title="404 - ページが見つかりません | TunisiaTrip"
        description="お探しのページを見つけることができませんでした。ホームページに戻り、チュニジア旅行情報をお楽しみください。"
        canonicalPath="/"
        noIndex={true}
      />
      <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <OptimizedImage
          src="/uploads/b8d3011d-f5cd-4edd-b34e-9ef0827ba186.png"
          alt="Discover Tunisia Logo"
          width={200}
          height={80}
          className="mb-8"
        />

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
          {t("404 - Page Not Found")}
        </h1>

        <p className="text-xl text-center mb-8 max-w-2xl text-gray-600">
          {t("We're sorry, the page you're looking for cannot be found. It might have been moved, deleted, or never existed.")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            {t("Return Home")}
          </Button>

          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
            className="px-8"
          >
            {t("Go Back")}
          </Button>
        </div>

        <div className="mt-16">
          <h2 className="font-semibold text-xl mb-4 text-center">
            {t("Popular Destinations")}
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/travel')}
              variant="ghost"
              className="border border-gray-200"
            >
              {t("Travel Information")}
            </Button>

            <Button
              onClick={() => navigate('/about')}
              variant="ghost"
              className="border border-gray-200"
            >
              {t("About Tunisia")}
            </Button>

            <Button
              onClick={() => navigate('/blog')}
              variant="ghost"
              className="border border-gray-200"
            >
              {t("Blog")}
            </Button>

            <Button
              onClick={() => navigate('/start-my-trip')}
              variant="ghost"
              className="border border-gray-200"
            >
              {t("Start My Trip")}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
