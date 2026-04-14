
import React from "react";
import { EnhancedAdminLayout } from "@/components/admin/modern/EnhancedAdminLayout";
import { MediaLibrary } from "@/components/admin/modern/MediaLibrary";

const AdminMediaPage = () => {
  return (
    <EnhancedAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Media Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage website images with automatic compression and WebP conversion.
          </p>
        </div>
        
        <MediaLibrary />
      </div>
    </EnhancedAdminLayout>
  );
};

export default AdminMediaPage;
