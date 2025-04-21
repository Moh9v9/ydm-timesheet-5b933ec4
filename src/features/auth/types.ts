
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { User } from "@/lib/types";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: UpdateProfileParams) => Promise<void>;
}

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: string;
  permissions: any;
}

// Add this new interface for updateProfile parameters
export interface UpdateProfileParams extends Partial<User> {
  currentPassword?: string; // Add this property for password verification
}
