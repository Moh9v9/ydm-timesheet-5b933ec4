
import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
      if (users.some(existingUser => existingUser.email === user.email)) {
        throw new Error("A user with this email already exists");
      }
      
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required");
      
      // Use the imported URL directly from a hardcoded URL that matches what's in the client
      const supabaseUrl = "https://bkrfhlycvtmpoewlwpcc.supabase.co";
      
      // Call the edge function to create the user
      const response = await fetch(`${supabaseUrl}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          role: user.role,
          permissions: user.permissions
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create user");
      }
      
      const newUser: User = {
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        password: '',
        role: data.user.role,
        permissions: data.user.permissions
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
      
      const updateData: any = {};
      
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
          throw new Error(profileError.message);
        }
      }
      
      if (userData.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          id,
          { password: userData.password }
        );
        
        if (passwordError) {
          throw new Error(passwordError.message);
        }
      }
      
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
      
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        throw new Error(error.message);
      }
      
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
