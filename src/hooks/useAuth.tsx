import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  roles: string[];
  display_name?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const [session, setSession] = useState<Session | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', userId)
        .single();

      // Fetch user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      return {
        display_name: profile?.display_name,
        roles: roles?.map(r => r.role) || []
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { display_name: null, roles: [] };
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          setAuthState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              roles: userData.roles,
              display_name: userData.display_name,
            },
            loading: false,
          });
        } else {
          setAuthState({ user: null, loading: false });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const userData = await fetchUserData(session.user.id);
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            roles: userData.roles,
            display_name: userData.display_name,
          },
          loading: false,
        });
      } else {
        setAuthState({ user: null, loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    }
    
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });
    
    if (error) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return { error };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};