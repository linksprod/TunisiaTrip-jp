
import { BlogCategory, BlogArticle } from "@/types/blog";

export const categories: BlogCategory[] = [
  {
    name: "Travel Diary",
    iconType: "BookOpen",
    color: "bg-blue-50",
    slug: "travel-diary"
  },
  {
    name: "Places",
    iconType: "LandPlot",
    color: "bg-purple-50",
    slug: "places"
  },
  {
    name: "Hotels",
    iconType: "Hotel",
    color: "bg-yellow-50", 
    slug: "hotels"
  },
  {
    name: "Food",
    iconType: "Utensils",
    color: "bg-red-50",
    slug: "food"
  },
  {
    name: "Events",
    iconType: "Calendar",
    color: "bg-indigo-50",
    slug: "events"
  },
  {
    name: "Culture",
    iconType: "Globe2",
    color: "bg-emerald-50",
    slug: "culture"
  },
  {
    name: "History",
    iconType: "History",
    color: "bg-amber-50",
    slug: "history"
  },
  {
    name: "Tips",
    iconType: "HelpCircle",
    color: "bg-teal-50",
    slug: "tips"
  }
];

export const articles: BlogArticle[] = [
  // Articles are now managed through Supabase admin interface
  // All articles have been migrated to the blog_articles table
];
