import { useCallback, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { BookingListItem } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

export function usePendingBookings() {
  const loader = useCallback(async () => {
    const response = await apiClient.getPaginated<BookingListItem>(endpoints.pendingBookings());
    return response.pagination.total;
  }, []);

  const resource = useAsyncResource(0, loader);

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  return resource;
}
