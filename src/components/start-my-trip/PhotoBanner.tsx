import { useEffect } from "react";
import { useActivities } from "@/hooks/useActivities";

export function PhotoBanner() {
  const { activities } = useActivities();

  // Collect all images with their city information and shuffle them randomly
  const allImagesWithCity = activities?.reduce((images: Array<{url: string, city: string}>, activity) => {
    const city = activity.location || 'Tunisia';
    if (activity.images && activity.images.length > 0) {
      const imagesWithCity = activity.images.map(img => ({ url: img, city }));
      return [...images, ...imagesWithCity];
    }
    if (activity.image) {
      return [...images, { url: activity.image, city }];
    }
    return images;
  }, []) || [];

  // Shuffle function to randomize images
  const shuffleArray = (array: Array<{url: string, city: string}>) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize the images order
  const randomizedImages = shuffleArray(allImagesWithCity);

  // Triple the images for seamless infinite loop
  const infiniteImages = [...randomizedImages, ...randomizedImages, ...randomizedImages];

  if (randomizedImages.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-r from-background/80 via-background/60 to-background/80">
      <div 
        className="flex h-full animate-film-scroll"
        style={{
          width: `${infiniteImages.length * 300}px`,
        }}
      >
        {infiniteImages.map((imageData, index) => (
          <div
            key={`${imageData.url}-${index}`}
            className="flex-shrink-0 w-[300px] h-full relative"
          >
            <img
              src={imageData.url}
              alt="Activity"
              className="w-full h-full object-cover border-r-2 border-white/20"
              loading="lazy"
            />
            {/* City tag */}
            <div className="absolute top-4 left-4">
              <div className="bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                {imageData.city}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}