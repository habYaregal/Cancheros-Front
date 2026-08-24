import { useLiveData } from "../hooks/useLiveData";
import { getMonthly, getMonthlyHistory } from "../api/client";
import HistoryPanel from "../components/HistoryPanel";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function MonthlyPage() {
  const { data, error, loading } = useLiveData(
    async () => {
      const [monthly, history] = await Promise.all([
        getMonthly(),
        getMonthlyHistory(),
      ]);
      return { monthly, history };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { monthly, history } = data;

  return (
    <div>
      <SectionTitle
        title={monthly.month?.name || "Monthly"}
        subtitle="Official Premier League month · aggregated Cancheros GW points."
      />
      <WinnerBanner winner={monthly.winner} tiedLabel="Joint monthly winners" />
      <StandingsTable rows={monthly.leaderboard} />
      <HistoryPanel
        title="Past monthly winners"
        entries={history}
        type="monthly"
        emptyMessage="Monthly winners are saved when all gameweeks in that month finish."
      />
    </div>
  );
}
