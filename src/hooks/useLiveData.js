import { useCallback, useEffect, useRef, useState } from "react";
import { useRefresh } from "../contexts/RefreshContext";

/**
 * Fetch + poll while a gameweek is live.
 * Also reloads when the header Refresh button syncs.
 */
export function useLiveData(loader, deps = [], intervalMs = 30000) {
  const { refreshKey } = useRefresh();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const alive = useRef(true);

  const reload = useCallback(async () => {
    try {
      const next = await loader();
      if (!alive.current) return;
      setData(next);
      setError(null);
      setUpdatedAt(new Date());
    } catch (err) {
      if (!alive.current) return;
      setError(err.message || "Failed to load");
    } finally {
      if (alive.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    alive.current = true;
    setLoading(true);
    void reload();

    const id = setInterval(() => {
      void reload();
    }, intervalMs);

    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [reload, intervalMs, refreshKey]);

  return { data, error, loading, updatedAt, reload };
}
