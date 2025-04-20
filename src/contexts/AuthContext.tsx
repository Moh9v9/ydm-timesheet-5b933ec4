
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // We need to fetch the profile information to get role and permissions
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user profile:", error);
                return;
              }
              
              if (profile) {
                // Convert profile data to User type with proper type conversion for permissions
                // Parse the permissions object safely and handle it could be an array or other type
                let permissionsObj: Record<string, unknown> = {};
                
                if (typeof profile.permissions === 'object' && profile.permissions !== null && !Array.isArray(profile.permissions)) {
                  permissionsObj = profile.permissions as Record<string, unknown>;
                }
                
                const userData: User = {
                  id: currentSession.user.id,
                  fullName: profile.full_name,
                  email: profile.email,
                  password: '', // We don't store or return passwords
                  role: profile.role as any,
                  permissions: {
                    view: Boolean(permissionsObj.view),
                    edit: Boolean(permissionsObj.edit),
                    delete: Boolean(permissionsObj.delete)
                  }
                };
                
                setUser(userData);
              }
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }
          
          if (profile) {
            // Parse the permissions object safely and handle it could be an array or other type
            let permissionsObj: Record<string, unknown> = {};
            
            if (typeof profile.permissions === 'object' && profile.permissions !== null && !Array.isArray(profile.permissions)) {
              permissionsObj = profile.permissions as Record<string, unknown>;
            }
            
            const userData: User = {
              id: currentSession.user.id,
              fullName: profile.full_name,
              email: profile.email,
              password: '', // We don't store or return passwords
              role: profile.role as any,
              permissions: {
                view: Boolean(permissionsObj.view),
                edit: Boolean(permissionsObj.edit),
                delete: Boolean(permissionsObj.delete)
              }
            };
            
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("User not found");
      }

      // User profile data will be fetched by the onAuthStateChange listener
      // Return a temporary user object for immediate feedback
      return {
        id: data.user.id,
        fullName: data.user.user_metadata.fullName || '',
        email: data.user.email || '',
        password: '',
        role: 'user', // Default, will be updated by listener
        permissions: {
          view: true,
          edit: false,
          delete: false,
        },
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw new Error(error.message || "Failed to send password reset email");
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(error.message || "Failed to reset password");
    }
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    if (!user || !session) {
      throw new Error("User not authenticated");
    }

    try {
      // If password is provided, update it through Auth API
      if (userData.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: userData.password,
        });
        
        if (passwordError) throw passwordError;
      }

      // Update profile data in the profiles table
      const updateData: any = {};
      
      if (userData.fullName) updateData.full_name = userData.fullName;
      if (userData.email) {
        // Update email through Auth API
        const { error: emailError } = await supabase.auth.updateUser({
          email: userData.email,
        });
        
        if (emailError) throw emailError;
        
        // Also update in profiles table
        updateData.email = userData.email;
      }
      if (userData.role) updateData.role = userData.role;
      if (userData.permissions) updateData.permissions = userData.permissions;

      // Only update profile if there's data to update
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);
          
        if (profileError) throw profileError;
      }

      // Update local user state with the new data
      setUser({ ...user, ...userData, password: '' });
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Failed to update profile");
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
