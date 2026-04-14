
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Save, Send, Languages } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BlogArticle } from "@/types/blog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface BlogPostsTableProps {
  blogPosts: BlogArticle[];
  isLoading: boolean;
  onEdit: (post: BlogArticle) => void;
  onDelete: (id: string) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({
  blogPosts,
  isLoading,
  onEdit,
  onDelete
}) => {
  const [translatingArticles, setTranslatingArticles] = useState<Set<string>>(new Set());

  const handleTranslateToJapanese = async (articleId: string) => {
    setTranslatingArticles(prev => new Set(prev).add(articleId));
    
    try {
      const { data, error } = await supabase.functions.invoke('translate-article', {
        body: { articleId }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Translation completed",
          description: "Japanese version created as draft for review.",
        });
        // Refresh the page to show the new article
        window.location.reload();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Translation error:', error);
      toast({
        title: "Translation failed",
        description: error.message || "Failed to translate article",
        variant: "destructive",
      });
    } finally {
      setTranslatingArticles(prev => {
        const newSet = new Set(prev);
        newSet.delete(articleId);
        return newSet;
      });
    }
  };
  // Separate posts by status and language
  const draftPosts = blogPosts.filter(post => post.status === "draft");
  const publishedPosts = blogPosts.filter(post => post.status === "published");
  const englishPosts = blogPosts.filter(post => (post as any).language === 'EN' || !(post as any).language);
  const japanesePosts = blogPosts.filter(post => (post as any).language === 'JP');

  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading blog posts...</span>
        </div>
      </Card>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
        <div className="p-8 text-center">
          <p className="text-gray-500">No blog posts found. Create your first blog post!</p>
        </div>
      </Card>
    );
  }

  // Create a table for the given posts
  const renderPostsTable = (posts: BlogArticle[]) => {
    if (posts.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">No posts in this category.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="font-medium">Title</TableHead>
            <TableHead className="font-medium">Category</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Language</TableHead>
            <TableHead className="font-medium">Date</TableHead>
            <TableHead className="text-right font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.id} className="hover:bg-gray-50 transition-colors">
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>
                <StatusBadge status={post.status} />
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  {(post as any).language || 'EN'}
                </span>
              </TableCell>
              <TableCell>
                {post.status === "published" 
                  ? new Date(post.publish_date!).toLocaleDateString() 
                  : new Date(post.updated_at).toLocaleDateString() + " (Last Modified)"
                }
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500 hover:text-blue-600"
                  onClick={() => onEdit(post)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                {((post as any).language || 'EN') === 'EN' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-green-600"
                    onClick={() => handleTranslateToJapanese(post.id)}
                    disabled={translatingArticles.has(post.id)}
                  >
                    {translatingArticles.has(post.id) ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Languages className="h-4 w-4 mr-1" />
                    )}
                    {translatingArticles.has(post.id) ? 'Translating...' : 'Translate to JP'}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-600"
                  onClick={() => onDelete(post.id || "")}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <Tabs defaultValue="all" className="p-0">
        <div className="border-b">
          <div className="px-4">
            <TabsList className="h-11">
              <TabsTrigger value="all" className="data-[state=active]:bg-background">
                All Posts ({blogPosts.length})
              </TabsTrigger>
              <TabsTrigger value="english" className="data-[state=active]:bg-background">
                🇺🇸 English ({englishPosts.length})
              </TabsTrigger>
              <TabsTrigger value="japanese" className="data-[state=active]:bg-background">
                🇯🇵 Japanese ({japanesePosts.length})
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-background">
                <Send className="h-4 w-4 mr-1" /> Published ({publishedPosts.length})
              </TabsTrigger>
              <TabsTrigger value="draft" className="data-[state=active]:bg-background">
                <Save className="h-4 w-4 mr-1" /> Drafts ({draftPosts.length})
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="overflow-x-auto">
          <TabsContent value="all" className="pt-0 pb-0">
            {renderPostsTable(blogPosts)}
          </TabsContent>
          <TabsContent value="english" className="pt-0 pb-0">
            {renderPostsTable(englishPosts)}
          </TabsContent>
          <TabsContent value="japanese" className="pt-0 pb-0">
            {renderPostsTable(japanesePosts)}
          </TabsContent>
          <TabsContent value="published" className="pt-0 pb-0">
            {renderPostsTable(publishedPosts)}
          </TabsContent>
          <TabsContent value="draft" className="pt-0 pb-0">
            {renderPostsTable(draftPosts)}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default BlogPostsTable;
