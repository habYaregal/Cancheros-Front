import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getTelegramWebApp,
  initTelegram,
  isTelegramMiniApp,
} from "../lib/telegram";

const TelegramContext = createContext({
  webApp: null,
  isTelegram: false,
  user: null,
});

function parentPath(pathname) {
  if (pathname === "/") return null;
  if (pathname === "/register") return "/profile";
  if (pathname === "/profile") return "/";
  if (pathname === "/weekly/past") return "/weekly";
  if (pathname.startsWith("/weekly/gw/")) return "/weekly/past";
  if (pathname === "/monthly/past") return "/monthly";
  if (pathname.startsWith("/monthly/") && pathname !== "/monthly") {
    return "/monthly/past";
  }
  if (pathname === "/h2h/past") return "/h2h";
  if (pathname.startsWith("/h2h/gw/")) return "/h2h/past";
  return "/";
}

export function TelegramProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [webApp, setWebApp] = useState(() => getTelegramWebApp());

  useEffect(() => {
    setWebApp(initTelegram() ?? getTelegramWebApp());
  }, []);

  useEffect(() => {
    const back = webApp?.BackButton;
    if (!back) return;

    const parent = parentPath(location.pathname);
    const onBack = () => navigate(parent || "/");

    back.onClick(onBack);
    if (parent) back.show();
    else back.hide();

    return () => {
      back.offClick?.(onBack);
      back.hide();
    };
  }, [webApp, location.pathname, navigate]);

  const value = useMemo(
    () => ({
      webApp,
      isTelegram: isTelegramMiniApp(),
      user: webApp?.initDataUnsafe?.user ?? null,
    }),
    [webApp]
  );

  return (
    <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
