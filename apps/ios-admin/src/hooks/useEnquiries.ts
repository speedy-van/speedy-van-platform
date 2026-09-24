import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { EnquiryDetail, EnquiryListItem, EnquiryStatus } from "@/models";

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
