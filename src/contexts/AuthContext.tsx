
import { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "@/features/auth/types";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
import { useAuthOperations } from "@/features/auth/hooks/useAuthOperations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, session, loading } = useAuthState();
  const operations = useAuthOperations();

  const value = {
    user,
    session,
    loading,
    ...operations
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
