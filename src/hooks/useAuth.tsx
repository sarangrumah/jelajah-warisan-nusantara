import { useState, useEffect } from 'react';
import { apiClient, User } from '@/lib/api-client';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setAuthState({ user: null, loading: false });
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('auth_token');
          setAuthState({ user: null, loading: false });
          return;
        }

        // Set the token in apiClient before making requests
        apiClient.setToken(token);
        
        // Fetch user profile
        const response = await apiClient.getProfile(decoded.userId);
        
        if (response.data) {
          setAuthState({
            user: {
              id: decoded.userId,
              email: decoded.email,
              roles: response.data.roles,
              display_name: response.data.display_name,
            },
            loading: false,
          });
        } else {
          localStorage.removeItem('auth_token');
          setAuthState({ user: null, loading: false });
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        setAuthState({ user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await apiClient.signIn(email, password);
    
    if (response.data) {
      setAuthState({
        user: response.data.user,
        loading: false,
      });
    }
    
    return { error: response.error ? new Error(response.error) : null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    const response = await apiClient.signUp(email, password, displayName);
    
    if (response.data) {
      setAuthState({
        user: response.data.user,
        loading: false,
      });
    }
    
    return { error: response.error ? new Error(response.error) : null };
  };

  const signOut = async () => {
    apiClient.clearToken();
    setAuthState({ user: null, loading: false });
    return { error: null };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
};