
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
  persistent?: boolean;
}

// Maintain a global cache of loaded images to prevent reloading
const loadedImages = new Set<string>();

// Cache of actual image elements for persistent images
const persistentImageCache = new Map<string, HTMLImageElement>();

export function OptimizedImage({
  src,
  alt,
  priority = false,
  className,
  width,
  height,
  placeholder = 'blur',
  persistent = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(loadedImages.has(src));
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If priority is true, preload the image
  useEffect(() => {
    // Check if this image is already preloaded/cached
    if (!loadedImages.has(src)) {
      if (priority) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = src;
        preloadLink.fetchPriority = 'high';
        
        // Check if link already exists to avoid duplicates
        const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
        if (!existingLink) {
          document.head.appendChild(preloadLink);
          
          // Clean up
          return () => {
            try {
              if (document.head.contains(preloadLink)) {
                document.head.removeChild(preloadLink);
              }
            } catch (e) {
              console.warn('Error removing preload link:', e);
            }
          };
        }
      }
    } else {
      // If image is already loaded, set state immediately
      setIsLoaded(true);
    }
  }, [src, priority]);

  // For persistent images like logos, cache the actual image element
  useEffect(() => {
    if (persistent && !persistentImageCache.has(src) && imgRef.current) {
      // Store the reference to this image element for future use
      const img = new Image();
      img.src = src;
      img.onload = () => {
        persistentImageCache.set(src, img);
        loadedImages.add(src);
        setIsLoaded(true);
      };
      img.onerror = handleImageError;
    }
  }, [src, persistent]);

  // Check on mount if we already have this image in persistent cache
  useEffect(() => {
    if (persistent && persistentImageCache.has(src)) {
      setIsLoaded(true);
    }
  }, [src, persistent]);

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoaded(true);
    loadedImages.add(src);
    
    // For persistent images, ensure they're cached for future navigation
    if (persistent && imgRef.current && !persistentImageCache.has(src)) {
      const img = new Image();
      img.src = src;
      persistentImageCache.set(src, img);
    }
  };

  // Handle image load failure
  const handleImageError = () => {
    setError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <img
      ref={imgRef}
      src={error ? '/placeholder.svg' : src}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        !isLoaded && placeholder === 'blur' ? 'opacity-0' : 'opacity-100',
        className
      )}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...props}
    />
  );
}
