import { api } from "./api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const res = await api.post<{ token: string; user: AuthUser }>("/auth/login", { email, password });
  if (res.success && res.data) {
    sessionStorage.setItem("sv-auth-token", res.data.token);
    sessionStorage.setItem("sv-user", JSON.stringify(res.data.user));
    return res.data;
  }
  throw new Error(res.error || "Login failed");
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const str = sessionStorage.getItem("sv-user");
  return str ? (JSON.parse(str) as AuthUser) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("sv-auth-token");
}

export function logout(): void {
  sessionStorage.removeItem("sv-auth-token");
  sessionStorage.removeItem("sv-user");
  window.location.href = "/auth/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
