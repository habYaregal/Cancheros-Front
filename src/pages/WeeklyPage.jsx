import { useLiveData } from "../hooks/useLiveData";
import { getWeekly } from "../api/client";
import ArchiveLink from "../components/ArchiveLink";
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
      const weekly = await getWeekly();
      return { weekly };
    },
    [],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { weekly } = data;

  return (
    <div>
      <SectionTitle
        title={`Gameweek ${weekly.gameweek}`}
        subtitle="Highest FPL score among Cancheros members wins the week."
      />
      <WinnerBanner winner={weekly.winner} tiedLabel="Joint weekly winners" />
      <StandingsTable rows={weekly.leaderboard} />
      <ArchiveLink to="/weekly/past" label="Browse past gameweeks" />
    </div>
  );
}
