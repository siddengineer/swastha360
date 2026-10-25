import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isSwasthAdmin: boolean;
  isHospitalAdmin: boolean;
  isHospitalStaff: boolean;
  isIndividual: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('swasth360_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('swasth360_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('swasth360_token', newToken);
    localStorage.setItem('swasth360_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('swasth360_token');
    localStorage.removeItem('swasth360_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const me = await api.auth.getMe();
      setUser(me);
      localStorage.setItem('swasth360_user', JSON.stringify(me));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const isSwasthAdmin = user?.role === 'SWASTH360_ADMIN';
  const isHospitalAdmin = user?.role === 'HOSPITAL_ADMIN';
  const isHospitalStaff = user?.role === 'HOSPITAL_STAFF';
  const isIndividual = user?.role === 'INDIVIDUAL_USER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isSwasthAdmin,
        isHospitalAdmin,
        isHospitalStaff,
        isIndividual,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
