import { useLiveData } from "../hooks/useLiveData";
import { getWeeklyHistory } from "../api/client";
import BackLink from "../components/BackLink";
import PeriodPicker from "../components/PeriodPicker";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";

export default function WeeklyArchivePage() {
  const { data, error, loading } = useLiveData(async () => {
    const history = await getWeeklyHistory();
    return { history };
  });

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const items = [...data.history]
    .reverse()
    .map((entry) => ({
      key: entry.gameweek,
      label: `GW${entry.gameweek}`,
      to: `/weekly/gw/${entry.gameweek}`,
    }));

  return (
    <div>
      <BackLink to="/weekly" label="Back to weekly" />
      <SectionTitle
        title="Past gameweeks"
        subtitle="Pick a gameweek to view the full standings."
      />
      <PeriodPicker
        title="Gameweeks"
        items={items}
        emptyMessage="GW winners are saved automatically when FPL marks a gameweek finished."
      />
    </div>
  );
}
