import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { AdminUser } from "@/models";

const tokenKey = "sv_admin_token";
const userKey = "sv_admin_user";

function getWebItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn("[startup] localStorage read failed", key, error);
    return null;
  }
}

function setWebItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn("[startup] localStorage write failed", key, error);
  }
}

function removeWebItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn("[startup] localStorage delete failed", key, error);
  }
}

export async function saveSession(token: string, user: AdminUser): Promise<void> {
  if (Platform.OS === "web") {
    setWebItem(tokenKey, token);
    setWebItem(userKey, JSON.stringify(user));
    return;
  }

  await Promise.all([
    SecureStore.setItemAsync(tokenKey, token),
    SecureStore.setItemAsync(userKey, JSON.stringify(user))
  ]);
}

export async function loadToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return getWebItem(tokenKey);
  }

  try {
    return await SecureStore.getItemAsync(tokenKey);
  } catch (error) {
    console.warn("[startup] secure token restore failed", error);
    return null;
  }
}

export async function loadUser(): Promise<AdminUser | null> {
  let raw: string | null = null;
  try {
    raw = Platform.OS === "web" ? getWebItem(userKey) : await SecureStore.getItemAsync(userKey);
  } catch (error) {
    console.warn("[startup] secure user restore failed", error);
    return null;
  }
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminUser;
  } catch (error) {
    console.warn("[startup] stored user payload was malformed", error);
    return null;
  }
}

export async function clearSession(): Promise<void> {
  if (Platform.OS === "web") {
    removeWebItem(tokenKey);
    removeWebItem(userKey);
    return;
  }

  await Promise.allSettled([
    SecureStore.deleteItemAsync(tokenKey),
    SecureStore.deleteItemAsync(userKey)
  ]);
}
