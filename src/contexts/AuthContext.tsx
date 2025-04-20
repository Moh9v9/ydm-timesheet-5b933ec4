
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "1",
    fullName: "Admin User",
    email: "admin@ydm.com",
    password: "admin123",
    role: "admin",
    permissions: {
      view: true,
      edit: true,
      delete: true,
    },
  },
  {
    id: "2",
    fullName: "Regular User",
    email: "user@ydm.com",
    password: "user123",
    role: "user",
    permissions: {
      view: true,
      edit: false,
      delete: false,
    },
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("ydm_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("ydm_user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Find user with matching credentials
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    // Set user in state and localStorage
    setUser(foundUser);
    localStorage.setItem("ydm_user", JSON.stringify(foundUser));
    return foundUser;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("ydm_user");
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find((u) => u.email === email);
    if (!foundUser) {
      throw new Error("Email not found");
    }

    // In a real app, we would send an email with a reset link
    console.log(`Password reset requested for: ${email}`);
  };

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<void> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // In a real app, we would validate the token and update the user's password
    console.log(`Password reset with token: ${token}`);
  };

  // Update user profile
  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Update user data
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem("ydm_user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
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
