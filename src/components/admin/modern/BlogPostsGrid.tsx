import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  Copy, 
  Calendar, 
  User, 
  Clock,
  Languages,
  Loader2,
  MoreHorizontal,
  Search,
  Filter
} from "lucide-react";
import { BlogArticle } from "@/types/blog";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface BlogPostsGridProps {
  blogPosts: BlogArticle[];
  isLoading: boolean;
  onEdit: (post: BlogArticle) => void;
  onDelete: (id: string) => void;
  onView?: (post: BlogArticle) => void;
  onDuplicate?: (post: BlogArticle) => void;
}

export const BlogPostsGrid: React.FC<BlogPostsGridProps> = ({
  blogPosts,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onDuplicate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [translatingArticles, setTranslatingArticles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

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

  // Filter posts based on search and filters
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    
    const postLanguage = (post as any).language || 'EN';
    const matchesLanguage = languageFilter === "all" || postLanguage === languageFilter;
    
    return matchesSearch && matchesStatus && matchesLanguage;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getImageUrl = (post: BlogArticle) => {
    if (!post.image) return "/placeholder.svg";
    return post.image.startsWith('http') ? post.image : `/uploads/${post.image}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[120px]">
              <Languages className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="EN">🇺🇸 English</SelectItem>
              <SelectItem value="JP">🇯🇵 Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            {searchTerm || statusFilter !== "all" || languageFilter !== "all" 
              ? "No articles found matching your filters."
              : "No blog posts found. Create your first blog post!"
            }
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(post)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <StatusBadge status={post.status} />
                  <Badge variant="outline" className="bg-background/80 backdrop-blur">
                    {(post as any).language || 'EN'}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-background/80 backdrop-blur hover:bg-background">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Article
                      </DropdownMenuItem>
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(post)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                      )}
                      {onDuplicate && (
                        <DropdownMenuItem onClick={() => onDuplicate(post)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                      )}
                      {((post as any).language || 'EN') === 'EN' && (
                        <DropdownMenuItem 
                          onClick={() => handleTranslateToJapanese(post.id)}
                          disabled={translatingArticles.has(post.id)}
                        >
                          {translatingArticles.has(post.id) ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Languages className="h-4 w-4 mr-2" />
                          )}
                          {translatingArticles.has(post.id) ? 'Translating...' : 'Translate to JP'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(post.id || "")}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <CardHeader className="pb-3">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.status === "published" && post.publish_date
                      ? formatDate(post.publish_date)
                      : formatDate(post.updated_at || post.created_at || "")
                    }
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
              </CardContent>

              {/* Quick Actions */}
              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(post)}
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(post)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Results Summary */}
      {filteredPosts.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {filteredPosts.length} of {blogPosts.length} articles
        </div>
      )}
    </div>
  );
};