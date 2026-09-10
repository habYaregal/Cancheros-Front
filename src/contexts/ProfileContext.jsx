import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, registerWithFpl } from "../api/client";
import { useTelegram } from "./TelegramContext";

const ProfileContext = createContext({
  me: null,
  loading: false,
  memberId: null,
  linked: false,
  refreshMe: async () => {},
  register: async () => {},
});

export function ProfileProvider({ children }) {
  const { isTelegram } = useTelegram();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshMe = useCallback(async () => {
    if (!isTelegram) {
      setMe(null);
      return null;
    }

    setLoading(true);
    try {
      const profile = await getMe();
      setMe(profile);
      return profile;
    } catch {
      setMe(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isTelegram]);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  const register = useCallback(async (fplId) => {
    const profile = await registerWithFpl(fplId);
    setMe(profile);
    return profile;
  }, []);

  const value = useMemo(
    () => ({
      me,
      loading,
      memberId: me?.member?.memberId ?? null,
      linked: Boolean(me?.linked),
      refreshMe,
      register,
    }),
    [me, loading, refreshMe, register]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
