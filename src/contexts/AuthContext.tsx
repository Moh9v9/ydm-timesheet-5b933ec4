
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "@/features/auth/types";
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
        // We'll let the auth state listener handle the session and user update
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
        // Then call the original logout
        return await operations.logout();
      } catch (error) {
        console.error("Enhanced logout error:", error);
        // Still clear state even if logout fails
        setUser(null);
        setSession(null);
        throw error;
      }
    }
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
