import { useParams } from "react-router-dom";
import { useLiveData } from "../hooks/useLiveData";
import { getMonthly } from "../api/client";
import BackLink from "../components/BackLink";
import {
  ErrorBlock,
  LoadingBlock,
  SectionTitle,
  StandingsTable,
  WinnerBanner,
} from "../components/ui";

export default function MonthlyMonthPage() {
  const { monthId } = useParams();
  const competitionMonthId = Number(monthId);

  const { data, error, loading } = useLiveData(
    async () => {
      const monthly = await getMonthly(competitionMonthId);
      return { monthly };
    },
    [competitionMonthId],
    30000
  );

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const { monthly } = data;

  return (
    <div>
      <BackLink to="/monthly/past" label="All past months" />
      <SectionTitle
        title={monthly.month?.name || "Monthly"}
        subtitle="Official Premier League month · aggregated Cancheros GW points."
      />
      <WinnerBanner winner={monthly.winner} tiedLabel="Joint monthly winners" />
      <StandingsTable rows={monthly.leaderboard} />
    </div>
  );
}
