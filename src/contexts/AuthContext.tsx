import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('ck-oms-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@cloudkitchen.com',
        role: 'superadmin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=64&h=64&fit=crop&crop=face'
      },
      {
        id: '2',
        name: 'Kitchen Manager',
        email: 'kitchen@cloudkitchen.com',
        role: 'kitchen_manager',
        brandId: '1',
        locationId: '1',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=64&h=64&fit=crop&crop=face'
      },
      {
        id: '3',
        name: 'Cook',
        email: 'cook@cloudkitchen.com',
        role: 'cook',
        brandId: '1',
        locationId: '1',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=64&h=64&fit=crop&crop=face'
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('ck-oms-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ck-oms-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};