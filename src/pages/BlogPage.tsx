
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { BlogContent } from "@/components/blog/BlogContent";
import { useSearchParams } from "react-router-dom";

const BlogPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  useEffect(() => {
    // Check if we have a category parameter
    const category = searchParams.get('category');
    
    if (category) {
      setTimeout(() => {
        // Find and click the category button if it exists
        const categoryButtons = document.querySelectorAll('.grid.grid-cols-2.sm\\:grid-cols-4.lg\\:grid-cols-8 button');
        
        for (const button of categoryButtons) {
          const buttonText = button.textContent?.toLowerCase();
          if (buttonText && buttonText.includes(category.toLowerCase())) {
            (button as HTMLElement).click();
            break;
          }
        }
      }, 500); // Give time for the DOM to render
    }
  }, [searchParams]);
  
  return (
    <MainLayout>
      <BlogContent 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </MainLayout>
  );
};

export default BlogPage;
