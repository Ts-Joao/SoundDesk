"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, AuthTokens } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { tokenManager } from "@/lib/auth/tokenManager";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Carregar usuário ao inicializar se tiver token
  useEffect(() => {
    const init = async () => {
      if (!tokenManager.hasValidSession()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authService.me();
        setUser(me);
      } catch {
        tokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (tokens: AuthTokens) => {
    tokenManager.setTokens(tokens.access_token, tokens.refresh_token);
    const me = await authService.me();
    setUser(me);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignorar erro */ }
    tokenManager.clearTokens();
    setUser(null);
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((updated: User) => {
    setUser(updated);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
