import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/api/apiClient";
import { endpoints } from "@/api/endpoints";
import type { DriverEarnings, DriverListItem, VanSize } from "@/models";
import { useAsyncResource } from "./useAsyncResource";

export function useDrivers() {
  const loader = useCallback(async () => apiClient.getList<DriverListItem>(endpoints.drivers, ["drivers"]), []);
  const resource = useAsyncResource<DriverListItem[]>([], loader);

  useEffect(() => {
    void resource.load();
  }, [resource.load]);

  const toggleActive = useCallback(async (driver: DriverListItem) => {
    await apiClient.patch<unknown>(endpoints.driverStatus(driver.id), { isActive: !driver.isActive });
    await resource.load();
  }, [resource]);

  const createDriver = useCallback(async (input: { name: string; email: string; phone?: string; vanSize: VanSize }) => {
    await apiClient.post<unknown>(endpoints.drivers, input);
    await resource.load();
  }, [resource]);

  return { ...resource, drivers: resource.data, toggleActive, createDriver };
}

export function useDriverDetail(driverId: string) {
  const [earnings, setEarnings] = useState<DriverEarnings | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setEarnings(await apiClient.get<DriverEarnings>(endpoints.driverEarnings(driverId)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load driver earnings.");
    } finally {
      setIsLoading(false);
    }
  }, [driverId]);

  const markPaid = useCallback(async () => {
    await apiClient.post<unknown>(endpoints.driverMarkPaid(driverId));
    await load();
  }, [driverId, load]);

  const resetPassword = useCallback(async () => {
    const response = await apiClient.post<{ tempPassword: string }>(endpoints.driverResetPassword(driverId));
    setTempPassword(response.tempPassword);
  }, [driverId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { earnings, tempPassword, setTempPassword, isLoading, error, load, markPaid, resetPassword };
}
