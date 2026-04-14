/**
 * Production URL utilities for social sharing and SEO
 */

const PRODUCTION_DOMAIN = 'https://tunisiatrip.jp';

/**
 * Get the production URL for sharing and canonical links
 * Always returns the production domain regardless of current environment
 */
export function getProductionUrl(): string {
  return PRODUCTION_DOMAIN;
}

/**
 * Generate a production URL for a specific path
 * @param path - The path to append to the production domain (should start with /)
 */
export function getProductionUrlForPath(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${PRODUCTION_DOMAIN}${normalizedPath}`;
}

/**
 * Get the current pathname from window.location
 * Safe to use in both client and server environments
 */
export function getCurrentPathname(): string {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return '/';
}

/**
 * Generate a production URL for the current page
 * Combines production domain with current pathname
 */
export function getCurrentProductionUrl(): string {
  return getProductionUrlForPath(getCurrentPathname());
}