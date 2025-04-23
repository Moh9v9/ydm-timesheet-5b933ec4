
import { useState, useEffect } from 'react';
import { User } from "@/lib/types";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { createUserFromProfile } from '../utils';
import { ProfileData } from '../types';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First check if we have a stored user from Google Sheets authentication
    const storedUser = sessionStorage.getItem('authUser');
    const authSession = sessionStorage.getItem('authSession');
    
    // Only use stored user if we also have a valid session
    if (storedUser && authSession) {
      try {
        // Check if the session is valid (not explicitly logged out)
        const parsedSession = JSON.parse(authSession);
        const parsedUser = JSON.parse(storedUser);
        
        // Use the stored user data if session exists and is valid
        if (parsedSession && parsedSession.authenticated === true) {
          console.log("Found valid stored authentication session");
          setUser(parsedUser);
        } else {
          console.log("Found stored user but session is invalid or expired");
          // Clear any residual auth data
          sessionStorage.removeItem('authUser');
          sessionStorage.removeItem('authSession');
        }
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
        // Clear invalid stored data
        sessionStorage.removeItem('authUser');
        sessionStorage.removeItem('authSession');
      }
    } else if (storedUser && !authSession) {
      // If we have user data but no session, clear the user data
      console.log("Found orphaned user data without session, clearing");
      sessionStorage.removeItem('authUser');
    }
    
    // Then proceed with Supabase authentication setup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid potential deadlocks with Supabase client
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) {
                console.error("Error fetching user profile:", error);
                return;
              }
              
              if (profile) {
                // Cast the profile to ProfileData to ensure type safety
                const userData = createUserFromProfile(
                  currentSession.user.id, 
                  profile as unknown as ProfileData
                );
                setUser(userData);
              }
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
            }
          }, 0);
        }
      }
    );

    // Then check for existing Supabase session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching user profile:", error);
            return;
          }
          
          if (profile) {
            // Cast the profile to ProfileData to ensure type safety
            const userData = createUserFromProfile(
              currentSession.user.id, 
              profile as unknown as ProfileData
            );
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, session, loading, setUser, setSession };
};
