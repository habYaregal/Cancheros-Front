import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getColorScheme,
  getTelegramWebApp,
  getThemeParams,
  initTelegram,
  isTelegramMiniApp,
  safeAreaInsets,
  useSettingsButton,
} from "../lib/telegram";

const TelegramContext = createContext({
  webApp: null,
  isTelegram: false,
  user: null,
  colorScheme: "dark",
  themeParams: {},
  safeArea: { top: 0, right: 0, bottom: 0, left: 0 },
  openProfile: () => {},
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
  const [colorScheme, setColorScheme] = useState(() => getColorScheme());
  const [themeParams, setThemeParams] = useState(() => getThemeParams());
  const [safeArea, setSafeArea] = useState(() => safeAreaInsets());

  useEffect(() => {
    const tg = initTelegram() ?? getTelegramWebApp();
    setWebApp(tg);
    if (tg) {
      setColorScheme(getColorScheme());
      setThemeParams(getThemeParams());
      setSafeArea(safeAreaInsets());
      if (tg.onEvent) {
        try {
          tg.onEvent("themeChanged", () => {
            setColorScheme(getColorScheme());
            setThemeParams(getThemeParams());
          });
          tg.onEvent("viewportChanged", () => {
            setSafeArea(safeAreaInsets());
          });
        } catch {
        }
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === "light") root.classList.add("tma-light");
    else root.classList.remove("tma-light");

    const sa = safeArea;
    root.style.setProperty("--tma-safe-top", `${sa.top}px`);
    root.style.setProperty("--tma-safe-right", `${sa.right}px`);
    root.style.setProperty("--tma-safe-bottom", `${sa.bottom}px`);
    root.style.setProperty("--tma-safe-left", `${sa.left}px`);
  }, [colorScheme, safeArea]);

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

  const openProfile = useCallback(() => {
    navigate("/profile");
  }, [navigate]);

  useEffect(() => {
    const { show } = useSettingsButton(openProfile);
    const inApp = isTelegramMiniApp();
    if (inApp) show();
  }, [openProfile]);

  const value = useMemo(
    () => ({
      webApp,
      isTelegram: isTelegramMiniApp(),
      user: webApp?.initDataUnsafe?.user ?? null,
      colorScheme,
      themeParams,
      safeArea,
      openProfile,
    }),
    [webApp, colorScheme, themeParams, safeArea, openProfile]
  );

  return (
    <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
