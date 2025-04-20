
import { User } from "@/lib/types";

export interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, "id">) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => User | undefined;
  loading: boolean;
}
