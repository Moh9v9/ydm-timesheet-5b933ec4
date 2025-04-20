
import { useState, useEffect } from 'react';
import { User } from "@/lib/types";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { createUserFromProfile } from '../utils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
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
                const userData = createUserFromProfile(currentSession.user.id, profile);
                setUser(userData);
              }
            } catch (error) {
              console.error("Failed to fetch user profile:", error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
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
            const userData = createUserFromProfile(currentSession.user.id, profile);
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
