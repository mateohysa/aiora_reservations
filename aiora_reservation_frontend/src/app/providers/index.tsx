'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Remove ReactQueryDevtools if it's causing errors or not installed
import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '@/services';
import { ThemeProvider } from './theme-provider';

// Export the useTheme hook
export { useTheme } from './theme-provider';

// Create a client
const queryClient = new QueryClient();

// Auth context
type User = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth on app load
    authService.initializeAuth();
    
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // In a real app, you would fetch the user profile here
          // For now, we'll just set a mock user
          setUser({
            userId: 1,
            username: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            role: 'ADMIN'
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login({ username, password });
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading, login, logout }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </AuthContext.Provider>
      {/* Remove ReactQueryDevtools if it's causing errors */}
    </QueryClientProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}