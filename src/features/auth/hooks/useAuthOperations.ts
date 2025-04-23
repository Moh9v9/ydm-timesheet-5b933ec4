
import { User } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { getUserByEmailAndPassword, updateUserRole, addUser } from "@/lib/googleSheets";
import { toast } from "sonner";
import { UpdateProfileParams } from "@/features/auth/types";

export const useAuthOperations = () => {
  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log("🔐 Attempting login via Google Sheets...", email);
      
      if (!email || !password) {
        console.warn("❌ Email and password are required");
        toast.error("Email and password are required");
        throw new Error("Email and password are required");
      }
      
      const user = await getUserByEmailAndPassword(email, password);

      if (!user) {
        console.warn("❌ Invalid email or password");
        toast.error("Invalid email or password");
        throw new Error("Invalid email or password");
      }

      const { id, fullName, role } = user;

      const permissions =
        role === "admin"
          ? {
              employees: { view: true, edit: true, delete: true },
              attendees: { view: true, edit: true },
              export: true,
            }
          : {
              employees: { view: true, edit: false, delete: false },
              attendees: { view: true, edit: true },
              export: false,
            };

      const userData: User = {
        id: id || uuidv4(),
        fullName: fullName || "",
        email,
        password: "",
        role: role || "user",
        permissions,
      };

      // Store authentication state in sessionStorage
      sessionStorage.setItem('authUser', JSON.stringify(userData));
      
      console.log("✅ Login successful:", userData);
      toast.success(`Welcome back, ${userData.fullName}`);
      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw new Error(error.message || "Failed to login");
    }
  };

  const logout = async () => {
    console.log("🔓 Logging out...");
    
    // Clear all authentication data from sessionStorage
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('authSession');
    
    // Clear any other auth-related storage
    localStorage.removeItem('authUser');
    localStorage.removeItem('authSession');
    
    toast.success("Logged out successfully");
    return Promise.resolve();
  };

  // Add the missing updateProfile function
  const updateProfile = async (userData: UpdateProfileParams) => {
    try {
      console.log("🔄 Updating user profile:", userData);
      
      // For now, only support updating the role if that's what was provided
      if (userData.role && userData.id) {
        await updateUserRole(userData.id, userData.role);
        
        // Update stored authentication data if it exists
        const storedUser = sessionStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.role = userData.role;
          sessionStorage.setItem('authUser', JSON.stringify(parsedUser));
        }
        
        toast.success("Profile updated successfully");
        return;
      }
      
      // For other updates, we'd need to implement more functions in googleSheets.ts
      // This is a placeholder for future implementation
      toast.info("Profile update functionality is limited in this version");
      
      return;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      throw new Error(error.message || "Failed to update profile");
    }
  };

  // Add missing forgotPassword and resetPassword functions
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      console.log("📧 Processing password reset for:", email);
      // In a real app, we would send an email with a reset link
      // For now, just show a success message
      toast.success(`If an account exists for ${email}, a password reset link has been sent.`);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      // Still show success even if error (security best practice - don't reveal if email exists)
      toast.success(`If an account exists for ${email}, a password reset link has been sent.`);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<void> => {
    try {
      console.log("🔑 Resetting password with token:", token);
      // In a real app, we would validate the token and update the password
      // For now, just show a success message
      toast.success("Password has been reset successfully. Please log in with your new password.");
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password");
      throw new Error(error.message || "Failed to reset password");
    }
  };

  return { login, logout, updateProfile, forgotPassword, resetPassword };
};
