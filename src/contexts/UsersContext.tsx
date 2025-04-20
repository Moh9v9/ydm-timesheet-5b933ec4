
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, UserPermissions } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) {
          console.error("Error loading users:", error);
          return;
        }
        
        if (profiles) {
          // Convert profiles to User[] format
          const loadedUsers: User[] = profiles.map(profile => ({
            id: profile.id,
            fullName: profile.full_name,
            email: profile.email,
            password: '', // We don't store or return passwords
            role: profile.role as UserRole,
            permissions: profile.permissions as UserPermissions
          }));
          
          setUsers(loadedUsers);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Get user by ID
  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Add new user
  const addUser = async (user: Omit<User, "id">): Promise<User> => {
    setLoading(true);
    
    try {
      // Check if email already exists
      if (users.some(existingUser => existingUser.email === user.email)) {
        throw new Error("A user with this email already exists");
      }
      
      // Step 1: Create the user in Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          fullName: user.fullName,
          role: user.role,
          permissions: user.permissions
        }
      });
      
      if (authError || !authData.user) {
        throw new Error(authError?.message || "Failed to create user in authentication system");
      }
      
      // The profile should be created automatically via our trigger
      // But we'll update users state for immediate UI update
      const newUser: User = {
        id: authData.user.id,
        fullName: user.fullName,
        email: user.email,
        password: '', // Don't store the password
        role: user.role,
        permissions: user.permissions
      };
      
      setUsers([...users, newUser]);
      return newUser;
    } catch (error: any) {
      console.error("Add user error:", error);
      throw new Error(error.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    
    try {
      // Check if email already exists (if email is being updated)
      if (userData.email) {
        const emailExists = users.some(
          existingUser => existingUser.email === userData.email && existingUser.id !== id
        );
        if (emailExists) {
          throw new Error("A user with this email already exists");
        }
      }
      
      const updateData: any = {};
      
      // Update profile in profiles table
      if (userData.fullName) updateData.full_name = userData.fullName;
      if (userData.email) updateData.email = userData.email;
      if (userData.role) updateData.role = userData.role;
      if (userData.permissions) updateData.permissions = userData.permissions;
      
      if (Object.keys(updateData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);
          
        if (profileError) {
          throw new Error(profileError.message || "Failed to update user profile");
        }
      }
      
      // If password is being updated
      if (userData.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          id,
          { password: userData.password }
        );
        
        if (passwordError) {
          throw new Error(passwordError.message || "Failed to update user password");
        }
      }
      
      // Update users state
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          return { ...user, ...userData, password: '' };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      const updatedUser = updatedUsers.find(user => user.id === id);
      if (!updatedUser) {
        throw new Error("User not found");
      }
      
      return updatedUser;
    } catch (error: any) {
      console.error("Update user error:", error);
      throw new Error(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Prevent deletion of all admin users
      const adminUsers = users.filter(user => user.role === "admin");
      const userToDelete = users.find(user => user.id === id);
      
      if (adminUsers.length === 1 && userToDelete?.role === "admin") {
        throw new Error("Cannot delete the last admin user");
      }
      
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        throw new Error(error.message || "Failed to delete user");
      }
      
      // The profile should be auto-deleted by the ON DELETE CASCADE constraint
      setUsers(users.filter(user => user.id !== id));
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw new Error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
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
