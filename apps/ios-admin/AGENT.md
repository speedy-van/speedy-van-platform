# SpeedyVan Admin — Expo App (Codex Agent Instructions)

You are building a **React Native / Expo** admin app for SpeedyVan using TypeScript.
This is the mobile admin panel — same functionality as the web admin at speedyvan.uk/admin.
Work through each phase in order. Do not skip steps.

---

## TECH STACK

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 52, React Native | Cross-platform iOS + Android |
| Language | TypeScript (strict) | Matches rest of monorepo |
| Routing | Expo Router v4 (file-based) | Same pattern as Next.js App Router |
| Styling | NativeWind v4 + Tailwind CSS | Team knows Tailwind already |
| Auth storage | expo-secure-store | Encrypted, equivalent to iOS Keychain |
| HTTP | Native `fetch` | No extra deps needed |
| Charts | react-native-chart-kit | Works with Expo, no native linking |
| State | React Context + hooks | Simple, no extra dep |

---

## CONTEXT

**API base URL:** `https://www.speedyvan.uk/api`

**Auth:** JWT Bearer token.
- Login → store token in SecureStore → attach as `Authorization: Bearer <token>` on every request.
- On 401 → clear token → redirect to `/login`

**Response envelope (all endpoints):**
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 20, "total": 100 } }
```

---

## PHASE 1 — PROJECT SETUP

### Step 1.1 — Initialise Expo project

Run inside `apps/ios-admin/`:

```bash
npx create-expo-app@latest . --template blank-typescript
```

### Step 1.2 — Install dependencies

```bash
npx expo install expo-secure-store expo-router expo-constants expo-linking expo-status-bar react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated react-native-svg
npm install nativewind tailwindcss react-native-chart-kit @react-native-async-storage/async-storage
```

### Step 1.3 — Configure NativeWind v4

Create `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo:  "#4F46E5",
          dark:    "#0F172A",
          slate:   "#1E293B",
          green:   "#10B981",
          red:     "#EF4444",
          warning: "#E11D48",
        },
      },
    },
  },
  plugins: [],
};
```

Create `babel.config.js`:
```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

Add to `metro.config.js`:
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: "./global.css" });
```

Create `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Add to `app/_layout.tsx` at the top:
```ts
import "../global.css";
```

Add `nativewind-env.d.ts` to root:
```ts
/// <reference types="nativewind/types" />
```

### Step 1.4 — Configure Expo Router

In `app.json` set:
```json
{
  "expo": {
    "scheme": "speedyvan-admin",
    "web": { "bundler": "metro" }
  }
}
```

`package.json` main must be `"expo-router/entry"`.

### Step 1.5 — TypeScript config

`tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## PHASE 2 — FOLDER STRUCTURE

Create this layout:

```
apps/ios-admin/
├── app/
│   ├── _layout.tsx              ← root layout (auth guard)
│   ├── login.tsx                ← login screen
│   └── (admin)/
│       ├── _layout.tsx          ← tab navigator (5 tabs)
│       ├── index.tsx            ← Dashboard tab
│       ├── bookings/
│       │   ├── index.tsx        ← Bookings list
│       │   └── [id].tsx         ← Booking detail
│       ├── drivers/
│       │   ├── index.tsx        ← Drivers list
│       │   └── [id].tsx         ← Driver detail
│       ├── jobs/
│       │   └── index.tsx        ← Job board
│       ├── analytics/
│       │   └── index.tsx        ← Analytics charts
│       ├── enquiries/
│       │   └── index.tsx        ← Enquiries list + detail sheet
│       └── notifications/
│           └── index.tsx        ← Notifications
├── src/
│   ├── api/
│   │   ├── client.ts            ← fetch wrapper, auth, 401 handling
│   │   └── endpoints.ts         ← all path constants
│   ├── auth/
│   │   ├── AuthContext.tsx      ← context + provider
│   │   └── secureStore.ts       ← token CRUD via expo-secure-store
│   ├── models/
│   │   ├── booking.ts
│   │   ├── driver.ts
│   │   ├── job.ts
│   │   ├── analytics.ts
│   │   ├── enquiry.ts
│   │   └── notification.ts
│   ├── hooks/
│   │   ├── useBookings.ts
│   │   ├── useBookingDetail.ts
│   │   ├── useDrivers.ts
│   │   ├── useDriverDetail.ts
│   │   ├── useJobs.ts
│   │   ├── useAnalytics.ts
│   │   ├── useEnquiries.ts
│   │   └── useNotifications.ts
│   └── components/
│       ├── KPICard.tsx
│       ├── StatusBadge.tsx
│       ├── LoadingView.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBanner.tsx
│       ├── FilterChips.tsx
│       └── ConfirmDialog.tsx
├── global.css
├── tailwind.config.js
├── babel.config.js
└── metro.config.js
```

---

## PHASE 3 — CORE INFRASTRUCTURE

### Task 3.1 — src/auth/secureStore.ts

```ts
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "sv_admin_token";
const USER_KEY  = "sv_admin_user";

export const secureStore = {
  saveToken:   (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  loadToken:   ()              => SecureStore.getItemAsync(TOKEN_KEY),
  deleteToken: ()              => SecureStore.deleteItemAsync(TOKEN_KEY),
  saveUser:    (user: object)  => SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)),
  loadUser:    async ()        => {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  deleteUser:  ()              => SecureStore.deleteItemAsync(USER_KEY),
  clear:       async ()        => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
```

### Task 3.2 — src/auth/AuthContext.tsx

```tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { secureStore } from "./secureStore";
import { apiClient } from "../api/client";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AdminUser | null>(null);
  const [token, setToken]     = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [savedToken, savedUser] = await Promise.all([
        secureStore.loadToken(),
        secureStore.loadUser(),
      ]);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser as AdminUser);
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.post<{ token: string; user: AdminUser }>(
      "/auth/login",
      { email, password }
    );
    await Promise.all([
      secureStore.saveToken(res.token),
      secureStore.saveUser(res.user),
    ]);
    setToken(res.token);
    setUser(res.user);
  }

  async function logout() {
    await secureStore.clear();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
```

### Task 3.3 — src/api/client.ts

```ts
import { secureStore } from "../auth/secureStore";

const BASE_URL = "https://www.speedyvan.uk/api";

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    return request<T>("GET", path);
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("POST", path, body);
  },
  async patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>("PATCH", path, body);
  },
  async delete<T = void>(path: string): Promise<T> {
    return request<T>("DELETE", path);
  },
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = await secureStore.loadToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    await secureStore.clear();
    // Navigation happens in root layout via auth state
    throw new APIError(401, "Unauthorized");
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message = json?.error ?? `Request failed (${response.status})`;
    throw new APIError(response.status, message);
  }

  if (json?.success === false) {
    throw new APIError(response.status, json.error ?? "Request failed");
  }

  // Unwrap envelope: return json.data if present, else full json
  return (json?.data !== undefined ? json.data : json) as T;
}
```

### Task 3.4 — src/api/endpoints.ts

```ts
export const EP = {
  // Auth
  login:              "/auth/login",
  me:                 "/auth/me",

  // Analytics
  analyticsOverview:  "/admin/analytics/overview",
  analyticsPerDay:    "/admin/analytics/bookings-per-day",
  revenuePerDay:      "/admin/analytics/revenue-per-day",
  analyticsServices:  "/admin/analytics/services",
  analyticsDrivers:   "/admin/analytics/drivers",

  // Bookings
  bookings:           (q = "", status = "", page = 1, limit = 20) =>
    `/admin/bookings?q=${encodeURIComponent(q)}&status=${status}&page=${page}&limit=${limit}`,
  booking:            (id: string) => `/admin/bookings/${id}`,
  bookingStatus:      (id: string) => `/admin/bookings/${id}/status`,
  bookingAssign:      (id: string) => `/admin/bookings/${id}/assign`,
  bookingCancel:      (id: string) => `/admin/bookings/${id}/cancel`,
  bookingTracking:    (id: string) => `/admin/bookings/${id}/tracking`,

  // Drivers
  drivers:            "/admin/drivers",
  driver:             (id: string) => `/admin/drivers/${id}`,
  driverStatus:       (id: string) => `/admin/drivers/${id}/status`,
  driverResetPw:      (id: string) => `/admin/drivers/${id}/reset-password`,
  driverEarnings:     (id: string) => `/admin/drivers/${id}/earnings`,
  driverMarkPaid:     (id: string) => `/admin/drivers/${id}/mark-paid`,
  driverPayConfig:    "/admin/drivers/pay-config",

  // Jobs
  jobs:               (status = "", isPublic = "") =>
    `/admin/jobs?status=${status}&isPublic=${isPublic}`,
  job:                (id: string) => `/admin/jobs/${id}`,
  jobDriverPay:       (id: string) => `/admin/jobs/${id}/driver-pay`,
  jobsPauseAll:       "/admin/jobs/pause-all",
  jobsResumeAll:      "/admin/jobs/resume-all",

  // Enquiries
  enquiries:          (q = "", status = "", page = 1) =>
    `/admin/enquiries?q=${encodeURIComponent(q)}&status=${status}&page=${page}&limit=30`,
  enquiry:            (id: string) => `/admin/enquiries/${id}`,
  enquirySendQuote:   (id: string) => `/admin/enquiries/${id}/send-quote`,

  // Notifications
  notifications:      "/admin/notifications",
  notification:       (id: string) => `/admin/notifications/${id}`,
  notificationsRead:  "/admin/notifications/read",

  // Service flags
  serviceFlags:       "/admin/service-flags",
  serviceFlag:        (slug: string) => `/admin/service-flags/${slug}`,
};
```

---

## PHASE 4 — TYPE MODELS

### Task 4.1 — src/models/booking.ts

```ts
export type BookingStatus =
  | "PENDING" | "CONFIRMED" | "ASSIGNED"
  | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING:     "Pending",
  CONFIRMED:   "Confirmed",
  ASSIGNED:    "Assigned",
  IN_PROGRESS: "Active",
  COMPLETED:   "Completed",
  CANCELLED:   "Cancelled",
};

export const BOOKING_STATUS_COLOR: Record<BookingStatus, string> = {
  PENDING:     "#E11D48",  // warning
  CONFIRMED:   "#3B82F6",  // blue
  ASSIGNED:    "#8B5CF6",  // purple
  IN_PROGRESS: "#10B981",  // green
  COMPLETED:   "#6B7280",  // grey
  CANCELLED:   "#EF4444",  // red
};

export interface BookingDriver {
  id: string;
  user: { name: string };
}

export interface BookingListItem {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceSlug: string;
  pickupAddress: string;
  dropoffAddress?: string;
  scheduledDate: string;
  timeSlot: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  driver?: BookingDriver;
}

export interface BookingItem {
  id: string;
  name: string;
  quantity: number;
}

export interface TrackingEvent {
  id: string;
  type: string;
  note?: string;
  createdAt: string;
  isInternal: boolean;
}

export interface StatusHistory {
  id: string;
  fromStatus?: string;
  toStatus: string;
  note?: string;
  createdAt: string;
}

export interface BookingDetail extends BookingListItem {
  notes?: string;
  items: BookingItem[];
  trackingEvents: TrackingEvent[];
  statusHistory: StatusHistory[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; hasMore: boolean };
}
```

### Task 4.2 — src/models/driver.ts

```ts
export type VanSize = "SMALL" | "MEDIUM" | "LARGE" | "LUTON";

export interface DriverUser {
  name: string;
  email: string;
  phone?: string;
}

export interface DriverListItem {
  id: string;
  vanSize: VanSize;
  isActive: boolean;
  totalEarned: number;
  unpaidEarnings: number;
  user: DriverUser;
}

export interface DriverEarnings {
  total: number;
  thisMonth: number;
  unpaid: number;
  paid: number;
}

export interface DriverPayConfig {
  percentage: number;
  minimumPay: number;
}
```

### Task 4.3 — src/models/job.ts

```ts
export type JobStatus = "AVAILABLE" | "CLAIMED" | "ACCEPTED" | "COMPLETED";

export const JOB_STATUS_COLOR: Record<JobStatus, string> = {
  AVAILABLE: "#10B981",
  CLAIMED:   "#E11D48",
  ACCEPTED:  "#3B82F6",
  COMPLETED: "#6B7280",
};

export interface JobListItem {
  id: string;
  isPublic: boolean;
  status: JobStatus;
  driverPay?: number;
  driverPayNote?: string;
  booking: {
    reference: string;
    serviceSlug: string;
    scheduledDate: string;
    timeSlot: string;
    totalPrice: number;
    pickupAddress: string;
  };
  driver?: { user: { name: string } };
}
```

### Task 4.4 — src/models/analytics.ts

```ts
export interface AnalyticsOverview {
  totalBookings: number;
  bookingsToday: number;
  bookingsThisMonth: number;
  revenueThisMonth: number;
  activeDrivers: number;
  pendingJobs: number;
  visitorsToday: number;
}

export interface BookingPerDay { date: string; count: number }
export interface RevenuePerDay  { date: string; revenue: number }
export interface ServiceStat    { slug: string; count: number; revenue: number }
```

### Task 4.5 — src/models/enquiry.ts

```ts
export type EnquiryStatus = "new" | "quoted" | "accepted" | "declined";

export const ENQUIRY_STATUS_COLOR: Record<EnquiryStatus, string> = {
  new:      "#3B82F6",
  quoted:   "#E11D48",
  accepted: "#10B981",
  declined: "#EF4444",
};

export interface EnquiryListItem {
  id: string;
  customerName: string;
  customerEmail: string;
  toCountry: string;
  toCity: string;
  status: EnquiryStatus;
  quotedPrice?: number;
  createdAt: string;
}

export interface EnquiryDetail extends EnquiryListItem {
  customerPhone: string;
  fromAddress: string;
  propertyType: string;
  bedrooms: number;
  needsPacking: boolean;
  needsStorage: boolean;
  notes?: string;
  adminNotes?: string;
}
```

### Task 4.6 — src/models/notification.ts

```ts
export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}
```

---

## PHASE 5 — ROOT LAYOUT & AUTH GUARD

### Task 5.1 — app/_layout.tsx

```tsx
import "../global.css";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/auth/AuthContext";
import { View, ActivityIndicator } from "react-native";

function RootGuard() {
  const { user, token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAdmin = segments[0] === "(admin)";
    if (!token && inAdmin) {
      router.replace("/login");
    } else if (token && !inAdmin) {
      router.replace("/(admin)/");
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-dark">
        <ActivityIndicator color="#4F46E5" size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootGuard />
    </AuthProvider>
  );
}
```

### Task 5.2 — app/(admin)/_layout.tsx  (Tab navigator)

```tsx
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { EP } from "@/api/endpoints";

export default function AdminLayout() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    apiClient
      .get<{ pagination: { total: number } }>(EP.bookings("", "PENDING", 1, 1))
      .then((res) => setPendingCount(res.pagination?.total ?? 0))
      .catch(() => {});
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   "#4F46E5",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle:             { backgroundColor: "#0F172A", borderTopColor: "#1E293B" },
        headerStyle:             { backgroundColor: "#0F172A" },
        headerTintColor:         "#F8FAFC",
        headerTitleStyle:        { fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index"         options={{ title: "Dashboard",  tabBarIcon: ({ color }) => <TabIcon name="🏠" color={color} /> }} />
      <Tabs.Screen name="bookings/index" options={{ title: "Bookings",  tabBarIcon: ({ color }) => <TabIcon name="📋" color={color} />, tabBarBadge: pendingCount > 0 ? pendingCount : undefined }} />
      <Tabs.Screen name="drivers/index"  options={{ title: "Drivers",   tabBarIcon: ({ color }) => <TabIcon name="🚐" color={color} /> }} />
      <Tabs.Screen name="jobs/index"     options={{ title: "Jobs",      tabBarIcon: ({ color }) => <TabIcon name="💼" color={color} /> }} />
      <Tabs.Screen name="analytics/index" options={{ title: "More",    tabBarIcon: ({ color }) => <TabIcon name="⋯" color={color} /> }} />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  const { Text } = require("react-native");
  return <Text style={{ fontSize: 20, color }}>{name}</Text>;
}
```

---

## PHASE 6 — SHARED COMPONENTS

### Task 6.1 — src/components/KPICard.tsx

```tsx
import { View, Text } from "react-native";

interface Props {
  title: string;
  value: string | number;
  icon: string;
  accent?: string; // Tailwind bg class e.g. "bg-indigo-500/20"
}

export function KPICard({ title, value, icon, accent = "bg-slate-700/40" }: Props) {
  return (
    <View className={`flex-1 rounded-2xl p-4 ${accent} border border-white/10`}>
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-white font-bold text-2xl">{value}</Text>
      <Text className="text-slate-400 text-xs mt-1">{title}</Text>
    </View>
  );
}
```

### Task 6.2 — src/components/StatusBadge.tsx

```tsx
import { View, Text } from "react-native";

interface Props {
  label: string;
  color: string; // hex
}

export function StatusBadge({ label, color }: Props) {
  return (
    <View style={{ backgroundColor: color + "22", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ color, fontSize: 11, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
```

### Task 6.3 — src/components/LoadingView.tsx

```tsx
import { View, ActivityIndicator, Text } from "react-native";

export function LoadingView() {
  return (
    <View className="flex-1 items-center justify-center gap-3">
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text className="text-slate-400 text-sm">Loading…</Text>
    </View>
  );
}
```

### Task 6.4 — src/components/EmptyState.tsx

```tsx
import { View, Text } from "react-native";

interface Props { icon: string; title: string; message: string }

export function EmptyState({ icon, title, message }: Props) {
  return (
    <View className="flex-1 items-center justify-center p-8 gap-3">
      <Text style={{ fontSize: 48 }}>{icon}</Text>
      <Text className="text-white font-bold text-lg text-center">{title}</Text>
      <Text className="text-slate-400 text-sm text-center">{message}</Text>
    </View>
  );
}
```

### Task 6.5 — src/components/ErrorBanner.tsx

```tsx
import { View, Text } from "react-native";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <View className="mx-4 mt-2 flex-row items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
      <Text className="text-red-400">⚠</Text>
      <Text className="text-red-400 text-sm flex-1">{message}</Text>
    </View>
  );
}
```

### Task 6.6 — src/components/FilterChips.tsx

```tsx
import { ScrollView, TouchableOpacity, Text, View } from "react-native";

interface Chip { label: string; value: string }

interface Props {
  chips: Chip[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterChips({ chips, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-2"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {chips.map((chip) => {
        const active = chip.value === selected;
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onSelect(chip.value)}
            className={`rounded-full px-4 py-1.5 border ${
              active ? "bg-brand-indigo border-brand-indigo" : "bg-transparent border-slate-600"
            }`}
          >
            <Text className={`text-sm font-semibold ${active ? "text-white" : "text-slate-400"}`}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
```

### Task 6.7 — src/components/ConfirmDialog.tsx

```tsx
import { Alert } from "react-native";

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void,
  destructive = true
) {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: "Confirm", style: destructive ? "destructive" : "default", onPress: onConfirm },
  ]);
}
```

---

## PHASE 7 — SCREENS

### Task 7.1 — app/login.tsx

```tsx
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const valid = email.trim().length > 0 && password.length > 0;

  async function handleLogin() {
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      await login(email.trim(), password);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-full bg-brand-indigo items-center justify-center mb-4">
            <Text style={{ fontSize: 40 }}>🚐</Text>
          </View>
          <Text className="text-white text-3xl font-extrabold">SpeedyVan</Text>
          <Text className="text-slate-400 text-sm mt-1">Admin Panel</Text>
        </View>

        {/* Fields */}
        <TextInput
          className="bg-slate-800 text-white rounded-xl px-4 py-3.5 mb-3 text-base border border-slate-700"
          placeholder="Email address"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput
          className="bg-slate-800 text-white rounded-xl px-4 py-3.5 mb-4 text-base border border-slate-700"
          placeholder="Password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
          onSubmitEditing={handleLogin}
        />

        {error !== "" && (
          <Text className="text-red-400 text-sm mb-3 text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={!valid || loading}
          className={`rounded-xl py-4 items-center ${valid && !loading ? "bg-brand-indigo" : "bg-slate-700"}`}
        >
          {loading
            ? <ActivityIndicator color="#0F172A" />
            : <Text className={`font-extrabold text-base ${valid ? "text-white" : "text-slate-500"}`}>Sign In</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
```

---

### Task 7.2 — app/(admin)/index.tsx (Dashboard)

Fetch `GET /admin/analytics/overview`.

Layout: dark background, 2-column grid of KPICards, pull-to-refresh.

```tsx
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/api/client";
import { EP } from "@/api/endpoints";
import { AnalyticsOverview } from "@/models/analytics";
import { KPICard } from "@/components/KPICard";
import { LoadingView } from "@/components/LoadingView";
import { ErrorBanner } from "@/components/ErrorBanner";

export default function DashboardScreen() {
  const [data, setData]           = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState("");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError("");
    try {
      const res = await apiClient.get<AnalyticsOverview>(EP.analyticsOverview);
      setData(res);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading && !data) return <LoadingView />;

  return (
    <ScrollView
      className="flex-1 bg-brand-dark"
      contentContainerStyle={{ padding: 16, gap: 12 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#4F46E5" />}
    >
      {error !== "" && <ErrorBanner message={error} />}

      <Text className="text-white text-xl font-bold mb-2">Overview</Text>

      <View className="flex-row gap-3">
        <KPICard title="Bookings Today"  value={data?.bookingsToday ?? "—"}    icon="📅" accent="bg-indigo-500/10" />
        <KPICard title="This Month"      value={data?.bookingsThisMonth ?? "—"} icon="📊" accent="bg-blue-500/10" />
      </View>
      <View className="flex-row gap-3">
        <KPICard title="Revenue / Month" value={data ? `£${data.revenueThisMonth.toFixed(0)}` : "—"} icon="💷" accent="bg-green-500/10" />
        <KPICard title="Active Drivers"  value={data?.activeDrivers ?? "—"}    icon="🚐" accent="bg-purple-500/10" />
      </View>
      <View className="flex-row gap-3">
        <KPICard title="Pending Jobs"    value={data?.pendingJobs ?? "—"}      icon="💼" accent="bg-rose-600/10" />
        <KPICard title="Visitors Today"  value={data?.visitorsToday ?? "—"}    icon="👁" accent="bg-cyan-500/10" />
      </View>
    </ScrollView>
  );
}
```

---

### Task 7.3 — app/(admin)/bookings/index.tsx (Bookings list)

- Header with `TextInput` search (debounced 400ms)
- `FilterChips` for status (All / Pending / Confirmed / Assigned / Active / Done)
- `FlatList` of booking rows
- Each row: reference (monospace), customer name, status badge, price, date
- `NavigationLink` to `/(admin)/bookings/[id]` using `router.push`
- Pull-to-refresh, infinite scroll (load more when near bottom)

Fetch: `GET /admin/bookings?q=&status=&page=&limit=20`

Response shape: `{ data: BookingListItem[], pagination: { page, limit, total } }`

Handle: loading, error, empty state.

Import and use `BOOKING_STATUS_LABEL` and `BOOKING_STATUS_COLOR` from models.

Status filter chip values: `""` / `"PENDING"` / `"CONFIRMED"` / `"ASSIGNED"` / `"IN_PROGRESS"` / `"COMPLETED"`

---

### Task 7.4 — app/(admin)/bookings/[id].tsx (Booking detail)

Fetch `GET /admin/bookings/:id`

Sections (use `SectionList` or stacked `View` groups):

**Customer** — name, email (Linking.openURL mailto:), phone (tel:)

**Booking** — reference, service, date + time slot, total price (£), status badge
- "Change Status" button → `Alert.alert` with action sheet of all statuses → `PATCH /admin/bookings/:id/status`

**Driver** — driver name or "Unassigned"
- "Assign Driver" button → loads `GET /admin/drivers`, shows `ActionSheetIOS` (iOS) or `Alert` (Android) to pick → `POST /admin/bookings/:id/assign`

**Items** — list of `{ name, quantity }` rows

**Tracking** — list of tracking events, newest first
- "Add Note" button → `Alert.prompt` (iOS) / modal with `TextInput` (Android) → `POST /admin/bookings/:id/tracking` body `{ type: "note", note, isInternal: true }`

**Actions**
- "Cancel Booking" (red) → `confirmAction("Cancel Booking?", "This cannot be undone.", ...)` → `POST /admin/bookings/:id/cancel`

Show `LoadingView` while loading. Show `ErrorBanner` on error. Reload after every successful mutation.

---

### Task 7.5 — app/(admin)/drivers/index.tsx (Drivers list)

Fetch `GET /admin/drivers`.

Each row: driver name (bold), email, van size badge, active toggle (`Switch`), unpaid earnings in rose if > 0.

Toolbar button "Add Driver" → modal `Alert.prompt` chain (or `Modal`) for: name, email, phone, van size → `POST /admin/drivers`.

Tap row → navigate to `/(admin)/drivers/[id]`.

Handle loading, error, empty state.

---

### Task 7.6 — app/(admin)/drivers/[id].tsx (Driver detail)

Fetch `GET /admin/drivers/:id/earnings`.

Sections:
- **Info**: name, email, phone, van size, active status
- **Earnings**: total (£), this month (£), unpaid (rose), paid (green)
  - "Mark All Paid" button (visible if unpaid > 0) → `confirmAction` → `POST /admin/drivers/:id/mark-paid`
- **Actions**:
  - "Reset Password" → `confirmAction` → `POST /admin/drivers/:id/reset-password` → show temp password in `Alert.alert`

---

### Task 7.7 — app/(admin)/jobs/index.tsx (Job board)

Fetch `GET /admin/jobs?status=AVAILABLE`.

Toolbar: "Pause All" button → `confirmAction` → `POST /admin/jobs/pause-all`
          "Publish All" button → `confirmAction` → `POST /admin/jobs/resume-all`

Each row:
- Reference (monospace bold), service, date/time
- Total price | Driver pay (green if set, "Set pay" in rose if not)
- Visibility eye icon (filled = public, outline = hidden) → tap → `PATCH /admin/jobs/:id { isPublic: !current }`

Tap row → bottom sheet / modal to set driver pay: amount field (numeric) + optional note → `PATCH /admin/jobs/:id/driver-pay { amount, note }`.

Handle loading, error, empty state.

---

### Task 7.8 — app/(admin)/analytics/index.tsx (Analytics + More links)

This tab acts as "Analytics" screen AND "More" navigation (since we only have 5 tabs).

**Top half:** Analytics charts
- Fetch all 4 endpoints in parallel: overview, per-day, revenue, services
- Use `react-native-chart-kit`:
  - `LineChart` — bookings per day (30 days)
  - `LineChart` — revenue per day (30 days), with `£` prefix on Y axis
  - `BarChart` — by service (top 6)
- Format x-axis: show only every 7th date label to avoid overlap

**Bottom section:** "More" navigation links list
- Enquiries → `router.push("/(admin)/enquiries/")`
- Notifications → `router.push("/(admin)/notifications/")`
- Logout → `confirmAction("Log out?", ..., () => logout())` where `logout` from `useAuth()`

---

### Task 7.9 — app/(admin)/enquiries/index.tsx (Enquiries)

Fetch `GET /admin/enquiries?page=1&limit=30`.

Status filter chips: All / New / Quoted / Accepted / Declined

Each row: customer name, destination (city, country), status badge, quoted price (if set), date.

Tap row → `Modal` (full-screen) showing:
- Customer details (name, email phone)
- Move details (from, to, property type, bedrooms, packing, storage)
- Notes
- Status picker (`Picker` or segmented control)
- Quoted price `TextInput` (numeric)
- Admin notes `TextInput` (multiline)
- "Save" button → `PATCH /admin/enquiries/:id`
- "Send Quote Email" button (only when status is "quoted") → `confirmAction` → `POST /admin/enquiries/:id/send-quote`

Handle loading, error, empty state.

---

### Task 7.10 — app/(admin)/notifications/index.tsx (Notifications)

Fetch `GET /admin/notifications`.

Each row: coloured dot (indigo = unread, grey = read), title (bold if unread), body, relative time.

Tap row → marks read: `PATCH /admin/notifications/:id`

Swipe left → "Delete" action → `confirmAction` → `DELETE /admin/notifications/:id`

Toolbar "Mark all read" button (visible if any unread) → `POST /admin/notifications/read { all: true }`

Handle loading, error, empty state.

---

## PHASE 8 — HOOKS (optional extraction)

Extract data-fetching logic from screens into reusable hooks in `src/hooks/`. Each hook returns `{ data, loading, error, reload }`. This reduces screen file size. Example:

```ts
// src/hooks/useBookings.ts
export function useBookings() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(false);

  async function load(q = "", status = "", reset = false) { ... }
  async function loadMore() { ... }

  return { bookings, loading, error, hasMore, load, loadMore };
}
```

---

## PHASE 9 — QUALITY RULES

Apply to every file:

1. **No `any` type** — use proper TypeScript types or `unknown` with type guards
2. **No raw string colours** — use Tailwind classes or brand hex constants from models
3. **All screens have:** loading state, error state (`ErrorBanner`), empty state (`EmptyState`), pull-to-refresh
4. **All destructive actions** use `confirmAction()` before calling the API
5. **Monetary values** always formatted as `£${value.toFixed(2)}`
6. **Dates** always formatted with `new Date(str).toLocaleDateString("en-GB")` or similar — never display raw ISO strings
7. **401 errors** are handled in `apiClient` — do NOT add extra logout logic in screens
8. **Screen background** is always `bg-brand-dark` (`#0F172A`)
9. **No inline styles** unless NativeWind class is impossible (e.g., dynamic hex colours for charts)
10. **TypeScript strict** — no `// @ts-ignore` comments

---

## PHASE 10 — DELIVERY CHECKLIST

Before completing, verify:

- [ ] `npx expo start` launches without errors
- [ ] Login screen renders, submits, stores token, navigates to tabs
- [ ] Dashboard loads KPI cards from live API
- [ ] Bookings list loads, search works, filter chips work, tapping a row opens detail
- [ ] Booking detail shows all sections, status change + assign driver work
- [ ] Drivers list loads, active toggle calls API
- [ ] Driver detail shows earnings, mark paid button works
- [ ] Job board loads, pause/resume all show confirmation, visibility toggle works
- [ ] Analytics charts render with real data (3 charts)
- [ ] Enquiries load, filter chips work, detail modal opens
- [ ] Notifications load, tap marks read, swipe deletes
- [ ] Logout shows confirmation, clears token, returns to login
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] All screens work on both iOS simulator and Android emulator
