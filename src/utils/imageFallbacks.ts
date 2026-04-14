// Image fallback utility for Tunisia travel website

export const DEFAULT_IMAGES = {
  // Activity types
  cultural: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?w=400', // Tunis medina
  historical: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', // Ancient ruins
  nature: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400', // Sahara desert
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', // Mediterranean coast
  adventure: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400', // Desert adventure
  
  // Accommodations
  hotel: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400',
  guesthouse: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
  
  // Transport & Infrastructure
  airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
  transport: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
  
  // Food & Culture
  food: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
  souk: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  
  // Generic Tunisia
  default: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c0e?w=400'
};

/**
 * Get a fallback image based on content type and context
 */
export function getFallbackImage(type?: string, category?: string): string {
  if (type === 'airport' || type === 'arrival' || type === 'departure') {
    return DEFAULT_IMAGES.airport;
  }
  
  if (type === 'hotel' || type === 'accommodation') {
    return DEFAULT_IMAGES.hotel;
  }
  
  if (type === 'guesthouse') {
    return DEFAULT_IMAGES.guesthouse;
  }
  
  if (type === 'activity') {
    switch (category?.toLowerCase()) {
      case 'cultural':
      case 'heritage':
        return DEFAULT_IMAGES.cultural;
      case 'historical':
      case 'ruins':
        return DEFAULT_IMAGES.historical;
      case 'nature':
      case 'landscape':
        return DEFAULT_IMAGES.nature;
      case 'beach':
      case 'coastal':
        return DEFAULT_IMAGES.beach;
      case 'adventure':
      case 'desert':
        return DEFAULT_IMAGES.adventure;
      default:
        return DEFAULT_IMAGES.cultural;
    }
  }
  
  if (type === 'food' || type === 'lunch' || type === 'dinner' || type === 'breakfast') {
    return DEFAULT_IMAGES.food;
  }
  
  return DEFAULT_IMAGES.default;
}

/**
 * Validate and get a working image URL with fallback
 */
export function getValidImageUrl(
  primaryImage?: string, 
  secondaryImage?: string, 
  type?: string, 
  category?: string
): string {
  // Try primary image first
  if (primaryImage && isValidImageUrl(primaryImage)) {
    return primaryImage;
  }
  
  // Try secondary image
  if (secondaryImage && isValidImageUrl(secondaryImage)) {
    return secondaryImage;
  }
  
  // Return appropriate fallback
  return getFallbackImage(type, category);
}

/**
 * Basic validation for image URLs
 */
function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
    return true;
  } catch {
    // Allow relative paths starting with /
    return url.startsWith('/') && url.length > 1;
  }
}

/**
 * Image error handler for React components
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackType?: string,
  fallbackCategory?: string
): void {
  const img = event.currentTarget;
  const fallbackUrl = getFallbackImage(fallbackType, fallbackCategory);
  
  // Prevent infinite loop if fallback also fails
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  }
}