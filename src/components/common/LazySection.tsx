import React, { useEffect, useState, useRef } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Lazy loads children only when they enter the viewport
 * Helps reduce initial bundle size and improve FCP/LCP
 */
export function LazySection({ 
  children, 
  fallback = <div className="min-h-[200px] bg-muted/20 animate-pulse rounded-xl" />,
  rootMargin = '100px',
  threshold = 0.1
}: LazySectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use IntersectionObserver for efficient visibility detection
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
}

export default LazySection;
