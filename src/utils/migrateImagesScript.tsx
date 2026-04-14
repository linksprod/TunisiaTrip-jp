import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, UploadCloud } from "lucide-react";
import { uploadImage, migrateExistingImages } from "@/utils/storageUtils";
import { toast } from "@/components/ui/use-toast";

// Specifically target Lovable uploads patterns
const LOVABLE_UPLOAD_PATTERNS = [
  '/lovable-uploads/',
  'https://lovable-uploads.',
  '.lovableproject.com/'
];

// Function to extract images from HTML
const extractImagesFromHtml = (html: string): string[] => {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const cssRegex = /url\(['"]?([^'"()]+)['"]?\)/g;
  const results: string[] = [];
  let match;
  
  // Extract from img tags
  while ((match = imgRegex.exec(html)) !== null) {
    const url = match[1];
    // Specifically look for Lovable uploads
    if (LOVABLE_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) && 
        !url.endsWith('.svg') &&
        !url.startsWith('data:image/svg')) {
      results.push(url);
    }
  }
  
  // Extract from CSS background URLs
  while ((match = cssRegex.exec(html)) !== null) {
    const url = match[1];
    if (LOVABLE_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) && 
        !url.endsWith('.svg') &&
        !url.startsWith('data:image/svg')) {
      results.push(url);
    }
  }
  
  return [...new Set(results)]; // Remove duplicates
};

const ImageMigrationTool: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [lovableImages, setLovableImages] = useState<string[]>([]);
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [migrationResults, setMigrationResults] = useState<{
    success: number;
    failed: number;
    urls: Record<string, string>;
  } | null>(null);

  // Scan the site specifically for Lovable uploads
  const scanWebsiteForLovableUploads = async () => {
    try {
      setIsScanning(true);
      toast({
        title: "Scanning website",
        description: "Looking for Lovable upload images across the website...",
      });
      
      // Get HTML content from current page
      const currentPageHtml = document.documentElement.outerHTML;
      
      // Specifically look for Lovable uploads
      const lovableUploadsFromCurrentPage = extractImagesFromHtml(currentPageHtml);
      
      // Get HTML content from key pages to extract images
      const pagesToScan = [
        '/',
        '/about',
        '/blog',
        '/travel',
        '/admin',
        '/atlantis'
      ];
      
      const foundImages: string[] = [];
      foundImages.push(...lovableUploadsFromCurrentPage);
      
      // Scan other main pages
      for (const path of pagesToScan) {
        try {
          const response = await fetch(path);
          if (!response.ok) continue;
          
          const html = await response.text();
          const pageImages = extractImagesFromHtml(html);
          foundImages.push(...pageImages);
        } catch (error) {
          console.error(`Error scanning page ${path}:`, error);
        }
      }
      
      // Process image URLs to make them absolute
      const processedImages = foundImages.map(src => {
        // Skip data URLs
        if (src.startsWith('data:')) return null;
        
        // Handle relative URLs
        if (src.startsWith('/')) {
          return window.location.origin + src;
        }
        
        // Keep absolute URLs as is
        if (src.startsWith('http')) {
          return src;
        }
        
        // Handle relative URLs without leading slash
        return window.location.origin + '/' + src;
      }).filter(Boolean) as string[];
      
      // Filter out non-Lovable uploads
      const filteredLovableImages = processedImages.filter(url => {
        if (!url) return false;
        
        // Only include Lovable uploads
        return LOVABLE_UPLOAD_PATTERNS.some(pattern => url.includes(pattern)) &&
               !url.endsWith('.svg');
      });
      
      // Remove duplicates
      const uniqueImages = [...new Set(filteredLovableImages)];
      setLovableImages(uniqueImages);
      
      toast({
        title: "Scan complete",
        description: `Found ${uniqueImages.length} unique Lovable upload images`,
      });
    } catch (error) {
      console.error("Error scanning website for images:", error);
      toast({
        title: "Scan failed",
        description: "Failed to scan website for Lovable upload images",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  // Migrate found Lovable uploads to Supabase
  const handleMigrateLovableImages = async () => {
    if (lovableImages.length === 0) {
      toast({
        title: "No images to migrate",
        description: "Please scan the website for Lovable upload images first",
      });
      return;
    }
    
    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      toast({
        title: "Starting migration",
        description: `Migrating ${lovableImages.length} Lovable images to Supabase...`,
      });
      
      // Start migration and track progress
      const results = await migrateExistingImages(lovableImages, 'website', (progress) => {
        setMigrationProgress(progress);
      });
      
      setMigrationResults(results);
      setMigrationCompleted(true);
      
      toast({
        title: "Migration complete",
        description: `Successfully migrated ${results.success} images, failed: ${results.failed}`,
        variant: results.failed > 0 ? "destructive" : "default"
      });
      
      // Download migration mapping as JSON
      const blob = new Blob([JSON.stringify(results.urls, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image_migration_mapping.json';
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Add migration mapping to console for reference
      console.log("Image URL mapping:", results.urls);
    } catch (error) {
      console.error("Error migrating images:", error);
      toast({
        title: "Migration failed",
        description: "An error occurred during migration",
        variant: "destructive"
      });
    } finally {
      setIsMigrating(false);
      setMigrationProgress(100);
    }
  };

  // Run scan on mount
  useEffect(() => {
    scanWebsiteForLovableUploads();
  }, []);

  return (
    <Card className="p-6 border border-gray-200 shadow-sm max-w-2xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6">One-Time Image Migration Tool</h1>
      <p className="text-gray-600 mb-6">
        This utility will scan the website for Lovable upload images and migrate them to Supabase storage with compression.
        All images will be compressed to max 400KB and converted to WebP format.
      </p>
      
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={scanWebsiteForLovableUploads}
            disabled={isScanning || isMigrating}
            variant="outline"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              "Scan Website Again"
            )}
          </Button>
          
          <Button
            onClick={handleMigrateLovableImages}
            disabled={isMigrating || lovableImages.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isMigrating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Migrating... {migrationProgress}%
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                Migrate {lovableImages.length} Images
              </>
            )}
          </Button>
        </div>
        
        {isMigrating && (
          <div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all"
                style={{ width: `${migrationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center mt-1">{migrationProgress}% Complete</p>
          </div>
        )}
        
        {migrationCompleted && migrationResults && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-800">Migration Completed</h3>
            <p>Successfully migrated: {migrationResults.success} images</p>
            <p>Failed: {migrationResults.failed} images</p>
            <p className="mt-2 text-sm text-gray-600">A JSON file with the URL mapping has been downloaded.</p>
            <p className="text-sm text-gray-600">You can also check the browser console for the mapping.</p>
            <p className="mt-4 font-semibold">After verification, you can remove this tool from your project.</p>
          </div>
        )}
        
        {lovableImages.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Found Lovable Uploads ({lovableImages.length})</h3>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              <ul className="space-y-1 text-xs">
                {lovableImages.map((url, idx) => (
                  <li key={idx} className="truncate text-blue-600 hover:underline">
                    <a href={url} target="_blank" rel="noreferrer">{url}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageMigrationTool;
