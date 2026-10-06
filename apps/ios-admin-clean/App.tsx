import React, {
  Component,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View
} from "react-native";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "https://www.speedyvan.uk/api";
const MAPBOX_TOKEN =
  (process.env as Record<string, string | undefined>)["EXPO_PUBLIC_MAPBOX_TOKEN"] ?? "";
const NOTIFICATION_SOUND_ASSET = require("./assets/sounds/new-booking.mp3");
type WebNotificationAudio = {
  loop: boolean;
  volume: number;
  currentTime: number;
  play: () => Promise<void>;
  pause: () => void;
};
let notificationAudioPlayer: AudioPlayer | null = null;
let notificationAudioModeReady = false;
let notificationVibrationTimer: ReturnType<typeof setInterval> | null = null;
let webNotificationAudio: WebNotificationAudio | null = null;

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminUser     = { id?: string; name?: string; email?: string; role?: string };
type Session       = { token: string; user: AdminUser };
type LoginResponse = { token: string; user: AdminUser };
type RequestOpts   = { method?: "GET" | "POST" | "PATCH" | "DELETE"; token?: string; body?: unknown };
type ResourceState<T> = { loading: boolean; refreshing: boolean; error: string | null; data: T | null };
type TabKey        = "dashboard" | "bookings" | "drivers" | "jobs" | "more";
type MoreView      = "main" | "notifications" | "create-admin" | "invoice";
type AnyRecord     = Record<string, unknown>;

const TABS: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "dashboard", label: "Home",     icon: "◉" },
  { key: "bookings",  label: "Bookings", icon: "≡" },
  { key: "drivers",   label: "Drivers",  icon: "⊚" },
  { key: "jobs",      label: "Jobs",     icon: "⊛" },
  { key: "more",      label: "More",     icon: "···" },
];

const LIST_ENDPOINTS: Record<Exclude<TabKey, "dashboard" | "more">, string> = {
  bookings: "/admin/bookings?page=1&limit=20",
  drivers:  "/admin/drivers",
  jobs:     "/admin/jobs",
};

const BOOKING_STATUSES = [
  "PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"
] as const;
const BOOKING_TIME_SLOTS = ["morning", "afternoon", "evening"] as const;
type BookingStatus   = (typeof BOOKING_STATUSES)[number];
type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];
type SaveMode        = "details" | "status" | "assign" | "cancel";

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING:     "#F97316",
  CONFIRMED:   "#3B82F6",
  ASSIGNED:    "#8B5CF6",
  IN_PROGRESS: "#10B981",
  COMPLETED:   "#64748B",
  CANCELLED:   "#EF4444",
};
const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING:     "Pending",
  CONFIRMED:   "Confirmed",
  ASSIGNED:    "Assigned",
  IN_PROGRESS: "In Progress",
  COMPLETED:   "Completed",
  CANCELLED:   "Cancelled",
};
const BOOKING_REFERENCE_RE = /\bSVR-\d{4}-[A-Z0-9]+\b/i;

type AdminNotification = {
  id: string; title: string; body?: string; message?: string;
  isRead: boolean; createdAt: string; link?: string;
};
type SeenBooking = {
  id: string; reference: string; customerName: string;
  totalPrice: string; createdAt: string;
};
type BookingFormState = {
  customerName: string; customerEmail: string; customerPhone: string;
  scheduledDate: string; selectedTimeSlot: BookingTimeSlot; notes: string;
};
const EMPTY_FORM: BookingFormState = {
  customerName: "", customerEmail: "", customerPhone: "",
  scheduledDate: "", selectedTimeSlot: "afternoon", notes: "",
};

// ─── Hook: animated count-up ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 700): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) { setDisplay(target); return; }
    const steps  = 16;
    const stepMs = Math.max(Math.round(duration / steps), 16);
    let step     = 0;
    const timer  = setInterval(() => {
      step++;
      const p     = step / steps;
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (step >= steps) {
        clearInterval(timer);
        fromRef.current = target;
        setDisplay(target);
      }
    }, stepMs);
    return () => clearInterval(timer);
  }, [target, duration]);

  return display;
}

// ─── Helper utilities ─────────────────────────────────────────────────────────
function isRecord(v: unknown): v is AnyRecord {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}
function getNestedValue(item: AnyRecord, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((cur, key) => (isRecord(cur) ? cur[key] : undefined), item);
}
function getString(item: AnyRecord, paths: string[], fallback = ""): string {
  for (const path of paths) {
    const v = getNestedValue(item, path);
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return fallback;
}
function getNumber(item: AnyRecord, paths: string[]): number | null {
  for (const path of paths) {
    const v = getNestedValue(item, path);
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim()) {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}
function isBookingStatus(v: unknown): v is BookingStatus {
  return typeof v === "string" && (BOOKING_STATUSES as readonly string[]).includes(v);
}
function isBookingTimeSlot(v: unknown): v is BookingTimeSlot {
  return typeof v === "string" && (BOOKING_TIME_SLOTS as readonly string[]).includes(v);
}
function getBookingStatus(item: AnyRecord | null): BookingStatus {
  if (!item) return "PENDING";
  const v = getString(item, ["status"], "PENDING").toUpperCase();
  return isBookingStatus(v) ? v : "PENDING";
}
function getBookingTimeSlot(item: AnyRecord | null): BookingTimeSlot {
  if (!item) return "afternoon";
  const v = getString(item, ["selectedTimeSlot"], "afternoon").toLowerCase();
  return isBookingTimeSlot(v) ? v : "afternoon";
}
function formatDateInput(v: unknown): string {
  if (typeof v !== "string" || !v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function toIsoFromDateInput(value: string, current: unknown): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const cd  = typeof current === "string" ? new Date(current) : null;
  const h   = cd && !Number.isNaN(cd.getTime()) ? cd.getUTCHours()   : 12;
  const min = cd && !Number.isNaN(cd.getTime()) ? cd.getUTCMinutes() : 0;
  const dt  = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), h, min));
  return Number.isNaN(dt.getTime()) ? null : dt.toISOString();
}
function buildBookingForm(booking: AnyRecord | null): BookingFormState {
  if (!booking) return EMPTY_FORM;
  return {
    customerName:     getString(booking, ["customerName",  "customer.name", "user.name"],  ""),
    customerEmail:    getString(booking, ["customerEmail", "customer.email","user.email"],  ""),
    customerPhone:    getString(booking, ["customerPhone", "customer.phone","user.phone"],  ""),
    scheduledDate:    formatDateInput(getNestedValue(booking, "scheduledAt")),
    selectedTimeSlot: getBookingTimeSlot(booking),
    notes:            getString(booking, ["notes"], ""),
  };
}
function pickList(payload: unknown, keys: string[]): AnyRecord[] {
  if (Array.isArray(payload)) return payload.filter(isRecord);
  if (!isRecord(payload)) return [];
  for (const key of keys) {
    const v = payload[key];
    if (Array.isArray(v)) return v.filter(isRecord);
  }
  if (Array.isArray(payload["data"])) return (payload["data"] as unknown[]).filter(isRecord);
  return [];
}
function pickNotifications(payload: unknown): AdminNotification[] {
  return pickList(payload, ["items", "notifications", "results"]).flatMap((item) => {
    const id          = getString(item, ["id"], "");
    const title       = getString(item, ["title"], "");
    const isReadValue = getNestedValue(item, "isRead");
    if (!id || !title || typeof isReadValue !== "boolean") return [];
    return [{
      id, title,
      body:      getString(item, ["body"], ""),
      message:   getString(item, ["message"], ""),
      isRead:    isReadValue,
      createdAt: getString(item, ["createdAt"], ""),
      link:      getString(item, ["link"], ""),
    }];
  });
}
function pickSeenBookings(payload: unknown): SeenBooking[] {
  return pickList(payload, ["bookings", "items", "results"]).flatMap((item) => {
    const id        = getString(item, ["id"], "");
    const reference = getString(item, ["reference"], "");
    if (!id || !reference) return [];
    return [{
      id, reference,
      customerName: getString(item, ["customerName", "customer.name", "user.name"], "Customer"),
      totalPrice:   formatMoney(getNestedValue(item, "totalPrice")),
      createdAt:    getString(item, ["createdAt"], ""),
    }];
  });
}

function getNotificationEventKey(notification: AdminNotification): string {
  const text = [
    notification.title,
    notification.body,
    notification.message,
    notification.link,
  ].filter(Boolean).join(" ");
  const reference = BOOKING_REFERENCE_RE.exec(text)?.[0]?.toUpperCase();
  return reference ? `booking:${reference}` : `notification:${notification.id}`;
}

// ─── Notification sound ───────────────────────────────────────────────────────
function getNotificationSoundUri(): string | null {
  if (typeof NOTIFICATION_SOUND_ASSET === "string") return NOTIFICATION_SOUND_ASSET;
  return Image.resolveAssetSource(NOTIFICATION_SOUND_ASSET)?.uri ?? null;
}

function startNotificationVibration() {
  Vibration.vibrate([0, 300, 160, 300]);
  if (notificationVibrationTimer) return;
  notificationVibrationTimer = setInterval(() => {
    Vibration.vibrate([0, 300, 160, 300]);
  }, 3_000);
}

function stopNotificationVibration() {
  Vibration.cancel();
  if (!notificationVibrationTimer) return;
  clearInterval(notificationVibrationTimer);
  notificationVibrationTimer = null;
}

async function startNativeNotificationSound() {
  if (!notificationAudioModeReady) {
    await setAudioModeAsync({
      interruptionMode: "mixWithOthers",
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    });
    notificationAudioModeReady = true;
  }

  notificationAudioPlayer ??= createAudioPlayer(NOTIFICATION_SOUND_ASSET, {
    keepAudioSessionActive: true,
  });
  notificationAudioPlayer.loop = true;
  notificationAudioPlayer.volume = 1;
  await notificationAudioPlayer.seekTo(0);
  notificationAudioPlayer.play();
}

function startWebNotificationSound() {
  try {
    const soundUri = getNotificationSoundUri();
    if (!soundUri) return;
    webNotificationAudio?.pause();
    webNotificationAudio = new Audio(soundUri);
    webNotificationAudio.loop = true;
    webNotificationAudio.volume = 1;
    webNotificationAudio.currentTime = 0;
    void webNotificationAudio.play();
  } catch {
    // Blocked by browser autoplay policy — silently ignore
  }
}

function playNotificationCue() {
  startNotificationVibration();
  if (Platform.OS === "web") {
    startWebNotificationSound();
    return;
  }
  void startNativeNotificationSound().catch(() => undefined);
}

function stopNotificationCue() {
  stopNotificationVibration();
  webNotificationAudio?.pause();
  if (webNotificationAudio) webNotificationAudio.currentTime = 0;
  notificationAudioPlayer?.pause();
  void notificationAudioPlayer?.seekTo(0).catch(() => undefined);
}

// ─── API client ───────────────────────────────────────────────────────────────
function readError(payload: unknown, status: number): string {
  if (isRecord(payload)) {
    if (typeof payload["error"]   === "string") return payload["error"];
    if (typeof payload["message"] === "string") return payload["message"];
  }
  return `Request failed (${status})`;
}

async function apiRequest<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const res = await fetch(`${API_BASE.replace(/\/+$/, "")}${path}`, {
    method:  opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const text    = await res.text();
  const payload: unknown = text.length > 0 ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(readError(payload, res.status));
  if (isRecord(payload) && payload["success"] === false)
    throw new Error(typeof payload["error"] === "string" ? payload["error"] : "Request failed");
  if (isRecord(payload) && "data" in payload) return payload["data"] as T;
  return payload as T;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatMoney(value: unknown): string {
  const n =
    typeof value === "number" ? value :
    typeof value === "string" ? Number(value) : NaN;
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency", currency: "GBP", maximumFractionDigits: 0,
  }).format(n);
}
function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(d);
}
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
function humanize(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}
function phoneToE164(phone: string): string {
  const cleaned = phone.replace(/[\s().-]/g, "");
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("0"))  return `44${cleaned.slice(1)}`;
  return cleaned;
}

// ─── Error boundary ───────────────────────────────────────────────────────────
class StartupErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.errorRoot}>
          <StatusBar style="light" />
          <Text style={styles.errorTitle}>Startup error</Text>
          <Text style={styles.errorText}>{this.state.error.message}</Text>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <StartupErrorBoundary>
      <AdminApp />
    </StartupErrorBoundary>
  );
}

function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  if (!session) return <LoginScreen onLogin={setSession} />;
  return <AdminShell session={session} onLogout={() => setSession(null)} />;
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState<"email" | "password" | null>(null);

  // Entrance animations
  const heroOpacity  = useRef(new Animated.Value(0)).current;
  const heroSlide    = useRef(new Animated.Value(32)).current;
  const panelSlide   = useRef(new Animated.Value(80)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity,  { toValue: 1, duration: 550, useNativeDriver: true }),
      Animated.spring(heroSlide,    { toValue: 0, tension: 70, friction: 12, useNativeDriver: true }),
      Animated.timing(panelOpacity, { toValue: 1, duration: 500, delay: 250, useNativeDriver: true }),
      Animated.spring(panelSlide,   { toValue: 0, tension: 55, friction: 11, delay: 250, useNativeDriver: true }),
    ]).start();
  }, [heroOpacity, heroSlide, panelSlide, panelOpacity]);

  const canSubmit = email.trim().length > 3 && password.length > 0 && !loading;

  async function submit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST", body: { email: email.trim(), password },
      });
      if (!data.token) throw new Error("Login response did not include a token.");
      onLogin({ token: data.token, user: data.user ?? { email } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.loginRoot}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.loginKeyboard}
      >
        <ScrollView
          contentContainerStyle={styles.loginScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <Animated.View
            style={[
              styles.loginHero,
              { opacity: heroOpacity, transform: [{ translateY: heroSlide }] },
            ]}
          >
            <View style={styles.loginBrandRow}>
              <View style={styles.logoWrapper}>
                <Image
                  // eslint-disable-next-line @typescript-eslint/no-require-imports
                  source={require("./assets/logo.jpeg")}
                  style={styles.logoImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.loginBadge}>
                <Text style={styles.loginBadgeText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.loginTitle}>SpeedyVan</Text>
            <Text style={styles.loginTitleAccent}>Operations Console</Text>
            <Text style={styles.loginSubtitle}>
              Manage live bookings, drivers, jobs, and customer updates from one secure place.
            </Text>

            <View style={styles.loginStatusStrip}>
              <View style={styles.loginStatusItem}>
                <Text style={styles.loginStatusValue}>24/7</Text>
                <Text style={styles.loginStatusLabel}>Ops</Text>
              </View>
              <View style={styles.loginStatusDivider} />
              <View style={styles.loginStatusItem}>
                <Text style={styles.loginStatusValue}>Live</Text>
                <Text style={styles.loginStatusLabel}>Data</Text>
              </View>
              <View style={styles.loginStatusDivider} />
              <View style={styles.loginStatusItem}>
                <Text style={styles.loginStatusValue}>UK</Text>
                <Text style={styles.loginStatusLabel}>Team</Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Form panel ── */}
          <Animated.View
            style={[
              styles.loginPanel,
              { opacity: panelOpacity, transform: [{ translateY: panelSlide }] },
            ]}
          >
            <View style={styles.panelHeader}>
              <View style={styles.panelAccentBar} />
              <View style={styles.panelHeaderText}>
                <Text style={styles.panelTitle}>Welcome back</Text>
                <Text style={styles.panelSubtitle}>Sign in to continue</Text>
              </View>
            </View>

            <View style={styles.loginFields}>
              <View style={[styles.inputRow, focused === "email" && styles.inputRowFocused]}>
                <Text style={styles.inputIcon}>@</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onBlur={() => setFocused(null)}
                  onChangeText={setEmail}
                  onFocus={() => setFocused("email")}
                  placeholder="Email address"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="next"
                  style={styles.inputField}
                  textContentType="username"
                  value={email}
                />
              </View>

              <View style={[styles.inputRow, focused === "password" && styles.inputRowFocused]}>
                <Text style={styles.inputIcon}>*</Text>
                <TextInput
                  onBlur={() => setFocused(null)}
                  onChangeText={setPassword}
                  onFocus={() => setFocused("password")}
                  onSubmitEditing={submit}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  returnKeyType="go"
                  secureTextEntry={!showPassword}
                  style={styles.inputField}
                  textContentType="password"
                  value={password}
                />
                <Pressable
                  hitSlop={8}
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? "Hide" : "Show"}</Text>
                </Pressable>
              </View>
            </View>

            {error ? (
              <View style={styles.errorBubble}>
                <Text style={styles.errorBubbleTitle}>Unable to sign in</Text>
                <Text style={styles.errorBubbleText}>{error}</Text>
              </View>
            ) : null}

            <Pressable
              disabled={!canSubmit}
              onPress={submit}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.loginButton,
                !canSubmit  && styles.disabledButton,
                pressed && canSubmit && styles.pressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign in</Text>
              )}
            </Pressable>

            <View style={styles.loginSecurityCard}>
              <Text style={styles.loginSecurityMark}>✓</Text>
              <Text style={styles.loginSecurityText}>
                Secure admin access for authorised SpeedyVan staff.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Admin shell ──────────────────────────────────────────────────────────────
function AdminShell({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [activeTab,         setActiveTab]         = useState<TabKey>("dashboard");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [notifBanner,       setNotifBanner]       = useState<AdminNotification | null>(null);
  const [visitorCount,      setVisitorCount]      = useState(0);
  const [visitorLoaded,     setVisitorLoaded]     = useState(false);
  const [state, setState] = useState<ResourceState<unknown>>({
    loading: true, refreshing: false, error: null, data: null,
  });

  const prevUnreadRef  = useRef<number | null>(null);
  const seenBookingIds = useRef<Set<string> | null>(null);
  const playedAlertKeys = useRef<Set<string>>(new Set());
  const lastCueAtRef    = useRef(0);
  const displayCount   = useCountUp(visitorCount);

  const showNotificationAlert = useCallback((notification: AdminNotification, eventKey: string) => {
    setNotifBanner(notification);

    const now = Date.now();
    if (playedAlertKeys.current.has(eventKey) || now - lastCueAtRef.current < 8_000) return;

    playedAlertKeys.current.add(eventKey);
    if (playedAlertKeys.current.size > 80) {
      const [oldest] = playedAlertKeys.current;
      if (oldest) playedAlertKeys.current.delete(oldest);
    }
    lastCueAtRef.current = now;
    playNotificationCue();
  }, []);

  const acknowledgeNotification = useCallback(() => {
    stopNotificationCue();
    setNotifBanner(null);
  }, []);

  useEffect(() => () => stopNotificationCue(), []);

  // Load tab data
  const load = useCallback(async (refreshing = false) => {
    if (activeTab === "more") {
      setState({ loading: false, refreshing: false, error: null, data: null });
      return;
    }
    setState((prev) => ({ ...prev, loading: !refreshing, refreshing, error: null }));
    try {
      const ep   = activeTab === "dashboard"
        ? "/admin/analytics/overview"
        : LIST_ENDPOINTS[activeTab];
      const data = await apiRequest<unknown>(ep, { token: session.token });
      setState({ loading: false, refreshing: false, error: null, data });
    } catch (err) {
      setState({
        loading: false, refreshing: false,
        error: err instanceof Error ? err.message : "Unable to load.",
        data: null,
      });
    }
  }, [activeTab, session.token]);

  useEffect(() => { void load(false); }, [load]);

  // Visitor count polling (every 30 s)
  useEffect(() => {
    let cancelled = false;
    async function pollVisitors() {
      try {
        const data = await apiRequest<{ count: number }>(
          "/admin/visitors/realtime", { token: session.token }
        );
        if (!cancelled && typeof data.count === "number") {
          setVisitorCount(data.count);
          setVisitorLoaded(true);
        }
      } catch { /* silent — visitor count is non-critical */ }
    }
    void pollVisitors();
    const timer = setInterval(() => void pollVisitors(), 30_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [session.token]);

  // Notification polling (every 10 s)
  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const data = await apiRequest<unknown>("/admin/notifications", { token: session.token });
        if (cancelled) return;
        const notifications = pickNotifications(data);
        const unread        = notifications.filter((n) => !n.isRead);
        const count         = unread.length;
        if (prevUnreadRef.current === null) { prevUnreadRef.current = count; return; }
        if (count > prevUnreadRef.current && unread[0]) {
          showNotificationAlert(unread[0], getNotificationEventKey(unread[0]));
        }
        prevUnreadRef.current = count;
      } catch { /* notification polling must not block the UI */ }
    }
    void poll();
    const timer = setInterval(() => void poll(), 10_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [session.token, showNotificationAlert]);

  // New booking polling (every 10 s)
  useEffect(() => {
    let cancelled = false;
    async function poll() {
      try {
        const data    = await apiRequest<unknown>(
          "/admin/bookings?page=1&limit=5", { token: session.token }
        );
        if (cancelled) return;
        const latest    = pickSeenBookings(data);
        const latestIds = new Set(latest.map((b) => b.id));
        if (seenBookingIds.current === null) { seenBookingIds.current = latestIds; return; }
        const newest = latest.find((b) => !seenBookingIds.current?.has(b.id));
        seenBookingIds.current = latestIds;
        if (newest) {
          const notification = {
            id: newest.id, title: `New booking: ${newest.reference}`,
            body: `${newest.customerName} · ${newest.totalPrice}`,
            isRead: false, createdAt: newest.createdAt,
          };
          showNotificationAlert(notification, `booking:${newest.reference.toUpperCase()}`);
        }
      } catch { /* silent */ }
    }
    void poll();
    const timer = setInterval(() => void poll(), 10_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [session.token, showNotificationAlert]);

  const title = selectedBookingId
    ? "Booking"
    : (TABS.find((t) => t.key === activeTab)?.label ?? "Admin");

  return (
    <SafeAreaView style={styles.shellRoot}>
      <StatusBar style="light" />

      {/* ── Top bar ──────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.topTextWrap}>
          <Text style={styles.topEyebrow}>SpeedyVan</Text>
          <Text numberOfLines={1} style={styles.topTitle}>{title}</Text>
        </View>
        <View style={styles.topActions}>
          {visitorLoaded && (
            <View style={styles.visitorBadge}>
              <Text style={styles.visitorBadgeText}>👁 {displayCount} live</Text>
            </View>
          )}
          <Pressable
            onPress={() => void load(true)}
            style={({ pressed }) => [styles.reloadButton, pressed && styles.pressed]}
          >
            <Text style={styles.reloadText}>↻</Text>
          </Pressable>
        </View>
      </View>

      {/* ── Notification banner ───────────────────────────────── */}
      {notifBanner ? (
        <NotificationBanner
          notification={notifBanner}
          onClose={acknowledgeNotification}
        />
      ) : null}

      {/* ── Tab bar ──────────────────────────────────────────── */}
      <TabBar
        activeTab={activeTab}
        onChange={(tab) => { setSelectedBookingId(null); setActiveTab(tab); }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      {selectedBookingId ? (
        <BookingDetailScreen
          bookingId={selectedBookingId}
          session={session}
          onBack={() => { setSelectedBookingId(null); void load(true); }}
        />
      ) : activeTab === "more" ? (
        <MoreScreen session={session} onLogout={onLogout} />
      ) : state.loading ? (
        <CenteredMessage label="Loading…" />
      ) : state.error ? (
        <ErrorState message={state.error} onRetry={() => void load(false)} />
      ) : activeTab === "dashboard" ? (
        <DashboardScreen
          data={state.data}
          refreshing={state.refreshing}
          onRefresh={() => void load(true)}
        />
      ) : (
        <ListScreen
          tab={activeTab}
          data={state.data}
          refreshing={state.refreshing}
          onRefresh={() => void load(true)}
          onOpenBooking={setSelectedBookingId}
        />
      )}
    </SafeAreaView>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({
  activeTab, onChange,
}: { activeTab: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <View style={styles.tabBar}>
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              active  && styles.activeTab,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.tabIcon, active && styles.activeTabIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabText, active && styles.activeTabText]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Notification banner ──────────────────────────────────────────────────────
function NotificationBanner({
  notification, onClose,
}: { notification: AdminNotification; onClose: () => void }) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1, tension: 90, friction: 9, useNativeDriver: true,
    }).start();
  }, [enter]);

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose}>
      <View style={styles.notifOverlay}>
        <Animated.View
          style={[
            styles.notifBanner,
            {
              opacity: enter,
              transform: [{
                scale: enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }),
              }],
            },
          ]}
        >
          <Pressable onPress={onClose} style={styles.notifBannerInner}>
            <View style={styles.notifBannerIconWrap}>
              <Text style={styles.notifBannerIcon}>🔔</Text>
            </View>
            <View style={styles.notifBannerBody}>
              <Text numberOfLines={2} style={styles.notifBannerTitle}>
                {notification.title}
              </Text>
              {(notification.body ?? notification.message) ? (
                <Text numberOfLines={3} style={styles.notifBannerText}>
                  {notification.body ?? notification.message}
                </Text>
              ) : null}
            </View>
            <View style={styles.notifStopButton}>
              <Text style={styles.notifStopButtonText}>Stop alert</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
type MetricItem = {
  label: string; value: number | string; money?: boolean; icon: string; accent: string;
};

function DashboardScreen({
  data, refreshing, onRefresh,
}: { data: unknown; refreshing: boolean; onRefresh: () => void }) {
  const metrics = useMemo<MetricItem[]>(() => {
    const src = isRecord(data) ? data : {};
    const n   = (paths: string[]) => getNumber(src, paths);

    const bookingsToday = n(["bookings.today",   "bookingsToday"]);
    const bookingsMonth = n(["bookings.month",   "bookingsThisMonth"]);
    const revenueToday  = n(["revenue.today",    "todayRevenue"]);
    const revenueMonth  = n(["revenue.month",    "monthlyRevenue",  "revenueThisMonth"]);
    const activeDrivers = n(["drivers.active",   "activeDrivers"]);
    const pendingJobs   = n(["jobs.pending",     "pendingJobs"]);
    const visitors      = n(["visitors.active",  "visitorsToday",   "activeVisitors"]);
    const totalBookings = n(["bookings.total",   "totalBookings"]);

    const result: MetricItem[] = [];
    if (bookingsToday !== null) result.push({ label: "Bookings Today",  value: bookingsToday, icon: "📅", accent: "#4F46E5" });
    if (bookingsMonth !== null) result.push({ label: "This Month",      value: bookingsMonth, icon: "📊", accent: "#0EA5E9" });
    if (revenueToday  !== null) result.push({ label: "Revenue Today",   value: revenueToday,  icon: "💷", accent: "#10B981", money: true });
    if (revenueMonth  !== null) result.push({ label: "Revenue / Month", value: revenueMonth,  icon: "💷", accent: "#059669", money: true });
    if (activeDrivers !== null) result.push({ label: "Active Drivers",  value: activeDrivers, icon: "🚐", accent: "#8B5CF6" });
    if (pendingJobs   !== null) result.push({ label: "Pending Jobs",    value: pendingJobs,   icon: "💼", accent: "#F97316" });
    if (visitors      !== null) result.push({ label: "Live Visitors",   value: visitors,      icon: "👁", accent: "#06B6D4" });
    if (totalBookings !== null) result.push({ label: "All Bookings",    value: totalBookings, icon: "🗂", accent: "#64748B" });

    if (result.length > 0) return result;

    return Object.entries(src)
      .filter((e): e is [string, number | string] =>
        typeof e[1] === "number" || typeof e[1] === "string"
      )
      .slice(0, 8)
      .map(([label, value]) => ({ label, value, icon: "·", accent: "#64748B" }));
  }, [data]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
      }
    >
      <Text style={styles.screenHeading}>Overview</Text>
      <View style={styles.metricGrid}>
        {metrics.length > 0
          ? metrics.map((m) => (
              <View
                key={m.label}
                style={[styles.metricCard, { borderLeftColor: m.accent, borderLeftWidth: 3 }]}
              >
                <Text style={styles.metricIcon}>{m.icon}</Text>
                <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
                  {m.money ? formatMoney(m.value) : String(m.value)}
                </Text>
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
            ))
          : <EmptyBlock title="No data" message="The API returned an empty overview." />
        }
      </View>
    </ScrollView>
  );
}

// ─── Generic list (drivers / jobs) ───────────────────────────────────────────
function ListScreen({
  tab, data, refreshing, onRefresh, onOpenBooking,
}: {
  tab: Exclude<TabKey, "dashboard" | "more">;
  data: unknown;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenBooking: (id: string) => void;
}) {
  const items = useMemo(() => {
    if (tab === "bookings") return pickList(data, ["bookings", "items", "results"]);
    if (tab === "drivers")  return pickList(data, ["drivers",  "items", "results"]);
    return pickList(data, ["jobs", "items", "results"]);
  }, [data, tab]);

  return (
    <FlatList
      contentContainerStyle={items.length > 0 ? styles.listContent : styles.emptyListContent}
      data={items}
      keyExtractor={(item, i) => getString(item, ["id", "_id", "reference"], `${tab}-${i}`)}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F97316" />
      }
      renderItem={({ item }) => {
        const id = getString(item, ["id", "_id"], "");
        return (
          <ListCard
            item={item}
            tab={tab}
            onPress={tab === "bookings" && id ? () => onOpenBooking(id) : undefined}
          />
        );
      }}
      ListEmptyComponent={
        <EmptyBlock
          title={`No ${tab}`}
          message="Pull to refresh, or check your admin permissions."
        />
      }
    />
  );
}

function ListCard({
  item, tab, onPress,
}: {
  item: AnyRecord;
  tab: Exclude<TabKey, "dashboard" | "more">;
  onPress?: () => void;
}) {
  const title =
    tab === "bookings"
      ? getString(item, ["reference", "customerName", "user.name"], "Booking")
      : tab === "drivers"
        ? getString(item, ["user.name", "name", "email", "user.email"], "Driver")
        : getString(item, ["title", "booking.reference", "reference", "id"], "Job");

  const subtitle =
    tab === "bookings"
      ? getString(item, ["customerName", "user.name", "customerEmail"], "Customer")
      : tab === "drivers"
        ? getString(item, ["user.email", "email", "phone", "user.phone"], "Driver account")
        : getString(item, ["booking.pickupAddress", "pickupAddress", "status"], "Job details");

  const rawStatus   = getString(item, ["status", "booking.status"], "");
  const statusUpper = rawStatus.toUpperCase();
  const statusColor = isBookingStatus(statusUpper) ? STATUS_COLORS[statusUpper] : "#94A3B8";
  const statusLabel = isBookingStatus(statusUpper) ? STATUS_LABELS[statusUpper] : humanize(rawStatus);

  const dateStr =
    tab === "bookings"
      ? getString(item, ["scheduledAt", "createdAt", "updatedAt"], "")
      : getString(item, ["createdAt",   "updatedAt", "booking.scheduledAt"], "");
  const amount = getNumber(item, ["totalPrice", "price", "booking.totalPrice", "driverPay"]);

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        onPress && styles.pressableCard,
        pressed  && styles.pressed,
      ]}
    >
      <View style={styles.cardTopLine}>
        <View style={styles.cardTitleWrap}>
          <Text numberOfLines={1} style={styles.cardTitle}>{title}</Text>
          <Text numberOfLines={1} style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
        {rawStatus ? (
          <View style={[styles.statusPill, { backgroundColor: statusColor + "22" }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardMetaLine}>
        <Text numberOfLines={1} style={styles.metaText}>{formatDate(dateStr)}</Text>
        {amount !== null ? (
          <Text style={styles.amountText}>{formatMoney(amount)}</Text>
        ) : null}
      </View>
      {onPress ? <Text style={styles.cardActionHint}>Tap to view ›</Text> : null}
    </Pressable>
  );
}

// ─── Booking detail ───────────────────────────────────────────────────────────
function BookingDetailScreen({
  bookingId, session, onBack,
}: { bookingId: string; session: Session; onBack: () => void }) {
  const [booking,        setBooking]        = useState<AnyRecord | null>(null);
  const [drivers,        setDrivers]        = useState<AnyRecord[]>([]);
  const [form,           setForm]           = useState<BookingFormState>(EMPTY_FORM);
  const [status,         setStatus]         = useState<BookingStatus>("PENDING");
  const [statusNote,     setStatusNote]     = useState("");
  const [assignDriverId, setAssignDriverId] = useState("");
  const [cancelReason,   setCancelReason]   = useState("");
  const [editing,        setEditing]        = useState(false);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [saving,         setSaving]         = useState<SaveMode | null>(null);
  const [error,          setError]          = useState<string | null>(null);
  const [success,        setSuccess]        = useState<string | null>(null);

  const loadDetail = useCallback(async (refresh = false) => {
    setLoading(!refresh); setRefreshing(refresh);
    setError(null); setSuccess(null);
    try {
      const [bData, dData] = await Promise.all([
        apiRequest<AnyRecord>(`/admin/bookings/${bookingId}`, { token: session.token }),
        apiRequest<unknown>("/admin/drivers", { token: session.token }),
      ]);
      setBooking(bData);
      setForm(buildBookingForm(bData));
      setStatus(getBookingStatus(bData));
      setAssignDriverId(getString(bData, ["driverId", "driver.id"], ""));
      setDrivers(pickList(dData, ["drivers", "items", "results"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load booking.");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, [bookingId, session.token]);

  useEffect(() => { void loadDetail(false); }, [loadDetail]);

  function updateForm<K extends keyof BookingFormState>(key: K, val: BookingFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function saveDetails() {
    if (!booking) return;
    const scheduledAt = toIsoFromDateInput(
      form.scheduledDate, getNestedValue(booking, "scheduledAt")
    );
    if (!scheduledAt)                       { setError("Use date format YYYY-MM-DD."); return; }
    if (!form.customerName.trim())          { setError("Customer name is required."); return; }
    if (!form.customerEmail.includes("@")) { setError("Enter a valid email."); return; }
    setSaving("details"); setError(null); setSuccess(null);
    try {
      const updated = await apiRequest<AnyRecord>(`/admin/bookings/${bookingId}/edit`, {
        method: "PATCH", token: session.token,
        body: {
          customerName:  form.customerName.trim(),
          customerEmail: form.customerEmail.trim(),
          customerPhone: form.customerPhone.trim(),
          scheduledAt,
          selectedTimeSlot: form.selectedTimeSlot,
          notes: form.notes.trim(),
        },
      });
      const merged = { ...booking, ...updated };
      setBooking(merged); setForm(buildBookingForm(merged));
      setEditing(false); setSuccess("Booking saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed."); }
    finally { setSaving(null); }
  }

  async function saveStatus() {
    if (!booking) return;
    setSaving("status"); setError(null); setSuccess(null);
    try {
      const note    = statusNote.trim();
      const updated = await apiRequest<AnyRecord>(`/admin/bookings/${bookingId}/status`, {
        method: "PATCH", token: session.token,
        body: { status, ...(note ? { note } : {}) },
      });
      setBooking({ ...booking, ...updated, status });
      setStatusNote(""); setSuccess("Status updated.");
    } catch (err) { setError(err instanceof Error ? err.message : "Update failed."); }
    finally { setSaving(null); }
  }

  async function assignDriver() {
    if (!booking || !assignDriverId) return;
    setSaving("assign"); setError(null); setSuccess(null);
    try {
      await apiRequest<unknown>(`/admin/bookings/${bookingId}/assign`, {
        method: "POST", token: session.token, body: { driverId: assignDriverId },
      });
      const driver = drivers.find((d) => getString(d, ["id"], "") === assignDriverId);
      setBooking({
        ...booking, driverId: assignDriverId,
        driver: driver ?? getNestedValue(booking, "driver"),
        status: "ASSIGNED",
      });
      setStatus("ASSIGNED"); setSuccess("Driver assigned.");
    } catch (err) { setError(err instanceof Error ? err.message : "Assign failed."); }
    finally { setSaving(null); }
  }

  async function cancelBooking() {
    if (!booking) return;
    setSaving("cancel"); setError(null); setSuccess(null);
    try {
      await apiRequest<unknown>(`/admin/bookings/${bookingId}/cancel`, {
        method: "POST", token: session.token,
        body: { reason: cancelReason.trim() || undefined },
      });
      setBooking({ ...booking, status: "CANCELLED" });
      setStatus("CANCELLED"); setCancelReason(""); setSuccess("Booking cancelled.");
    } catch (err) { setError(err instanceof Error ? err.message : "Cancel failed."); }
    finally { setSaving(null); }
  }

  if (loading) return <CenteredMessage label="Loading booking…" />;
  if (!booking) {
    return (
      <View style={styles.detailContent}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <ErrorState
          message={error ?? "Booking not found."}
          onRetry={() => void loadDetail(false)}
        />
      </View>
    );
  }

  const reference      = getString(booking, ["reference"], "Booking");
  const customerName   = getString(booking, ["customerName",  "customer.name",  "user.name"],  "Customer");
  const customerEmail  = getString(booking, ["customerEmail", "customer.email", "user.email"], "");
  const customerPhone  = getString(booking, ["customerPhone", "customer.phone", "user.phone"], "");
  const pickupAddress  = getString(booking, ["pickupAddress"],  "—");
  const dropoffAddress = getString(booking, ["dropoffAddress"], "—");
  const serviceName    = getString(booking, ["serviceName", "serviceSlug"], "—");
  const serviceVariant = getString(booking, ["serviceVariant"], "");
  const scheduledAt    = getString(booking, ["scheduledAt"], "");
  const timeSlot       = getString(booking, ["selectedTimeSlot"], "");
  const totalPrice     = getNumber(booking, ["totalPrice", "price"]);
  const notes          = getString(booking, ["notes"], "");
  const items          = pickList(getNestedValue(booking, "items"), ["items"]);
  const driverRecord   = isRecord(getNestedValue(booking, "driver"))
    ? (getNestedValue(booking, "driver") as AnyRecord)
    : null;
  const driverName     = driverRecord ? getString(driverRecord, ["user.name", "name"], "") : "";
  const helpersCount   = getNumber(booking, ["helpersCount"])  ?? 0;
  const needsPacking   = getNestedValue(booking, "needsPacking")  === true;
  const needsAssembly  = getNestedValue(booking, "needsAssembly") === true;
  const assemblyType   = getString(booking, ["assemblyType"], "");
  const assemblyQty    = getNumber(booking, ["assemblyQty"])   ?? 0;
  const pickupFloor    = getNumber(booking, ["pickupFloor"])   ?? 0;
  const dropoffFloor   = getNumber(booking, ["dropoffFloor"])  ?? 0;
  const pickupHasLift  = getNestedValue(booking, "pickupHasLift")  === true;
  const dropoffHasLift = getNestedValue(booking, "dropoffHasLift") === true;
  const distanceMiles  = getNumber(booking, ["distanceMiles"]);
  const pickupLat      = getNumber(booking, ["pickupLat"]);
  const pickupLng      = getNumber(booking, ["pickupLng"]);
  const dropoffLat     = getNumber(booking, ["dropoffLat"]);
  const dropoffLng     = getNumber(booking, ["dropoffLng"]);
  const bookingStatus  = getBookingStatus(booking);
  const statusColor    = STATUS_COLORS[bookingStatus];

  return (
    <ScrollView
      contentContainerStyle={styles.detailContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => void loadDetail(true)}
          tintColor="#F97316"
        />
      }
    >
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Bookings</Text>
      </Pressable>

      {/* Header */}
      <View style={styles.detailHeader}>
        <View style={styles.cardTitleWrap}>
          <Text style={styles.detailReference}>{reference}</Text>
          <Text style={styles.cardSubtitle}>{customerName}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: statusColor + "22" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[bookingStatus]}
          </Text>
        </View>
      </View>

      {error   ? <Text style={styles.inlineError}>{error}</Text>     : null}
      {success ? <Text style={styles.inlineSuccess}>{success}</Text> : null}

      {/* Map */}
      <BookingMapSection
        pickupLat={pickupLat}   pickupLng={pickupLng}
        dropoffLat={dropoffLat} dropoffLng={dropoffLng}
        pickupAddress={pickupAddress}
        dropoffAddress={dropoffAddress}
        token={MAPBOX_TOKEN}
      />

      {/* Customer */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Customer</Text>
        {customerPhone ? <CustomerContactButtons phone={customerPhone} /> : null}
        <View style={styles.detailRows}>
          <DetailRow label="Name"  value={customerName} />
          <DetailRow label="Email" value={customerEmail || "—"} />
          <DetailRow label="Phone" value={customerPhone || "—"} />
        </View>
      </View>

      {/* Booking details */}
      <View style={styles.profileCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Booking details</Text>
          <Pressable
            onPress={() => {
              setForm(buildBookingForm(booking));
              setEditing((e) => !e);
              setError(null);
              setSuccess(null);
            }}
            style={styles.smallButton}
          >
            <Text style={styles.smallButtonText}>{editing ? "Close" : "Edit"}</Text>
          </Pressable>
        </View>

        {editing ? (
          <View style={styles.formBlock}>
            <FormField
              label="Customer name"
              value={form.customerName}
              onChangeText={(v) => updateForm("customerName", v)}
            />
            <FormField
              label="Customer email"
              value={form.customerEmail}
              onChangeText={(v) => updateForm("customerEmail", v)}
              keyboardType="email-address"
            />
            <FormField
              label="Customer phone"
              value={form.customerPhone}
              onChangeText={(v) => updateForm("customerPhone", v)}
              keyboardType="phone-pad"
            />
            <FormField
              label="Service date"
              value={form.scheduledDate}
              onChangeText={(v) => updateForm("scheduledDate", v)}
              placeholder="YYYY-MM-DD"
            />
            <Text style={styles.fieldLabel}>Time slot</Text>
            <View style={styles.optionWrap}>
              {BOOKING_TIME_SLOTS.map((slot) => (
                <Pressable
                  key={slot}
                  onPress={() => updateForm("selectedTimeSlot", slot)}
                  style={[styles.optionPill, form.selectedTimeSlot === slot && styles.activeOptionPill]}
                >
                  <Text
                    style={[styles.optionText, form.selectedTimeSlot === slot && styles.activeOptionText]}
                  >
                    {humanize(slot)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <FormField
              label="Notes"
              value={form.notes}
              onChangeText={(v) => updateForm("notes", v)}
              multiline
            />
            <Pressable
              disabled={saving === "details"}
              onPress={saveDetails}
              style={[styles.primaryButton, saving === "details" && styles.disabledButton]}
            >
              {saving === "details"
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryButtonText}>Save booking</Text>
              }
            </Pressable>
          </View>
        ) : (
          <View style={styles.detailRows}>
            <DetailRow label="Service"   value={serviceName} />
            {serviceVariant ? <DetailRow label="Variant"  value={serviceVariant} /> : null}
            <DetailRow label="Date"      value={scheduledAt ? formatDate(scheduledAt) : "—"} />
            <DetailRow label="Time slot" value={timeSlot ? humanize(timeSlot) : "—"} />
            <DetailRow label="Pickup"    value={pickupAddress} />
            <DetailRow label="Dropoff"   value={dropoffAddress} />
            {distanceMiles !== null ? (
              <DetailRow label="Distance" value={`${distanceMiles.toFixed(1)} mi`} />
            ) : null}
            <DetailRow label="Price" value={totalPrice !== null ? formatMoney(totalPrice) : "—"} />
            {notes ? <DetailRow label="Notes" value={notes} /> : null}
          </View>
        )}
      </View>

      {/* Added services */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Added services</Text>
        <View style={styles.detailRows}>
          <DetailRow
            label="Helpers"
            value={helpersCount > 0 ? String(helpersCount) : "None"}
          />
          <DetailRow label="Packing" value={needsPacking ? "Yes" : "No"} />
          <DetailRow
            label="Assembly"
            value={
              needsAssembly
                ? `${assemblyType ? humanize(assemblyType) : "Yes"}${assemblyQty > 0 ? ` × ${assemblyQty}` : ""}`
                : "No"
            }
          />
          <DetailRow
            label="Pickup"
            value={`Floor ${pickupFloor}${pickupHasLift ? " · lift available" : ""}`}
          />
          <DetailRow
            label="Dropoff"
            value={`Floor ${dropoffFloor}${dropoffHasLift ? " · lift available" : ""}`}
          />
        </View>
      </View>

      {/* Status */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Update status</Text>
        <View style={styles.optionWrap}>
          {BOOKING_STATUSES.map((s) => (
            <Pressable
              key={s}
              onPress={() => setStatus(s)}
              style={[
                styles.optionPill,
                status === s && {
                  backgroundColor: STATUS_COLORS[s] + "22",
                  borderColor: STATUS_COLORS[s],
                },
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  status === s && { color: STATUS_COLORS[s] },
                ]}
              >
                {STATUS_LABELS[s]}
              </Text>
            </Pressable>
          ))}
        </View>
        <FormField
          label="Note (optional)"
          value={statusNote}
          onChangeText={setStatusNote}
          placeholder="Reason for change"
        />
        <Pressable
          disabled={saving === "status"}
          onPress={saveStatus}
          style={[styles.secondaryButton, saving === "status" && styles.disabledButton]}
        >
          {saving === "status"
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.secondaryButtonText}>Update status</Text>
          }
        </Pressable>
      </View>

      {/* Driver */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Driver</Text>
        <Text style={styles.sectionSubtitle}>
          {driverName ? `Assigned: ${driverName}` : "No driver assigned."}
        </Text>
        <View style={styles.driverList}>
          {drivers.map((d) => {
            const id   = getString(d, ["id"], "");
            const name = getString(d, ["user.name", "name"], "Driver");
            const van  = getString(d, ["vanSize"], "");
            const sel  = id === assignDriverId;
            return (
              <Pressable
                key={id}
                onPress={() => setAssignDriverId(id)}
                style={[styles.driverOption, sel && styles.activeDriverOption]}
              >
                <Text style={[styles.driverOptionText, sel && styles.activeOptionText]}>
                  {name}{van ? ` (${van})` : ""}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          disabled={!assignDriverId || saving === "assign"}
          onPress={assignDriver}
          style={[
            styles.secondaryButton,
            (!assignDriverId || saving === "assign") && styles.disabledButton,
          ]}
        >
          {saving === "assign"
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.secondaryButtonText}>Assign driver</Text>
          }
        </Pressable>
      </View>

      {/* Items */}
      {items.length > 0 ? (
        <View style={styles.profileCard}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item, i) => (
            <DetailRow
              key={getString(item, ["id"], `item-${i}`)}
              label={getString(item, ["quantity"], "1")}
              value={getString(item, ["name"], "Item")}
            />
          ))}
        </View>
      ) : null}

      {/* Cancel */}
      <View style={styles.profileCard}>
        <Text style={styles.sectionTitle}>Cancel booking</Text>
        <FormField
          label="Reason"
          value={cancelReason}
          onChangeText={setCancelReason}
          placeholder="Optional reason"
          multiline
        />
        <Pressable
          disabled={bookingStatus === "CANCELLED" || saving === "cancel"}
          onPress={cancelBooking}
          style={[
            styles.dangerButton,
            (bookingStatus === "CANCELLED" || saving === "cancel") && styles.disabledButton,
          ]}
        >
          {saving === "cancel"
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.dangerButtonText}>Cancel booking</Text>
          }
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ─── Mapbox map section ───────────────────────────────────────────────────────
function BookingMapSection({
  pickupLat, pickupLng, dropoffLat, dropoffLng,
  pickupAddress, dropoffAddress, token,
}: {
  pickupLat: number | null; pickupLng: number | null;
  dropoffLat: number | null; dropoffLng: number | null;
  pickupAddress: string; dropoffAddress: string;
  token: string;
}) {
  const [route, setRoute] = useState<{ distanceMi: number; durationMin: number } | null>(null);

  const hasToken  = token.length > 0;
  const allCoords =
    pickupLat !== null && pickupLng !== null &&
    dropoffLat !== null && dropoffLng !== null;

  useEffect(() => {
    if (!hasToken || !allCoords) return;
    if (pickupLng === null || pickupLat === null ||
        dropoffLng === null || dropoffLat === null) return;

    let cancelled = false;
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/` +
      `${pickupLng.toFixed(6)},${pickupLat.toFixed(6)};` +
      `${dropoffLng.toFixed(6)},${dropoffLat.toFixed(6)}` +
      `?access_token=${token}&overview=false`;

    fetch(url)
      .then((r) => r.json())
      .then((data: unknown) => {
        if (cancelled || !isRecord(data)) return;
        const routes = data["routes"];
        if (!Array.isArray(routes) || !isRecord(routes[0])) return;
        const r    = routes[0];
        const dist = typeof r["distance"] === "number" ? r["distance"] : 0;
        const dur  = typeof r["duration"] === "number" ? r["duration"] : 0;
        setRoute({ distanceMi: dist / 1609.34, durationMin: dur / 60 });
      })
      .catch(() => { /* network error — map still shows */ });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasToken) return null;

  if (
    pickupLat === null || pickupLng === null ||
    dropoffLat === null || dropoffLng === null
  ) {
    return (
      <View style={styles.mapSection}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>📍 {pickupAddress}</Text>
          <Text style={styles.mapArrow}>↓</Text>
          <Text style={styles.mapPlaceholderText}>🏁 {dropoffAddress}</Text>
        </View>
      </View>
    );
  }

  const mapUrl =
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
    `pin-s-a+F97316(${pickupLng.toFixed(6)},${pickupLat.toFixed(6)}),` +
    `pin-s-b+0F172A(${dropoffLng.toFixed(6)},${dropoffLat.toFixed(6)})/` +
    `auto/680x260@2x?padding=60,40&access_token=${token}`;

  return (
    <View style={styles.mapSection}>
      <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />
      {route !== null && (
        <View style={styles.routeBar}>
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Distance</Text>
            <Text style={styles.routeValue}>{route.distanceMi.toFixed(1)} mi</Text>
          </View>
          <View style={styles.routeDivider} />
          <View style={styles.routeItem}>
            <Text style={styles.routeLabel}>Drive time</Text>
            <Text style={styles.routeValue}>{formatDuration(route.durationMin)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Customer contact buttons ─────────────────────────────────────────────────
function CustomerContactButtons({ phone }: { phone: string }) {
  const cleaned = phone.replace(/\s/g, "");
  const e164    = phoneToE164(phone);
  return (
    <View style={styles.contactRow}>
      <Pressable
        style={({ pressed }) => [styles.contactBtn, pressed && styles.pressed]}
        onPress={() => { void Linking.openURL(`tel:${cleaned}`); }}
      >
        <Text style={styles.contactBtnText}>📞  Call</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.contactBtn, styles.whatsappBtn, pressed && styles.pressed]}
        onPress={() => { void Linking.openURL(`https://wa.me/${e164}`); }}
      >
        <Text style={styles.contactBtnText}>💬  WhatsApp</Text>
      </Pressable>
    </View>
  );
}

// ─── More screen ──────────────────────────────────────────────────────────────
function MoreScreen({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [view, setView] = useState<MoreView>("main");

  if (view === "notifications") {
    return <NotificationsListScreen session={session} onBack={() => setView("main")} />;
  }
  if (view === "create-admin") {
    return <CreateAdminScreen onBack={() => setView("main")} />;
  }
  if (view === "invoice") {
    return <InvoiceScreen onBack={() => setView("main")} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* Profile */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {session.user.name?.[0]?.toUpperCase() ?? "A"}
          </Text>
        </View>
        <Text style={styles.profileName}>{session.user.name ?? "Admin"}</Text>
        <Text style={styles.profileRole}>Administrator</Text>
      </View>

      {/* Navigation */}
      <View style={styles.navCard}>
        <MoreNavLink icon="🔔" label="Notifications" onPress={() => setView("notifications")} />
        <MoreNavLink icon="👤" label="Create Admin"  onPress={() => setView("create-admin")} />
        <MoreNavLink icon="🧾" label="Invoices"      onPress={() => setView("invoice")} />
      </View>

      {/* Sign out */}
      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}
      >
        <Text style={styles.logoutText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

function MoreNavLink({
  icon, label, onPress,
}: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navLink, pressed && styles.pressed]}
    >
      <Text style={styles.navLinkIcon}>{icon}</Text>
      <Text style={styles.navLinkLabel}>{label}</Text>
      <Text style={styles.navLinkArrow}>›</Text>
    </Pressable>
  );
}

// ─── Notifications list ───────────────────────────────────────────────────────
function NotificationsListScreen({
  session, onBack,
}: { session: Session; onBack: () => void }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiRequest<unknown>("/admin/notifications", { token: session.token });
      setNotifications(pickNotifications(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [session.token]);

  useEffect(() => { void load(); }, [load]);

  async function markRead(id: string) {
    try {
      await apiRequest("/admin/notifications/read", {
        method: "POST", token: session.token, body: { ids: [id] },
      });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* silent */ }
  }

  async function deleteNotif(id: string) {
    try {
      await apiRequest(`/admin/notifications/${id}`, {
        method: "DELETE", token: session.token,
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch { /* silent */ }
  }

  async function markAllRead() {
    try {
      await apiRequest("/admin/notifications/read", {
        method: "POST", token: session.token, body: { all: true },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch { /* silent */ }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subHeader}>
        <Pressable onPress={onBack} style={styles.backButtonSm}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.subTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <Pressable onPress={markAllRead} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>All read</Text>
          </Pressable>
        ) : <View style={{ width: 72 }} />}
      </View>

      {loading ? (
        <CenteredMessage label="Loading…" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : notifications.length === 0 ? (
        <EmptyBlock title="All caught up" message="No notifications yet." />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={notifications}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.notifCard, !item.isRead && styles.notifCardUnread]}
              onPress={() => { if (!item.isRead) void markRead(item.id); }}
            >
              <View style={styles.notifCardRow}>
                <View
                  style={[
                    styles.notifDot,
                    { backgroundColor: item.isRead ? "#CBD5E1" : "#F97316" },
                  ]}
                />
                <View style={styles.notifCardContent}>
                  <Text
                    style={[
                      styles.notifCardTitle,
                      !item.isRead && styles.notifCardTitleUnread,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {(item.body ?? item.message) ? (
                    <Text style={styles.notifCardBody}>
                      {item.body ?? item.message}
                    </Text>
                  ) : null}
                  <Text style={styles.notifCardTime}>{formatDate(item.createdAt)}</Text>
                </View>
                <Pressable
                  onPress={() => void deleteNotif(item.id)}
                  hitSlop={10}
                  style={styles.notifDeleteBtn}
                >
                  <Text style={styles.notifDeleteText}>✕</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

// ─── Create Admin (missing API) ───────────────────────────────────────────────
function CreateAdminScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subHeader}>
        <Pressable onPress={onBack} style={styles.backButtonSm}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.subTitle}>Create Admin</Text>
        <View style={{ width: 72 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.missingApiCard}>
          <Text style={styles.missingApiTitle}>Backend route required</Text>
          <Text style={styles.missingApiBody}>
            Creating an admin user requires an API endpoint that does not yet exist:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>POST /admin/users</Text>
          </View>
          <Text style={styles.missingApiBody}>Expected request body:</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>{`{\n  "name":     "string",\n  "email":    "string",\n  "password": "string",\n  "role":     "ADMIN"\n}`}</Text>
          </View>
          <Text style={styles.missingApiNote}>
            The existing POST /auth/register only creates CUSTOMER-role users.
            A separate admin-creation route with role elevation and access
            controls is needed before this screen can be built.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Invoice screen (missing API) ─────────────────────────────────────────────
function InvoiceScreen({ onBack }: { onBack: () => void }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.subHeader}>
        <Pressable onPress={onBack} style={styles.backButtonSm}>
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <Text style={styles.subTitle}>Invoices</Text>
        <View style={{ width: 72 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.missingApiCard}>
          <Text style={styles.missingApiTitle}>Invoice endpoints missing</Text>
          <Text style={styles.missingApiBody}>
            Invoice management requires the following backend routes — none of
            which currently exist:
          </Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>GET   /admin/bookings/:id/invoice</Text>
            <Text style={styles.codeText}>POST  /admin/bookings/:id/invoice</Text>
            <Text style={styles.codeText}>PATCH /admin/invoices/:id</Text>
            <Text style={styles.codeText}>POST  /admin/invoices/:id/send</Text>
            <Text style={styles.codeText}>PATCH /admin/invoices/:id/mark-paid</Text>
            <Text style={styles.codeText}>PATCH /admin/invoices/:id/mark-unpaid</Text>
          </View>
          <Text style={styles.missingApiNote}>
            Once these endpoints are added to the API, the invoice UI will be
            built here. No fake actions have been implemented.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function FormField({
  label, value, onChangeText, placeholder, keyboardType, multiline,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  multiline?: boolean;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        autoCapitalize={keyboardType === "email-address" ? "none" : undefined}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor="#94A3B8"
        style={[styles.formInput, multiline && styles.formTextArea]}
        value={value}
      />
    </View>
  );
}

function CenteredMessage({ label }: { label: string }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color="#F97316" size="large" />
      <Text style={styles.centeredText}>{label}</Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.errorStateIcon}>⚠</Text>
      <Text style={styles.errorStateTitle}>Unable to load</Text>
      <Text style={styles.errorStateText}>{message}</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
      >
        <Text style={styles.secondaryButtonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

function EmptyBlock({ title, message }: { title: string; message: string }) {
  return (
    <View style={styles.emptyBlock}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // ── Login ──
  loginRoot: { flex: 1, backgroundColor: "#0B1220" },
  loginKeyboard: { flex: 1 },
  loginScroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: 22,
  },
  loginHero: {
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 26,
  },
  loginBrandRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoWrapper: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(249,115,22,0.55)",
    borderRadius: 24,
    borderWidth: 2,
    height: 86,
    justifyContent: "center",
    overflow: "hidden",
    width: 86,
  },
  logoImage: { height: 86, width: 86 },
  loginBadge: {
    backgroundColor: "rgba(249,115,22,0.14)",
    borderColor: "rgba(249,115,22,0.5)",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  loginBadgeText: {
    color: "#FDBA74",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  loginTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 45,
    marginTop: 28,
  },
  loginTitleAccent: {
    color: "#FDBA74",
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31,
    marginTop: 2,
  },
  loginSubtitle: {
    color: "#CBD5E1",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
    marginTop: 12,
    maxWidth: 390,
  },
  loginStatusStrip: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  loginStatusItem: { alignItems: "center", flex: 1 },
  loginStatusValue: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
  loginStatusLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
    textTransform: "uppercase",
  },
  loginStatusDivider: {
    backgroundColor: "rgba(255,255,255,0.12)",
    height: 34,
    width: 1,
  },
  loginPanel: {
    backgroundColor: "#F8FAFC",
    borderTopColor: "rgba(249,115,22,0.25)",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    gap: 16,
    padding: 24,
    paddingBottom: 26,
  },
  panelHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 2,
  },
  panelAccentBar: {
    backgroundColor: "#F97316",
    borderRadius: 999,
    height: 44,
    width: 5,
  },
  panelHeaderText: { flex: 1 },
  panelTitle: {
    color: "#0F172A",
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 30,
  },
  panelSubtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },
  loginFields: { gap: 12 },
  inputRow: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: "row",
    gap: 10,
    minHeight: 58,
    paddingHorizontal: 14,
  },
  inputRowFocused: {
    borderColor: "#F97316",
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  inputIcon: {
    color: "#F97316",
    fontSize: 18,
    fontWeight: "900",
    width: 22,
  },
  inputField: {
    color: "#0F172A",
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    minHeight: 56,
    paddingVertical: 0,
  },
  eyeButton: {
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 999,
    justifyContent: "center",
    minWidth: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  eyeIcon: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "900",
  },
  errorBubble: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: 14,
    borderWidth: 1,
    gap: 3,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorBubbleTitle: {
    color: "#991B1B",
    fontSize: 13,
    fontWeight: "900",
  },
  errorBubbleText: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  loginButton: {
    marginTop: 2,
    minHeight: 58,
  },
  loginSecurityCard: {
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderColor: "#BBF7D0",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  loginSecurityMark: {
    color: "#047857",
    fontSize: 15,
    fontWeight: "900",
  },
  loginSecurityText: {
    color: "#047857",
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 17,
  },
  input: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: 14,
    borderWidth: 1.5, color: "#0F172A", fontSize: 16, minHeight: 54,
    paddingHorizontal: 16,
  },
  inlineError:   { color: "#B91C1C", fontSize: 14, fontWeight: "700" },
  inlineSuccess: { color: "#047857", fontSize: 14, fontWeight: "800" },

  // ── Buttons ──
  primaryButton: {
    alignItems: "center", backgroundColor: "#F97316", borderRadius: 14,
    justifyContent: "center", minHeight: 54,
  },
  primaryButtonText:   { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  secondaryButton: {
    alignItems: "center", backgroundColor: "#0F172A", borderRadius: 12,
    justifyContent: "center", marginTop: 14, paddingHorizontal: 18, paddingVertical: 14,
  },
  secondaryButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  dangerButton: {
    alignItems: "center", backgroundColor: "#B91C1C", borderRadius: 12,
    justifyContent: "center", marginTop: 10, minHeight: 50,
  },
  dangerButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "900" },
  disabledButton:   { backgroundColor: "#CBD5E1" },
  smallButton: {
    backgroundColor: "#0F172A", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  smallButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
  pressed:         { opacity: 0.78 },

  // ── Shell ──
  shellRoot: { backgroundColor: "#F1F5F9", flex: 1 },

  // ── Top bar ──
  topBar: {
    alignItems: "center", backgroundColor: "#0F172A", flexDirection: "row",
    gap: 12, justifyContent: "space-between",
    paddingBottom: 18, paddingHorizontal: 16, paddingTop: 14,
  },
  topTextWrap: { flex: 1 },
  topEyebrow:  {
    color: "#F97316", fontSize: 11, fontWeight: "900",
    letterSpacing: 1.5, textTransform: "uppercase",
  },
  topTitle:    { color: "#FFFFFF", fontSize: 24, fontWeight: "900", marginTop: 2 },
  topActions:  { alignItems: "center", flexDirection: "row", gap: 8 },
  visitorBadge: {
    backgroundColor: "rgba(249,115,22,0.15)", borderColor: "rgba(249,115,22,0.4)",
    borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6,
  },
  visitorBadgeText: { color: "#FDBA74", fontSize: 12, fontWeight: "900" },
  reloadButton: { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 10 },
  reloadText:   { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },

  // ── Notification banner ──
  notifOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.72)",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  notifBanner: {
    backgroundColor: "#0F172A",
    borderColor: "#F97316",
    borderRadius: 24,
    borderWidth: 2,
    elevation: 14,
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    width: "100%",
  },
  notifBannerInner: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  notifBannerIconWrap: {
    alignItems: "center", backgroundColor: "#F97316", borderRadius: 999,
    height: 64, justifyContent: "center", width: 64,
  },
  notifBannerIcon:  { fontSize: 30 },
  notifBannerBody:  { alignItems: "center", width: "100%" },
  notifBannerTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", lineHeight: 27, textAlign: "center" },
  notifBannerText:  { color: "#CBD5E1", fontSize: 15, fontWeight: "700", lineHeight: 22, marginTop: 8, textAlign: "center" },
  notifStopButton: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 14,
    justifyContent: "center",
    marginTop: 4,
    minHeight: 48,
    paddingHorizontal: 22,
    width: "100%",
  },
  notifStopButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  // ── Tab bar ──
  tabBar: {
    backgroundColor: "#FFFFFF", borderBottomColor: "#E2E8F0", borderBottomWidth: 1,
    flexDirection: "row", paddingHorizontal: 4, paddingVertical: 6,
  },
  tab: {
    alignItems: "center", borderRadius: 12, flex: 1,
    justifyContent: "center", minHeight: 50, paddingVertical: 6,
  },
  activeTab:     { backgroundColor: "#FFF7ED" },
  tabIcon:       { color: "#94A3B8", fontSize: 15, fontWeight: "900" },
  activeTabIcon: { color: "#F97316" },
  tabText:       { color: "#94A3B8", fontSize: 10, fontWeight: "800", marginTop: 2 },
  activeTabText: { color: "#F97316" },

  // ── Content layouts ──
  content:         { gap: 16, padding: 16, paddingBottom: 36 },
  detailContent:   { gap: 12, padding: 16, paddingBottom: 52 },
  listContent:     { padding: 16, paddingBottom: 32 },
  emptyListContent:{ flexGrow: 1, padding: 16 },
  screenHeading:   { color: "#0F172A", fontSize: 24, fontWeight: "900", marginBottom: 4 },

  // ── Metric cards ──
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  metricCard: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: 16, borderWidth: 1,
    flexBasis: "47%", flexGrow: 1, minHeight: 112, padding: 16,
  },
  metricIcon:  { fontSize: 24, marginBottom: 8 },
  metricValue: { color: "#0F172A", fontSize: 26, fontWeight: "900" },
  metricLabel: {
    color: "#64748B", fontSize: 10, fontWeight: "800",
    marginTop: 4, textTransform: "uppercase",
  },

  // ── Cards (list) ──
  card: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: 14,
    borderWidth: 1, marginBottom: 12, padding: 16,
  },
  pressableCard: {
    elevation: 1, shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6,
  },
  cardTopLine:  { alignItems: "flex-start", flexDirection: "row", gap: 10 },
  cardTitleWrap:{ flex: 1 },
  cardTitle:    { color: "#0F172A", fontSize: 17, fontWeight: "900" },
  cardSubtitle: { color: "#64748B", fontSize: 14, fontWeight: "600", lineHeight: 20, marginTop: 3 },
  statusPill:   { borderRadius: 999, maxWidth: 128, paddingHorizontal: 10, paddingVertical: 5 },
  statusText:   { fontSize: 11, fontWeight: "900" },
  cardMetaLine: {
    alignItems: "center", borderTopColor: "#F1F5F9", borderTopWidth: 1,
    flexDirection: "row", justifyContent: "space-between", marginTop: 12, paddingTop: 10,
  },
  metaText:       { color: "#94A3B8", flex: 1, fontSize: 12, fontWeight: "700" },
  amountText:     { color: "#047857", fontSize: 15, fontWeight: "900" },
  cardActionHint: { color: "#F97316", fontSize: 11, fontWeight: "900", marginTop: 8 },

  // ── Profile / section cards ──
  profileCard: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: 14,
    borderWidth: 1, gap: 10, padding: 16,
  },
  sectionTitle:    { color: "#0F172A", fontSize: 20, fontWeight: "900" },
  sectionSubtitle: { color: "#64748B", fontSize: 13, fontWeight: "600", lineHeight: 18 },
  sectionHeaderRow:{
    alignItems: "flex-start", flexDirection: "row",
    gap: 12, justifyContent: "space-between",
  },

  // ── Detail header / rows ──
  detailHeader: {
    alignItems: "flex-start", flexDirection: "row",
    gap: 12, justifyContent: "space-between", marginBottom: 4,
  },
  detailReference: { color: "#0F172A", fontSize: 22, fontWeight: "900" },
  detailRows:      { gap: 6, marginTop: 4 },
  detailRow: {
    borderTopColor: "#F1F5F9", borderTopWidth: 1, flexDirection: "row", gap: 12, paddingTop: 8,
  },
  detailLabel: {
    color: "#64748B", fontSize: 11, fontWeight: "900",
    textTransform: "uppercase", width: 84,
  },
  detailValue: { color: "#0F172A", flex: 1, fontSize: 13, fontWeight: "600", lineHeight: 19 },

  // ── Form ──
  formBlock:  { gap: 12 },
  fieldLabel: {
    color: "#475569", fontSize: 11, fontWeight: "900",
    marginBottom: 6, textTransform: "uppercase",
  },
  formInput: {
    backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: 10,
    borderWidth: 1.5, color: "#0F172A", fontSize: 15, fontWeight: "700",
    minHeight: 48, paddingHorizontal: 14, paddingVertical: 10,
  },
  formTextArea: { minHeight: 88, textAlignVertical: "top" },

  // ── Option pills ──
  optionWrap:      { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  optionPill: {
    backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", borderRadius: 999,
    borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8,
  },
  activeOptionPill:{ backgroundColor: "#FFF7ED", borderColor: "#F97316" },
  optionText:      { color: "#475569", fontSize: 12, fontWeight: "900" },
  activeOptionText:{ color: "#F97316" },

  // ── Back buttons ──
  backButton: {
    alignSelf: "flex-start", backgroundColor: "#E2E8F0", borderRadius: 10,
    marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  backButtonSm: {
    alignItems: "center", backgroundColor: "#E2E8F0", borderRadius: 10,
    justifyContent: "center", minWidth: 44, paddingHorizontal: 14, paddingVertical: 10,
  },
  backButtonText: { color: "#0F172A", fontSize: 13, fontWeight: "900" },

  // ── Driver list ──
  driverList: { gap: 8, marginTop: 4 },
  driverOption: {
    backgroundColor: "#F8FAFC", borderColor: "#E2E8F0", borderRadius: 10, borderWidth: 1, padding: 12,
  },
  activeDriverOption: { backgroundColor: "#FFF7ED", borderColor: "#F97316" },
  driverOptionText:   { color: "#334155", fontSize: 13, fontWeight: "700" },

  // ── Mapbox map section ──
  mapSection: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0",
    borderRadius: 14, borderWidth: 1, overflow: "hidden",
  },
  mapImage:           { height: 220, width: "100%" },
  mapPlaceholder: {
    alignItems: "center", backgroundColor: "#F1F5F9",
    gap: 8, justifyContent: "center", minHeight: 110, padding: 20,
  },
  mapPlaceholderText: { color: "#334155", fontSize: 13, fontWeight: "700", textAlign: "center" },
  mapArrow:           { color: "#94A3B8", fontSize: 22 },
  routeBar: {
    backgroundColor: "#FFFFFF", borderTopColor: "#F1F5F9", borderTopWidth: 1,
    flexDirection: "row", paddingHorizontal: 20, paddingVertical: 14,
  },
  routeItem:    { alignItems: "center", flex: 1 },
  routeDivider: { backgroundColor: "#E2E8F0", width: 1 },
  routeLabel:   { color: "#64748B", fontSize: 11, fontWeight: "800", textTransform: "uppercase" },
  routeValue:   { color: "#0F172A", fontSize: 18, fontWeight: "900", marginTop: 3 },

  // ── Contact buttons ──
  contactRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  contactBtn: {
    alignItems: "center", backgroundColor: "#0F172A", borderRadius: 10,
    flex: 1, justifyContent: "center", paddingVertical: 13,
  },
  whatsappBtn:    { backgroundColor: "#075E54" },
  contactBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

  // ── More screen ──
  profileHeader: { alignItems: "center", gap: 6, paddingVertical: 8 },
  avatarCircle: {
    alignItems: "center", backgroundColor: "#F97316", borderRadius: 999,
    height: 72, justifyContent: "center", width: 72,
  },
  avatarText:  { color: "#FFFFFF", fontSize: 28, fontWeight: "900" },
  profileName: { color: "#0F172A", fontSize: 22, fontWeight: "900", marginTop: 4 },
  profileRole: { color: "#64748B", fontSize: 14, fontWeight: "600" },

  navCard: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0",
    borderRadius: 14, borderWidth: 1, overflow: "hidden",
  },
  navLink: {
    alignItems: "center", borderBottomColor: "#F1F5F9", borderBottomWidth: 1,
    flexDirection: "row", gap: 14, paddingHorizontal: 16, paddingVertical: 18,
  },
  navLinkIcon:  { fontSize: 20, width: 28 },
  navLinkLabel: { color: "#0F172A", flex: 1, fontSize: 16, fontWeight: "700" },
  navLinkArrow: { color: "#94A3B8", fontSize: 22, fontWeight: "700" },

  logoutButton: {
    alignItems: "center", backgroundColor: "#FEE2E2", borderRadius: 14,
    marginTop: 4, padding: 18,
  },
  logoutText: { color: "#B91C1C", fontSize: 15, fontWeight: "900" },

  // ── Sub-screen header ──
  subHeader: {
    alignItems: "center", backgroundColor: "#FFFFFF",
    borderBottomColor: "#E2E8F0", borderBottomWidth: 1,
    flexDirection: "row", gap: 8, justifyContent: "space-between",
    paddingBottom: 12, paddingHorizontal: 14, paddingTop: 12,
  },
  subTitle: { color: "#0F172A", flex: 1, fontSize: 17, fontWeight: "900", textAlign: "center" },

  // ── Notifications list ──
  notifCard: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0",
    borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: "hidden",
  },
  notifCardUnread:      { borderColor: "#FDBA74" },
  notifCardRow:         { alignItems: "center", flexDirection: "row", gap: 12, padding: 14 },
  notifDot:             { borderRadius: 999, height: 10, width: 10 },
  notifCardContent:     { flex: 1, gap: 3 },
  notifCardTitle:       { color: "#64748B", fontSize: 14, fontWeight: "600" },
  notifCardTitleUnread: { color: "#0F172A", fontWeight: "900" },
  notifCardBody:        { color: "#64748B", fontSize: 12, lineHeight: 17 },
  notifCardTime:        { color: "#94A3B8", fontSize: 11, fontWeight: "700", marginTop: 2 },
  notifDeleteBtn:       { padding: 8 },
  notifDeleteText:      { color: "#94A3B8", fontSize: 16, fontWeight: "700" },

  // ── Missing API screens ──
  missingApiCard: {
    backgroundColor: "#FFFFFF", borderColor: "#E2E8F0",
    borderRadius: 14, borderWidth: 1, gap: 12, padding: 20,
  },
  missingApiTitle: { color: "#0F172A", fontSize: 20, fontWeight: "900" },
  missingApiBody:  { color: "#475569", fontSize: 14, fontWeight: "600", lineHeight: 22 },
  missingApiNote:  { color: "#64748B", fontSize: 13, fontWeight: "600", lineHeight: 20 },
  codeBlock:       { backgroundColor: "#0F172A", borderRadius: 10, gap: 6, padding: 16 },
  codeText: {
    color: "#7DD3FC",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 13,
    lineHeight: 22,
  },

  // ── Centered / loading / error ──
  centered:        { alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  centeredText:    { color: "#64748B", fontSize: 14, fontWeight: "700" },
  errorStateIcon:  { color: "#EF4444", fontSize: 40 },
  errorStateTitle: { color: "#0F172A", fontSize: 20, fontWeight: "900" },
  errorStateText:  {
    color: "#64748B", fontSize: 14, fontWeight: "600",
    lineHeight: 20, textAlign: "center",
  },

  // ── Empty block ──
  emptyBlock: {
    alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2E8F0",
    borderRadius: 14, borderWidth: 1, flex: 1, justifyContent: "center",
    minHeight: 200, padding: 28,
  },
  emptyTitle:   { color: "#0F172A", fontSize: 18, fontWeight: "900", textAlign: "center" },
  emptyMessage: {
    color: "#64748B", fontSize: 14, fontWeight: "600",
    lineHeight: 20, marginTop: 6, textAlign: "center",
  },

  // ── Startup error ──
  errorRoot:  {
    alignItems: "center", backgroundColor: "#7F1D1D",
    flex: 1, justifyContent: "center", padding: 24,
  },
  errorTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  errorText:  {
    color: "#FECACA", fontSize: 14, fontWeight: "600",
    lineHeight: 20, marginTop: 8, textAlign: "center",
  },
});
