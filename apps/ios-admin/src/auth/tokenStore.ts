import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AdminUser } from "@/models";

const tokenKey = "sv_admin_token";
const userKey = "sv_admin_user";

function getWebItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setWebItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function removeWebItem(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export async function saveSession(token: string, user: AdminUser): Promise<void> {
  if (Platform.OS === "web") {
    setWebItem(tokenKey, token);
    setWebItem(userKey, JSON.stringify(user));
    return;
  }

  await SecureStore.setItemAsync(tokenKey, token);
  await SecureStore.setItemAsync(userKey, JSON.stringify(user));
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return getWebItem(tokenKey);
  }

  return SecureStore.getItemAsync(tokenKey);
}

export async function loadUser(): Promise<AdminUser | null> {
  const raw = Platform.OS === "web" ? getWebItem(userKey) : await SecureStore.getItemAsync(userKey);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === "web") {
    removeWebItem(tokenKey);
    removeWebItem(userKey);
    return;
  }

  await SecureStore.deleteItemAsync(tokenKey);
  await SecureStore.deleteItemAsync(userKey);
}
