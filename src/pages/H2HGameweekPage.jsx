import { useParams } from "react-router-dom";
import { useLiveData } from "../hooks/useLiveData";
import { getCurrentGameweek, getH2HMatches } from "../api/client";
import BackLink from "../components/BackLink";
import H2HMatchRow from "../components/H2HMatchRow";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";

export default function H2HGameweekPage() {
  const { gameweek } = useParams();
  const gameweekFplId = Number(gameweek);

  const { data, error, loading } = useLiveData(
    async () => {
      const [allMatches, currentGameweek] = await Promise.all([
        getH2HMatches(gameweekFplId),
        getCurrentGameweek(),
      ]);
      return { allMatches, currentGameweek };
    },
    [gameweekFplId],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const matches = data.allMatches?.matches || [];
  const live =
    data.currentGameweek?.fplId === gameweekFplId &&
    !data.currentGameweek?.finished;

  return (
    <div>
      <BackLink to="/h2h/past" label="All past gameweeks" />
      <SectionTitle
        title={`GW${gameweekFplId} H2H`}
        subtitle={
          live
            ? "Fixtures are live and update as FPL scores move."
            : "Head-to-head fixtures for this gameweek."
        }
      />

      {matches.length === 0 ? (
        <div className="border border-line bg-panel px-4 py-5 text-sm text-mist">
          No H2H fixtures for this gameweek.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <H2HMatchRow key={match.matchId} match={match} live={live} />
          ))}
        </div>
      )}
    </div>
  );
}
