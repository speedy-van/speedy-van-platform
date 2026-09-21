import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { BookingDetail, BookingListItem, BookingStatus, DriverListItem } from "@/models";

type BookingsState = {
  bookings: BookingListItem[];
  search: string;
  setSearch: (value: string) => void;
  status: BookingStatus | null;
  setStatus: (value: BookingStatus | null) => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  load: (reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
};

export function useBookings(): BookingsState {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (reset = true) => {
    const nextPage = reset ? 1 : page;
    setIsLoading(reset);
    setIsLoadingMore(!reset);
    setError(null);

    try {
      const response = await apiClient.getPaginated<BookingListItem>(
        endpoints.bookings({ q: search, status, page: nextPage, limit: 20 })
      );
      setBookings((current) => (reset ? response.data : [...current, ...response.data]));
      setPage(nextPage);
      setHasMore(nextPage * response.pagination.limit < response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load bookings.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [page, search, status]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(true);
    setError(null);

    try {
      const response = await apiClient.getPaginated<BookingListItem>(
        endpoints.bookings({ q: search, status, page: nextPage, limit: 20 })
      );
      setBookings((current) => [...current, ...response.data]);
      setHasMore(nextPage * response.pagination.limit < response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more bookings.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, page, search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void load(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [load]);

  return { bookings, search, setSearch, status, setStatus, isLoading, isLoadingMore, hasMore, error, load, loadMore };
}

export function useBookingDetail(id: string) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [drivers, setDrivers] = useState<DriverListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBooking(await apiClient.get<BookingDetail>(endpoints.booking(id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load booking.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadDrivers = useCallback(async () => {
    setDrivers(await apiClient.getList<DriverListItem>(endpoints.drivers, ["drivers"]));
  }, []);

  const updateStatus = useCallback(async (nextStatus: BookingStatus, note?: string) => {
    await apiClient.patch<unknown>(endpoints.bookingStatus(id), { status: nextStatus, note: note || undefined });
    await load();
  }, [id, load]);

  const assignDriver = useCallback(async (driverId: string) => {
    await apiClient.post<unknown>(endpoints.bookingAssign(id), { driverId });
    await load();
  }, [id, load]);

  const cancelBooking = useCallback(async (reason?: string) => {
    await apiClient.post<unknown>(endpoints.bookingCancel(id), { reason: reason || undefined });
    await load();
  }, [id, load]);

  const addTrackingNote = useCallback(async (note: string) => {
    await apiClient.post<unknown>(endpoints.bookingTracking(id), { type: "note", message: note, note, isInternal: true });
    await load();
  }, [id, load]);

  useEffect(() => {
    void load();
    void loadDrivers();
  }, [load, loadDrivers]);

  return { booking, drivers, isLoading, error, load, updateStatus, assignDriver, cancelBooking, addTrackingNote };
}
