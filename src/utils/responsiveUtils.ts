
/**
 * Utility functions to help with responsive design
 */

// Screen size breakpoints (matching tailwind defaults + extra small)
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

/**
 * Gets a value based on the current screen size
 * @param options - Object with breakpoint values
 * @param defaultValue - Default value if no breakpoint matches
 * @returns The appropriate value for the current screen size
 */
export function getResponsiveValue<T>(
  options: {
    base?: T;
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  defaultValue?: T
): T {
  const width = window.innerWidth;
  
  if (width >= breakpoints['2xl'] && options['2xl'] !== undefined) {
    return options['2xl'];
  }
  
  if (width >= breakpoints.xl && options.xl !== undefined) {
    return options.xl;
  }
  
  if (width >= breakpoints.lg && options.lg !== undefined) {
    return options.lg;
  }
  
  if (width >= breakpoints.md && options.md !== undefined) {
    return options.md;
  }
  
  if (width >= breakpoints.sm && options.sm !== undefined) {
    return options.sm;
  }
  
  if (width >= breakpoints.xs && options.xs !== undefined) {
    return options.xs;
  }
  
  if (options.base !== undefined) {
    return options.base;
  }
  
  return defaultValue as T;
}

/**
 * Truncates text to a specific length and adds ellipsis
 * @param text - Text to truncate
 * @param length - Max length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

/**
 * Determines if the element is visible in viewport
 * @param element - DOM element to check
 * @param offset - Optional offset to trigger earlier
 * @returns Boolean indicating if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top - offset <= window.innerHeight &&
    rect.bottom + offset >= 0
  );
}

/**
 * Get responsive text size classes
 * @param baseSize - Base text size
 * @returns Responsive text size classes
 */
export function getResponsiveTextSize(baseSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl' = 'base'): string {
  const sizeMap = {
    xs: 'text-xs xs:text-sm sm:text-sm',
    sm: 'text-sm xs:text-sm sm:text-base',
    base: 'text-sm xs:text-base sm:text-base md:text-lg',
    lg: 'text-base xs:text-lg sm:text-xl md:text-2xl',
    xl: 'text-lg xs:text-xl sm:text-2xl md:text-3xl'
  };
  
  return sizeMap[baseSize];
}

/**
 * Get responsive spacing classes
 * @param spacing - Base spacing
 * @returns Responsive spacing classes
 */
export function getResponsiveSpacing(spacing: 'tight' | 'normal' | 'loose' = 'normal'): string {
  const spacingMap = {
    tight: 'gap-1 xs:gap-2 sm:gap-3',
    normal: 'gap-2 xs:gap-3 sm:gap-4 md:gap-6',
    loose: 'gap-3 xs:gap-4 sm:gap-6 md:gap-8'
  };
  
  return spacingMap[spacing];
}
