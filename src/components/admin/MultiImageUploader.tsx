import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStorage } from '@/hooks/use-storage';
import { toast } from 'sonner';

interface MultiImageUploaderProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  currentImages?: string[];
  folder?: string;
  maxImages?: number;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  onImagesUploaded,
  currentImages = [],
  folder = "website",
  maxImages = 4
}) => {
  const [images, setImages] = useState<string[]>(currentImages);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useStorage();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the max limit
    if (images.length + files.length > maxImages) {
      toast.error(`Vous ne pouvez ajouter que ${maxImages} images maximum`);
      return;
    }

    // Process files sequentially to avoid race conditions
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`Le fichier ${file.name} n'est pas une image valide`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
        continue;
      }

      try {
        setUploadingIndex(images.length);
        const imageUrl = await uploadImage(file, folder);
        
        if (imageUrl) {
          setImages(prevImages => {
            const newImages = [...prevImages, imageUrl];
            onImagesUploaded(newImages);
            return newImages;
          });
          toast.success(`Image ${file.name} ajoutée avec succès`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Erreur lors de l'upload de ${file.name}`);
      } finally {
        setUploadingIndex(null);
      }
    }
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUploaded(newImages);
    toast.success('Image removed');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
        <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-4">
        {images.map((imageUrl, index) => (
          <Card key={index} className="relative group">
            <CardContent className="p-2">
              <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {uploadingIndex !== null && (
          <Card className="border-dashed border-2 border-primary/50">
            <CardContent className="p-2">
              <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {images.length < maxImages && uploadingIndex === null && (
          <Card 
            className="border-dashed border-2 border-gray-300 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={triggerFileInput}
          >
            <CardContent className="p-2">
              <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                <div className="text-center space-y-2">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">
                    Add Image ({images.length}/{maxImages})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No images uploaded yet</p>
          <Button onClick={triggerFileInput} disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload First Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiImageUploader;