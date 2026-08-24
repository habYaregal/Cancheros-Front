import { createContext, useContext, useState } from "react";
import { triggerLiveSync } from "../api/client";

const RefreshContext = createContext({
  refreshKey: 0,
  syncing: false,
  refresh: async () => {},
});

export function RefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncing, setSyncing] = useState(false);

  async function refresh() {
    if (syncing) return;

    setSyncing(true);
    try {
      await triggerLiveSync();
      setRefreshKey((key) => key + 1);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <RefreshContext.Provider value={{ refreshKey, syncing, refresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  return useContext(RefreshContext);
}
