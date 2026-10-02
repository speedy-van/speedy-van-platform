import { useRouter, useSegments } from "expo-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { apiClient, setUnauthorizedHandler } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { AdminUser, LoginResponse } from "@/models";
import { clearSession, loadToken, loadUser, saveSession } from "./tokenStore";

type AuthStatus = "loading" | "authenticated" | "anonymous";
type StartupPhase = "configuration" | "storage" | "auth" | "ready";

type AuthContextValue = {
  status: AuthStatus;
  startupPhase: StartupPhase;
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [startupPhase, setStartupPhase] = useState<StartupPhase>("configuration");
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
      console.info("[startup] configuration validation complete");
      setStartupPhase("storage");

      const [token, storedUser] = await Promise.all([loadToken(), loadUser()]);
      if (!mounted) return;

      setStartupPhase("auth");
      if (token) {
        setUser(storedUser);
        setStatus("authenticated");
      } else {
        setStatus("anonymous");
      }
      setStartupPhase("ready");
    }

    void restore().catch((error) => {
      console.error("[startup] session restore failed", error);
      if (!mounted) return;
      setUser(null);
      setStatus("anonymous");
      setStartupPhase("ready");
    });

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
      startupPhase,
      user,
      isAuthenticated: status === "authenticated",
      login,
      logout
    }),
    [login, logout, startupPhase, status, user]
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
  const { status, isAuthenticated, startupPhase } = useAuth();
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

  if (status === "loading") {
    console.info(`[startup] waiting for ${startupPhase}`);
  }

  return <>{children}</>;
}
