import { useParams } from "react-router-dom";
import { useLiveData } from "../hooks/useLiveData";
import { getCurrentGameweek, getWeekly } from "../api/client";
import BackLink from "../components/BackLink";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function WeeklyGameweekPage() {
  const { gameweek } = useParams();
  const gameweekFplId = Number(gameweek);

  const { data, error, loading } = useLiveData(
    async () => {
      const [weekly, currentGameweek] = await Promise.all([
        getWeekly(gameweekFplId),
        getCurrentGameweek(),
      ]);
      return { weekly, currentGameweek };
    },
    [gameweekFplId],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { weekly, currentGameweek } = data;
  const live =
    currentGameweek?.fplId === gameweekFplId &&
    !currentGameweek?.finished;

  return (
    <div>
      <BackLink to="/weekly/past" label="All past gameweeks" />
      <SectionTitle
        title={`Gameweek ${weekly.gameweek}`}
        subtitle={
          live
            ? "Live standings for this gameweek."
            : "Highest FPL score among Cancheros members wins the week."
        }
      />
      <WinnerBanner winner={weekly.winner} tiedLabel="Joint weekly winners" />
      <StandingsTable rows={weekly.leaderboard} />
    </div>
  );
}
