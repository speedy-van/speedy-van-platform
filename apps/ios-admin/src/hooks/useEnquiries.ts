import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type {
  EnquiryDetail,
  EnquiryListItem,
  EnquiryStatus,
  StorageEnquiryDetail,
  StorageEnquiryListItem,
  StorageEnquiryStatus
} from "@/models";

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryListItem[]>([]);
  const [selected, setSelected] = useState<EnquiryDetail | null>(null);
  const [status, setStatus] = useState<EnquiryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPaginated<EnquiryListItem>(endpoints.enquiries({ status, page: 1, limit: 30 }));
      setEnquiries(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load enquiries.");
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const openDetail = useCallback(async (id: string) => {
    setSelected(await apiClient.get<EnquiryDetail>(endpoints.enquiry(id)));
  }, []);

  const updateStatus = useCallback(async (id: string, nextStatus: EnquiryStatus, quotedPrice?: number, adminNotes?: string) => {
    await apiClient.patch<unknown>(endpoints.enquiry(id), {
      status: nextStatus,
      quotedPrice,
      adminNotes: adminNotes || undefined
    });
    await load();
  }, [load]);

  const sendQuote = useCallback(async (id: string) => {
    await apiClient.post<unknown>(endpoints.sendQuote(id));
    await load();
  }, [load]);

  useEffect(() => {
    void load();
  }, [load]);

  return { enquiries, selected, setSelected, status, setStatus, isLoading, error, load, openDetail, updateStatus, sendQuote };
}

export function useStorageEnquiries() {
  const [enquiries, setEnquiries] = useState<StorageEnquiryListItem[]>([]);
  const [selected, setSelected] = useState<StorageEnquiryDetail | null>(null);
  const [status, setStatus] = useState<StorageEnquiryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPaginated<StorageEnquiryListItem>(
        endpoints.storageEnquiries({ status, page: 1, limit: 30 })
      );
      setEnquiries(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load storage enquiries.");
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const openDetail = useCallback(async (id: string) => {
    setSelected(await apiClient.get<StorageEnquiryDetail>(endpoints.storageEnquiry(id)));
  }, []);

  const updateStatus = useCallback(async (
    id: string,
    nextStatus: StorageEnquiryStatus,
    quote: {
      quotedTransportPrice?: number | null;
      quotedStoragePrice?: number | null;
      quotePeriod?: string | null;
      quoteNotes?: string | null;
      adminNotes?: string | null;
    }
  ) => {
    await apiClient.patch<unknown>(endpoints.storageEnquiry(id), {
      status: nextStatus,
      ...quote
    });
    await load();
  }, [load]);

  const sendQuote = useCallback(async (
    id: string,
    quote: {
      quotedTransportPrice?: number | null;
      quotedStoragePrice?: number | null;
      quotePeriod?: string | null;
      quoteNotes?: string | null;
    }
  ) => {
    await apiClient.post<unknown>(endpoints.sendStorageQuote(id), quote);
    await load();
  }, [load]);

  useEffect(() => {
    void load();
  }, [load]);

  return { enquiries, selected, setSelected, status, setStatus, isLoading, error, load, openDetail, updateStatus, sendQuote };
}
