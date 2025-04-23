
import { User } from "@/lib/types";

export const useUsersOperations = (
  users: User[], 
  setUsers: (users: User[]) => void,
  setLoading: (loading: boolean) => void
) => {
  const getUser = (id: string) => {
    return users.find(user => user.id === id);
  };

  const addUser = async (user: Omit<User, "id">): Promise<User> => {
    setLoading(true);
    
    try {
      console.log("Starting user creation process...");
      
      if (users.some(existingUser => existingUser.email === user.email)) {
        throw new Error("A user with this email already exists");
      }
      
      // Generate a unique ID for the new user (since Supabase is removed)
      const newUserId = crypto.randomUUID();
      
      const newUser: User = {
        id: newUserId,
        fullName: user.fullName,
        email: user.email,
        password: '',
        role: user.role,
        permissions: user.permissions
      };
      
      // Save the new user to storage
      // This is just a placeholder for now - in a real app, you'd save to Google Sheets
      console.log("User created successfully:", newUser);
      
      setUsers([...users, newUser]);
      return newUser;
    } catch (error: any) {
      console.error("Add user error:", error);
      throw error; // Preserve the original error to show proper message
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setLoading(true);
    
    try {
      if (userData.email) {
        const emailExists = users.some(
          existingUser => existingUser.email === userData.email && existingUser.id !== id
        );
        if (emailExists) {
          throw new Error("A user with this email already exists");
        }
      }
      
      // Update user in the local state
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

  const deleteUser = async (id: string): Promise<void> => {
    setLoading(true);
    
    try {
      const adminUsers = users.filter(user => user.role === "admin");
      const userToDelete = users.find(user => user.id === id);
      
      if (adminUsers.length === 1 && userToDelete?.role === "admin") {
        throw new Error("Cannot delete the last admin user");
      }
      
      // Remove user from local state
      setUsers(users.filter(user => user.id !== id));
    } catch (error: any) {
      console.error("Delete user error:", error);
      throw new Error(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return {
    getUser,
    addUser,
    updateUser,
    deleteUser
  };
};
