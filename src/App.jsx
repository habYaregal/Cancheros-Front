import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import WeeklyPage from "./pages/WeeklyPage";
import WeeklyArchivePage from "./pages/WeeklyArchivePage";
import WeeklyGameweekPage from "./pages/WeeklyGameweekPage";
import MonthlyPage from "./pages/MonthlyPage";
import MonthlyArchivePage from "./pages/MonthlyArchivePage";
import MonthlyMonthPage from "./pages/MonthlyMonthPage";
import SeasonPage from "./pages/SeasonPage";
import H2HPage from "./pages/H2HPage";
import H2HArchivePage from "./pages/H2HArchivePage";
import H2HGameweekPage from "./pages/H2HGameweekPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { RefreshProvider, useRefresh } from "./contexts/RefreshContext";
import { TelegramProvider } from "./contexts/TelegramContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { getCurrentGameweek, getHealth } from "./api/client";

function AppShell() {
  const { refreshKey } = useRefresh();
  const [liveLabel, setLiveLabel] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    let alive = true;

    async function refreshMeta() {
      try {
        const [health, gameweek] = await Promise.all([
          getHealth(),
          getCurrentGameweek(),
        ]);

        if (!alive) return;

        if (gameweek && !gameweek.finished) {
          setLiveLabel(`Live GW${gameweek.fplId}`);
        } else if (gameweek) {
          setLiveLabel(`GW${gameweek.fplId} finished`);
        }

        if (health?.liveSync?.lastSuccessAt) {
          setUpdatedAt(new Date(health.liveSync.lastSuccessAt));
        } else {
          setUpdatedAt(new Date());
        }
      } catch {
        // page-level hooks will surface API errors
      }
    }

    void refreshMeta();
    const id = setInterval(refreshMeta, 30000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [refreshKey]);

  return (
    <Layout liveLabel={liveLabel} updatedAt={updatedAt}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/weekly" element={<WeeklyPage />} />
        <Route path="/weekly/past" element={<WeeklyArchivePage />} />
        <Route path="/weekly/gw/:gameweek" element={<WeeklyGameweekPage />} />
        <Route path="/monthly" element={<MonthlyPage />} />
        <Route path="/monthly/past" element={<MonthlyArchivePage />} />
        <Route path="/monthly/:monthId" element={<MonthlyMonthPage />} />
        <Route path="/season" element={<SeasonPage />} />
        <Route path="/h2h" element={<H2HPage />} />
        <Route path="/h2h/past" element={<H2HArchivePage />} />
        <Route path="/h2h/gw/:gameweek" element={<H2HGameweekPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <RefreshProvider>
      <TelegramProvider>
        <ProfileProvider>
          <AppShell />
        </ProfileProvider>
      </TelegramProvider>
    </RefreshProvider>
  );
}
