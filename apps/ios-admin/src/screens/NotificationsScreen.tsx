import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { ActionButton, HeaderMetric, ScreenHeader, ScreenShell } from "@/components/AppScaffold";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingView } from "@/components/LoadingView";
import { useNotifications } from "@/hooks/useNotifications";
import type { AdminNotification } from "@/models";
import { colors } from "@/theme/colors";
import { formatDateTime } from "@/utils/format";

export function NotificationsScreen() {
  const notifications = useNotifications();
  const [pendingDelete, setPendingDelete] = useState<AdminNotification | null>(null);

  if (notifications.isLoading && notifications.notifications.length === 0) return <LoadingView />;

  return (
    <ScreenShell>
      <ScreenHeader
        title="Notifications"
        subtitle="Operational alerts, booking events, and admin updates."
        eyebrow="Inbox"
        icon="notifications"
      >
        <View className="flex-row flex-wrap gap-2">
          <HeaderMetric label="Total" value={String(notifications.notifications.length)} icon="file-tray-full" />
          <HeaderMetric label="Unread" value={String(notifications.notifications.filter((item) => !item.isRead).length)} icon="mail-unread" />
        </View>
      </ScreenHeader>
      {notifications.error ? <ErrorBanner message={notifications.error} /> : null}
      {notifications.hasUnread ? (
        <View className="px-4 py-4">
          <ActionButton label="Mark All Read" icon="checkmark-done" onPress={() => void notifications.markAllRead()} />
        </View>
      ) : null}
      <FlatList
        data={notifications.notifications}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={notifications.isLoading} onRefresh={() => void notifications.load()} />}
        contentContainerClassName={notifications.notifications.length === 0 ? "flex-1" : "p-4"}
        ListEmptyComponent={<EmptyState icon="notifications-outline" title="No notifications" message="Admin notifications will appear here." />}
        renderItem={({ item }) => (
          <NotificationRow
            notification={item}
            onRead={() => item.isRead ? undefined : notifications.markRead(item.id)}
            onDelete={() => setPendingDelete(item)}
          />
        )}
      />
      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete Notification"
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const item = pendingDelete;
          setPendingDelete(null);
          if (item) void notifications.deleteNotification(item.id);
        }}
      />
    </ScreenShell>
  );
}

function NotificationRow({
  notification,
  onRead,
  onDelete
}: {
  notification: AdminNotification;
  onRead: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable onPress={onRead} className="mb-3 rounded-lg border border-svLine bg-white p-4 shadow-sm">
      <View className="flex-row gap-3">
        <View className={notification.isRead ? "h-11 w-11 items-center justify-center rounded-lg bg-slate-100" : "h-11 w-11 items-center justify-center rounded-lg bg-svBrandSubtle"}>
          <Ionicons name={notification.isRead ? "mail-open-outline" : "mail-unread"} size={21} color={notification.isRead ? colors.muted : colors.svBrand} />
        </View>
        <View className="flex-1">
          <Text className={notification.isRead ? "text-base font-bold text-svDark" : "text-base font-extrabold text-svDark"} numberOfLines={2}>
            {notification.title}
          </Text>
          <Text className="mt-1 text-sm leading-5 text-slate-500">{notification.body}</Text>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-xs font-bold text-slate-500">{formatDateTime(notification.createdAt)}</Text>
            <Pressable onPress={onDelete} className="h-9 w-9 items-center justify-center rounded-lg bg-red-50">
              <Ionicons name="trash-outline" size={17} color={colors.svRed} />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
