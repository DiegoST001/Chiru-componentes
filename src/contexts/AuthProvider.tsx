import React, { createContext, useContext, useEffect, useCallback, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";
import { AuthService } from "@/features/auth/service/auth.service";
import type { LoginRequest } from "@/features/auth/model/auth.model";

type Session = Record<string, any> | null;

type AuthContextValue = {
  user: Session;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest, clientIp?: string) => Promise<{ ok: boolean; error?: any }>;
  logout: () => void;
  refreshSessionFromStorage: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Session>(null);
  const [token, setToken] = useState<string | null>(null);

  const refreshSessionFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    const rawSession = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
    const rawToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    try {
      setUser(rawSession ? JSON.parse(rawSession) : null);
    } catch {
      setUser(null);
    }
    setToken(rawToken ?? null);
  }, []);

  useEffect(() => {
    refreshSessionFromStorage();
  }, [refreshSessionFromStorage]);

  // Sync auth across tabs/windows: cuando cambian las keys relevantes en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      // e.key puede ser null según la spec; salimos si es null
      if (!e.key) return;

      // Forzamos tipo string[] para evitar que TS infiera literales estrictos
      const relevantKeys: string[] = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_SESSION];
      // Añadir REFRESH_TOKEN si existe en el objeto STORAGE_KEYS
      if ((STORAGE_KEYS as any).REFRESH_TOKEN) {
        relevantKeys.push((STORAGE_KEYS as any).REFRESH_TOKEN);
      }

      if (relevantKeys.includes(e.key)) {
        refreshSessionFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshSessionFromStorage]);

  const login = useCallback(
    async (credentials: LoginRequest, clientIp?: string) => {
      try {
        const res = await AuthService.login(credentials, clientIp);
        const accessToken = (res as any)?.accessToken ?? (res as any)?.token;
        const refreshToken = (res as any)?.refreshToken;
        const session = (res as any)?.session ?? null;

        if (typeof window !== "undefined" && accessToken) {
          // persistir en storage
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, String(accessToken));
          if (refreshToken && (STORAGE_KEYS as any).REFRESH_TOKEN) {
            localStorage.setItem((STORAGE_KEYS as any).REFRESH_TOKEN, String(refreshToken));
          }
          if (session) {
            localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
            const userId = (session as any)?.userId ?? (session as any)?.id ?? (res as any)?.userId;
            if (userId && (STORAGE_KEYS as any).USER_ID) {
              localStorage.setItem((STORAGE_KEYS as any).USER_ID, String(userId));
            }
          }

          // actualizar estado inmediatamente para la pestaña actual
          try {
            setUser(session ?? null);
            setToken(String(accessToken));
          } catch {
            // fallback a refresh desde storage
            refreshSessionFromStorage();
          }
        }

        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
    [refreshSessionFromStorage]
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        if ((STORAGE_KEYS as any).REFRESH_TOKEN) {
          localStorage.removeItem((STORAGE_KEYS as any).REFRESH_TOKEN);
        }
        if ((STORAGE_KEYS as any).USER_ID) {
          localStorage.removeItem((STORAGE_KEYS as any).USER_ID);
        }
        // para asegurar que algunos listeners internos (pestaña actual) respondan,
        // actualizamos estado local inmediatamente.
        setUser(null);
        setToken(null);
      } catch (e) {
        console.warn("AuthProvider logout cleanup failed", e);
      }
    } else {
      setUser(null);
      setToken(null);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
    refreshSessionFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    console.warn("useAuth called outside AuthProvider - returning safe fallback");
    const fallback = {
      user: null,
      token: null,
      isAuthenticated: false,
      login: async () => ({ ok: false, error: new Error("AuthProvider not available") }),
      logout: () => {},
      refreshSessionFromStorage: () => {},
    } as AuthContextValue;
    return fallback;
  }
  return ctx;
}