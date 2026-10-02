import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";

export type NotificationSettings = {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

const defaultSettings: NotificationSettings = {
  soundEnabled: true,
  hapticsEnabled: true
};

function settingsKey(userId: string | undefined): string {
  return `sv_admin_notification_settings_${userId ?? "anonymous"}`;
}

export async function loadNotificationSettings(userId: string | undefined): Promise<NotificationSettings> {
  try {
    const raw = await AsyncStorage.getItem(settingsKey(userId));
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
    return {
      soundEnabled: parsed.soundEnabled !== false,
      hapticsEnabled: parsed.hapticsEnabled !== false
    };
  } catch (error) {
    console.warn("[notifications] settings restore failed", error);
    return defaultSettings;
  }
}

export async function saveNotificationSettings(userId: string | undefined, settings: NotificationSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(settingsKey(userId), JSON.stringify(settings));
  } catch (error) {
    console.warn("[notifications] settings save failed", error);
  }
}

export function useNotificationSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    void loadNotificationSettings(user?.id).then((next) => {
      if (cancelled) return;
      setSettings(next);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const update = useCallback((patch: Partial<NotificationSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      void saveNotificationSettings(user?.id, next);
      return next;
    });
  }, [user?.id]);

  return { settings, isLoading, update };
}
