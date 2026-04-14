
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { convertToWebP } from "@/utils/imageUtils";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function VideoHighlightSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  
  // Video data
  const mainVideoData = {
    title: "To the Unknown Beauties of Tunisia with Hae In Jung",
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    summary: "Popular Japanese content creator talks about their favorite things in Tunisia and shares their recommendations with potential tourists, providing valuable insights to this culturally rich country's best sites and destinations. From artisanal arts to sesame sweets, Tunisian and Japanese cultures have so much in common which results to a feeling of familiarity and comfort despite being in a completely different continent.",
    slug: "tunisia-with-hae-in-jung"
  };

  // More videos data
  const moreVideos = [
    {
      id: 1,
      title: "To the Unknown Beauties of Tunisia with Hae In Jung",
      date: "March, 2023",
      thumbnail: convertToWebP("https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7"),
      active: true,
      slug: "tunisia-with-hae-in-jung"
    },
    {
      id: 2,
      title: "Discover TOZEUR: Sahara Landscapes",
      date: "March, 2023",
      thumbnail: convertToWebP("https://images.unsplash.com/photo-1489493887464-892be6d1daae"),
      active: false,
      slug: "discover-tozeur"
    },
    {
      id: 3,
      title: "Mystical Explorations: Touring in Tunisia",
      date: "March, 2023",
      thumbnail: convertToWebP("https://images.unsplash.com/photo-1517760444937-f6397edcbbcd"),
      active: false,
      slug: "mystical-explorations"
    },
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4">
      <div className="mb-4">
        <div className="text-blue-500 mb-2">
          <TranslateText text="Videos" language={currentLanguage} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          <Link to={`/videos/${mainVideoData.slug}`} className="hover:text-blue-700 transition-colors">
            <TranslateText text={mainVideoData.title} language={currentLanguage} />
          </Link>
        </h2>
        <div className="flex justify-end mb-4">
          {isMobile ? (
            <Link to="/videos">
              <Button
                variant="outline"
                className="border border-blue-500 text-blue-500 rounded-full px-3 text-xs hover:bg-blue-50 transition-colors"
              >
                <TranslateText text="See All >" language={currentLanguage} />
              </Button>
            </Link>
          ) : (
            <Link to="/videos">
              <Button
                variant="outline"
                className="border border-blue-500 text-blue-500 rounded-full px-6 text-sm hover:bg-blue-50 transition-colors"
              >
                <TranslateText text="See All Videos" language={currentLanguage} />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* YouTube embed */}
      <div className="w-full aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden cursor-pointer">
        <iframe 
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${mainVideoData.videoId}`}
          title={mainVideoData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Summary */}
      <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-10 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-medium text-base md:text-lg mb-2">
          <TranslateText text="Video Summary" language={currentLanguage} />
        </h3>
        <p className="text-gray-700 text-xs md:text-sm">
          <TranslateText text={mainVideoData.summary} language={currentLanguage} />
        </p>
      </div>

      {/* More Videos section */}
      <div className="mt-6 md:mt-8 mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">
          <TranslateText text="Watch Next" language={currentLanguage} />
        </h3>
        
        {isMobile ? (
          // Mobile video carousel - simplified for mobile
          <div className="space-y-4">
            {moreVideos.map((video) => (
              <Link to={`/videos/${video.slug}`} key={video.id}>
                <div className={`p-2 rounded-lg ${video.active ? 'border-2 border-blue-500 bg-blue-50' : 'border border-gray-200'} hover:shadow-md transition-all`}>
                  <div className="flex gap-3">
                    <div className="w-1/3 aspect-video bg-cover bg-center rounded-lg"
                         style={{ backgroundImage: `url(${video.thumbnail})` }}></div>
                    <div className="w-2/3">
                      <h4 className="font-bold text-sm">
                        <TranslateText text={video.title} language={currentLanguage} />
                      </h4>
                      <p className="text-gray-500 text-xs mt-1">
                        <TranslateText text={video.date} language={currentLanguage} />
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          // Desktop video carousel with navigation
          <div className="relative">
            {/* Navigation buttons */}
            <button className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {moreVideos.map((video) => (
                <Link to={`/videos/${video.slug}`} key={video.id} className="min-w-[280px] max-w-[280px] flex-shrink-0 group">
                  <div 
                    className={`aspect-video bg-cover bg-center rounded-lg ${
                      video.active ? "border-2 border-blue-500" : ""
                    } transition-transform group-hover:scale-[1.02]`}
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  ></div>
                  <h4 className="font-bold text-lg mt-3 group-hover:text-blue-600 transition-colors">
                    <TranslateText text={video.title} language={currentLanguage} />
                  </h4>
                  <p className="text-gray-500 text-sm">
                    <TranslateText text={video.date} language={currentLanguage} />
                  </p>
                </Link>
              ))}
            </div>
            
            <button className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-blue-500 rounded-full shadow p-2 hover:bg-blue-600 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
      
      {/* Mobile-only "See All" button at bottom */}
      {isMobile && (
        <div className="flex justify-center mt-6 mb-4">
          <Link to="/videos">
            <Button 
              variant="outline" 
              className="border border-blue-500 text-blue-500 rounded-full px-6 text-sm hover:bg-blue-50 transition-colors"
            >
              <TranslateText text="See All Videos" language={currentLanguage} />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
