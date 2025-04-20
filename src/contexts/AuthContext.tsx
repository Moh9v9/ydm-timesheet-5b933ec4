
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "@/features/auth/types";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
import { useAuthOperations } from "@/features/auth/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading, setUser, setSession } = useAuthState();
  const operations = useAuthOperations();

  // Enhance logout to also clear local state
  const enhancedOperations = {
    ...operations,
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
