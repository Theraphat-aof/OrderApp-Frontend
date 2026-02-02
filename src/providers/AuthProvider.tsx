'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { User } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } =
    useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await apiClient.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Only clear tokens if unauthorized (token invalid/expired and refresh failed)
          // Don't clear on server errors (500) or network errors
          if (response.error?.status === 401) {
            console.log('Token invalid, logging out');
            apiClient.clearTokens();
          } else {
            console.error('Failed to get user details:', response.error);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Do not clear tokens on generic errors
        // apiClient.clearTokens(); 
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading]);

  const handleLogout = () => {
    apiClient.clearTokens();
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
