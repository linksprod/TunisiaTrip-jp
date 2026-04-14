
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadImage } from "@/utils/storageUtils";
import { toast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  currentImage,
  folder = "blog"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setErrorMessage(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      // Show preview immediately
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);
      setUploadProgress(30);

      console.log("Starting image upload to Supabase...");
      
      // Progress simulation with randomized increments for more natural feel
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = Math.floor(Math.random() * 8) + 3; // Random increment between 3-10
          const newProgress = prev + increment;
          return newProgress < 85 ? newProgress : prev; // Cap at 85%
        });
      }, 700);
      
      // Upload to Supabase storage with automatic compression
      const imageUrl = await uploadImage(file, folder);
      
      clearInterval(progressInterval);
      
      if (imageUrl) {
        setUploadProgress(100);
        onImageUploaded(imageUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully",
        });
      } else {
        // Revert preview if upload failed
        setPreviewUrl(currentImage || null);
        setErrorMessage("Failed to upload image. Please try again.");
        toast({
          title: "Upload failed",
          description: "Failed to upload image to storage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setErrorMessage("Error uploading image: " + (error as Error).message);
      setPreviewUrl(currentImage || null);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Reset progress after a delay
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center">
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />

        {/* Preview or Placeholder */}
        <div 
          className="relative w-full h-[200px] border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden"
          onClick={!isUploading ? triggerFileInput : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="mt-2 text-sm text-gray-500">Uploading & Optimizing...</span>
              
              {/* Progress bar */}
              <div className="w-4/5 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {uploadProgress < 100 ? 'Processing image...' : 'Finishing upload...'}
              </span>
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full group">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button 
                  type="button"
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center cursor-pointer p-6">
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="w-full mt-2 text-red-500 text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      {!isUploading && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={triggerFileInput}
          className="w-full flex items-center justify-center"
        >
          <Upload className="mr-2 h-4 w-4" />
          {previewUrl ? "Replace Image" : "Upload Image"}
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
