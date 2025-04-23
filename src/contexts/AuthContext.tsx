
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType, UpdateProfileParams } from "@/features/auth/types";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
import { useAuthOperations } from "@/features/auth/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading, setUser, setSession } = useAuthState();
  const operations = useAuthOperations();

  // Enhance login to update local state immediately
  const enhancedOperations = {
    ...operations,
    login: async (email: string, password: string) => {
      try {
        const userData = await operations.login(email, password);
        // Update local state immediately for faster UI feedback
        setUser(userData);
        // Store session information
        const sessionInfo = { authenticated: true, timestamp: new Date().toISOString() };
        sessionStorage.setItem('authSession', JSON.stringify(sessionInfo));
        return userData;
      } catch (error) {
        console.error("Enhanced login error:", error);
        throw error;
      }
    },
    logout: async () => {
      try {
        // First clear local state
        setUser(null);
        setSession(null);
        
        // Clear all authentication data from storage
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authSession');
        
        // Then call the original logout
        return await operations.logout();
      } catch (error) {
        console.error("Enhanced logout error:", error);
        // Still clear state even if logout fails
        setUser(null);
        setSession(null);
        // Clear storage as well
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
        throw error;
      }
    },
    updateProfile: async (userData: UpdateProfileParams) => {
      try {
        await operations.updateProfile(userData);
        
        // Update local state to reflect changes
        if (user) {
          setUser({
            ...user,
            ...userData,
            // Don't update password in local state
            password: user.password
          });
          
          // Update stored user data if it exists
          const storedUser = sessionStorage.getItem('authUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = { ...parsedUser, ...userData, password: parsedUser.password };
            sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        console.error("Enhanced update profile error:", error);
        throw error;
      }
    },
    // Make sure forgotPassword and resetPassword are included
    forgotPassword: operations.forgotPassword,
    resetPassword: operations.resetPassword
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    ...enhancedOperations
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
