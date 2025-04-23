
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
        setUser(userData);
        const sessionInfo = { authenticated: true, timestamp: new Date().toISOString() };
        sessionStorage.setItem('authSession', JSON.stringify(sessionInfo));
        return userData;
      } catch (error) {
        throw error;
      }
    },
    logout: async () => {
      try {
        setUser(null);
        setSession(null);

        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
        localStorage.removeItem('authUser');
        localStorage.removeItem('authSession');

        return await operations.logout();
      } catch (error) {
        setUser(null);
        setSession(null);
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
        throw error;
      }
    },
    updateProfile: async (userData: UpdateProfileParams) => {
      try {
        await operations.updateProfile(userData);

        if (user) {
          setUser({
            ...user,
            ...userData,
            password: user.password
          });

          const storedUser = sessionStorage.getItem('authUser');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const updatedUser = { ...parsedUser, ...userData, password: parsedUser.password };
            sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
          }
        }
      } catch (error) {
        throw error;
      }
    },
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
