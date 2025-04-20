
import { User, Session } from "@supabase/supabase-js";
import { UserRole, UserPermissions } from "@/lib/types";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  permissions: Record<string, unknown>;
}
