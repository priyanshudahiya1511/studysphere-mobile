import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { secureStorage } from '../lib/secureStorage';
import { storage } from '../lib/storage';
import {
  loginService,
  verifyOtpService,
  logoutService,
  googleAuthService,
} from '../services/auth.services';
import { User } from '../types/auth.types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await secureStorage.getItem('access_token');
        const storedUser = await storage.getItem('user');
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.log('Session restore failed', e);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginService({ email, password });
    await secureStorage.setItem('access_token', data.accessToken);
    await secureStorage.setItem('refresh_token', data.refreshToken);
    await storage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const data = await verifyOtpService({ email, otp });
    await secureStorage.setItem('access_token', data.accessToken);
    await secureStorage.setItem('refresh_token', data.refreshToken);
    await storage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const googleLogin = async (googleToken: string) => {
    const data = await googleAuthService(googleToken);
    await secureStorage.setItem('access_token', data.accessToken);
    await secureStorage.setItem('refresh_token', data.refreshToken);
    await storage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (e) {
      console.log('Logout request failed', e);
    }
    await secureStorage.deleteItem('access_token');
    await secureStorage.deleteItem('refresh_token');
    await storage.deleteItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, verifyOtp, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
