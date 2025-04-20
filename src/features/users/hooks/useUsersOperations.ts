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
      console.log("Starting user creation process...");
      
      if (users.some(existingUser => existingUser.email === user.email)) {
        throw new Error("A user with this email already exists");
      }
      
      // Get the current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication error: " + sessionError.message);
      }
      
      if (!session) {
        console.error("No active session found");
        throw new Error("Authentication required: Please sign in to create users");
      }
      
      console.log("Session acquired, proceeding with edge function call");
      
      // Set up the URL for the edge function
      const supabaseUrl = "https://bkrfhlycvtmpoewlwpcc.supabase.co";
      const functionUrl = `${supabaseUrl}/functions/v1/create-user`;
      
      console.log("Calling edge function with URL:", functionUrl);
      console.log("Using authentication token:", session.access_token.substring(0, 10) + "...");
      
      // Fetch with timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        const payload = {
          fullName: user.fullName,
          email: user.email,
          password: user.password,
          role: user.role,
          permissions: user.permissions
        };
        
        console.log("Sending payload:", payload);
        
        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log("Edge function response status:", response.status);
        console.log("Edge function response headers:", Object.fromEntries(response.headers.entries()));
        
        // Try to parse the response as JSON
        let responseText;
        let data;
        try {
          responseText = await response.text();
          console.log("Raw response text:", responseText);
          if (responseText) {
            data = JSON.parse(responseText);
            console.log("Edge function response data:", data);
          } else {
            throw new Error("Empty response from server");
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          throw new Error(`Invalid response from server: Could not parse JSON. Raw response: ${responseText}`);
        }
        
        if (!response.ok) {
          console.error("Edge function returned an error:", data);
          throw new Error(data.error || data.details || `Failed to create user: ${response.status} ${response.statusText}`);
        }
        
        if (!data || !data.user || !data.user.id) {
          console.error("No user ID returned from edge function:", data);
          throw new Error("Invalid response from server: Missing user data");
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
        console.log("User created successfully:", newUser);
        return newUser;
      } catch (fetchError: any) {
        console.error("Fetch error:", fetchError);
        if (fetchError.name === 'AbortError') {
          throw new Error("Edge function request timed out after 30 seconds");
        }
        throw fetchError;
      }
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
