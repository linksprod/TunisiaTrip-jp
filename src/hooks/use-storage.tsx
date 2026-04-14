
import { useState } from "react";
import { uploadImage, deleteImage, listImages, migrateExistingImages } from "@/utils/storageUtils";

export const useStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);

  const handleUpload = async (file: File, folder?: string) => {
    setIsUploading(true);
    try {
      return await uploadImage(file, folder);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    setIsDeleting(true);
    try {
      return await deleteImage(imageUrl);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleListImages = async (folder?: string) => {
    setIsLoading(true);
    try {
      return await listImages(folder);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateImages = async (imageUrls: string[], folder?: string) => {
    setIsMigrating(true);
    setMigrationProgress(0);
    try {
      // Setup progress tracking
      const updateProgress = (progress: number) => {
        setMigrationProgress(progress);
      };
      
      return await migrateExistingImages(imageUrls, folder, updateProgress);
    } finally {
      setIsMigrating(false);
      setMigrationProgress(100);
    }
  };

  return {
    uploadImage: handleUpload,
    deleteImage: handleDelete,
    listImages: handleListImages,
    migrateImages: handleMigrateImages,
    isUploading,
    isDeleting,
    isLoading,
    isMigrating,
    migrationProgress,
  };
};
