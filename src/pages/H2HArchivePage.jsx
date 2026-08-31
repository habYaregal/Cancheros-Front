import { useLiveData } from "../hooks/useLiveData";
import { getCurrentGameweek, getH2HMatches } from "../api/client";
import BackLink from "../components/BackLink";
import PeriodPicker from "../components/PeriodPicker";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";

export default function H2HArchivePage() {
  const { data, error, loading } = useLiveData(async () => {
    const [allMatches, gameweek] = await Promise.all([
      getH2HMatches(),
      getCurrentGameweek(),
    ]);
    return { allMatches, gameweek };
  });

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const currentFplId = data.gameweek?.fplId;
  const gameweeks = [
    ...new Set((data.allMatches?.matches || []).map((match) => match.gameweek)),
  ]
    .filter((gw) => gw !== currentFplId)
    .sort((a, b) => b - a);

  const items = gameweeks.map((gw) => ({
    key: gw,
    label: `GW${gw}`,
    to: `/h2h/gw/${gw}`,
  }));

  return (
    <div>
      <BackLink to="/h2h" label="Back to H2H" />
      <SectionTitle
        title="Past H2H gameweeks"
        subtitle="Pick a gameweek to view fixtures and scores."
      />
      <PeriodPicker
        title="Gameweeks"
        items={items}
        emptyMessage="Past H2H rounds appear here after their gameweek finishes."
      />
    </div>
  );
}
