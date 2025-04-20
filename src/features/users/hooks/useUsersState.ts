
import { useState, useEffect } from 'react';
import { User } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { createUserFromProfile } from '@/features/auth/utils';

export const useUsersState = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

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
          const loadedUsers = profiles.map(profile => 
            createUserFromProfile(profile.id, profile)
          );
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

  return { users, setUsers, loading, setLoading };
};
