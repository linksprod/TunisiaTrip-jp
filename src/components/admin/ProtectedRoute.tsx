
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  requireAdmin = false, 
  children 
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Enhanced debugging
  useEffect(() => {
    console.log('ProtectedRoute mounted:', { 
      user: !!user, 
      isAdmin, 
      isLoading, 
      requireAdmin, 
      route: window.location.pathname,
      locationPathname: location.pathname
    });
  }, [user, isAdmin, isLoading, requireAdmin, location]);

  // Handle toast notifications in useEffect to avoid render loops
  useEffect(() => {
    if (!user && !isLoading) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive"
      });
    }
  }, [user, isLoading, toast]);

  useEffect(() => {
    if (requireAdmin && user && isAdmin === false) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page",
        variant: "destructive"
      });
    }
  }, [requireAdmin, user, isAdmin, toast]);

  // Simplified authentication logic with faster checks
  // Show loading for a shorter time
  if (isLoading && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-admin-primary" />
          <p className="mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    console.log('User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // For admin routes, check admin status
  // But don't wait too long if we've verified the user
  if (requireAdmin) {
    // Still checking admin - only show brief loading
    if (isAdmin === null) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-admin-primary" />
            <p className="mt-2">Verifying admin privileges...</p>
          </div>
        </div>
      );
    }
    
    // Authenticated but not admin when admin is required
    if (isAdmin === false) {
      console.log('User authenticated but not admin, showing access denied');
      return (
        <div className="flex h-screen flex-col items-center justify-center text-center p-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You don't have admin privileges to access this page.
          </p>
          <p className="mt-1 text-gray-600">
            Please contact an administrator if you believe this is an error.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="mt-6"
          >
            Return to Home
          </Button>
        </div>
      );
    }
  }

  // User is authenticated and has required privileges
  console.log('User authenticated and has required privileges, rendering content');
  return children ? <>{children}</> : <Outlet />;
};

// Separate export to avoid circular dependency issues
export const AdminProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <ProtectedRoute requireAdmin={true}>{children}</ProtectedRoute>;
};
