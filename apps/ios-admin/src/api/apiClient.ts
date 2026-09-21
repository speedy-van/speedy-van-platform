import { clearSession, loadToken } from "@/auth/tokenStore";
import type { ApiEnvelope, PaginatedResult, PaginationMeta } from "@/models";
import Constants from "expo-constants";
import { Platform } from "react-native";

const PRODUCTION_API_URL = "https://api.speedyvan.uk";

function withoutTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function getExpoHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) return hostUri;

  const legacyManifest = Constants.manifest as { debuggerHost?: unknown } | null;
  return typeof legacyManifest?.debuggerHost === "string" ? legacyManifest.debuggerHost : null;
}

function getDevApiBaseURL(): string {
  if (Platform.OS === "web") return "http://localhost:4000";

  const hostUri = getExpoHost();
  const host = hostUri?.split(":")[0];
  return host ? `http://${host}:4000` : "http://localhost:4000";
}

const configuredApiURL = process.env.EXPO_PUBLIC_API_URL;
const baseURL = withoutTrailingSlash(
  configuredApiURL && configuredApiURL.length > 0
    ? configuredApiURL
    : __DEV__
      ? getDevApiBaseURL()
      : PRODUCTION_API_URL
);

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";
type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export class APIError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

function isEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return value !== null && typeof value === "object" && "success" in value;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && Array.isArray(value) === false;
}

function isPagination(value: unknown): value is PaginationMeta {
  return (
    isObject(value) &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    typeof value.total === "number"
  );
}

async function parseResponse<T>(response: Response): Promise<{ data: T; pagination?: PaginationMeta }> {
  if (response.status === 401) {
    await clearSession();
    unauthorizedHandler?.();
    throw new APIError("Your session has expired. Please sign in again.", 401);
  }

  const text = await response.text();
  const payload = text.length > 0 ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message = isObject(payload) && typeof payload.error === "string"
      ? payload.error
      : `Request failed with status ${response.status}`;
    throw new APIError(message, response.status);
  }

  if (isEnvelope<T>(payload)) {
    if (payload.success === false) {
      throw new APIError(payload.error);
    }
    return { data: payload.data, pagination: payload.pagination };
  }

  return { data: payload as T };
}

async function request<T>(method: RequestMethod, path: string, body?: unknown): Promise<{ data: T; pagination?: PaginationMeta }> {
  const token = await loadToken();
  const response = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return parseResponse<T>(response);
}

function pickNamedList<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!isObject(payload)) return [];

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) return value as T[];
  }

  return [];
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const response = await request<T>("GET", path);
    return response.data;
  },
  async getList<T>(path: string, keys: string[] = []): Promise<T[]> {
    const response = await request<unknown>("GET", path);
    return pickNamedList<T>(response.data, keys);
  },
  async getPaginated<T>(path: string): Promise<PaginatedResult<T>> {
    const response = await request<T[]>("GET", path);
    const pagination = isPagination(response.pagination)
      ? response.pagination
      : { page: 1, limit: response.data.length, total: response.data.length };
    return { data: response.data, pagination };
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await request<T>("POST", path, body);
    return response.data;
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await request<T>("PATCH", path, body);
    return response.data;
  },
  async delete(path: string): Promise<void> {
    await request<unknown>("DELETE", path);
  }
};
