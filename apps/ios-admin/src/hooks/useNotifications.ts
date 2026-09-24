import { useCallback, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { AdminNotification } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

export function useNotifications() {
  const loader = useCallback(async () => apiClient.getList<AdminNotification>(endpoints.notifications, ["items"]), []);
  const resource = useAsyncResource<AdminNotification[]>([], loader);

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  const markRead = useCallback(async (id: string) => {
    await apiClient.patch<unknown>(endpoints.notification(id), { isRead: true });
    await resource.load();
  }, [resource]);

  const markAllRead = useCallback(async () => {
    await apiClient.post<unknown>(endpoints.markNotificationsRead, { all: true });
    await resource.load();
  }, [resource]);

  const deleteNotification = useCallback(async (id: string) => {
    await apiClient.delete(endpoints.notification(id));
    resource.setData((current) => current.filter((item) => item.id !== id));
  }, [resource]);

  return {
    ...resource,
    notifications: resource.data,
    hasUnread: resource.data.some((item) => item.isRead === false),
    markRead,
    markAllRead,
    deleteNotification
  };
}
