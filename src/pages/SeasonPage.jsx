import { useLiveData } from "../hooks/useLiveData";
import { getSeason, getSeasonHistory } from "../api/client";
import HistoryPanel from "../components/HistoryPanel";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function SeasonPage() {
  const { data, error, loading } = useLiveData(
    async () => {
      const [season, history] = await Promise.all([
        getSeason(),
        getSeasonHistory(),
      ]);
      return { season, history };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { season, history } = data;

  return (
    <div>
      <SectionTitle
        title={season.season?.name || "Season"}
        subtitle="Season-long FPL points for active Cancheros members."
      />
      <WinnerBanner winner={season.winner} tiedLabel="Joint season leaders" />
      <StandingsTable rows={season.leaderboard} />
      <HistoryPanel
        title="Past season winners"
        entries={history}
        type="season"
        emptyMessage="Season winner is saved after GW38."
      />
    </div>
  );
}
