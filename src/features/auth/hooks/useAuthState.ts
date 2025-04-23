
import { useState, useEffect } from 'react';
import { User } from "@/lib/types";

// Google Sheets only: no more ProfileData or Supabase
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null); // Session here can just be a simple object or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('authUser');
    const authSession = sessionStorage.getItem('authSession');

    if (storedUser && authSession) {
      try {
        const parsedSession = JSON.parse(authSession);
        const parsedUser = JSON.parse(storedUser);

        if (parsedSession && parsedSession.authenticated === true) {
          console.log("Found valid stored authentication session");
          setUser(parsedUser);
        } else {
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('authSession');
        }
      } catch (error) {
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
      }
    } else if (storedUser && !authSession) {
      sessionStorage.removeItem('authUser');
    }

    setLoading(false);
  }, []);

  return { user, session, loading, setUser, setSession };
};
