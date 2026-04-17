import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add a cache to prevent repeated admin checks
let adminStatusCache: { [key: string]: boolean } = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof window === 'undefined') {
    console.log('[SSR] AuthProvider: Rendering on server');
  }
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // This function will be used to check admin status using the security definer function
  const checkAdminStatus = async (userId: string) => {
    try {
      // Check cache first
      if (adminStatusCache[userId] !== undefined) {
        console.log('Using cached admin status for user:', userId);
        setIsAdmin(adminStatusCache[userId]);
        return;
      }

      console.log('Checking admin status for user:', userId);

      // Use the security definer function to avoid RLS recursion
      const { data, error } = await supabase.rpc('is_user_admin', {
        user_id: userId
      });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      console.log('User admin status response:', data);
      const isAdminValue = data ?? false;

      // Cache the result
      adminStatusCache[userId] = isAdminValue;
      setIsAdmin(isAdminValue);

    } catch (error) {
      console.error('Exception checking admin status:', error);
      setIsAdmin(false);
    }
  };

  // Clear cache on logout
  const clearCache = () => {
    adminStatusCache = {};
  };

  useEffect(() => {
    // Set initial loading state
    setIsLoading(true);
    console.log('AuthProvider: Initializing auth state at', new Date().toISOString());

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_OUT') {
          clearCache();
        }

        // Always update the session and user state immediately
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Fetch admin status if we have a user
        if (newSession?.user) {
          // Use setTimeout to avoid Supabase auth deadlocks
          setTimeout(() => {
            checkAdminStatus(newSession.user!.id);
          }, 0);
        } else {
          setIsAdmin(null);
        }

        // Only set loading to false after all checks
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Got existing session:', currentSession ? 'yes' : 'no');

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        // Immediate feedback that user is logged in
        setIsLoading(false);

        // Then check admin status in the background
        checkAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(null);
        setIsLoading(false);
      }
    }).catch(error => {
      console.error('Failed to get session:', error);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign in with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Signed in successfully",
        description: "Welcome back!"
      });

      // Don't need to manually update state or navigate, the auth state listener will handle it
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        title: "Error signing in",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
      throw error; // Re-throw for component to handle
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Account created",
        description: "Please check your email for verification instructions.",
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        title: "Error creating account",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();

      // Clear all auth state
      setUser(null);
      setSession(null);
      setIsAdmin(null);

      toast({
        title: "Signed out successfully"
      });

      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isLoading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
