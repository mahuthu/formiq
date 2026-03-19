'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setToken, clearToken } from '@/lib/api';

interface User { id: string; name: string; email: string; role: string; }
interface Org { id: string; name: string; plan: string; documentQuota: number; documentsUsed: number; apiKey?: string; }
interface AuthCtx {
  user: User | null;
  org: Org | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (orgName: string, name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('formiq_user');
    if (stored) {
      setUser(JSON.parse(stored));
      setOrg(JSON.parse(localStorage.getItem('formiq_org') || 'null'));
    }
    setLoading(false);
  }, []);

  const persist = (data: any) => {
    setToken(data.token);
    setUser(data.user);
    setOrg(data.org);
    localStorage.setItem('formiq_user', JSON.stringify(data.user));
    localStorage.setItem('formiq_org', JSON.stringify(data.org));
  };

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    persist(data);
  };

  const register = async (orgName: string, name: string, email: string, password: string) => {
    const data = await api.auth.register({ orgName, name, email, password });
    persist(data);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setOrg(null);
    window.location.href = '/login';
  };

  return <Ctx.Provider value={{ user, org, loading, login, register, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
