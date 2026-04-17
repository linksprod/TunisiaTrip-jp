
import React, { useEffect, useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { BlogContent } from "@/components/blog/BlogContent";
import { useSearchParams } from "react-router-dom";
import { PageSEO } from "@/components/common/PageSEO";

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
      <PageSEO
        title="チュニジア旅行ブログ｜観光ガイド・音ヒント・地元情報 | TunisiaTrip"
        description="チュニジア旅行に役立つ最新ブログを日本語で。サハラ砂漠体験記、カルタゴ遺跡ガイド、視㡉8たまり情報、旅行のコツなど、実際に訪れた記事を多数公開。"
        canonicalPath="/blog"
        keywords="チュニジアブログ, チュニジア音ヒント, チュニジア旅行記, サハラ砂漠体験, カルタゴ遺跡, チュニジア観光ガイド"
      />
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
