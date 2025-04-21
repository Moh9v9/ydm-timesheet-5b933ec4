
import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

export const useAuthOperations = () => {
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log("Attempting login with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error("No user returned after login");
        throw new Error("User not found");
      }

      console.log("Login successful, user data:", data.user.id);
      
      // Return the user data for immediate feedback
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

  return {
    login,
    logout: async () => {
      try {
        // Get the current session first to check if we're logged in
        const { data: sessionData } = await supabase.auth.getSession();
        
        // Only attempt to sign out if we have a session
        if (sessionData?.session) {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        } else {
          // If no session, consider it already logged out
          console.log("No active session found, already logged out");
        }

        // Force redirect to login page regardless of session status
        window.location.href = "/login";
      } catch (error: any) {
        console.error("Logout error:", error);
        // Force redirect to login page even if there was an error
        window.location.href = "/login";
      }
    },
    forgotPassword: async (email: string): Promise<void> => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/reset-password',
        });
        
        if (error) throw error;
      } catch (error: any) {
        console.error("Forgot password error:", error);
        throw new Error(error.message || "Failed to send password reset email");
      }
    },
    resetPassword: async (token: string, password: string): Promise<void> => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: password
        });
        
        if (error) throw error;
      } catch (error: any) {
        console.error("Reset password error:", error);
        throw new Error(error.message || "Failed to reset password");
      }
    },
    updateProfile: async (userData: Partial<User>): Promise<void> => {
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

        // If password change is requested, handle it properly
        if (userData.password && userData.currentPassword) {
          // First verify the current password by attempting to sign in
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email || user?.email || '',
            password: userData.currentPassword,
          });
          
          if (signInError) {
            throw new Error("Current password is incorrect");
          }
          
          // If verification succeeded, update the password
          const { error: passwordError } = await supabase.auth.updateUser({
            password: userData.password,
          });
          
          if (passwordError) throw passwordError;
        }

        // Update email if provided
        if (userData.email) {
          // Update email through Auth API
          const { error: emailError } = await supabase.auth.updateUser({
            email: userData.email,
          });
          
          if (emailError) throw emailError;
        }

        // Update profile data in the profiles table
        const updateData: any = {};
        
        if (userData.fullName) updateData.full_name = userData.fullName;
        if (userData.email) updateData.email = userData.email;
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
    }
  };
};
