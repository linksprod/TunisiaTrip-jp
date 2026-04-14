
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BlogAnalytics {
  totalPosts: number;
  totalReadTime: number;
  averageReadTime: number;
  categoryCounts: Record<string, number>;
  monthlyPostCounts: Array<{
    month: string;
    count: number;
    readTime: number;
  }>;
  // Track changes over time
  postGrowthRate: number; 
  readTimeGrowthRate: number;
  categoryGrowthRates: Record<string, number>;
}

export const useBlogAnalytics = () => {
  const [analytics, setAnalytics] = useState<BlogAnalytics>({
    totalPosts: 0,
    totalReadTime: 0,
    averageReadTime: 0,
    categoryCounts: {},
    monthlyPostCounts: [],
    postGrowthRate: 0,
    readTimeGrowthRate: 0,
    categoryGrowthRates: {}
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculate reading time based on content length
  const calculateReadTime = (content: string): number => {
    if (!content) return 0;
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  useEffect(() => {
    const fetchBlogAnalytics = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching blog analytics from Supabase...");
        
        // Fetch blog posts from Supabase
        const { data: posts, error } = await supabase
          .from('blog_articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        console.log(`Retrieved ${posts?.length || 0} blog posts from database`);
        
        // Calculate analytics
        const blogPosts = posts || [];
        const totalPosts = blogPosts.length;
        
        // Get current date and date 30 days ago for growth calculations
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(now.getDate() - 60);
        
        // Filter posts by period for growth rate calculations
        const postsLast30Days = blogPosts.filter(post => {
          const postDate = new Date(post.created_at);
          return postDate >= thirtyDaysAgo && postDate <= now;
        });
        
        const postsPrevious30Days = blogPosts.filter(post => {
          const postDate = new Date(post.created_at);
          return postDate >= sixtyDaysAgo && postDate < thirtyDaysAgo;
        });
        
        // Calculate reading times
        const readTimes = blogPosts.map(post => calculateReadTime(post.content || ''));
        const totalReadTime = readTimes.reduce((acc, time) => acc + time, 0);
        const averageReadTime = totalPosts > 0 ? Math.round(totalReadTime / totalPosts) : 0;
        
        // Calculate read time growth
        const readTimeLast30Days = postsLast30Days.reduce(
          (acc, post) => acc + calculateReadTime(post.content || ''), 
          0
        );
        
        const readTimePrevious30Days = postsPrevious30Days.reduce(
          (acc, post) => acc + calculateReadTime(post.content || ''), 
          0
        );
        
        // Calculate growth rates
        const postGrowthRate = postsPrevious30Days.length > 0 
          ? ((postsLast30Days.length - postsPrevious30Days.length) / postsPrevious30Days.length) * 100
          : postsLast30Days.length > 0 ? 100 : 0;
          
        const readTimeGrowthRate = readTimePrevious30Days > 0
          ? ((readTimeLast30Days - readTimePrevious30Days) / readTimePrevious30Days) * 100
          : readTimeLast30Days > 0 ? 100 : 0;
        
        // Category distribution
        const categoryCounts: Record<string, number> = {};
        const categoryCountsLast30Days: Record<string, number> = {};
        const categoryCountsPrevious30Days: Record<string, number> = {};
        
        blogPosts.forEach(post => {
          if (post.category) {
            categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
            
            const postDate = new Date(post.created_at);
            if (postDate >= thirtyDaysAgo && postDate <= now) {
              categoryCountsLast30Days[post.category] = (categoryCountsLast30Days[post.category] || 0) + 1;
            } else if (postDate >= sixtyDaysAgo && postDate < thirtyDaysAgo) {
              categoryCountsPrevious30Days[post.category] = (categoryCountsPrevious30Days[post.category] || 0) + 1;
            }
          }
        });
        
        // Calculate category growth rates
        const categoryGrowthRates: Record<string, number> = {};
        Object.keys(categoryCounts).forEach(category => {
          const last30 = categoryCountsLast30Days[category] || 0;
          const prev30 = categoryCountsPrevious30Days[category] || 0;
          
          categoryGrowthRates[category] = prev30 > 0
            ? ((last30 - prev30) / prev30) * 100
            : last30 > 0 ? 100 : 0;
        });
        
        // Monthly post distribution (for last 6 months)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData: Array<{month: string, count: number, readTime: number}> = [];
        
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = monthNames[month.getMonth()];
          
          const postsInMonth = blogPosts.filter(post => {
            const postDate = new Date(post.created_at);
            return postDate.getMonth() === month.getMonth() && 
                   postDate.getFullYear() === month.getFullYear();
          });
          
          const readTimeInMonth = postsInMonth.reduce((acc, post) => 
            acc + calculateReadTime(post.content || ''), 0);
          
          monthlyData.push({
            month: monthName,
            count: postsInMonth.length,
            readTime: readTimeInMonth
          });
        }
        
        console.log("Blog analytics calculated:", {
          totalPosts,
          averageReadTime,
          postGrowthRate: Math.round(postGrowthRate),
          categories: Object.keys(categoryCounts).length
        });
        
        setAnalytics({
          totalPosts,
          totalReadTime,
          averageReadTime,
          categoryCounts,
          monthlyPostCounts: monthlyData,
          postGrowthRate: Math.round(postGrowthRate),
          readTimeGrowthRate: Math.round(readTimeGrowthRate),
          categoryGrowthRates
        });
        
      } catch (err) {
        console.error("Error fetching blog analytics:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogAnalytics();
  }, []);

  return { analytics, isLoading, error };
};
