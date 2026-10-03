import { useCallback, useEffect, useRef, useState } from "react";
import { APIError, apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import { parseBookingDetailResponse, type BookingDetail, type BookingListItem, type BookingStatus, type DriverListItem } from "@/models";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [driverError, setDriverError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const bookingRef = useRef<BookingDetail | null>(null);
  const requestSeq = useRef(0);
  const bookingController = useRef<AbortController | null>(null);
  const driverController = useRef<AbortController | null>(null);

  const setCurrentBooking = useCallback((next: BookingDetail | null) => {
    bookingRef.current = next;
    setBooking(next);
  }, []);

  const messageFromError = useCallback((err: unknown, fallback: string) => (
    err instanceof Error ? err.message : fallback
  ), []);

  const load = useCallback(async () => {
    bookingController.current?.abort();
    const controller = new AbortController();
    bookingController.current = controller;
    const seq = requestSeq.current + 1;
    requestSeq.current = seq;
    const hasSameBooking = bookingRef.current?.id === id;
    setIsLoading(!hasSameBooking);
    setIsRefreshing(hasSameBooking);
    setError(null);
    setNotFound(false);
    try {
      const response = await apiClient.get<unknown>(endpoints.booking(id), { signal: controller.signal });
      const parsed = parseBookingDetailResponse(response);
      if (controller.signal.aborted || requestSeq.current !== seq) return;
      setCurrentBooking(parsed);
      setIsStale(false);
    } catch (err) {
      if (controller.signal.aborted || requestSeq.current !== seq) return;
      const status = err instanceof APIError ? err.status : undefined;
      if (status === 401 || status === 403) {
        setCurrentBooking(null);
        setIsStale(false);
      } else if (status === 404) {
        setCurrentBooking(null);
        setIsStale(false);
        setNotFound(true);
      } else if (bookingRef.current?.id === id) {
        setIsStale(true);
      } else {
        setCurrentBooking(null);
        setIsStale(false);
      }
      setError(messageFromError(err, "Could not load booking."));
    } finally {
      if (!controller.signal.aborted && requestSeq.current === seq) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [id, messageFromError, setCurrentBooking]);

  const loadDrivers = useCallback(async () => {
    driverController.current?.abort();
    const controller = new AbortController();
    driverController.current = controller;
    setDriverError(null);
    try {
      setDrivers(await apiClient.getList<DriverListItem>(endpoints.drivers, ["drivers"], { signal: controller.signal }));
    } catch (err) {
      if (!controller.signal.aborted) {
        setDriverError(messageFromError(err, "Could not load drivers."));
      }
    }
  }, [messageFromError]);

  const updateStatus = useCallback(async (nextStatus: BookingStatus, note?: string) => {
    try {
      await apiClient.patch<unknown>(endpoints.bookingStatus(id), { status: nextStatus, note: note || undefined });
      await load();
      return true;
    } catch (err) {
      setError(messageFromError(err, "Could not update booking status."));
      return false;
    }
  }, [id, load, messageFromError]);

  const assignDriver = useCallback(async (driverId: string) => {
    try {
      await apiClient.post<unknown>(endpoints.bookingAssign(id), { driverId });
      await load();
      return true;
    } catch (err) {
      setError(messageFromError(err, "Could not assign driver."));
      return false;
    }
  }, [id, load, messageFromError]);

  const cancelBooking = useCallback(async (reason?: string) => {
    try {
      await apiClient.post<unknown>(endpoints.bookingCancel(id), { reason: reason || undefined });
      await load();
      return true;
    } catch (err) {
      setError(messageFromError(err, "Could not cancel booking."));
      return false;
    }
  }, [id, load, messageFromError]);

  const addTrackingNote = useCallback(async (note: string) => {
    try {
      await apiClient.post<unknown>(endpoints.bookingTracking(id), { type: "note", message: note, isInternal: true });
      await load();
      return true;
    } catch (err) {
      setError(messageFromError(err, "Could not add note."));
      return false;
    }
  }, [id, load, messageFromError]);

  useEffect(() => {
    setCurrentBooking(null);
    setIsStale(false);
    setError(null);
    setDriverError(null);
    setNotFound(false);
    void load();
    void loadDrivers();
    return () => {
      bookingController.current?.abort();
      driverController.current?.abort();
    };
  }, [id, load, loadDrivers, setCurrentBooking]);

  return {
    booking,
    drivers,
    isLoading,
    isRefreshing,
    error,
    driverError,
    isStale,
    notFound,
    load,
    updateStatus,
    assignDriver,
    cancelBooking,
    addTrackingNote,
  };
}
