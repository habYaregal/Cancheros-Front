const PITCH = "#071a12";
const PITCH_BG = "#05140e";

export function getTelegramWebApp() {
  return typeof window !== "undefined" ? window.Telegram?.WebApp ?? null : null;
}

export function isTelegramMiniApp() {
  const tg = getTelegramWebApp();
  return Boolean(tg?.initData || tg?.initDataUnsafe?.user);
}

export function initTelegram() {
  const tg = getTelegramWebApp();
  if (!tg) return null;

  try {
    tg.ready();
    tg.expand();
    tg.setHeaderColor?.(PITCH);
    tg.setBackgroundColor?.(PITCH_BG);
    tg.disableVerticalSwipes?.();
  } catch {
    // WebApp methods are unavailable outside Telegram
  }

  return tg;
}

export function haptic(kind = "selection") {
  const haptic = getTelegramWebApp()?.HapticFeedback;
  if (!haptic) return;

  try {
    if (kind === "impact") haptic.impactOccurred("light");
    else haptic.selectionChanged();
  } catch {
    // ignore
  }
}
