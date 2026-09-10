import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

const api = axios.create({
  baseURL: apiBase,
  timeout: 45000,
});

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData;
  if (initData) {
    config.headers["X-Telegram-Init-Data"] = initData;
  }
  return config;
});

export async function getHealth() {
  const { data } = await api.get("/health");
  return data;
}

export async function getCancheros() {
  const { data } = await api.get("/cancheros");
  return data;
}

export async function getManagers() {
  const { data } = await api.get("/managers");
  return data;
}

export async function getCurrentGameweek() {
  const { data } = await api.get("/gameweeks/current");
  return data;
}

export async function getStandings() {
  const { data } = await api.get("/standings");
  return data;
}

export async function getWeekly(gameweek) {
  const { data } = await api.get("/weekly", {
    params: gameweek ? { gameweek } : undefined,
  });
  return data;
}

export async function getMonthly(month) {
  const { data } = await api.get("/monthly", {
    params: month ? { month } : undefined,
  });
  return data;
}

export async function getSeason() {
  const { data } = await api.get("/season");
  return data;
}

export async function getH2H() {
  const { data } = await api.get("/h2h");
  return data;
}

export async function getH2HMatches(gameweek) {
  const { data } = await api.get("/h2h/matches", {
    params: gameweek ? { gameweek } : undefined,
  });
  return data;
}

export async function getWeeklyHistory() {
  const { data } = await api.get("/weekly/history");
  return data.history;
}

export async function getMonthlyHistory() {
  const { data } = await api.get("/monthly/history");
  return data.history;
}

export async function getSeasonHistory() {
  const { data } = await api.get("/season/history");
  return data.history;
}

export async function getH2HHistory() {
  const { data } = await api.get("/h2h/history");
  return data.history;
}

/**
 * Fast live refresh (league scores + H2H).
 */
export async function triggerLiveSync() {
  const { data } = await api.post(
    "/sync/live",
    null,
    { timeout: 45000 }
  );
  return data;
}

export async function getH2HDrawStatus() {
  const { data } = await api.get("/h2h/draw-status");
  return data;
}

export async function drawH2HLottery() {
  const { data } = await api.post("/h2h/draw", null, {
    timeout: 30000,
  });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function registerWithFpl(fplId) {
  const { data } = await api.post("/auth/register", { fplId });
  return data;
}

export default api;
