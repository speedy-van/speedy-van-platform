import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

export type AsyncResource<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
  load: () => Promise<void>;
  setData: Dispatch<SetStateAction<T>>;
  setError: Dispatch<SetStateAction<string | null>>;
};

export function useAsyncResource<T>(initialData: T, loader: () => Promise<T>): AsyncResource<T> {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await loader());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [loader]);

  return { data, isLoading, error, load, setData, setError };
}
