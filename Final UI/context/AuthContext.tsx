"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getCurrentUser } from '@/lib/api'; // Import the API function

// Basic User type - expand as needed
// This should match the user type returned by your getCurrentUser and loginUser API calls
interface User {
  id: string | number;
  email: string;
  user_type: 'individual' | 'company';
  full_name?: string;
  company_name?: string;
  // Add other relevant fields
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // True during initial auth check, and potentially during login/logout calls
  login: (newToken: string, userData: User) => void;
  logout: () => void;
  setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true for initial auth check

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // console.log("Found token, attempting to get current user:", storedToken);
          // Pass the token to getCurrentUser
          const userData = await getCurrentUser(storedToken);
          if (userData) {
            // console.log("User data received:", userData);
            // The login function will set user, token, localStorage, and isLoading to false
            login(storedToken, userData);
          } else {
            // This case might indicate an issue with getCurrentUser response or token validity not caught by API error
            // console.log("No user data received, logging out.");
            logout(); // Clears token from localStorage and context, sets isLoading to false
          }
        } catch (error) {
          // console.error("Failed to fetch user with stored token:", error);
          logout(); // Token is invalid or expired, or API error
        }
      } else {
        // console.log("No token found in localStorage.");
        setIsLoading(false); // No token, so not loading user data
      }
    };

    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  const login = (newToken: string, userData: User) => {
    // console.log("AuthContext: login called", { newToken, userData });
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    // console.log("AuthContext: logout called");
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsLoading(false);
    // Optional: redirect to login or home page.
    // This is often better handled by routing logic consuming the context.
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setIsLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
