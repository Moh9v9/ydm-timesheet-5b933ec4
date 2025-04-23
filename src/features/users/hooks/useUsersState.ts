
import { useState, useEffect } from 'react';
import { User } from "@/lib/types";
import { createUserFromProfile } from '@/features/auth/utils';

export const useUsersState = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        // Since we're using Google Sheets now, we would fetch users from there
        // For now, we'll just use an empty array
        const loadedUsers: User[] = [];
        setUsers(loadedUsers);
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
