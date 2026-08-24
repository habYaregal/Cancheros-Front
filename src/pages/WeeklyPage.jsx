import { useLiveData } from "../hooks/useLiveData";
import { getWeekly, getWeeklyHistory } from "../api/client";
import HistoryPanel from "../components/HistoryPanel";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function WeeklyPage() {
  const { data, error, loading } = useLiveData(
    async () => {
      const [weekly, history] = await Promise.all([
        getWeekly(),
        getWeeklyHistory(),
      ]);
      return { weekly, history };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { weekly, history } = data;

  return (
    <div>
      <SectionTitle
        title={`Gameweek ${weekly.gameweek}`}
        subtitle="Highest FPL score among Cancheros members wins the week."
      />
      <WinnerBanner winner={weekly.winner} tiedLabel="Joint weekly winners" />
      <StandingsTable rows={weekly.leaderboard} />
      <HistoryPanel
        title="Past weekly winners"
        entries={history}
        type="weekly"
        emptyMessage="GW winners are saved automatically when FPL marks a gameweek finished."
      />
    </div>
  );
}
