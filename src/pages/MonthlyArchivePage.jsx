import { useLiveData } from "../hooks/useLiveData";
import { getMonthlyHistory } from "../api/client";
import BackLink from "../components/BackLink";
import PeriodPicker from "../components/PeriodPicker";
import { ErrorBlock, LoadingBlock, SectionTitle } from "../components/ui";

export default function MonthlyArchivePage() {
  const { data, error, loading } = useLiveData(async () => {
    const history = await getMonthlyHistory();
    return { history };
  });

  if (loading && !data) return <LoadingBlock />;
  if (error && !data) return <ErrorBlock message={error} />;

  const items = [...data.history]
    .reverse()
    .map((entry) => ({
      key: entry.competitionMonthId,
      label: entry.monthName || `Month ${entry.monthNumber}`,
      to: `/monthly/${entry.competitionMonthId}`,
    }));

  return (
    <div>
      <BackLink to="/monthly" label="Back to monthly" />
      <SectionTitle
        title="Past months"
        subtitle="Pick a month to view the full standings."
      />
      <PeriodPicker
        title="Months"
        items={items}
        emptyMessage="Monthly winners are saved when all gameweeks in that month finish."
      />
    </div>
  );
}
