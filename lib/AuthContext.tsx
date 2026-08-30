'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';
import { getToken, saveToken, clearToken } from './auth';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponse {
  jwt: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiFetch<User>('/api/users/me?populate=role', { token });
      setUser(data);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function load() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch<User>('/api/users/me?populate=role', { token });
        if (!ignore) setUser(data);
      } catch {
        clearToken();
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  async function login(identifier: string, password: string) {
    const data = await apiFetch<LoginResponse>('/api/auth/local', {
      method: 'POST',
      body: { identifier, password },
    });
    saveToken(data.jwt);
    await loadUser();
  }

  async function register(username: string, email: string, password: string) {
    const data = await apiFetch<LoginResponse>('/api/auth/local/register', {
      method: 'POST',
      body: { username, email, password },
    });
    saveToken(data.jwt);
    await loadUser();
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}