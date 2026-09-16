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
    tg.enableClosingConfirmation?.();
  } catch {
  }

  return tg;
}

export function haptic(kind = "selection") {
  const haptic = getTelegramWebApp()?.HapticFeedback;
  if (!haptic) return;

  try {
    if (kind === "impact") haptic.impactOccurred("light");
    else if (kind === "heavy") haptic.impactOccurred("heavy");
    else if (kind === "medium") haptic.impactOccurred("medium");
    else if (kind === "rigid") haptic.notificationOccurred("error");
    else if (kind === "success") haptic.notificationOccurred("success");
    else if (kind === "warning") haptic.notificationOccurred("warning");
    else haptic.selectionChanged();
  } catch {
  }
}

export async function showAlert(message) {
  const tg = getTelegramWebApp();
  if (!tg?.showAlert) {
    window.alert?.(message);
    return;
  }
  return new Promise((resolve) => {
    try {
      tg.showAlert(message, () => resolve());
    } catch {
      resolve();
    }
  });
}

export async function showConfirm(message) {
  const tg = getTelegramWebApp();
  if (!tg?.showConfirm) {
    return window.confirm?.(message) ?? true;
  }
  return new Promise((resolve) => {
    try {
      tg.showConfirm(message, (ok) => resolve(Boolean(ok)));
    } catch {
      resolve(true);
    }
  });
}

export async function showPopup({ title = "", message = "", buttons = [{ type: "ok", text: "OK" }] } = {}) {
  const tg = getTelegramWebApp();
  if (!tg?.showPopup) {
    window.alert?.(message || title);
    return null;
  }
  return new Promise((resolve) => {
    try {
      tg.showPopup({ title, message, buttons }, (id) => resolve(id ?? null));
    } catch {
      resolve(null);
    }
  });
}

export async function readClipboard() {
  const tg = getTelegramWebApp();
  if (tg?.readTextFromClipboard) {
    return new Promise((resolve) => {
      try {
        tg.readTextFromClipboard((text) => resolve(text ?? ""));
      } catch {
        resolve("");
      }
    });
  }
  if (navigator?.clipboard?.readText) {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  }
  return "";
}

export function openLink(url, { tryInstantView = false } = {}) {
  const tg = getTelegramWebApp();
  if (tg?.openLink) {
    try {
      tg.openLink(url, { try_instant_view: tryInstantView });
      return;
    } catch {
    }
  }
  window.open?.(url, "_blank", "noopener,noreferrer");
}

export function openTelegramLink(url) {
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    try {
      tg.openTelegramLink(url);
      return;
    } catch {
    }
  }
  window.location.assign(url);
}

export function shareToStory(mediaUrl, { text = "", widgetLink } = {}) {
  const tg = getTelegramWebApp();
  if (!tg?.shareToStory) return false;
  try {
    tg.shareToStory(mediaUrl, {
      text,
      widget_link: widgetLink,
    });
    return true;
  } catch {
    return false;
  }
}

export function getThemeParams() {
  const tg = getTelegramWebApp();
  if (!tg?.themeParams) return {};
  try {
    return typeof tg.themeParams === "string"
      ? Object.fromEntries(new URLSearchParams(tg.themeParams))
      : { ...tg.themeParams };
  } catch {
    return {};
  }
}

export function getColorScheme() {
  const tg = getTelegramWebApp();
  return tg?.colorScheme || "dark";
}

export function getViewportHeight() {
  const tg = getTelegramWebApp();
  return tg?.viewportHeight || window.innerHeight;
}

export function isExpanded() {
  const tg = getTelegramWebApp();
  return Boolean(tg?.isExpanded);
}

export async function expand() {
  const tg = getTelegramWebApp();
  if (!tg) return false;
  try {
    await tg.expand?.();
    return true;
  } catch {
    return false;
  }
}

export function useMainButton() {
  const tg = getTelegramWebApp();
  const mainButton = tg?.MainButton;
  return {
    show: (label = "Continue", onClick, { color = "#bfff00", textColor = "#071a12", progress = false, disabled = false } = {}) => {
      if (!mainButton) return;
      try {
        mainButton.setText(label);
        mainButton.setParams?.({ color, text_color: textColor, has_shine_effect: false });
        mainButton.showProgress?.();
        if (!progress) mainButton.hideProgress?.();
        if (disabled) mainButton.disable?.(); else mainButton.enable?.();
        mainButton.show?.();
        if (onClick) {
          mainButton.offClick?.(onClick);
          mainButton.onClick(onClick);
        }
      } catch {
      }
    },
    hide: () => {
      if (!mainButton) return;
      try {
        mainButton.hide?.();
        mainButton.hideProgress?.();
      } catch {
      }
    },
    setProgress: (show) => {
      if (!mainButton) return;
      try {
        if (show) mainButton.showProgress?.();
        else mainButton.hideProgress?.();
      } catch {
      }
    },
    setEnabled: (enabled) => {
      if (!mainButton) return;
      try {
        if (enabled) mainButton.enable?.();
        else mainButton.disable?.();
      } catch {
      }
    },
    setText: (label) => {
      if (!mainButton) return;
      try {
        mainButton.setText(label);
      } catch {
      }
    },
  };
}

export function useSettingsButton(onClick) {
  const tg = getTelegramWebApp();
  const settingsButton = tg?.SettingsButton;
  if (!settingsButton) return { show: () => {}, hide: () => {} };

  if (onClick) {
    try {
      settingsButton.offClick?.(onClick);
      settingsButton.onClick(onClick);
    } catch {
    }
  }

  return {
    show: () => { try { settingsButton.show?.(); } catch {} },
    hide: () => { try { settingsButton.hide?.(); } catch {} },
  };
}

export function enableClosingConfirmation(enable = true) {
  const tg = getTelegramWebApp();
  if (!tg) return;
  try {
    if (enable) tg.enableClosingConfirmation?.();
    else tg.disableClosingConfirmation?.();
  } catch {
  }
}

export function safeAreaInsets() {
  const tg = getTelegramWebApp();
  return {
    top: Number(tg?.safeAreaInset?.top || 0),
    right: Number(tg?.safeAreaInset?.right || 0),
    bottom: Number(tg?.safeAreaInset?.bottom || 0),
    left: Number(tg?.safeAreaInset?.left || 0),
  };
}
