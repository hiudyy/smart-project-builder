
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded credentials as specified in requirements
    if (email === 'hiudyyy@gmail.com' && password === 'Hiudy.999') {
      const userData = { email };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      return true;
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
