
import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, UserPermissions } from "@/lib/types";

// Mock data for users
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
  {
    id: "3",
    fullName: "Manager User",
    email: "manager@ydm.com",
    password: "manager123",
    role: "user",
    permissions: {
      view: true,
      edit: true,
      delete: false,
    },
  },
];

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, "id">) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUser: (id: string) => User | undefined;
  loading: boolean;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);

  // Get user by ID
  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Add new user
  const addUser = async (user: Omit<User, "id">): Promise<User> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if email already exists
    if (users.some(existingUser => existingUser.email === user.email)) {
      setLoading(false);
      throw new Error("A user with this email already exists");
    }
    
    // Generate new ID
    const newUser: User = {
      ...user,
      id: `${Date.now()}`,
    };
    
    setUsers([...users, newUser]);
    setLoading(false);
    return newUser;
  };

  // Update user
  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Check if email already exists (if email is being updated)
    if (userData.email) {
      const emailExists = users.some(
        existingUser => existingUser.email === userData.email && existingUser.id !== id
      );
      if (emailExists) {
        setLoading(false);
        throw new Error("A user with this email already exists");
      }
    }
    
    const updatedUsers = users.map(user => {
      if (user.id === id) {
        return { ...user, ...userData };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setLoading(false);
    
    const updatedUser = updatedUsers.find(user => user.id === id);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  };

  // Delete user
  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Prevent deletion of all admin users
    const adminUsers = users.filter(user => user.role === "admin");
    const userToDelete = users.find(user => user.id === id);
    
    if (adminUsers.length === 1 && userToDelete?.role === "admin") {
      setLoading(false);
      throw new Error("Cannot delete the last admin user");
    }
    
    setUsers(users.filter(user => user.id !== id));
    setLoading(false);
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUser,
        loading
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
