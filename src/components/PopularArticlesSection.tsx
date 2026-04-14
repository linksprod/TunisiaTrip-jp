
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function PopularArticlesSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  
  const articles = [
    {
      id: 1,
      title: "El Djem Amphitheater",
      category: "History",
      image: "https://images.unsplash.com/photo-1540552999122-a0ac7a9a0008",
      description: "Discover one of the most impressive Roman ruins in Africa, a UNESCO World Heritage site that once hosted gladiatorial spectacles.",
      slug: "el-djem-amphitheater"
    },
    {
      id: 2,
      title: "Sidi Bou Said's Blue Paradise",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780",
      description: "Explore the picturesque blue and white village perched above the Mediterranean, known for its stunning architecture and artistic heritage.",
      slug: "sidi-bou-said"
    },
    {
      id: 3,
      title: "Sahara Desert Experience",
      category: "Adventure",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      description: "Journey into the heart of the Sahara, ride camels through golden dunes, and experience magical desert nights under the stars.",
      slug: "sahara-adventure"
    },
    {
      id: 4,
      title: "Traditional Tunisian Cuisine",
      category: "Food",
      image: "https://images.unsplash.com/photo-1484980972926-edee96e0960d",
      description: "Dive into Tunisia's rich culinary heritage, from spicy harissa to couscous, influenced by Mediterranean and North African flavors.",
      slug: "tunisian-cuisine"
    },
    {
      id: 5,
      title: "Carthage Ruins",
      category: "History",
      image: "https://images.unsplash.com/photo-1548019979-e49b53bc4432",
      description: "Walk through the ancient ruins of Carthage, once the most powerful city in the Mediterranean, now a UNESCO World Heritage site.",
      slug: "carthage-ruins"
    },
    {
      id: 6,
      title: "Medina of Tunis",
      category: "Culture",
      image: "https://images.unsplash.com/photo-1590165482129-1b8b27698780",
      description: "Discover the heart of Tunis in its historic Medina, a maze of ancient streets, traditional souks, and architectural wonders.",
      slug: "medina-tunis"
    },
    {
      id: 7,
      title: "Mediterranean Beaches",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      description: "Explore Tunisia's stunning coastline, from pristine beaches to hidden coves along the Mediterranean Sea.",
      slug: "tunisia-beaches"
    }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold">
          <TranslateText text="Popular Articles" language={currentLanguage} />
        </h2>
        {!isMobile && (
          <Link to="/articles">
            <Button variant="outline" className="border border-blue-500 text-blue-500 rounded-full px-6 text-sm hover:bg-blue-50 transition-colors">
              <TranslateText text="See All Articles" language={currentLanguage} />
            </Button>
          </Link>
        )}
        {isMobile && (
          <Link to="/articles">
            <Button variant="outline" className="border border-blue-500 text-blue-500 rounded-full px-3 text-xs hover:bg-blue-50 transition-colors">
              <TranslateText text="See All >" language={currentLanguage} />
            </Button>
          </Link>
        )}
      </div>

      {/* Articles Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true
        }}
        className="relative w-full"
      >
        <CarouselContent className="-ml-4">
          {articles.map((article) => (
            <CarouselItem key={article.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3">
              <Link to={`/articles/${article.slug}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow h-full">
                  <div className="relative h-[200px]">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      <TranslateText text={article.category} language={currentLanguage} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      <TranslateText text={article.title} language={currentLanguage} />
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      <TranslateText text={article.description} language={currentLanguage} />
                    </p>
                    <div className="text-blue-500 text-xs flex items-center group">
                      <TranslateText text="Learn more" language={currentLanguage} /> 
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>

      {/* Mobile-only "See All" button at bottom */}
      {isMobile && (
        <div className="flex justify-center mt-6">
          <Link to="/articles">
            <Button 
              variant="outline" 
              className="border border-blue-500 text-blue-500 rounded-full px-6 text-sm hover:bg-blue-50 transition-colors"
            >
              <TranslateText text="See All Articles" language={currentLanguage} />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
