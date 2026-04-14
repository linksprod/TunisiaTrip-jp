import React, { useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageInserted: (imageUrl: string) => void;
  triggerId?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageInserted, triggerId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = (file: File, maxSizeKB: number = 80): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions to maintain aspect ratio
        let { width, height } = img;
        const maxDimension = 1200; // Maximum width or height

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality and reduce until we meet size requirements
        let quality = 0.9;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const sizeKB = blob.size / 1024;
                if (sizeKB <= maxSizeKB || quality <= 0.1) {
                  resolve(blob);
                } else {
                  quality -= 0.1;
                  tryCompress();
                }
              }
            },
            'image/webp',
            quality
          );
        };

        tryCompress();
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Traitement en cours",
        description: "Compression et upload de l'image...",
      });

      // Compress the image
      const compressedBlob = await compressImage(file);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `blog_image_${timestamp}_${randomString}.webp`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      // Insert the image markdown into the editor
      onImageInserted(publicUrl);

      toast({
        title: "Image ajoutée",
        description: `Image compressée (${Math.round(compressedBlob.size / 1024)}KB) et uploadée avec succès.`,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader l'image. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={triggerFileSelect}
        className="hidden"
        id={triggerId || "image-uploader-trigger"}
      />
    </>
  );
};