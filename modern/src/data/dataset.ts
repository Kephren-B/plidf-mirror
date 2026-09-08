import { useCallback, useEffect, useState } from "react";
import type { PlidfDataset } from "../types";
import { defaultSource, type DatasetSource } from "./sources";

export interface DatasetState {
  data: PlidfDataset | null;
  loading: boolean;
  error: string | null;
}

/**
 * Charge le dataset depuis la source configurée et expose l'état
 * (data / loading / error) ainsi qu'un `reload`.
 */
export function useDataset(source: DatasetSource = defaultSource): DatasetState & {
  reload: () => Promise<void>;
} {
  const [data, setData] = useState<PlidfDataset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const ds = await source.load();
      setData(ds);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load };
}
