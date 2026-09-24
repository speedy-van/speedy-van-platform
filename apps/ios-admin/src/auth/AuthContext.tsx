import { useRouter, useSegments } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { apiClient, setUnauthorizedHandler } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { AdminUser, LoginResponse } from "@/models";
import { clearSession, loadToken, loadUser, saveSession } from "./tokenStore";

type AuthStatus = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: AuthStatus;
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AdminUser | null>(null);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
    setStatus("anonymous");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus("anonymous");
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restore(): Promise<void> {
      const [token, storedUser] = await Promise.all([loadToken(), loadUser()]);
      if (!mounted) return;

      if (token) {
        setUser(storedUser);
        setStatus("authenticated");
      } else {
        setStatus("anonymous");
      }
    }

    void restore();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>(endpoints.authLogin, { email, password });
    await saveSession(response.token, response.user);
    setUser(response.user);
    setStatus("authenticated");
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      login,
      logout
    }),
    [login, logout, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export function AuthGate({ children }: PropsWithChildren): JSX.Element {
  const { status, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (status === "loading") return;

    const firstSegment = segments[0];
    const inAuthGroup = firstSegment === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, router, segments, status]);

  return <>{children}</>;
}
