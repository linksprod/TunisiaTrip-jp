
import React, { useState } from 'react';
import { createImageSources, ImageSource } from '@/utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchPriority = 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Basic image optimization attributes
  const imgProps = {
    onLoad: () => setIsLoaded(true),
    alt,
    width,
    height,
    loading,
    fetchPriority,
    decoding: 'async' as const,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    style: { contentVisibility: 'auto' as const }
  };

  // SVGs and GIFs get special treatment
  if (src.endsWith('.svg') || src.endsWith('.gif')) {
    return <img {...imgProps} src={src} />;
  }

  // Check if this is a Supabase image or other optimized source
  const isOptimizedSource = 
    src.includes('storage.googleapis.com') || 
    src.includes('supabase.co') || 
    src.includes('.webp');
  
  // For Supabase images or other already optimized images
  if (isOptimizedSource) {
    // Supabase images are already optimized, so we can just use them directly
    return <img {...imgProps} src={src} />;
  } else {
    // For regular images, we create a sources array for different formats and sizes
    const imageSources: ImageSource[] = createImageSources(src);

    return (
      <picture>
        {/* WebP format sources */}
        {imageSources
          .filter(source => source.type === 'image/webp')
          .map((source, idx) => (
            <source
              key={`webp-${idx}`}
              srcSet={source.src}
              type={source.type}
              media={source.media}
            />
          ))}

        {/* Original format sources */}
        {imageSources
          .filter(source => source.type !== 'image/webp')
          .map((source, idx) => (
            <source
              key={`original-${idx}`}
              srcSet={source.src}
              media={source.media}
            />
          ))}

        {/* Fallback img element */}
        <img {...imgProps} src={src} />
      </picture>
    );
  }
};

export default OptimizedImage;
