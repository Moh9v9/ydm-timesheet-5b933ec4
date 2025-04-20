import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAuthOperations = () => {
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
        role: 'user',
        permissions: {
          employees: {
            view: false,
            edit: false,
            delete: false
          },
          attendees: {
            view: false,
            edit: false
          },
          export: false
        },
      };
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message || "Failed to logout");
    }
  };

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

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      // Make sure we have a valid user ID
      if (!userData.id) {
        // Get current user ID if not provided
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        userData.id = user.id;
      }

      // Update user metadata in auth.users if fullName is provided
      if (userData.fullName) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: userData.fullName,
            fullName: userData.fullName, // Include both formats for compatibility
          }
        });
        
        if (metadataError) throw metadataError;
      }

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
          .eq('id', userData.id);
          
        if (profileError) throw profileError;
      }
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Failed to update profile");
    }
  };

  return {
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile
  };
};
