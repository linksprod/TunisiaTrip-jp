
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TunisiaFooter } from "@/components/TunisiaFooter";
import { Chat } from "@/components/chat/Chat";
import { TagBar } from "@/components/TagBar";
import { useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";

interface MainLayoutProps {
  children: React.ReactNode;
  showTagBar?: boolean;
}

export function MainLayout({ children, showTagBar = true }: MainLayoutProps) {
  const location = useLocation();

  // Use useLayoutEffect to scroll before the browser paints
  useLayoutEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          // Set smooth scrolling just before scrolling to element
          document.documentElement.style.scrollBehavior = 'smooth';
          element.scrollIntoView({ 
            block: 'start',
            behavior: 'smooth'
          });
        }
      });
    } else {
      // If no hash, scroll to top immediately without smooth behavior
      window.scrollTo(0, 0);
      
      // Then apply smooth scrolling for any subsequent user scrolling
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
      });
    }
    
    // Clean up by resetting scroll behavior
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, [location.pathname, location.hash]); // React to both pathname and hash changes

  return (
    <div className="flex min-h-screen flex-col w-full">
      <ErrorBoundary>
        <Navbar />
        <div className="pt-14 md:pt-16 w-full"> {/* Responsive navbar height */}
          {showTagBar && (
            <div 
              className="sticky top-14 md:top-16 w-full bg-gray-50 shadow-sm will-change-transform z-[55]"
              style={{ 
                overflow: 'visible',
                marginTop: '-1px'
              }}
            >
              <TagBar />
            </div>
          )}
          <main className="flex-1 w-full">
            <div className="page-transition w-full">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </main>
          <TunisiaFooter />
          <Chat />
        </div>
      </ErrorBoundary>
    </div>
  );
}
