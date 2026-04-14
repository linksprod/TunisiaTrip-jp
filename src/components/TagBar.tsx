
import React, { useState, useEffect } from "react";
import { DesktopSearch } from "./tag-bar/DesktopSearch";
import { MobileSearch } from "./tag-bar/MobileSearch";
import { TagButton } from "./tag-bar/TagButton";
import { useTags } from "@/hooks/use-tags";
import { useDeviceSize } from "@/hooks/use-mobile";
import { SearchProvider } from "@/hooks/use-search-context";
import { useTranslation } from "@/hooks/use-translation";

export function TagBar(): JSX.Element {
  const { isMobile } = useDeviceSize();
  const { tags, activeTag, handleTagClick } = useTags();
  const { currentLanguage } = useTranslation();
  const [stickyClass, setStickyClass] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 0) {
        setStickyClass("shadow-sm");
      } else {
        setStickyClass("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Split tags into left and right groups for desktop
  const leftTags = tags.slice(0, Math.ceil(tags.length / 2));
  const rightTags = tags.slice(Math.ceil(tags.length / 2));

  return (
    <SearchProvider>
      <div className={`relative bg-gray-50 ${stickyClass}`} style={{ zIndex: 55 }}>
        {/* Mobile Layout - CSS First with Tailwind */}
        <div className="block md:hidden">
          <div className="container mx-auto w-full px-0 py-2" style={{ overflow: 'visible' }}>
            <div className="flex flex-col gap-2 w-full">
              <div className="w-full px-3"> 
                <MobileSearch />
              </div>
              <div className="flex overflow-x-auto gap-1 px-2 hide-scrollbar pb-1" 
                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {tags.map((tag) => (
                  <TagButton
                    key={tag.name}
                    name={tag.name}
                    isActive={activeTag === tag.name}
                    onClick={() => handleTagClick(tag.name, tag.path)}
                    path={tag.path}
                    currentLanguage={currentLanguage}
                    data-testid={`tag-${tag.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - CSS First with Tailwind */}
        <div className="hidden md:block">
          <div className="container mx-auto w-full px-3 sm:px-4 md:px-6 py-3" style={{ overflow: 'visible' }}>
            <div className="flex items-center justify-between w-full min-h-[44px] md:min-h-[48px]" style={{ overflow: 'visible' }}>
              <div className={`flex gap-1 md:gap-2 items-center justify-start transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'flex-shrink-1 min-w-0' : 'flex-shrink-0'
              } ${
                isSearchExpanded ? 'transform -translate-x-1 md:-translate-x-2 opacity-60 scale-95' : 'transform translate-x-0 opacity-100 scale-100'
              }`}>
                <div className="flex gap-1 md:gap-2 whitespace-nowrap overflow-hidden">
                  {leftTags.map((tag) => (
                    <TagButton
                      key={tag.name}
                      name={tag.name}
                      isActive={activeTag === tag.name}
                      onClick={() => handleTagClick(tag.name, tag.path)}
                      path={tag.path}
                      currentLanguage={currentLanguage}
                      data-testid={`tag-${tag.name}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center flex-shrink-0 relative mx-2 md:mx-4" style={{ overflow: 'visible' }}>
                <DesktopSearch onExpandChange={setIsSearchExpanded} />
              </div>

              <div className={`flex gap-1 md:gap-2 items-center justify-end transition-all duration-300 ease-in-out ${
                isSearchExpanded ? 'flex-shrink-1 min-w-0' : 'flex-shrink-0'
              } ${
                isSearchExpanded ? 'transform translate-x-1 md:translate-x-2 opacity-60 scale-95' : 'transform translate-x-0 opacity-100 scale-100'
              }`}>
                <div className="flex gap-1 md:gap-2 whitespace-nowrap overflow-hidden">
                  {rightTags.map((tag) => (
                    <TagButton
                      key={tag.name}
                      name={tag.name}
                      isActive={activeTag === tag.name}
                      onClick={() => handleTagClick(tag.name, tag.path)}
                      path={tag.path}
                      currentLanguage={currentLanguage}
                      data-testid={`tag-${tag.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}
