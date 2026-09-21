import { useCallback, useEffect } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { JobListItem } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

export function useJobs() {
  const loader = useCallback(async () => apiClient.getList<JobListItem>(endpoints.jobs("AVAILABLE"), ["jobs"]), []);
  const resource = useAsyncResource<JobListItem[]>([], loader);

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  const toggleVisibility = useCallback(async (job: JobListItem) => {
    await apiClient.patch<unknown>(endpoints.job(job.id), { isPublic: !job.isPublic });
    await resource.load();
  }, [resource]);

  const pauseAll = useCallback(async () => {
    await apiClient.post<unknown>(endpoints.pauseAllJobs);
    await resource.load();
  }, [resource]);

  const resumeAll = useCallback(async () => {
    await apiClient.post<unknown>(endpoints.resumeAllJobs);
    await resource.load();
  }, [resource]);

  const setDriverPay = useCallback(async (jobId: string, amount: number, note?: string) => {
    await apiClient.patch<unknown>(endpoints.jobDriverPay(jobId), {
      amount,
      note: note || undefined,
      driverPay: amount,
      driverPayNotes: note || undefined
    });
    await resource.load();
  }, [resource]);

  return { ...resource, jobs: resource.data, toggleVisibility, pauseAll, resumeAll, setDriverPay };
}
